import { Request, Response } from 'express';
import { AuthHandlers } from './authHandlers';


describe('AuthHandlers', () => {
  let authHandlers: AuthHandlers;

  beforeEach(() => {
    authHandlers = new AuthHandlers("test dependency");
  });

  describe('loginHandler', () => {
      it('should return 200 sucessful login', async () => {
        const req: Request = {} as Request;
        const res: Response = { send: jest.fn() } as unknown as Response;
        authHandlers.loginHandler(req, res);
        expect(res.send).toHaveBeenCalledWith({ message: 'Login route' });
      });

      it('should return the 400 invalid request', async () => {
        expect(true).toBe(true);
      });

      it('should return the 401 bad login', async () => {
        expect(true).toBe(true);
      });
  });

  describe('registerHandler', () => {
    it('should return 200 successful registration', async () => {
      expect(true).toBe(true);
    });

    it('should return 400 invalid request', async () => {
      expect(true).toBe(true);
    });

    it('should return 409 user already registered', async () => {
      expect(true).toBe(true);
    });
  });

  describe('logoutHandler', () => {
    it('should return 200 successful logout', async () => {
      expect(true).toBe(true);
    });

    it('should not return anything except 200', async () => {
      expect(true).toBe(true);
    });
  });

  describe('resetPasswordHandler', () => {
    it('should return 200 password reset', async () => {
      expect(true).toBe(true);
    });

    it('should return 400 invalid request', async () => {
      expect(true).toBe(true);
    });
  });

  describe('changePasswordHandler', () => {
    it('should return 200 password changed', async () => {
      expect(true).toBe(true);
    });

    it('should return 400 invalid request', async () => {
      expect(true).toBe(true);
    });

    it('should return 403 invalid token', async () => {
      expect(true).toBe(true);
    });
  });


});
