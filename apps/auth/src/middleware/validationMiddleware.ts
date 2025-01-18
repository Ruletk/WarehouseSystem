import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response } from "express";
import { ApiResponse } from "../dto/response";


export function validateRequest<T extends object>(DTOClass: new () => T) {
  return async (req: Request, res: Response, next: () => void) => {
    const dtoInstance = plainToInstance(DTOClass, req.body);
    const errors: ValidationError[] = await validate(dtoInstance);

    if (errors.length > 0) {
      const message = new ValidationError();
      message.children = errors;
      return res.status(400).json(
        ApiResponse.from({
          code: 400,
          type: "error",
          message: `Validation error. ${message.toString()}`,
        })
      );
    }

    req.body = dtoInstance;
    next();
  };
}
