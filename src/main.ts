import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './utils/http-exception.filter';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

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

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
