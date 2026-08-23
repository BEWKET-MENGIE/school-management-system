import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Ensure this path matches your setup

@Module({
  imports: [PrismaModule], // Inject PrismaModule here!
  controllers: [SubjectsController],
  providers: [SubjectsService],
  exports: [SubjectsService], // Optional: Export if other modules need to fetch subjects later
})
export class SubjectsModule {}