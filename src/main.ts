import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set a global prefix so all routes start with /api
  app.setGlobalPrefix('api');

  // Enable CORS to allow external API testers and frontends to communicate with your backend
  app.enableCors();

  // Enable global validation pipe to enforce DTO rules (class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips properties that do not have any decorators
      forbidNonWhitelisted: true, // Throws an error if non-allowed properties are sent
      transform: true, // Automatically transforms payloads to match DTO types
    }),
  );

  // Use environment port if available, otherwise default to 3000
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Application is running on: ${await app.getUrl()}/api`);
}

bootstrap().catch((err) => {
  console.error('Error starting application:', err);
  process.exit(1);
});
