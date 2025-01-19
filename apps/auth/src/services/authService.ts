import { compare, hash } from 'bcrypt';
import { Request } from 'express';
import { ApiResponse } from '@warehouse/validation';
import { AuthRequest } from '../dto/request';
import { AuthRepository } from '../repositories/authRepository';
import { JwtService } from './jwtService';
import { TokenService } from './tokenService';

const saltRounds = 10;

export class AuthService {
  private authRepository: AuthRepository;
  private tokenService: TokenService;
  private jwtService: JwtService;

  constructor(
    authRepository: AuthRepository,
    tokenService: TokenService,
    jwtService: JwtService
  ) {
    console.log('INFO: Creating AuthService instance');
    this.authRepository = authRepository;
    this.tokenService = tokenService;
    this.jwtService = jwtService;
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

    return ApiResponse.from({
      code: 201,
      type: 'success',
      message: 'Successfully registered. Check your email for verification.',
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
