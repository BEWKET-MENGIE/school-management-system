import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTermDto } from './dto/create-term.dto';
import { UpdateTermDto } from './dto/update-term.dto';

@Injectable()
export class TermsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateTermDto) {
    if (new Date(createDto.startDate) >= new Date(createDto.endDate)) {
      throw new BadRequestException('End date must be after start date.');
    }

    // Verify the academic year exists before creating the term
    const academicYear = await this.prisma.academicYear.findUnique({
      where: { id: createDto.academicYearId },
    });

    if (!academicYear) {
      throw new NotFoundException(
        `Academic Year with ID "${createDto.academicYearId}" not found.`,
      );
    }

    return this.prisma.term.create({
      data: {
        termName: createDto.name, // Mapping 'name' from DTO to 'termName' in Prisma schema
        academicYearId: createDto.academicYearId,
        startDate: new Date(createDto.startDate),
        endDate: new Date(createDto.endDate),
      },
    });
  }

  async findAll() {
    return this.prisma.term.findMany({
      orderBy: { startDate: 'asc' },
      include: {
        academicYear: true,
      },
    });
  }

  async findOne(id: string) {
    const term = await this.prisma.term.findUnique({
      where: { id },
      include: { academicYear: true },
    });

    if (!term) {
      throw new NotFoundException(`Term with ID "${id}" not found.`);
    }

    return term;
  }

  async update(id: string, updateDto: UpdateTermDto) {
    await this.findOne(id);

    if (
      updateDto.startDate &&
      updateDto.endDate &&
      new Date(updateDto.startDate) >= new Date(updateDto.endDate)
    ) {
      throw new BadRequestException('End date must be after start date.');
    }

    const dataToUpdate: any = { ...updateDto };

    // Map DTO name to Prisma termName if provided
    if (updateDto.name) {
      dataToUpdate.termName = updateDto.name;
      delete dataToUpdate.name;
    }

    if (updateDto.startDate)
      dataToUpdate.startDate = new Date(updateDto.startDate);
    if (updateDto.endDate) dataToUpdate.endDate = new Date(updateDto.endDate);

    return this.prisma.term.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.term.delete({
      where: { id },
    });
  }
}
