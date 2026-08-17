import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { EnrollStudentDto } from './dto/enroll-student.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post('enroll')
  async enrollStudent(@Body() dto: EnrollStudentDto) {
    return this.studentsService.enrollStudent(dto);
  }

  @Get()
  async findAllStudents(@Query('sectionId') sectionId?: string) {
    return this.studentsService.findAllStudents(sectionId);
  }
}