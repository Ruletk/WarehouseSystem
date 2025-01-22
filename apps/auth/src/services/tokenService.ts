import { Request } from 'express';
import { Auth } from '../models/auth';
import { RefreshTokenRepository } from '../repositories/refreshTokenRepository';
import { JwtService } from './jwtService';
import { RefreshToken } from '../models/refreshToken';
import { getRandomValues } from 'crypto';
import { JwtPayload } from 'jsonwebtoken';

export class TokenService {
  private refreshTokenRepository: RefreshTokenRepository;
  private jwtService: JwtService;

  constructor(
    refreshTokenRepository: RefreshTokenRepository,
    jwtService: JwtService
  ) {
    console.log('INFO: Creating TokenService instance');
    this.refreshTokenRepository = refreshTokenRepository;
    this.jwtService = jwtService;
  }

  /**
   * Creates a new refresh token for the given authentication context and request.
   *
   * @param {Auth} auth - The authentication context for which the refresh token is being created.
   * @param {Request} req - The HTTP request object containing headers used for token creation.
   * @returns {Promise<string>} A promise that resolves to the newly created refresh token.
   */
  async createRefreshToken(auth: Auth, req: Request): Promise<string> {
    const now = new Date();
    const refreshToken = await this.generateRefreshToken();
    await this.refreshTokenRepository.create(
      auth,
      new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000),
      refreshToken,
      req.headers['user-agent'] as string,
      req.headers['x-forwarded-for'] as string
    );

    return refreshToken;
  }

  /**
   * Finds a refresh token by its token string.
   *
   * @param token - The token string to search for.
   * @returns A promise that resolves to the found RefreshToken object, or undefined if not found.
   */
  async findRefreshToken(token: string): Promise<RefreshToken | undefined> {
    return this.refreshTokenRepository.findByToken(token);
  }

  /**
   * Expires a given refresh token by deleting it from the repository.
   *
   * @param token - The refresh token to be expired.
   * @returns A promise that resolves to a boolean indicating whether the token was successfully deleted.
   */
  async expireRefreshToken(token: string): Promise<boolean> {
    return this.refreshTokenRepository.delete(token);
  }

  /**
   * Creates a new access token using the provided refresh token.
   *
   * @param token - The `RefreshToken` instance or its string representation.
   * @returns A promise that resolves to the newly generated access token.
   * @throws {Error} If the provided refresh token is not found.
   */
  async createAccessToken(token: RefreshToken): Promise<string>;
  async createAccessToken(token: string): Promise<string>;
  async createAccessToken(token: RefreshToken | string): Promise<string> {
    if (typeof token === 'string') {
      token = await this.findRefreshToken(token);
      if (!token) {
        throw new Error('Refresh token not found');
      }
    }

    // TODO: Implement caching.
    return this.jwtService.generateAccessToken(token.auth);
  }

  /**
   * Finds the email address associated with an activation token.
   *
   * @param token - The activation token to search for.
   * @returns A promise that resolves to the email address associated with the token or undefined if not found.
   */
  async findActivationToken(token: string): Promise<number> {
    const decodedToken = this.jwtService.decodeToken(token) as JwtPayload;
    return decodedToken?.id;
  }

  private async generateRefreshToken(): Promise<string> {
    const array = new Uint8Array(48);
    getRandomValues(array);
    return Buffer.from(array).toString('base64');
  }
}
