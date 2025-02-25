import { Request, Response, Router } from 'express';
import {
  AuthRequest,
  PasswordChange,
  RequestPasswordChange,
} from '../dto/request';
import { ApiResponse, validateRequest } from '@warehouse/validation';
import { AuthService } from '../services/authService';
import { getLogger } from '@warehouse/logging';
import { authorizationMiddleware } from '@warehouse/authorization';

const logger = getLogger('authAPI');

export class AuthAPI {
  private authService: AuthService;

  constructor(authService: AuthService) {
    logger.info('Creating AuthAPI instance');
    this.authService = authService;
  }
  /**
   * Registers all authentication-related routes to the provided router.
   *
   * @param router - The router instance to which the routes will be registered.
   *
   * This method registers three types of routes:
   * - Public routes: Routes that are accessible to everyone.
   * - Public-only routes: Routes that are accessible only to non-authenticated users.
   * - Authenticated routes: Routes that are accessible only to authenticated users.
   */
  registerRoutes(router: Router): void {
    logger.info('Registering auth routes');
    this.registerPublicRoutes(router);
    this.registerPublicOnlyRoutes(router);
    this.registerAuthenticatedRoutes(router);
  }

  private registerPublicRoutes(router: Router): void {
    logger.info('Registering public auth routes', {
      routerName: router.name,
      routes: ['/logout', '/refresh', '/activate/:token']
    });

    router.get('/logout', this.logoutHandler.bind(this));
    router.get('/refresh', this.refreshTokenHandler.bind(this));
    router.get('/activate/:token', this.activateAccountHandler.bind(this));
  }

  private registerPublicOnlyRoutes(router: Router): void {
    logger.info('Registering public only auth routes', {
      routerName: router.name,
      routes: ['/login', '/register', '/forgot-password', '/change-password/:token']
    });

    router.post('/login', validateRequest(AuthRequest), this.loginHandler.bind(this));
    router.post('/register', validateRequest(AuthRequest), this.registerHandler.bind(this));
    router.post('/forgot-password', validateRequest(RequestPasswordChange), this.forgotPassword.bind(this));
    router.post('/change-password/:token', validateRequest(PasswordChange), this.changePasswordHandler.bind(this));
  }

  private registerAuthenticatedRoutes(router: Router): void {
    logger.info('Registering authenticated auth routes', {
      routerName: router.name
    });

    router.get('/user', authorizationMiddleware(''), this.userHandler.bind(this));
  }

  private async loginHandler(req: Request, res: Response) {
    logger.debug('Login attempt', {
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    const resp = await this.authService.login(req.body, req);

    if (resp.data?.token) {
      res.cookie('auth', resp.data.token, {
        maxAge: 31536000000,
        httpOnly: true,
      });
      logger.info('Login successful', { userId: resp.data.userId });
    } else {
      logger.warn('Login failed', { code: resp.code });
    }

    res.status(resp.code).json(resp);
  }

  private async registerHandler(req: Request, res: Response) {
    console.log('Register handler called');
    const resp = await this.authService.register(req.body);

    res.status(resp.code).json(resp);
  }

  private async logoutHandler(req: Request, res: Response) {
    const token = req.cookies?.auth;
    logger.debug('Logout attempt', {
      hasToken: !!token,
      ip: req.ip
    });

    if (token) res.clearCookie('auth');

    const resp = await this.authService.logout(token);
    logger.info('Logout completed', {
      success: resp.code === 200
    });

    res.status(resp.code).json(resp);
  }

  private async forgotPassword(req: Request, res: Response) {
    console.log('Forgot password handler called');
    const resp = await this.authService.forgotPassword(req.body);
    res.status(resp.code).json(resp);
  }

  private async changePasswordHandler(req: Request, res: Response) {
    console.log('Change password handler called');
    const token = req.params.token;
    const resp = await this.authService.changePassword(token, req.body);
    res.status(resp.code).json(resp);
  }

  private async refreshTokenHandler(req: Request, res: Response) {
    logger.debug('Token refresh attempt', {
      ip: req.ip,
      hasToken: !!req.cookies?.auth
    });

    const refreshToken = req.cookies?.auth;
    const resp = await this.authService.getAccessToken(refreshToken);

    if (resp.data?.token) {
      res.header('X-Access-Token', resp.data.token as string);
      logger.info('Token refreshed successfully');
    } else {
      logger.warn('Token refresh failed', { code: resp.code });
    }

    res.status(resp.code).json(resp);
  }

  private async activateAccountHandler(req: Request, res: Response) {
    console.log('Activate account handler called');
    const token = req.params.token;
    const resp = await this.authService.activateAccount(token);

    res.status(resp.code).json(resp);
  }

  private async userHandler(req: Request, res: Response) {
    console.log('User handler called');
    const resp = await this.authService.getUserData(req.authPayload.userId);

    if (resp && 'code' in resp)
      res.status(resp.code).json(resp);
    else
      res.status(200).json(resp);
  }
}
