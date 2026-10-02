import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { UpdateAcademicYearDto } from './dto/update-academic-year.dto';

@Injectable()
export class AcademicYearsService {
  constructor(private readonly prisma: PrismaService) {}

  // Inside academic-years.service.ts

  async create(createDto: CreateAcademicYearDto) {
    if (new Date(createDto.startDate) >= new Date(createDto.endDate)) {
      throw new BadRequestException('End date must be after start date.');
    }

    return this.prisma.$transaction(async (tx) => {
      if (createDto.isCurrent) {
        await tx.academicYear.updateMany({
          where: { isCurrent: true },
          data: { isCurrent: false },
        });
      }

      return tx.academicYear.create({
        data: {
          yearName: createDto.yearName,
          startDate: new Date(createDto.startDate), // Convert string to Date
          endDate: new Date(createDto.endDate), // Convert string to Date
          isCurrent: createDto.isCurrent ?? false,
        },
      });
    });
  }

  async findAll() {
    return this.prisma.academicYear.findMany({
      orderBy: { startDate: 'desc' },
      include: {
        terms: true,
      },
    });
  }

  async findOne(id: string) {
    const year = await this.prisma.academicYear.findUnique({
      where: { id },
      include: { terms: true },
    });

    if (!year) {
      throw new NotFoundException(`Academic Year with ID "${id}" not found.`);
    }

    return year;
  }

  async update(id: string, updateDto: UpdateAcademicYearDto) {
    await this.findOne(id);

    if (
      updateDto.startDate &&
      updateDto.endDate &&
      new Date(updateDto.startDate) >= new Date(updateDto.endDate)
    ) {
      throw new BadRequestException('End date must be after start date.');
    }

    return this.prisma.$transaction(async (tx) => {
      if (updateDto.isCurrent) {
        await tx.academicYear.updateMany({
          where: { isCurrent: true },
          data: { isCurrent: false },
        });
      }

      return tx.academicYear.update({
        where: { id },
        data: updateDto,
      });
    });
  }

  async setCurrent(id: string) {
    await this.findOne(id);

    return this.prisma.$transaction(async (tx) => {
      await tx.academicYear.updateMany({
        where: { isCurrent: true },
        data: { isCurrent: false },
      });

      return tx.academicYear.update({
        where: { id },
        data: { isCurrent: true },
      });
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.academicYear.delete({
      where: { id },
    });
  }
}
