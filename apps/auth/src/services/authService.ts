import { compare, hash } from 'bcrypt';
import { Request } from 'express';
import { ApiResponse } from '@warehouse/validation';
import {
  AuthRequest,
  PasswordChange,
  RequestPasswordChange,
} from '../dto/request';
import { AuthRepository } from '../repositories/authRepository';
import { JwtService } from './jwtService';
import { TokenService } from './tokenService';
import { EmailService } from './emailService';
import { getLogger } from '@warehouse/logging';

const logger = getLogger('authService');
const saltRounds = 10;

export class AuthService {
  private authRepository: AuthRepository;
  private tokenService: TokenService;
  private jwtService: JwtService;
  private emailSerivce: EmailService;

  constructor(
    authRepository: AuthRepository,
    tokenService: TokenService,
    jwtService: JwtService,
    emailService: EmailService
  ) {
    logger.info('Creating AuthService instance');
    this.authRepository = authRepository;
    this.tokenService = tokenService;
    this.jwtService = jwtService;
    this.emailSerivce = emailService;
  }

  public async login(req: AuthRequest, data: Request): Promise<ApiResponse> {
    logger.info('Login attempt', { email: req.email });

    const auth = await this.authRepository.findByEmail(req.email);
    if (!auth || !auth.is_active) {
      logger.warn('Login failed: invalid credentials or inactive account', {
        email: req.email,
        found: !!auth,
        isActive: !!auth?.is_active
      });
      return ApiResponse.from({
        code: 404,
        type: 'error',
        message: 'Invalid email or password',
      });
    }

    logger.debug('Validating password', { userId: auth.id });
    const isPasswordMatch = await this.comparePassword(
      req.password,
      auth.password_hash
    );

    if (!isPasswordMatch) {
      logger.warn('Login failed: password mismatch', { userId: auth.id });
      return ApiResponse.from({
        code: 404,
        type: 'error',
        message: 'Invalid email or password',
      });
    }

    logger.debug('Creating refresh token', { userId: auth.id });
    const token = await this.tokenService.createRefreshToken(auth, data);

    logger.info('Login successful', {
      userId: auth.id,
      tokenPrefix: token.substring(0, 5)
    });

    return ApiResponse.from({
      code: 200,
      type: 'success',
      message: 'Login successful',
      data: { token },
    });
  }

  public async register(req: AuthRequest): Promise<ApiResponse> {
    logger.info('Registration attempt', { email: req.email });

    const existingUser = await this.authRepository.findByEmail(req.email);
    if (existingUser) {
      logger.warn('Registration failed: email already exists', {
        email: req.email
      });
      return ApiResponse.from({
        code: 409,
        type: 'error',
        message: 'User already exists',
      });
    }

    logger.debug('Creating new user account');
    const passwordHash = await this.hashPassword(req.password);
    const user = await this.authRepository.create(req.email, passwordHash);

    logger.debug('Generating activation token', { userId: user.id });
    const activationToken = await this.tokenService.createActivationToken(user);
    this.emailSerivce.sendActivationEmail(user.email, activationToken);

    logger.info('Registration successful', { userId: user.id });
    return ApiResponse.from({
      code: 201,
      type: 'success',
      message: 'Successfully registered. Check your email for verification.',
    });
  }

  public async logout(token: string): Promise<ApiResponse> {
    logger.info('Logout service called');
    const result = await this.tokenService.expireRefreshToken(token);
    logger.debug(`Token ${token} is deleted?: ${result}`);

    return ApiResponse.from({
      code: 200,
      type: 'success',
      message: 'Successfully logged out',
    });
  }

  public async getAccessToken(refreshToken: string): Promise<ApiResponse> {
    if (!refreshToken) {
      logger.error('No refresh token provided');
      // Because of nginx proxy, we need to return a 200 status code
      // To not trigger the error handler in the backend.
      return ApiResponse.from({
        code: 200,
        type: 'error',
        message: 'No refresh token provided',
      });
    }
    let token = '';
    try {
      token = await this.tokenService.createAccessToken(refreshToken);
    } catch (error) {
      logger.error('Unable to create access token', error);
      return ApiResponse.from({
        code: 200,
        type: 'error',
        message: 'Unable to create access token',
      });
    }

    return ApiResponse.from({
      code: 200,
      type: 'success',
      message: 'Access token created',
      data: {
        token,
      },
    });
  }

  public async activateAccount(token: string) {
    let id = 0;
    try {
      id = await this.tokenService.findActivationToken(token);
    } catch (error) {
      logger.error('Unable to find activation token', error);
      return ApiResponse.from({
        code: 400,
        type: 'error',
        message: 'Invalid token',
      });
    }

    if (!id)
      return ApiResponse.from({
        code: 404,
        type: 'error',
        message: 'Account not found',
      });

    // No validation required because the token is already generated valid
    // only if hacked then error will be thrown

    const res = await this.authRepository.activateAccount(id);
    if (!res)
      return ApiResponse.from({
        code: 500,
        type: 'error',
        message: 'Unable to activate account',
      });

    return ApiResponse.from({
      code: 200,
      type: 'success',
      message: 'Account activated',
    });
  }

  public async forgotPassword(
    req: RequestPasswordChange
  ): Promise<ApiResponse> {
    const user = await this.authRepository.findByEmail(req.email);
    if (!user) {
      // Don't want to expose that the email is not found
      // To prevent enumeration attacks. Loggin the error is enough.
      // Logging for analysis purposes, and for metrics, response on attacks.
      logger.info(`User with email ${req.email} not found`);
      return ApiResponse.from({
        code: 200,
        type: 'success',
        message: 'Password reset email sent',
      });
    }

    const resetToken = await this.tokenService.createPasswordResetToken(user);
    this.emailSerivce.sendPasswordResetEmail(user.email, resetToken);

    return ApiResponse.from({
      code: 200,
      type: 'success',
      message: 'Password reset email sent',
    });
  }

  public async changePassword(
    token: string,
    req: PasswordChange
  ): Promise<ApiResponse> {
    logger.info('Change password service called');

    let authId = 0;
    try {
      authId = await this.tokenService.findPasswordResetToken(token);
    } catch (error) {
      logger.error('Unable to find password reset token', error);
      return ApiResponse.from({
        code: 400,
        type: 'error',
        message: 'Invalid token',
      });
    }
    const auth = await this.authRepository.findById(authId);

    const newPassword = await this.hashPassword(req.password);
    if (auth.password_hash === newPassword) {
      return ApiResponse.from({
        code: 400,
        type: 'error',
        message: 'New password cannot be the same as the old password',
      });
    }

    const res = await this.authRepository.updatePassword(auth.id, newPassword);
    if (!res) {
      logger.error('Unable to update password: ', auth.id);
      return ApiResponse.from({
        code: 500,
        type: 'error',
        message: 'Unable to update password',
      });
    }

    return ApiResponse.from({
      code: 200,
      type: 'success',
      message: 'Password changed',
    });
  }

  private async hashPassword(password: string): Promise<string> {
    logger.debug('Hashing password');
    return hash(password, saltRounds);
  }

  private async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    logger.debug('Comparing password hash');
    return compare(password, hash);
  }
}
