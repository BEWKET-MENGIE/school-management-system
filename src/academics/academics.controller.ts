import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AcademicsService } from './academics.service';
import { CreateSubjectDto } from './dto/subject/create-subject.dto';
import { CreateTermDto } from './dto/term/create-term.dto';
import { CreateClassSectionDto } from './dto/class-section/create-class-section.dto';
import { AssignTeacherSubjectDto } from './dto/teacher-assignment/assign-teacher-subject.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('academics')
@UseGuards(JwtAuthGuard)
export class AcademicsController {
  constructor(private readonly academicsService: AcademicsService) {}

  // --- Subjects ---
  @Post('subjects')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  createSubject(@Body() dto: CreateSubjectDto) {
    return this.academicsService.createSubject(dto);
  }

  @Get('subjects')
  findAllSubjects() {
    return this.academicsService.findAllSubjects();
  }

  // --- Terms ---
  @Post('terms')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  createTerm(@Body() dto: CreateTermDto) {
    return this.academicsService.createTerm(dto);
  }

  @Get('terms')
  findAllTerms() {
    return this.academicsService.findAllTerms();
  }

  // --- Class Sections ---
  @Post('class-sections')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  createClassSection(@Body() dto: CreateClassSectionDto) {
    return this.academicsService.createClassSection(dto);
  }

  @Get('class-sections')
  findAllClassSections() {
    return this.academicsService.findAllClassSections();
  }

  // --- Teacher Assignments ---
  @Post('assignments')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  assignTeacher(@Body() dto: AssignTeacherSubjectDto) {
    return this.academicsService.assignTeacher(dto);
  }
}