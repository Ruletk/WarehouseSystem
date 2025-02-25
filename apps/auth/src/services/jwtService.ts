import * as jwt from 'jsonwebtoken';
import { Auth } from '../models/auth';
import { getLogger } from '@warehouse/logging';

const logger = getLogger('jwtService');
const ACCESS_EXPIRES_IN = '15m';

export class JwtService {
  private secret;
  
  constructor() {
    logger.info('Creating JwtService instance');
    this.secret = process.env.JWT_SECRET || this.secret;

    if (!process.env.JWT_SECRET) {
      logger.warn('Using default JWT secret key. This is not secure for production!');
    }
  }

  generateToken(
    payload: Record<string, unknown>,
    expiresIn: string = ACCESS_EXPIRES_IN
  ): string {
    logger.debug('Generating JWT token', {
      expiresIn,
      payloadKeys: Object.keys(payload)
    });

    return jwt.sign(payload, this.secret, { expiresIn });
  }

  decodeToken(token: string): jwt.JwtPayload | string {
    logger.debug('Decoding JWT token', {
      tokenPrefix: token.substring(0, 8)
    });

    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      logger.warn('Token verification failed', {
        error: error.message,
        tokenPrefix: token.substring(0, 8)
      });
      throw error;
    }
  }

  generateAccessToken(user: Auth): string {
    logger.info('Generating access token', {
      userId: user.id,
      expiresIn: ACCESS_EXPIRES_IN
    });

    const payload = { id: user.id, email: user.email };
    return this.generateToken(payload, ACCESS_EXPIRES_IN);
  }

  generateActivationToken(user: Auth): string {
    logger.info('Generating activation token', {
      userId: user.id,
      expiresIn: '1d'
    });

    const payload = { id: user.id };
    return this.generateToken(payload, '1d');
  }

  generatePasswordResetToken(user: Auth): string {
    logger.info('Generating password reset token', {
      userId: user.id,
      expiresIn: '1h'
    });

    const payload = { id: user.id };
    return this.generateToken(payload, '1h');
  }
}
