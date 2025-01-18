import { Auth } from '../models/auth';
import { JwtService } from './jwtService';
import * as jwt from 'jsonwebtoken';

describe('JwtService', () => {
  let jwtService: JwtService;
  const secret = 'testSecret';
  const payload = { id: 1, email: 'test@example.com' };
  const token = 'testToken';
  const prepairedToken = jwt.sign(payload, secret, { expiresIn: '15m' });

  beforeAll(() => {
    process.env.JWT_SECRET = secret;
    jwtService = new JwtService();
  });

  describe('generateToken', () => {
    it('should generate a token with the given payload', () => {
      const res = jwtService.generateToken(payload as never);
      const decodedPayload = jwt.verify(res, secret) as jwt.JwtPayload;
      expect(decodedPayload).toHaveProperty('id', payload.id);
      expect(decodedPayload).toHaveProperty('email', payload.email);
    });

    it('should generate a token with the default expiration', () => {
      const res = jwtService.generateToken(payload as never);
      const decodedPayload = jwt.verify(res, secret) as jwt.JwtPayload;
      expect(decodedPayload.exp - decodedPayload.iat).toBe(60 * 15);
    });

    it('should generate a token with the given payload and expiration', () => {
      const expiresIn = '1h';
      const res = jwtService.generateToken(payload as never, expiresIn);
      const decodedPayload = jwt.verify(res, secret) as jwt.JwtPayload;
      expect(decodedPayload.exp - decodedPayload.iat).toBe(60 * 60);
    });
  });

  describe('decodeToken', () => {
    it('should decode a token', () => {
      const res = jwtService.decodeToken(prepairedToken);
      expect(res).toHaveProperty('id', payload.id);
      expect(res).toHaveProperty('email', payload.email);
    });

    it('should throw an error if the token is invalid', () => {
      expect(() => jwtService.decodeToken(token)).toThrow();
    });
  });

  describe('generateAccessToken', () => {
    it('should generate an access token with the given user', () => {
      const user = new Auth();
      user.id = 1;
      user.email = 'example@gmail.com';

      const res = jwtService.generateAccessToken(user);
      const decodedPayload = jwt.verify(res, secret) as jwt.JwtPayload;
      expect(decodedPayload).toHaveProperty('id', user.id);
      expect(decodedPayload).toHaveProperty('email', user.email);
    });
  });

  describe('generateActivationToken', () => {
    it('should generate an activation token with the given user', () => {
      const user = new Auth();
      user.email = 'hello@world.com';

      const res = jwtService.generateActivationToken(user);
      const decodedPayload = jwt.verify(res, secret) as jwt.JwtPayload;
      expect(decodedPayload).toHaveProperty('email', user.email);
    });
  });
  describe('generatePasswordResetToken', () => {
    it('should generate a password reset token with the given user', () => {
      const user = new Auth();
      user.email = 'hello@world.com';

      const res = jwtService.generatePasswordResetToken(user);
      const decodedPayload = jwt.verify(res, secret) as jwt.JwtPayload;
      expect(decodedPayload).toHaveProperty('email', user.email);
    });
  });
});
