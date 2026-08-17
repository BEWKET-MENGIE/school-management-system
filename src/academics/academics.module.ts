// src/academics/academics.module.ts
import { Module } from '@nestjs/common';
import { AcademicsService } from './academics.service';
import { AcademicsController } from './academics.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AcademicsController],
  providers: [AcademicsService],
  exports: [AcademicsService], // Exported in case other modules need it later
})
export class AcademicsModule {}