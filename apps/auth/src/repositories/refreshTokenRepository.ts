import { DataSource, MoreThan, Repository } from 'typeorm';
import { RefreshToken } from '../models/refreshToken';
import { Auth } from '../models/auth';
import { getLogger } from '@warehouse/logging';

const logger = getLogger('refreshTokenRepository');

export class RefreshTokenRepository {
  private dataSource: DataSource;
  private refreshTokenRepository: Repository<RefreshToken>;

  constructor(dataSource: DataSource) {
    logger.info('Creating RefreshTokenRepository instance');
    this.dataSource = dataSource;
    this.refreshTokenRepository = dataSource.getRepository(RefreshToken);
  }

  /**
   * Creates a new refresh token for the given authentication details.
   *
   * @param auth - The authentication details associated with the refresh token.
   * @param expires - The expiration date of the refresh token.
   * @param token - The token string.
   * @param lastUserAgent - The user agent of the last request.
   * @param lastIP - The IP address of the last request.
   * @returns A promise that resolves to the created RefreshToken object.
   */
  async create(
    auth: Auth,
    expires: Date,
    token: string,
    lastUserAgent: string,
    lastIP: string
  ): Promise<RefreshToken> {
    logger.debug('Creating new refresh token', {
      auth_id: auth.id,
      expires,
      lastIP,
      userAgent: lastUserAgent.substring(0, 50)
    });

    const refreshToken = this.refreshTokenRepository.create({
      auth,
      expires,
      token,
      lastUserAgent,
      lastIP,
    });
    const now = new Date();
    refreshToken.created_at = now;
    refreshToken.updated_at = now;

    const saved = await this.refreshTokenRepository.save(refreshToken);
    logger.info('Refresh token created', { token_id: saved.id });
    return saved;
  }

  /**
   * Finds a refresh token by its token string.
   * The token must not be expired.
   *
   * @param token - The token string to search for.
   * @returns A promise that resolves to the found RefreshToken object or undefined if not found.
   */
  async findByToken(token: string): Promise<RefreshToken | undefined> {
    logger.debug('Searching for refresh token', {
      token: `${token.substring(0, 8)}...`
    });

    const result = await this.refreshTokenRepository.findOne({
      where: { token, expires: MoreThan(new Date()) },
      relations: ['auth'],
    });

    logger.info('Token search completed', {
      found: !!result,
      isExpired: result ? result.expires < new Date() : undefined
    });

    return result;
  }

  /**
   * Deletes a refresh token by marking it as expired.
   *
   * @param token - The refresh token to be deleted.
   * @returns A promise that resolves to a boolean indicating whether the token was successfully marked as deleted.
   */
  async delete(token: string): Promise<boolean> {
    logger.warn('Deleting refresh token', {
      token: `${token.substring(0, 8)}...`
    });

    const now = new Date();
    const updateRes = await this.refreshTokenRepository
      .createQueryBuilder()
      .update(RefreshToken)
      .set({ expires: now })
      .where({ token, expires: MoreThan(now) })
      .execute();

    logger.info('Token deletion completed', {
      success: updateRes.affected !== 0,
      affectedRows: updateRes.affected
    });

    return updateRes.affected !== 0;
  }

  /**
   * Deletes all expired refresh tokens from the repository.
   * Strongly not recommended to use this method in production.
   * Because it will lost all history user sessions, location, and device.
   * For marketing and security reason, it's better to keep the history.
   *
   * This method uses a query builder to delete all entries in the
   * refreshTokenRepository where the expiration date is greater
   * than the current date.
   *
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  async deleteAllExpired(): Promise<void> {
    logger.crit('Attempting to delete all expired tokens', {
      timestamp: new Date().toISOString()
    });

    const result = await this.refreshTokenRepository
      .createQueryBuilder()
      .delete()
      .where({ expires: MoreThan(new Date()) })
      .execute();

    logger.warn('Expired tokens deletion completed', {
      affectedRows: result.affected,
      timestamp: new Date().toISOString()
    });
  }
}
