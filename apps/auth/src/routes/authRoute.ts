import { Request, Response, Router } from 'express';
import {
  AuthRequest,
  PasswordChange,
  RequestPasswordChange,
} from '../dto/request';
import { validateRequest } from '@warehouse/validation';

export class AuthAPI {
  private authService: string; // Temporary string, will be replaced with actual service

  constructor(authService: string) {
    // Temporary string, will be replaced with actual service
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

    router.get('/logout', this.logoutHandler);
    router.get('/refresh', this.refreshTokenHandler);
    router.get('/activate/:token', this.activateAccountHandler);
  }

  private registerPublicOnlyRoutes(router: Router): void {
    console.log(
      `INFO: Registering public only auth routes with router: ${router.name}.`
    );

    router.post('/login', validateRequest(AuthRequest), this.loginHandler);
    router.post(
      '/register',
      validateRequest(AuthRequest),
      this.registerHandler
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

  private loginHandler(req: Request, res: Response) {
    console.log('Login handler called');
    res.json({ message: 'Login handler called', data: req.body });
  }

  private registerHandler(req: Request, res: Response) {
    console.log('Register handler called');
    res.json({ message: 'Register handler called', data: req.body });
  }

  private logoutHandler(req: Request, res: Response) {
    console.log('Logout handler called');
    res.json({ message: 'Logout handler called' });
  }

  private forgotPassword(req: Request, res: Response) {
    console.log('Forgot password handler called');
    res.json({ message: 'Forgot password handler called', data: req.body });
  }

  private changePasswordHandler(req: Request, res: Response) {
    console.log('Change password handler called');
    res.json({ message: 'Change password handler called', data: req.body });
  }

  private refreshTokenHandler(req: Request, res: Response) {
    console.log('Refresh token handler called');
    res.json({ message: 'Refresh token handler called' });
  }

  private activateAccountHandler(req: Request, res: Response) {
    console.log('Activate account handler called');
    res.json({ message: 'Activate account handler called' });
  }
}
