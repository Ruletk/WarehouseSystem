import * as jwt from 'jsonwebtoken';
import { ApiResponse } from '@warehouse/validation';
import { NextFunction, Request, RequestHandler, Response } from 'express';


interface AuthPayload {
  userId: number;
  roles: string[];
}

declare module 'express-serve-static-core' {
  interface Request {
    authPayload?: AuthPayload;
  }
}


export function authorizationMiddleware(
  requiredRole: string
): RequestHandler {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const token = req.cookies?.auth;
    if (!token) {
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
      res.status(500).send('Internal Server Error');
      return;
    }

    const payload = jwt.verify(token, secret) as jwt.JwtPayload;
    const userId = parseInt(payload['sub'] as string, 10);
    const roles = payload['roles'] as string[]; // Always an array or empty array

    req.authPayload = { userId, roles };

    if (requiredRole && !checkPermission(roles, requiredRole)) {
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
