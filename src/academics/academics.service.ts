import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { CreateTermDto } from './dto/create-term.dto';
import { AssessmentType } from '@prisma/client';

@Injectable()
export class AcademicsService {
  constructor(private readonly prisma: PrismaService) {}

  // --- ACADEMIC YEARS & TERMS ---
  async createAcademicYear(dto: {
    yearName: string;
    startDate: string;
    endDate: string;
    isCurrent?: boolean;
  }) {
    return this.prisma.academicYear.create({
      data: {
        yearName: dto.yearName,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        isCurrent: dto.isCurrent ?? false,
      },
    });
  }

  async findAllAcademicYears() {
    return this.prisma.academicYear.findMany();
  }

  async createTerm(dto: CreateTermDto) {
    return this.prisma.term.create({
      data: {
        termName: dto.termName || dto.name || '',
        academicYearId: dto.academicYearId,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
      },
    });
  }

  async findAllTerms() {
    return this.prisma.term.findMany();
  }

  // --- SUBJECTS ---
  async createSubject(dto: { name: string; code: string }) {
    return this.prisma.subject.create({
      data: {
        name: dto.name,
        code: dto.code,
      },
    });
  }

  async findAllSubjects() {
    return this.prisma.subject.findMany();
  }

  // --- CLASS SECTIONS ---
  async createClassSection(dto: { sectionName: string; gradeLevel: number }) {
    return this.prisma.classSection.create({
      data: {
        sectionName: dto.sectionName,
        gradeLevel: dto.gradeLevel,
      },
    });
  }

  async findAllClassSections() {
    return this.prisma.classSection.findMany({
      include: { students: true },
    });
  }

  // --- TEACHER SUBJECT CLASSES ---
  async createTeacherSubjectClass(dto: {
    teacherId: string;
    subjectId: string;
    classSectionId: string;
    academicYearId: string;
  }) {
    return this.prisma.teacherSubjectClass.create({
      data: {
        teacherId: dto.teacherId,
        subjectId: dto.subjectId,
        classSectionId: dto.classSectionId,
        academicYearId: dto.academicYearId,
      },
    });
  }

  async findAllTeacherSubjectClasses() {
    return this.prisma.teacherSubjectClass.findMany({
      include: {
        teacher: true,
        subject: true,
        classSection: true,
      },
    });
  }

  // --- ASSESSMENTS ---
  async createAssessment(dto: {
    teacherSubjectClassId: string;
    termId: string;
    title: string;
    type: AssessmentType;
    weightPercentage: number;
    maxScore?: number;
  }) {
    return this.prisma.assessment.create({
      data: {
        teacherSubjectClassId: dto.teacherSubjectClassId,
        termId: dto.termId,
        title: dto.title,
        type: dto.type,
        weightPercentage: dto.weightPercentage,
        maxScore: dto.maxScore ?? 100.0,
      },
    });
  }

  async findAllAssessments() {
    return this.prisma.assessment.findMany();
  }

  // --- GRADES ---
  async recordGrade(dto: {
    studentId: string;
    assessmentId: string;
    scoreObtained: number;
    remarks?: string;
  }) {
    const student = await this.prisma.student.findUnique({
      where: { id: dto.studentId },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${dto.studentId} not found`);
    }

    return this.prisma.grade.create({
      data: {
        studentId: dto.studentId,
        assessmentId: dto.assessmentId,
        scoreObtained: dto.scoreObtained,
        remarks: dto.remarks,
      },
    });
  }

  // --- ATTENDANCE ---
  async recordAttendance(dto: CreateAttendanceDto) {
    const student = await this.prisma.student.findUnique({
      where: { id: dto.studentId },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${dto.studentId} not found`);
    }

    return this.prisma.attendanceLog.create({
      data: {
        studentId: dto.studentId,
        status: dto.status,
        type: dto.type,
        termId: dto.termId,
        date: dto.date ? new Date(dto.date) : undefined,
      },
    });
  }

  async findAllAttendance() {
    return this.prisma.attendanceLog.findMany({
      include: {
        student: true,
      },
    });
  }

  async findAttendanceById(id: string) {
    const log = await this.prisma.attendanceLog.findUnique({
      where: { id },
      include: { student: true },
    });

    if (!log) {
      throw new NotFoundException(`Attendance log with ID ${id} not found`);
    }

    return log;
  }

  async updateAttendance(id: string, dto: Partial<CreateAttendanceDto>) {
    await this.findAttendanceById(id);

    return this.prisma.attendanceLog.update({
      where: { id },
      data: {
        ...dto,
        date: dto.date ? new Date(dto.date) : undefined,
      },
    });
  }

  async removeAttendance(id: string) {
    await this.findAttendanceById(id);

    return this.prisma.attendanceLog.delete({
      where: { id },
    });
  }
}
