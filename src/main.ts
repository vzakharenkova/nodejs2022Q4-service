import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  await app.listen(4000);
}
bootstrap();
