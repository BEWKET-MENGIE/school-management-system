import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExaminationDto } from './dto/create-examination.dto';
import { RecordResultDto } from './dto/record-result.dto';

@Injectable()
export class ExaminationsService {
  constructor(private readonly prisma: PrismaService) {}

  // Helper to compute grade letter from standard scale
  private calculateGradeLetter(percentage: number): string {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  }

  async createExamination(dto: CreateExaminationDto) {
    return this.prisma.examination.create({
      data: {
        title: dto.title,
        date: new Date(dto.date),
        totalMarks: dto.totalMarks,
        termId: dto.termId,
        subjectId: dto.subjectId,
      },
      include: {
        term: true,
        subject: true,
      },
    });
  }

  async findAllExaminations() {
    return this.prisma.examination.findMany({
      include: {
        term: true,
        subject: true,
        _count: { select: { results: true } },
      },
    });
  }

  async recordResult(dto: RecordResultDto) {
    const exam = await this.prisma.examination.findUnique({
      where: { id: dto.examinationId },
    });

    if (!exam) {
      throw new NotFoundException(
        `Examination with ID ${dto.examinationId} not found`,
      );
    }

    const percentage = (dto.marksObtained / exam.totalMarks) * 100;
    const grade = this.calculateGradeLetter(percentage);

    return this.prisma.result.upsert({
      where: {
        examinationId_studentId: {
          examinationId: dto.examinationId,
          studentId: dto.studentId,
        },
      },
      update: {
        marksObtained: dto.marksObtained,
        grade,
        remarks: dto.remarks,
      },
      create: {
        examinationId: dto.examinationId,
        studentId: dto.studentId,
        marksObtained: dto.marksObtained,
        grade,
        remarks: dto.remarks,
      },
      include: {
        student: {
          select: { firstName: true, lastName: true, admissionNumber: true },
        },
        examination: { select: { title: true, totalMarks: true } },
      },
    });
  }

  async getStudentReportCard(studentId: string, termId: string) {
    const results = await this.prisma.result.findMany({
      where: {
        studentId,
        examination: { termId },
      },
      include: {
        examination: {
          include: {
            subject: true,
            term: true,
          },
        },
      },
    });

    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: { section: true },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    return {
      student,
      termId,
      results,
    };
  }
}
