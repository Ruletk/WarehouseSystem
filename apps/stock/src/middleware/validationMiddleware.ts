import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware для валидации данных.
 * @param dtoClass - Класс DTO для валидации.
 * @returns Middleware-функция для обработки запросов.
 */
export function validationMiddleware(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Преобразуем тело запроса в экземпляр DTO-класса
      const instance = plainToInstance(dtoClass, req.body);

      // Выполняем валидацию
      const errors = await validate(instance);

      // Если есть ошибки валидации, возвращаем их клиенту
      if (errors.length > 0) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: errors.map((error) => ({
            property: error.property,
            constraints: error.constraints,
          })),
        });
      }

      // Если ошибок нет, передаем управление следующему middleware
      next();
    } catch (err) {
      // Обработка неожиданных ошибок
      res.status(500).json({
        message: 'Internal server error during validation',
        error: err.message,
      });
    }
  };
}
