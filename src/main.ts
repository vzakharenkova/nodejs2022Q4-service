import {
  BadRequestException,
  ClassSerializerInterceptor,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
// import { SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
// import { readFile } from 'fs/promises';
// import { join } from 'path';
// import { parse } from 'yaml';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './utils/http-exception.filter';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

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

  //   const swaggerDocs = await readFile(join(__dirname, '..', 'doc/api.yaml'), 'utf-8');

  //   SwaggerModule.setup('doc', app, parse(swaggerDocs));

  await app.listen(process.env.PORT || 4000, async () =>
    console.log(`App is running on ${await app.getUrl()}`),
  );
}
bootstrap();
