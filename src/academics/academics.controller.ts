import { CreateTeacherSubjectClassDto } from './dto/assign-teacher-subject.dto';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { Controller, Post, Get, Body } from '@nestjs/common';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { AcademicsService } from './academics.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { CreateTermDto } from './dto/create-term.dto';
import { CreateClassSectionDto } from './dto/create-class-section.dto';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';

@Controller('academics')
export class AcademicsController {
  constructor(private readonly academicsService: AcademicsService) {}

  // --- Academic Year Endpoints ---
  @Post('years')
  async createAcademicYear(@Body() dto: CreateAcademicYearDto) {
    return this.academicsService.createAcademicYear(dto);
  }

  @Get('years')
  async findAllAcademicYears() {
    return this.academicsService.findAllAcademicYears();
  }

  // --- Attendance Endpoints ---
  @Post('attendance')
  async recordAttendance(@Body() dto: CreateAttendanceDto) {
    return this.academicsService.recordAttendance(dto);
  }

  @Get('attendance')
  async findAllAttendance() {
    return this.academicsService.findAllAttendance();
  }

  // --- Term Endpoints ---
  @Post('terms')
  async createTerm(@Body() dto: CreateTermDto) {
    return this.academicsService.createTerm(dto);
  }

  @Get('terms')
  async findAllTerms() {
    return this.academicsService.findAllTerms();
  }

  // --- Class Sections Endpoints ---
  @Post('sections')
  async createClassSection(@Body() dto: CreateClassSectionDto) {
    return this.academicsService.createClassSection(dto);
  }

  @Get('sections')
  async findAllClassSections() {
    return this.academicsService.findAllClassSections();
  }

  // --- Grades Endpoints ---
  @Post('grades')
  async recordGrade(
    @Body()
    dto: {
      studentId: string;
      assessmentId: string;
      scoreObtained: number;
      remarks?: string;
    },
  ) {
    return this.academicsService.recordGrade(dto);
  }

  // --- Assessments Endpoints ---
  @Post('assessments')
  async createAssessment(@Body() dto: CreateAssessmentDto) {
    return this.academicsService.createAssessment(dto);
  }

  @Get('assessments')
  async findAllAssessments() {
    return this.academicsService.findAllAssessments();
  }
  // --- Subjects Endpoints ---
  @Post('subjects')
  async createSubject(@Body() dto: CreateSubjectDto) {
    return this.academicsService.createSubject(dto);
  }

  @Get('subjects')
  async findAllSubjects() {
    return this.academicsService.findAllSubjects();
  }

  // --- Teacher Subject Classes Endpoints ---
  @Post('teacher-classes')
  async createTeacherSubjectClass(@Body() dto: CreateTeacherSubjectClassDto) {
    return this.academicsService.createTeacherSubjectClass(dto);
  }

  @Get('teacher-classes')
  async findAllTeacherSubjectClasses() {
    return this.academicsService.findAllTeacherSubjectClasses();
  }
}
