import * as jwt from 'jsonwebtoken';
import { Auth } from '../models/auth';

const ACCESS_EXPIRES_IN = '15m';

export class JwtService {
  private readonly secret: string = 'TOP-SECRET-TOKEN-KEY';

  constructor() {
    console.log('INFO: Creating JwtService instance');
    this.secret = process.env.JWT_SECRET;
  }

  generateToken(
    payload: Record<string, unknown>,
    expiresIn: string = ACCESS_EXPIRES_IN
  ): string {
    return jwt.sign(payload, this.secret, { expiresIn });
  }

  decodeToken(token: string): jwt.JwtPayload | string {
    return jwt.verify(token, this.secret);
  }

  generateAccessToken(user: Auth): string {
    const payload = { id: user.id, email: user.email };
    return this.generateToken(payload, ACCESS_EXPIRES_IN);
  }

  generateActivationToken(user: Auth): string {
    const payload = { email: user.email };
    return this.generateToken(payload, '1d');
  }

  generatePasswordResetToken(user: Auth): string {
    const payload = { email: user.email };
    return this.generateToken(payload, '1h');
  }
}
