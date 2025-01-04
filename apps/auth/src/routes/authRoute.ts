import { Router } from 'express';
import { AuthHandlers } from './authHandlers';

const authHandlers = new AuthHandlers("test dependency");

const authRouter = Router();

authRouter.post('/login', authHandlers.loginHandler);
authRouter.post('/register', authHandlers.registerHandler);
authRouter.get('/logout', authHandlers.logoutHandler);
authRouter.post('/reset-password', authHandlers.resetPasswordHandler);
authRouter.post('/change-password/:token', authHandlers.changePasswordHandler);

export { authRouter };
