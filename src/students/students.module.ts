import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Required to use PrismaService inside StudentsService
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService], // Exports it just in case other modules need to look up students later
})
export class StudentsModule {}