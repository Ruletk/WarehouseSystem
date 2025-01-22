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
    console.log('INFO: Creating AuthService instance');
    this.authRepository = authRepository;
    this.tokenService = tokenService;
    this.jwtService = jwtService;
    this.emailSerivce = emailService;
  }

  public async login(req: AuthRequest, data: Request): Promise<ApiResponse> {
    console.log('INFO: Login service called');
    const auth = await this.authRepository.findByEmail(req.email);
    if (!auth || !auth.is_active) {
      console.log(
        `INFO: User ${
          req.email
        } found: ${!!auth}, is_active: ${!!auth?.is_active}`
      );
      return ApiResponse.from({
        code: 404,
        type: 'error',
        message: 'Invalid email or password',
      });
    }

    console.log(`DEBUG: User found: ${auth.id}, checking password`);
    const isPasswordMatch = await this.comparePassword(
      req.password,
      auth.password_hash
    );
    if (!isPasswordMatch) {
      console.log('DEBUG: Password does not match');
      return ApiResponse.from({
        code: 404,
        type: 'error',
        message: 'Invalid email or password',
      });
    }

    console.log(`DEBUG: Password matches, creating token`);
    const token = await this.tokenService.createRefreshToken(auth, data);
    console.log(
      `DEBUG: Token created: ${token.substring(0, 5)}, returning response`
    );

    return ApiResponse.from({
      code: 200,
      type: 'success',
      message: 'Login successful',
      data: {
        token,
      },
    });
  }

  public async register(req: AuthRequest): Promise<ApiResponse> {
    console.log('INFO: Register service called');
    const existingUser = await this.authRepository.findByEmail(req.email);
    if (existingUser) {
      console.log('DEBUG: User already exists');
      return ApiResponse.from({
        code: 409,
        type: 'error',
        message: 'User already exists',
      });
    }

    console.log('DEBUG: User does not exist, creating user');
    const passwordHash = await this.hashPassword(req.password);
    const user = await this.authRepository.create(req.email, passwordHash);
    console.log(`DEBUG: User created: ${user.id}.`);

    console.log('DEBUG: Sending activation email');
    const activationToken = await this.tokenService.createActivationToken(user);
    this.emailSerivce.sendActivationEmail(user.email, activationToken);

    return ApiResponse.from({
      code: 201,
      type: 'success',
      message: 'Successfully registered. Check your email for verification.',
    });
  }

  public async logout(token: string): Promise<ApiResponse> {
    console.log('INFO: Logout service called');
    const result = await this.tokenService.expireRefreshToken(token);
    console.log(`DEBUG: Token ${token} is deleted?: ${result}`);

    return ApiResponse.from({
      code: 200,
      type: 'success',
      message: 'Successfully logged out',
    });
  }

  public async getAccessToken(refreshToken: string): Promise<ApiResponse> {
    if (!refreshToken) {
      console.log('ERROR: No refresh token provided');
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
      console.error('ERROR: Unable to create access token', error);
      return ApiResponse.from({
        code: 500,
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
      console.error('ERROR: Unable to find activation token', error);
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
      console.log(`INFO: User with email ${req.email} not found`);
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

  public async changePassword(token: string, req: PasswordChange): Promise<ApiResponse> {
    console.log('INFO: Change password service called');

    let authId = 0;
    try {
    authId = await this.tokenService.findPasswordResetToken(token);
    } catch (error) {
      console.error('ERROR: Unable to find password reset token', error);
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
      console.error('ERROR: Unable to update password: ', auth.id);
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
    return hash(password, saltRounds);
  }

  private async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return compare(password, hash);
  }
}
