import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async markAttendance(dto: CreateAttendanceDto) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Upsert record so marking attendance again on same day updates the existing record
    return this.prisma.attendance.upsert({
      where: {
        studentId_classSectionId_date: {
          studentId: dto.studentId,
          classSectionId: dto.classSectionId,
          date: today,
        },
      },
      update: {
        status: dto.status,
        remarks: dto.remarks,
        recordedById: dto.recordedById,
      },
      create: {
        studentId: dto.studentId,
        classSectionId: dto.classSectionId,
        recordedById: dto.recordedById,
        status: dto.status,
        remarks: dto.remarks,
        date: today,
      },
      include: {
        student: {
          select: { firstName: true, lastName: true, admissionNumber: true },
        },
        classSection: true,
      },
    });
  }

  async findBySectionAndDate(classSectionId: string, dateStr?: string) {
    const date = dateStr ? new Date(dateStr) : new Date();
    date.setHours(0, 0, 0, 0);

    return this.prisma.attendance.findMany({
      where: {
        classSectionId,
        date,
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            admissionNumber: true,
          },
        },
      },
    });
  }
}
