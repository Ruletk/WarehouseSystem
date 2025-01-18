import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response } from "express";
import { ApiResponse } from "./baseDTO";

export function validateRequest<T extends object>(DTOClass: new () => T) {
  return async (req: Request, res: Response, next: () => void): Promise<void> => {
    const dtoInstance = plainToInstance(DTOClass, req.body);
    const errors: ValidationError[] = await validate(dtoInstance);

    if (errors.length > 0) {
      const message = new ValidationError();
      message.children = errors;
      res.status(400).json(
        ApiResponse.from({
          code: 400,
          type: 'error',
          message: `Validation error. ${message.toString()}`,
        })
      );
      return;
    }

    req.body = dtoInstance;
    next();
  };
}
