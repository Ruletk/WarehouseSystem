import { Request, Response, Router } from 'express';
import {
  AuthRequest,
  PasswordChange,
  RequestPasswordChange,
} from '../dto/request';
import { validateRequest } from '@warehouse/validation';
import { AuthService } from '../services/authService';

export class AuthAPI {
  private authService: AuthService;

  constructor(authService: AuthService) {
    console.log('INFO: Creating AuthAPI instance');
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
    console.log('INFO: Registering auth routes');
    this.registerPublicRoutes(router);
    this.registerPublicOnlyRoutes(router);
    this.registerAuthenticatedRoutes(router);
  }

  private registerPublicRoutes(router: Router): void {
    console.log(
      `INFO: Registering public auth routes with router: ${router.name}.`
    );

    router.get('/logout', this.logoutHandler.bind(this));
    router.get('/refresh', this.refreshTokenHandler.bind(this));
    router.get('/activate/:token', this.activateAccountHandler.bind(this));
  }

  private registerPublicOnlyRoutes(router: Router): void {
    console.log(
      `INFO: Registering public only auth routes with router: ${router.name}.`
    );

    router.post(
      '/login',
      validateRequest(AuthRequest),
      this.loginHandler.bind(this)
    );
    router.post(
      '/register',
      validateRequest(AuthRequest),
      this.registerHandler.bind(this)
    );
    router.post(
      '/forgot-password',
      validateRequest(RequestPasswordChange),
      this.forgotPassword
    );
    router.post(
      '/change-password/:token',
      validateRequest(PasswordChange),
      this.changePasswordHandler
    );
  }

  private registerAuthenticatedRoutes(router: Router): void {
    console.log(
      `INFO: Registering authenticated auth routes with router: ${router.name}.`
    );
  }

  private async loginHandler(req: Request, res: Response) {
    console.log('Login handler called');
    const resp = await this.authService.login(req.body, req);

    if (resp.type === 'error') {
      res.status(resp.code).json(resp);
      return;
    }

    res.cookie('auth', resp.data?.token, {
      maxAge: 31536000000,
      httpOnly: true,
    });
    res.json(resp);
  }

  private async registerHandler(req: Request, res: Response) {
    console.log('Register handler called');
    const resp = await this.authService.register(req.body);

    if (resp.type === 'error') {
      res.status(resp.code).json(resp);
      return;
    }

    res.json(resp);
  }

  private async logoutHandler(req: Request, res: Response) {
    console.log('INFO: Logout handler called');
    const token = req.cookies?.auth;
    console.log(`DEBUG: Token is: ${token}`);
    if (token) res.clearCookie('auth');

    const resp = await this.authService.logout(token);
    res.json(resp);
  }

  private forgotPassword(req: Request, res: Response) {
    console.log('Forgot password handler called');
    res.json({ message: 'Forgot password handler called', data: req.body });
  }

  private changePasswordHandler(req: Request, res: Response) {
    console.log('Change password handler called');
    res.json({ message: 'Change password handler called', data: req.body });
  }

  private async refreshTokenHandler(req: Request, res: Response) {
    console.log('Refresh token handler called');
    const refreshToken = req.cookies?.auth;
    const resp = await this.authService.getAccessToken(refreshToken);

    if (resp.code == 500) return res.status(resp.code).json(resp);

    // Guraunteed to have a data.token property
    res.header('X-Access-Token', resp.data.token as string);
    res.json(resp);
  }

  private async activateAccountHandler(req: Request, res: Response) {
    console.log('Activate account handler called');
    const token = req.params.token;
    const resp = await this.authService.activateAccount(token);

    res.status(resp.code).json(resp);
  }
}
