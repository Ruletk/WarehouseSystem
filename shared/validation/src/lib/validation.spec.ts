import { validateRequest, validateQuery, validateParams } from './validation';
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

jest.mock('class-transformer', () => ({
  plainToInstance: jest.fn(),
}));

jest.mock('class-validator', () => ({
  validate: jest.fn(),
  ValidationError: jest.fn().mockImplementation(() => ({
    children: [],
    toString: jest.fn().mockReturnValue('Validation error details'),
  })),
}));

jest.mock('./baseDTO', () => ({
  ApiResponse: {
    from: jest.fn().mockImplementation((data) => data),
  },
}));

describe('validation', () => {
  describe('validateRequest', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;

    beforeEach(() => {
      req = { body: {} };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });

    describe('deprecated req.body', () => {
      it('should attach validated body to req.validatedBody', async () => {
        const DTOClass = jest.fn();
        (plainToInstance as jest.Mock).mockReturnValue({});
        (validate as jest.Mock).mockResolvedValue([]);

        const middleware = validateRequest(DTOClass);
        await middleware(req as Request, res as Response, next);

        expect(req.validatedBody).toBeDefined();
        expect(req.validatedBody).toEqual({});
      });

      it('should not attach validated body to req.body', async () => {
        const DTOClass = jest.fn();
        (plainToInstance as jest.Mock).mockReturnValue({});
        (validate as jest.Mock).mockResolvedValue([]);

        const middleware = validateRequest(DTOClass);
        await middleware(req as Request, res as Response, next);

        expect(req.body).toEqual({});
      });
    });

    it('should call next if validation passes', async () => {
      const DTOClass = jest.fn();
      (plainToInstance as jest.Mock).mockReturnValue({});
      (validate as jest.Mock).mockResolvedValue([]);

      const middleware = validateRequest(DTOClass);
      await middleware(req as Request, res as Response, next);

      expect(plainToInstance).toHaveBeenCalledWith(DTOClass, req.body, { enableImplicitConversion: true });
      expect(validate).toHaveBeenCalledWith({});
      expect(next).toHaveBeenCalled();
    });

    it('should return 400 if validation fails', async () => {
      const DTOClass = jest.fn();
      const errorObj = { constraints: { error: "Error message" } };
      (plainToInstance as jest.Mock).mockReturnValue({});
      (validate as jest.Mock).mockResolvedValue([errorObj]);

      const middleware = validateRequest(DTOClass);
      await middleware(req as Request, res as Response, next);

      expect(plainToInstance).toHaveBeenCalledWith(DTOClass, req.body, { enableImplicitConversion: true });
      expect(validate).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: 400,
        type: 'error',
        message: 'Invalid request data - Error message'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('validateQuery', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;

    beforeEach(() => {
      req = { query: {} };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });

    it('should call next if validation passes', async () => {
      const DTOClass = jest.fn();
      (plainToInstance as jest.Mock).mockReturnValue({});
      (validate as jest.Mock).mockResolvedValue([]);

      const middleware = validateQuery(DTOClass);
      await middleware(req as Request, res as Response, next);

      expect(plainToInstance).toHaveBeenCalledWith(DTOClass, req.query, { enableImplicitConversion: true });
      expect(validate).toHaveBeenCalledWith({});
      expect(next).toHaveBeenCalled();
    });

    it('should return 400 if validation fails', async () => {
      const DTOClass = jest.fn();
      const errorObj = { constraints: { error: "Error message" } };
      (plainToInstance as jest.Mock).mockReturnValue({});
      (validate as jest.Mock).mockResolvedValue([errorObj]);

      const middleware = validateQuery(DTOClass);
      await middleware(req as Request, res as Response, next);

      expect(plainToInstance).toHaveBeenCalledWith(DTOClass, req.query, { enableImplicitConversion: true });
      expect(validate).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: 400,
        type: 'error',
        message: 'Invalid query parameters - Error message'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('validateParams', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;

    beforeEach(() => {
      req = { params: {} };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });

    it('should call next if validation passes', async () => {
      const DTOClass = jest.fn();
      (plainToInstance as jest.Mock).mockReturnValue({});
      (validate as jest.Mock).mockResolvedValue([]);

      const middleware = validateParams(DTOClass);
      await middleware(req as Request, res as Response, next);

      expect(plainToInstance).toHaveBeenCalledWith(DTOClass, req.params, { enableImplicitConversion: true });
      expect(validate).toHaveBeenCalledWith({});
      expect(next).toHaveBeenCalled();
    });

    it('should return 400 if validation fails', async () => {
      const DTOClass = jest.fn();
      const errorObj = { constraints: { error: "Error message" } };
      (plainToInstance as jest.Mock).mockReturnValue({});
      (validate as jest.Mock).mockResolvedValue([errorObj]);

      const middleware = validateParams(DTOClass);
      await middleware(req as Request, res as Response, next);

      expect(plainToInstance).toHaveBeenCalledWith(DTOClass, req.params, { enableImplicitConversion: true });
      expect(validate).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: 400,
        type: 'error',
        message: 'Invalid URL parameters - Error message'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
