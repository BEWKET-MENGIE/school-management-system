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
import { AcademicYearsService } from './academic-years.service';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { UpdateAcademicYearDto } from './dto/update-academic-year.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('academic-years')
export class AcademicYearsController {
  constructor(private readonly academicYearsService: AcademicYearsService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() createDto: CreateAcademicYearDto) {
    return this.academicYearsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.academicYearsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.academicYearsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateDto: UpdateAcademicYearDto) {
    return this.academicYearsService.update(id, updateDto);
  }

  @Patch(':id/set-current')
  @Roles('ADMIN')
  setCurrent(@Param('id') id: string) {
    return this.academicYearsService.setCurrent(id);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.academicYearsService.remove(id);
  }
}
