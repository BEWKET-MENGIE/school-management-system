import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createResultDto: CreateResultDto) {
    return this.prisma.result.create({
      data: createResultDto,
    });
  }

  async findAll() {
    return this.prisma.result.findMany({
      include: {
        student: true,
        examination: true,
      },
    });
  }

  async findOne(id: string) {
    const result = await this.prisma.result.findUnique({
      where: { id },
      include: {
        student: true,
        examination: true,
      },
    });

    if (!result) {
      throw new NotFoundException(`Result with ID "${id}" not found`);
    }

    return result;
  }

  async findMyResults(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException(
        'Student profile not found for this user account.',
      );
    }

    return this.prisma.result.findMany({
      where: { studentId: student.id },
      include: {
        examination: true,
      },
    });
  }

  async findResultsByStudentId(studentId: string) {
    return this.prisma.result.findMany({
      where: { studentId },
      include: {
        examination: true,
      },
    });
  }

  async update(id: string, updateResultDto: UpdateResultDto) {
    await this.findOne(id);
    return this.prisma.result.update({
      where: { id },
      data: updateResultDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.result.delete({
      where: { id },
    });
  }
}
