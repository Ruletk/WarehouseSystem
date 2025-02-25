import { authorizationMiddleware } from './authorization';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ApiResponse } from '@warehouse/validation';

jest.mock('jsonwebtoken');

describe('authorizationMiddleware', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            cookies: {},
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
        next = jest.fn();
        process.env['JWT_SECRET'] = 'testsecret';
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 401 if no token is provided', async () => {
        const middleware = authorizationMiddleware('requiredPermission');
        await middleware(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(
            ApiResponse.from({
                code: 401,
                type: 'error',
                message: 'Unauthorized',
            })
        );
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 500 if JWT_SECRET is not set', async () => {
        delete process.env['JWT_SECRET'];
        req.cookies = { auth: 'token' };

        const middleware = authorizationMiddleware('requiredPermission');
        await middleware(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Internal Server Error');
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if user does not have required permission', async () => {
        req.cookies = { auth: 'token' };
        (jwt.verify as jest.Mock).mockReturnValue({
            sub: '3',
            roles: ['user'],
        });

        const middleware = authorizationMiddleware('admin');
        await middleware(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(
            ApiResponse.from({
                code: 403,
                type: 'error',
                message: 'Forbidden',
            })
        );
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next if user has required permission', async () => {
        req.cookies = { auth: 'token' };
        (jwt.verify as jest.Mock).mockReturnValue({
            sub: '3',
            roles: ['admin'],
        });

        const middleware = authorizationMiddleware('admin');
        await middleware(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
        expect(req.authPayload).toEqual({
            userId: 3,
            roles: ['admin'],
        });
    });

    it('should call next if no required role is specified', async () => {
        req.cookies = { auth: 'token' };
        (jwt.verify as jest.Mock).mockReturnValue({
            sub: '4',
            roles: ['user'],
        });

        const middleware = authorizationMiddleware('');
        await middleware(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
        expect(req.authPayload).toEqual({
            userId: 4,
            roles: ['user'],
        });
    });
});