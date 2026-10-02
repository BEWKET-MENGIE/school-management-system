import { Module } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Add this!
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
  exports: [DepartmentsService], // Export so other modules can use it
})
export class DepartmentsModule {}
