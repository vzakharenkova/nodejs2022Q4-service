import {
  BadRequestException,
  ClassSerializerInterceptor,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';
import { CustomLoggerService } from './logger/custom-logger.service';
import { HttpExceptionFilter } from './utils/http-exception.filter';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new CustomLoggerService();

  app.useLogger(logger);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalFilters(new HttpExceptionFilter(logger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const customError = errors
          .map((error) => {
            const keys = Object.keys(error.constraints);

            return keys.map((key) => error.constraints[key]).join(', ');
          })
          .join('; ');

        return new BadRequestException(customError);
      },
    }),
  );

  await app.listen(process.env.PORT || 4000, async () =>
    console.log(`App is running on ${await app.getUrl()}`),
  );
}
bootstrap();
