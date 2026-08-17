import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS so your Next.js frontend can talk to this backend later
  app.enableCors();

  // Enable DTO validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away any extra fields not defined in the DTO
      transform: true, // Automatically transforms payloads to match DTO classes
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
