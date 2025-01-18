import { DataSource, MoreThan, Repository } from 'typeorm';
import { RefreshToken } from '../models/refreshToken';
import { Auth } from '../models/auth';

export class RefreshTokenRepository {
  private dataSource: DataSource;
  private refreshTokenRepository: Repository<RefreshToken>;

  constructor(dataSource: DataSource) {
    console.log('INFO: Creating RefreshTokenRepository instance');
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
    return this.refreshTokenRepository.save(refreshToken);
  }

  /**
   * Finds a refresh token by its token string.
   * The token must not be expired.
   *
   * @param token - The token string to search for.
   * @returns A promise that resolves to the found RefreshToken object or undefined if not found.
   */
  async findByToken(token: string): Promise<RefreshToken | undefined> {
    return this.refreshTokenRepository.findOne({ where: { token, expires: MoreThan(new Date()) } });
  }

  /**
   * Deletes a refresh token by marking it as expired.
   *
   * @param token - The refresh token to be deleted.
   * @returns A promise that resolves to a boolean indicating whether the token was successfully marked as deleted.
   */
  async delete(token: string): Promise<boolean> {
    const now = new Date();
    const updateRes = await this.refreshTokenRepository
      .createQueryBuilder()
      .update(RefreshToken)
      .set({ expires: now })
      .where({ token })
      .execute();
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
    await this.refreshTokenRepository
      .createQueryBuilder()
      .delete()
      .where({ expires: MoreThan(new Date()) })
      .execute();
  }
}
