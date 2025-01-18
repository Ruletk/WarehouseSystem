import { Request } from 'express';
import { Auth } from '../models/auth';
import { RefreshTokenRepository } from '../repositories/refreshTokenRepository';
import { JwtService } from './jwtService';
import { RefreshToken } from '../models/refreshToken';

export class TokenService {
  private refreshTokenRepository: RefreshTokenRepository;
  private jwtService: JwtService;

  constructor(
    refreshTokenRepository: RefreshTokenRepository,
    jwtService: JwtService
  ) {
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
    const refreshToken = 'token';
    await this.refreshTokenRepository.create(
      auth,
      new Date(),
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
}
