import { Module } from '@nestjs/common';
import { ClassSectionsService } from './class-sections.service';
import { ClassSectionsController } from './class-sections.controller';

@Module({
  controllers: [ClassSectionsController],
  providers: [ClassSectionsService],
})
export class ClassSectionsModule {}
