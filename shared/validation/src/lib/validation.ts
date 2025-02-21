import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from './baseDTO';
import { getLogger } from '@warehouse/logging';

const logger = getLogger('validation');

/**
 * Extends the Express Request interface to include validated body, query, and params.
 * This is useful for accessing validated data in the request handlers.
 * Additions:
 * - `validatedBody` - The validated request body.
 * - `validatedQuery` - The validated query parameters.
 * - `validatedParams` - The validated URL parameters.
 */
declare module 'express-serve-static-core' {
  interface Request {
    validatedBody?: unknown;
    validatedQuery?: unknown;
    validatedParams?: unknown;
  }
}


/**
 * Validates the request body using the provided DTO class.
 * The validated body is attached to the request object as `validatedBody`.
 * `validatedBody` is of the same type as the provided DTO class.
 * 
 * Deprecated: Use `req.validatedBody` instead of `req.body`.
 * @param DTOClass 
 * @returns An Express middleware function
 * @example
 * ```typescript
 * class CreateUserDTO {
 *   \@IsString()
 *   name!: string;
 * }
 * 
 * router.post('/', validateRequest(CreateUserDTO), async (req, res) => {
 *   if (req.validatedBody instanceof CreateUserDTO) {} // Always true
 *   console.log(req.validatedBody.name); // Access the validated name
 *   // Do something with the validated name
 * });
 * ```
 */
export function validateRequest<T extends object>(DTOClass: new () => T) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // Not safe, as req.body can contain sensitive data
    // But for debugging purposes, it's fine. I think.
    logger.debug('Validating request data', { DTOClass, body: req.body, method: req.method, url: req.url });

    const dtoInstance = plainToInstance(DTOClass, req.body, {
      enableImplicitConversion: true,
    });
    const errors: ValidationError[] = await validate(dtoInstance);

    logger.debug('Translated request data to DTO instance', {
      dtoInstance,
      errors,
    });

    if (errors.length > 0) {
      const errorMessages = errors.map((error) =>
        Object.values(error.constraints ?? {}).join(', ')
      );

      logger.error('Invalid request data', { errors: errorMessages });

      res.status(400).json(
        ApiResponse.from({
          code: 400,
          type: 'error',
          message: `Invalid request data - ${errorMessages.join('; ')}`,
        })
      );
      return;
    }

    req.validatedBody = dtoInstance as T;
    req.body = dtoInstance; // Deprecated, use validatedBody instead.
    logger.debug(
      'Request data validated successfully, continuing with request processing'
    );
    next();
  };
}


/**
 * Validates query parameters using the provided DTO class.
 * The validated parameters are attached to the request object as `validatedQuery`.
 * `validatedQuery` is of the same type as the provided DTO class.
 * @param DTOClass The DTO class to use for validation
 * @returns An Express middleware function
 * @example
 * ```typescript
 * class GetUserDTO {
 *   \@IsInt()
 *   id!: number;
 * }
 * 
 * router.get('/', validateQuery(GetUserDTO), async (req, res) => {
 *   if (req.validatedQuery instanceof GetUserDTO) {} // Always true
 *   console.log(req.validatedQuery.id); // Access the validated ID
 *   // Do something with the validated ID
 * });
 * ```
*/
export function validateQuery<T extends object>(DTOClass: new () => T) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    logger.debug('Validating query parameters', {
      DTOClass,
      query: req.query,
      method: req.method,
      url: req.url,
    });

    const dtoInstance = plainToInstance(DTOClass, req.query, {
      enableImplicitConversion: true,
    });
    const errors: ValidationError[] = await validate(dtoInstance);

    logger.debug('Translated query parameters to DTO instance', {
      dtoInstance,
      errors,
    });

    if (errors.length > 0) {
      const errorMessages = errors.map((error) =>
        Object.values(error.constraints ?? {}).join(', ')
      );

      logger.error('Invalid query parameters', { errors: errorMessages });

      res.status(400).json(
        ApiResponse.from({
          code: 400,
          type: 'error',
          message: `Invalid query parameters - ${errorMessages.join('; ')}`,
        })
      );
      return;
    }

    req.validatedQuery = dtoInstance as T;
    logger.debug(
      'Query parameters validated successfully, continuing with request processing'
    );
    next();
  };
}

/**
 * Validates URL parameters using the provided DTO class.
 * The validated parameters are attached to the request object as `validatedParams`.
 * `validatedParams` is of the same type as the provided DTO class.
 * @param DTOClass The DTO class to use for validation
 * @returns An Express middleware function
 * @example
 * ```typescript
 * class GetUserDTO {
 *   \@IsInt()
 *   id!: number;
 * }
 * 
 * router.get('/:id', validateParams(GetUserDTO), async (req, res) => {
 *   if (req.validatedParams instanceof GetUserDTO) {} // Always true
 *   console.log(req.validatedParams.id); // Access the validated ID
 *   // Do something with the validated ID
 * });
 * ```
 */
export function validateParams<T extends object>(DTOClass: new () => T) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    logger.debug('Validating URL parameters', {
      DTOClass,
      params: req.params,
      method: req.method,
      url: req.url,
    });

    const dtoInstance = plainToInstance(DTOClass, req.params, {
      enableImplicitConversion: true,
    });
    const errors: ValidationError[] = await validate(dtoInstance);

    logger.debug('Translated URL parameters to DTO instance', {
      dtoInstance,
      errors,
    });

    if (errors.length > 0) {
      const errorMessages = errors.map((error) =>
        Object.values(error.constraints ?? {}).join(', ')
      );

      logger.error('Invalid URL parameters', { errors: errorMessages });

      res.status(400).json(
        ApiResponse.from({
          code: 400,
          type: 'error',
          message: `Invalid URL parameters - ${errorMessages.join('; ')}`,
        })
      );
      return;
    }

    req.validatedParams = dtoInstance as T;
    logger.debug(
      'URL parameters validated successfully, continuing with request processing'
    );
    next();
  };
}