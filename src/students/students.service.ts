import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EnrollStudentDto } from './dto/enroll-student.dto';
import { Stream } from '@prisma/client';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async enrollStudent(dto: EnrollStudentDto) {
    // 1. Check if admission number is unique
    const existingStudent = await this.prisma.student.findUnique({
      where: { admissionNumber: dto.admissionNumber },
    });

    if (existingStudent) {
      throw new ConflictException(`Student with admission number "${dto.admissionNumber}" already exists.`);
    }

    // 2. Validate Class Section exists
    const section = await this.prisma.classSection.findUnique({
      where: { id: dto.sectionId },
    });

    if (!section) {
      throw new NotFoundException(`Class section with ID "${dto.sectionId}" not found.`);
    }

    // 3. Validate Stream Rules
    const stream = dto.currentStream || Stream.NONE;

    if ((dto.currentGradeLevel === 9 || dto.currentGradeLevel === 10) && stream !== Stream.NONE) {
      throw new BadRequestException(`Grades 9 and 10 must have their stream set to NONE.`);
    }

    if ((dto.currentGradeLevel === 11 || dto.currentGradeLevel === 12) && stream === Stream.NONE) {
      throw new BadRequestException(`Grades 11 and 12 must be assigned to either NATURAL_SCIENCE or SOCIAL_SCIENCE.`);
    }

    // 4. Create Student Record
    return this.prisma.student.create({
      data: {
        userId: dto.userId,
        admissionNumber: dto.admissionNumber,
        firstName: dto.firstName,
        lastName: dto.lastName,
        gender: dto.gender,
        currentGradeLevel: dto.currentGradeLevel,
        currentStream: stream,
        sectionId: dto.sectionId,
        
      },
      include: {
        section: { // Matched to relation name in schema
          select: { sectionName: true, gradeLevel: true },
        },
      },
    });
  }

  async findAllStudents(sectionId?: string) {
    return this.prisma.student.findMany({
      where: sectionId ? { sectionId: sectionId } : undefined,
      include: {
        section: { select: { sectionName: true, gradeLevel: true } },
      },
      orderBy: [{ currentGradeLevel: 'asc' }, { lastName: 'asc' }],
    });
  }
}