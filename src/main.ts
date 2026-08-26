// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipe to enforce DTO rules (class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips properties that do not have any decorators
      forbidNonWhitelisted: true, // Throws an error if non-allowed properties are sent
      transform: true, // Automatically transforms payloads to match DTO types
    }),
  );

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
// Replace: bootstrap();
// With:
bootstrap().catch((err) => {
  console.error('Error starting application:', err);
  process.exit(1);
});
