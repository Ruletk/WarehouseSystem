import * as jwt from 'jsonwebtoken';
import { ApiResponse } from '@warehouse/validation';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { getLogger } from '@warehouse/logging';

const logger = getLogger('authorization');

interface AuthPayload {
  userId: number;
  userEmail: string;
  roles: string[];
}

declare module 'express-serve-static-core' {
  interface Request {
    authPayload?: AuthPayload;
  }
}

export function authorizationMiddleware(requiredRole: string): RequestHandler {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const token: string | undefined = req.headers ? req.headers['x-access-token'] as string : undefined;
    logger.debug('Authorization middleware', {
      token,
      requiredRole,
    });

    if (!token) {
      logger.warn('No token provided');
      res.status(401).json(
        ApiResponse.from({
          code: 401,
          type: 'error',
          message: 'Unauthorized',
        })
      );
      return;
    }

    const secret = process.env['JWT_SECRET'] as string;
    if (!secret) {
      logger.error('JWT_SECRET is not set');
      res.status(500).send('Internal Server Error');
      return;
    }

    let payload: jwt.JwtPayload;

    try {
      payload = jwt.verify(token, secret) as jwt.JwtPayload;
    } catch (error) {
      logger.warn('Token verification failed', {
        error: error,
        tokenPrefix: token.substring(0, 8),
      });
      res.status(401).json(
        ApiResponse.from({
          code: 401,
          type: 'error',
          message: 'Unauthorized',
        })
      );
      return;
    }
    const userId = parseInt(payload['id'] as string, 10);
    const userEmail = payload['email'] as string;
    const roles = payload['roles'] as string[]; // Always an array or empty array

    req.authPayload = { userId, userEmail, roles };

    if (requiredRole && !checkPermission(roles, requiredRole)) {
      logger.warn('User does not have required permission', {
        userId,
        userEmail,
        requiredRole,
        userRoles: roles,
      });
      res.status(403).json(
        ApiResponse.from({
          code: 403,
          type: 'error',
          message: 'Forbidden',
        })
      );
      return;
    }

    next();
  };
}

function checkPermission(roles: string[], requiredRole: string): boolean {
  return roles.includes(requiredRole);
}
