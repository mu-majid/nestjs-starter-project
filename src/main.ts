import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true, // respond only with attributes in the DTO
      transform: true, // Convert the request body to DTO class - Performance maybe slightly slower
      forbidNonWhitelisted: true // Prevent unknown attributes and throw error
    })
  );
  await app.listen(3000);
}
bootstrap();
