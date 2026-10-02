import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// DTOs
import { CreateSubjectDto } from './dto/subject/create-subject.dto';
import { UpdateSubjectDto } from './dto/subject/update-subject.dto';
import { CreateTermDto } from './dto/term/create-term.dto';
import { UpdateTermDto } from './dto/term/update-term.dto';
import { CreateClassSectionDto } from './dto/class-section/create-class-section.dto';
import { UpdateClassSectionDto } from './dto/class-section/update-class-section.dto';
import { AssignTeacherSubjectDto } from './dto/teacher-assignment/assign-teacher-subject.dto';

// Constants & Entities
import { ACADEMIC_ERRORS } from './academics.constants';
import { SubjectEntity } from './entities/subject.entity';
import { TermEntity } from './entities/term.entity';
import { ClassSectionEntity } from './entities/class-section.entity';

@Injectable()
export class AcademicsService {
  constructor(private readonly prisma: PrismaService) {}

  // ==========================================
  // SUBJECTS
  // ==========================================
  async createSubject(dto: CreateSubjectDto): Promise<SubjectEntity> {
    const existing = await this.prisma.subject.findUnique({
      where: { code: dto.code },
    });
    if (existing) {
      throw new BadRequestException(`Subject code '${dto.code}' already exists.`);
    }

    const subject = await this.prisma.subject.create({
      data: {
        name: dto.name,
        code: dto.code,
        gradeLevel: dto.gradeLevel,
        description: dto.description,
      },
    });
    return new SubjectEntity(subject);
  }

  async findAllSubjects(): Promise<SubjectEntity[]> {
    const subjects = await this.prisma.subject.findMany({
      orderBy: { name: 'asc' },
    });
    return subjects.map((s) => new SubjectEntity(s));
  }

  async findOneSubject(id: string): Promise<SubjectEntity> {
    const subject = await this.prisma.subject.findUnique({ where: { id } });
    if (!subject) throw new NotFoundException(ACADEMIC_ERRORS.SUBJECT_NOT_FOUND);
    return new SubjectEntity(subject);
  }

  async updateSubject(id: string, dto: UpdateSubjectDto): Promise<SubjectEntity> {
    await this.findOneSubject(id);

    if (dto.code) {
      const existing = await this.prisma.subject.findUnique({ where: { code: dto.code } });
      if (existing && existing.id !== id) {
        throw new BadRequestException(`Subject code '${dto.code}' is already taken.`);
      }
    }

    const updated = await this.prisma.subject.update({
      where: { id },
      data: dto,
    });
    return new SubjectEntity(updated);
  }

  // ==========================================
  // TERMS
  // ==========================================
  async createTerm(dto: CreateTermDto): Promise<TermEntity> {
    const academicYear = await this.prisma.academicYear.findUnique({
      where: { id: dto.academicYearId },
    });
    if (!academicYear) {
      throw new NotFoundException(ACADEMIC_ERRORS.ACADEMIC_YEAR_NOT_FOUND);
    }

    if (dto.isCurrent) {
      await this.prisma.term.updateMany({
        where: { isCurrent: true },
        data: { isCurrent: false },
      });
    }

    const term = await this.prisma.term.create({
      data: {
        termName: dto.termName,
        academicYearId: dto.academicYearId,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        isCurrent: dto.isCurrent ?? false,
      },
    });
    return new TermEntity(term);
  }

  async findAllTerms(): Promise<TermEntity[]> {
    const terms = await this.prisma.term.findMany({
      include: { academicYear: true },
      orderBy: { startDate: 'desc' },
    });
    return terms.map((term) => new TermEntity(term));
  }

  async findOneTerm(id: string): Promise<TermEntity> {
    const term = await this.prisma.term.findUnique({
      where: { id },
      include: { academicYear: true },
    });
    if (!term) throw new NotFoundException(ACADEMIC_ERRORS.TERM_NOT_FOUND);
    return new TermEntity(term);
  }

  async updateTerm(id: string, dto: UpdateTermDto): Promise<TermEntity> {
    await this.findOneTerm(id);

    if (dto.academicYearId) {
      const academicYear = await this.prisma.academicYear.findUnique({
        where: { id: dto.academicYearId },
      });
      if (!academicYear) {
        throw new NotFoundException(ACADEMIC_ERRORS.ACADEMIC_YEAR_NOT_FOUND);
      }
    }

    if (dto.isCurrent) {
      await this.prisma.term.updateMany({
        where: { isCurrent: true },
        data: { isCurrent: false },
      });
    }

    const updated = await this.prisma.term.update({
      where: { id },
      data: {
        ...(dto.termName && { termName: dto.termName }),
        ...(dto.academicYearId && { academicYearId: dto.academicYearId }),
        ...(dto.startDate && { startDate: new Date(dto.startDate) }),
        ...(dto.endDate && { endDate: new Date(dto.endDate) }),
        ...(dto.isCurrent !== undefined && { isCurrent: dto.isCurrent }),
      },
    });

    return new TermEntity(updated);
  }

  // ==========================================
  // CLASS SECTIONS
  // ==========================================
  async createClassSection(dto: CreateClassSectionDto): Promise<ClassSectionEntity> {
    const section = await this.prisma.classSection.create({
      data: {
        sectionName: dto.sectionName,
        gradeLevel: dto.gradeLevel,
      },
    });
    return new ClassSectionEntity(section);
  }

  async findAllClassSections(): Promise<ClassSectionEntity[]> {
    const sections = await this.prisma.classSection.findMany({
      orderBy: { gradeLevel: 'asc' },
    });
    return sections.map((s) => new ClassSectionEntity(s));
  }

  async findOneClassSection(id: string): Promise<ClassSectionEntity> {
    const section = await this.prisma.classSection.findUnique({ where: { id } });
    if (!section) throw new NotFoundException(ACADEMIC_ERRORS.CLASS_SECTION_NOT_FOUND);
    return new ClassSectionEntity(section);
  }

  async updateClassSection(id: string, dto: UpdateClassSectionDto): Promise<ClassSectionEntity> {
    await this.findOneClassSection(id);

    const updated = await this.prisma.classSection.update({
      where: { id },
      data: dto,
    });
    return new ClassSectionEntity(updated);
  }

  // ==========================================
  // TEACHER SUBJECT ASSIGNMENT
  // ==========================================
  async assignTeacher(dto: AssignTeacherSubjectDto) {
    const teacher = await this.prisma.teacher.findUnique({ where: { id: dto.teacherId } });
    if (!teacher) throw new NotFoundException(ACADEMIC_ERRORS.TEACHER_NOT_FOUND);

    const subject = await this.prisma.subject.findUnique({ where: { id: dto.subjectId } });
    if (!subject) throw new NotFoundException(ACADEMIC_ERRORS.SUBJECT_NOT_FOUND);

    const classSection = await this.prisma.classSection.findUnique({ where: { id: dto.classSectionId } });
    if (!classSection) throw new NotFoundException(ACADEMIC_ERRORS.CLASS_SECTION_NOT_FOUND);

    const academicYear = await this.prisma.academicYear.findUnique({ where: { id: dto.academicYearId } });
    if (!academicYear) throw new NotFoundException(ACADEMIC_ERRORS.ACADEMIC_YEAR_NOT_FOUND);

    return this.prisma.teacherSubjectClass.create({
      data: {
        teacherId: dto.teacherId,
        subjectId: dto.subjectId,
        classSectionId: dto.classSectionId,
        academicYearId: dto.academicYearId,
      },
    });
  }
}