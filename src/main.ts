import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { useContainer, ValidationError } from 'class-validator';

// Import firebase-admin
import * as admin from 'firebase-admin';
import * as serviceAccount from './config/kavia-14bce-firebase-adminsdk.json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Set the config options
  const adminConfig = serviceAccount as unknown;
  // Initialize the firebase admin app
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (errors: ValidationError[]) => {
      let retError = {};
      errors.forEach((item) => {
        retError[item.property] = Object.values(item.constraints);
      });
      let rs = {
        message: "Validation errors in your request",
        errors: retError,
      }
      return new HttpException(rs, HttpStatus.UNPROCESSABLE_ENTITY)}
  }));
  await app.listen(3000);
}
bootstrap();
