import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTeacherDto,
  CreateStudentDto,
  CreateParentDto,
} from './dto/create-user.dto';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createTeacher(dto: CreateTeacherDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email address is already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: UserRole.TEACHER,
        teacher: {
          create: {
            firstName: dto.firstName,
            lastName: dto.lastName,
            phone: dto.phone ?? '', // Fallback to empty string if undefined
          },
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        teacher: true,
      },
    });
  }

  async createStudent(dto: CreateStudentDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email address is already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: UserRole.STUDENT,
        student: {
          create: {
            firstName: dto.firstName,
            lastName: dto.lastName,

            admissionNumber: dto.admissionNumber, // Phone property safely removed
            currentGradeLevel: dto.currentGradeLevel,
            gender: dto.gender,
            ...(dto.currentStream && { currentStream: dto.currentStream }),
            ...(dto.dateOfBirth && { dateOfBirth: new Date(dto.dateOfBirth) }),
            ...(dto.sectionId && {
              section: { connect: { id: dto.sectionId } },
            }),
            ...(dto.parentId && {
              parents: {
                create: {
                  parentId: dto.parentId,
                  relationship: dto.relationship || 'GUARDIAN',
                },
              },
            }),
          },
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        student: true,
      },
    });
  }

  async createParent(dto: CreateParentDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email address is already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: UserRole.PARENT,
        parent: {
          create: {
            firstName: dto.firstName,
            lastName: dto.lastName,
            phone: dto.phone, // Guaranteed to be a string by DTO
          },
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        parent: true,
      },
    });
  }

  async findAll(role?: string) {
    return this.prisma.user.findMany({
      where: role ? { role: role as UserRole } : undefined,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        teacher: true,
        student: true,
        parent: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        teacher: true,
        student: true,
        parent: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user;
  }
}
