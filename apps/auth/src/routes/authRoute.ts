import { Router } from 'express';
import { AuthHandlers } from './authHandlers';
import {
  AuthRequest,
  PasswordChange,
  RequestPasswordChange,
} from '../dto/request';
import { validateRequest } from '@warehouse/validation';

const authHandlers = new AuthHandlers('test dependency');

const authRouter = Router();

authRouter.post(
  '/login',
  validateRequest(AuthRequest),
  authHandlers.loginHandler
);
authRouter.post(
  '/register',
  validateRequest(AuthRequest),
  authHandlers.registerHandler
);
authRouter.get('/logout', authHandlers.logoutHandler);
authRouter.post(
  '/reset-password',
  validateRequest(RequestPasswordChange),
  authHandlers.resetPasswordHandler
);
authRouter.post(
  '/change-password/:token',
  validateRequest(PasswordChange),
  authHandlers.changePasswordHandler
);

export { authRouter };
