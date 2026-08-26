import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { EnrollStudentDto } from './dto/enroll-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async enrollStudent(dto: EnrollStudentDto) {
    if (dto.admissionNumber) {
      const existing = await this.prisma.student.findUnique({
        where: { admissionNumber: dto.admissionNumber },
      });
      if (existing) {
        throw new ConflictException(
          `Admission number '${dto.admissionNumber}' is taken`,
        );
      }
    }

    const student = await this.prisma.student.create({
      data: {
        admissionNumber: dto.admissionNumber,
        firstName: dto.firstName,
        lastName: dto.lastName,
        gender: dto.gender,
        currentGradeLevel: dto.currentGradeLevel,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        userId: dto.userId,
        sectionId: dto.sectionId,
      },
    });

    try {
      // Sending a placeholder email for now to ensure compilation
      this.notificationsService.sendEnrollmentWelcome('student@example.com');
    } catch (error) {
      console.error('Notification failed', error);
    }

    return student;
  }

  async findAll(params?: { sectionId?: string; search?: string }) {
    const { sectionId, search } = params || {};
    return this.prisma.student.findMany({
      where: {
        sectionId: sectionId || undefined,
        OR: search
          ? [
              { admissionNumber: { contains: search, mode: 'insensitive' } },
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
            ]
          : undefined,
      },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) throw new NotFoundException(`Student not found`);
    return student;
  }

  // --- HIGH SCHOOL REGISTRATION STATS (GRADES 9-12) ---
  async getRegistrationStats() {
    // 1. Fetch all students whose grade level is between 9 and 12
    const students = await this.prisma.student.findMany({
      where: {
        currentGradeLevel: {
          in: [9, 10, 11, 12],
        },
      },
      select: {
        currentGradeLevel: true,
      },
    });

    // 2. Initialize counters
    const totalHighSchoolStudents = students.length;
    const gradeCounts: Record<number, number> = {
      9: 0,
      10: 0,
      11: 0,
      12: 0,
    };

    // 3. Count students per grade level
    students.forEach((student) => {
      if (gradeCounts[student.currentGradeLevel] !== undefined) {
        gradeCounts[student.currentGradeLevel] += 1;
      }
    });

    // 4. Return total and a structured array for your frontend charts
    return {
      totalHighSchoolStudents,
      chartData: [
        { name: 'Grade 9', students: gradeCounts[9] },
        { name: 'Grade 10', students: gradeCounts[10] },
        { name: 'Grade 11', students: gradeCounts[11] },
        { name: 'Grade 12', students: gradeCounts[12] },
      ],
    };
  }
}
