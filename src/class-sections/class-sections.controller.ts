import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ClassSectionsService } from './class-sections.service';
import { CreateClassSectionDto } from './dto/create-class-section.dto';
import { UpdateClassSectionDto } from './dto/update-class-section.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('class-sections')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClassSectionsController {
  constructor(private readonly classSectionsService: ClassSectionsService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() createClassSectionDto: CreateClassSectionDto) {
    return this.classSectionsService.create(createClassSectionDto);
  }

  @Get()
  findAll() {
    return this.classSectionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classSectionsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(
    @Param('id') id: string,
    @Body() updateClassSectionDto: UpdateClassSectionDto,
  ) {
    return this.classSectionsService.update(id, updateClassSectionDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.classSectionsService.remove(id);
  }
}
