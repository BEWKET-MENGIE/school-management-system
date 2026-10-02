import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeeStructureDto } from './dto/create-fee-structure.dto';
import { CreateFeePaymentDto } from './dto/create-fee-payment.dto';
import { FeeStatus } from '@prisma/client';

@Injectable()
export class FeesService {
  constructor(private readonly prisma: PrismaService) {}

  async createFeeStructure(dto: CreateFeeStructureDto) {
    return this.prisma.feeStructure.create({
      data: {
        title: dto.title,
        amount: dto.amount,
        gradeLevel: dto.gradeLevel,
        dueDate: new Date(dto.dueDate),
        academicYearId: dto.academicYearId,
      },
      include: { academicYear: true },
    });
  }

  async findAllFeeStructures(gradeLevel?: number) {
    return this.prisma.feeStructure.findMany({
      where: gradeLevel ? { gradeLevel } : undefined,
      include: { academicYear: true },
    });
  }

  async recordPayment(dto: CreateFeePaymentDto) {
    const feeStructure = await this.prisma.feeStructure.findUnique({
      where: { id: dto.feeStructureId },
    });

    if (!feeStructure) {
      throw new NotFoundException(
        `Fee structure with ID ${dto.feeStructureId} not found`,
      );
    }

    const existingPayments = await this.prisma.feePayment.findMany({
      where: {
        feeStructureId: dto.feeStructureId,
        studentId: dto.studentId,
      },
    });

    const totalPaidSoFar = existingPayments.reduce(
      (acc, p) => acc + p.amountPaid,
      0,
    );
    const totalWithNewPayment = totalPaidSoFar + dto.amountPaid;

    let status: FeeStatus = FeeStatus.PARTIAL;
    if (totalWithNewPayment >= feeStructure.amount) {
      status = FeeStatus.PAID;
    }

    return this.prisma.feePayment.create({
      data: {
        feeStructureId: dto.feeStructureId,
        studentId: dto.studentId,
        amountPaid: dto.amountPaid,
        paymentMethod: dto.paymentMethod,
        receiptNumber: dto.receiptNumber,
        status,
        remarks: dto.remarks,
      },
      include: {
        student: {
          select: { firstName: true, lastName: true, admissionNumber: true },
        },
        feeStructure: true,
      },
    });
  }

  async getStudentPaymentHistory(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    return this.prisma.feePayment.findMany({
      where: { studentId },
      include: { feeStructure: true },
      orderBy: { paymentDate: 'desc' },
    });
  }
}
