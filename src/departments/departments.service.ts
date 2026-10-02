import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateDepartmentDto) {
    // Optional: Check if a department with this name already exists
    const existing = await this.prisma.department.findFirst({
      where: { name: createDto.name },
    });

    if (existing) {
      throw new ConflictException(
        `Department '${createDto.name}' already exists.`,
      );
    }

    return this.prisma.department.create({
      data: createDto,
    });
  }

  async findAll() {
    return this.prisma.department.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const department = await this.prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      throw new NotFoundException(`Department with ID "${id}" not found.`);
    }

    return department;
  }

  async update(id: string, updateDto: UpdateDepartmentDto) {
    await this.findOne(id); // Ensure it exists before updating

    if (updateDto.name) {
      const existing = await this.prisma.department.findFirst({
        where: {
          name: updateDto.name,
          NOT: { id },
        },
      });

      if (existing) {
        throw new ConflictException(
          `Department '${updateDto.name}' already exists.`,
        );
      }
    }

    return this.prisma.department.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure it exists before deleting
    return this.prisma.department.delete({
      where: { id },
    });
  }
}
