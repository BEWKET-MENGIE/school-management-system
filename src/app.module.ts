// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AcademicsModule } from './academics/academics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Makes environment variables global
    PrismaModule,
    AuthModule,
    UsersModule,
    AcademicsModule, // <--- Ensure AcademicsModule is included here
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}