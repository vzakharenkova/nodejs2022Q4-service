import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLoggerService } from './custom-logger.service';

@Injectable()
export class CustomLoggerMiddleware implements NestMiddleware {
  constructor(private readonly customLoggerService: CustomLoggerService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const { body, method, originalUrl, params } = request;

    response.on('finish', () => {
      const { statusCode } = response;

      this.customLoggerService.log(
        `${new Date().toISOString()} - ${method} ${originalUrl} | STATUS: ${statusCode} | ${JSON.stringify(
          body,
        )} | ${JSON.stringify(params)}`,
      );
    });

    next();
  }
}
