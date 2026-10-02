import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTeacherDto: CreateTeacherDto) {
    return this.prisma.teacher.create({
      data: createTeacherDto,
      include: {
        user: { select: { email: true, role: true, isActive: true } },
        department: true,
      },
    });
  }

  async findAll() {
    return this.prisma.teacher.findMany({
      include: {
        user: { select: { email: true, role: true } },
        department: true,
        subjectAssignments: {
          include: {
            subject: true,
            classSection: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      include: {
        user: { select: { email: true, role: true } },
        department: true,
        subjectAssignments: {
          include: {
            subject: true,
            classSection: true,
          },
        },
      },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    return teacher;
  }
}
