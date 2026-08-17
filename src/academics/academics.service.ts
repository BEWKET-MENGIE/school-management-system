import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSectionDto } from './dto/create-academic.dto';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { AssignTeacherSubjectDto } from './dto/assign-teacher-subject.dto';
import { Stream } from '@prisma/client';

@Injectable()
export class AcademicsService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== SECTIONS ====================

  async createSection(dto: CreateSectionDto) {
    if ((dto.gradeLevel === 9 || dto.gradeLevel === 10) && dto.stream !== Stream.NONE) {
      throw new BadRequestException(`Grades 9 and 10 must have their stream set to NONE.`);
    }

    if ((dto.gradeLevel === 11 || dto.gradeLevel === 12) && dto.stream === Stream.NONE) {
      throw new BadRequestException(`Grades 11 and 12 must be assigned to either NATURAL_SCIENCE or SOCIAL_SCIENCE.`);
    }

    const existing = await this.prisma.classSection.findUnique({
      where: {
        gradeLevel_sectionName: {
          gradeLevel: dto.gradeLevel,
          sectionName: dto.sectionName,
        },
      },
    });

    if (existing) {
      throw new ConflictException(`Section "${dto.sectionName}" for Grade ${dto.gradeLevel} already exists.`);
    }

    return this.prisma.classSection.create({
      data: {
        sectionName: dto.sectionName,
        gradeLevel: dto.gradeLevel,
      },
      include: {
        _count: {
          select: { students: true },
        },
      },
    });
  }

  async findAllSections(gradeLevel?: number) {
    return this.prisma.classSection.findMany({
      where: gradeLevel ? { gradeLevel: Number(gradeLevel) } : undefined,
      include: {
        _count: {
          select: { students: true },
        },
      },
      orderBy: [{ gradeLevel: 'asc' }, { sectionName: 'asc' }],
    });
  }

  async findOneSection(id: string) {
    const section = await this.prisma.classSection.findUnique({
      where: { id },
      include: {
        students: {
          select: {
            id: true,
            admissionNumber: true,
            firstName: true,
            lastName: true,
            currentStream: true,
            status: true,
          },
        },
      },
    });

    if (!section) {
      throw new NotFoundException(`Class section with ID "${id}" not found.`);
    }

    return section;
  }

  // ==================== SUBJECTS ====================

  async createSubject(dto: CreateSubjectDto) {
    const existing = await this.prisma.subject.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new ConflictException(`Subject code "${dto.code}" already exists.`);
    }

    return this.prisma.subject.create({
      data: {
        name: dto.name,
        code: dto.code,
        gradeLevel: dto.gradeLevel,
      },
    });
  }

  async findAllSubjects(gradeLevel?: number) {
    return this.prisma.subject.findMany({
      where: gradeLevel ? { gradeLevel: Number(gradeLevel) } : undefined,
      orderBy: [{ gradeLevel: 'asc' }, { name: 'asc' }],
    });
  }

  // ==================== TEACHER ASSIGNMENTS ====================

  async assignTeacherToSubjectClass(dto: AssignTeacherSubjectDto) {
    console.log('--- DEBUGGING TEACHER ASSIGNMENT ---');
    console.log('Received DTO:', dto);

    // Print all records in database to verify active connection file
    const allTeachers = await this.prisma.teacher.findMany();
    const allSubjects = await this.prisma.subject.findMany();
    const allSections = await this.prisma.classSection.findMany();
    const allAcademicYears = await this.prisma.academicYear.findMany();

    console.log('Available Teachers:', allTeachers.map(t => ({ id: t.id, name: `${t.firstName} ${t.lastName}` })));
    console.log('Available Subjects:', allSubjects.map(s => ({ id: s.id, code: s.code })));
    console.log('Available Sections:', allSections.map(sec => ({ id: sec.id, name: sec.sectionName })));
    console.log('Available Academic Years:', allAcademicYears.map(ay => ({ id: ay.id })));

    const teacher = await this.prisma.teacher.findUnique({
      where: { id: dto.teacherId },
    });
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID "${dto.teacherId}" not found.`);
    }

    const subject = await this.prisma.subject.findUnique({
      where: { id: dto.subjectId },
    });
    if (!subject) {
      throw new NotFoundException(`Subject with ID "${dto.subjectId}" not found.`);
    }

    const section = await this.prisma.classSection.findUnique({
      where: { id: dto.classSectionId },
    });
    if (!section) {
      throw new NotFoundException(`Class section with ID "${dto.classSectionId}" not found.`);
    }

    const academicYear = await this.prisma.academicYear.findUnique({
      where: { id: dto.academicYearId },
    });
    if (!academicYear) {
      throw new NotFoundException(`Academic year with ID "${dto.academicYearId}" not found.`);
    }

    const existingAssignment = await this.prisma.teacherSubjectClass.findFirst({
      where: {
        teacherId: dto.teacherId,
        subjectId: dto.subjectId,
        classSectionId: dto.classSectionId,
        academicYearId: dto.academicYearId,
      },
    });

    if (existingAssignment) {
      throw new ConflictException(`This teacher is already assigned to this subject for this section in this academic year.`);
    }

    return this.prisma.teacherSubjectClass.create({
      data: {
        teacherId: dto.teacherId,
        subjectId: dto.subjectId,
        classSectionId: dto.classSectionId,
        academicYearId: dto.academicYearId,
      },
      include: {
        teacher: { select: { firstName: true, lastName: true } },
        subject: { select: { name: true, code: true } },
        classSection: { select: { sectionName: true, gradeLevel: true } },
        academicYear: true,
      },
    });
  }

  async findAllTeacherAssignments() {
    return this.prisma.teacherSubjectClass.findMany({
      include: {
        teacher: { select: { firstName: true, lastName: true } },
        subject: { select: { name: true, code: true } },
        classSection: { select: { sectionName: true, gradeLevel: true } },
        academicYear: true,
      },
    });
  }
}