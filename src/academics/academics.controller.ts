import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AcademicsService } from './academics.service';
import { CreateSectionDto } from './dto/create-academic.dto';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { AssignTeacherSubjectDto } from './dto/assign-teacher-subject.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('academics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AcademicsController {
  constructor(private readonly academicsService: AcademicsService) {}

  // ==================== SECTIONS ENDPOINTS ====================

  @Post('sections')
  @Roles(UserRole.ADMIN)
  createSection(@Body() dto: CreateSectionDto) {
    return this.academicsService.createSection(dto);
  }

  @Get('sections')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  findAllSections(@Query('gradeLevel') gradeLevel?: number) {
    return this.academicsService.findAllSections(gradeLevel);
  }

  @Get('sections/:id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findOneSection(@Param('id') id: string) {
    return this.academicsService.findOneSection(id);
  }

  // ==================== SUBJECTS ENDPOINTS ====================

  @Post('subjects')
  @Roles(UserRole.ADMIN)
  createSubject(@Body() dto: CreateSubjectDto) {
    return this.academicsService.createSubject(dto);
  }

  @Get('subjects')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  findAllSubjects(@Query('gradeLevel') gradeLevel?: number) {
    return this.academicsService.findAllSubjects(gradeLevel);
  }

  // ==================== TEACHER ASSIGNMENTS ENDPOINTS ====================

  @Post('teacher-assignments')
  @Roles(UserRole.ADMIN)
  assignTeacherToSubjectClass(@Body() dto: AssignTeacherSubjectDto) {
    return this.academicsService.assignTeacherToSubjectClass(dto);
  }

  @Get('teacher-assignments')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findAllTeacherAssignments() {
    return this.academicsService.findAllTeacherAssignments();
  }
}