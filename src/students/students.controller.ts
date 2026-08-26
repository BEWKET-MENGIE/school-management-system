import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { StudentsService } from './students.service';
import { EnrollStudentDto } from './dto/enroll-student.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post('enroll')
  enrollStudent(@Body() dto: EnrollStudentDto) {
    return this.studentsService.enrollStudent(dto);
  }

  @Get('stats')
  getRegistrationStats() {
    return this.studentsService.getRegistrationStats();
  }

  @Get()
  findAll(
    @Query('sectionId') sectionId?: string,
    @Query('search') search?: string,
  ) {
    return this.studentsService.findAll({ sectionId });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }
}
