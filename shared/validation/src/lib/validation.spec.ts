import { validateRequest } from './validation';
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
      req = {
        body: {},
      };
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

      const middleware = validateRequest(DTOClass);
      await middleware(req as Request, res as Response, next);

      expect(plainToInstance).toHaveBeenCalledWith(DTOClass, req.body);
      expect(validate).toHaveBeenCalledWith({});
      expect(next).toHaveBeenCalled();
    });

    it('should return 400 if validation fails', async () => {
      const DTOClass = jest.fn();
      const validationError = new ValidationError();
      (plainToInstance as jest.Mock).mockReturnValue({});
      (validate as jest.Mock).mockResolvedValue([validationError]);

      const middleware = validateRequest(DTOClass);
      await middleware(req as Request, res as Response, next);

      expect(plainToInstance).toHaveBeenCalledWith(DTOClass, req.body);
      expect(validate).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: 400,
        type: 'error',
        message: 'Validation error. Validation error details',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
