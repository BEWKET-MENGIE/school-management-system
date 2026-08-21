import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassSectionDto } from './dto/create-class-section.dto';
import { UpdateClassSectionDto } from './dto/update-class-section.dto';

@Injectable()
export class ClassSectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateClassSectionDto) {
    const existing = await this.prisma.classSection.findUnique({
      where: {
        gradeLevel_sectionName: {
          gradeLevel: dto.gradeLevel,
          sectionName: dto.sectionName,
        },
      },
    });

    if (existing) {
      throw new ConflictException(`Section ${dto.sectionName} for Grade ${dto.gradeLevel} already exists.`);
    }

    return this.prisma.classSection.create({ data: dto });
  }

  async findAll() {
    return this.prisma.classSection.findMany({
      orderBy: [
        { gradeLevel: 'asc' },
        { sectionName: 'asc' },
      ],
    });
  }

  async findOne(id: string) {
    const section = await this.prisma.classSection.findUnique({ where: { id } });
    if (!section) throw new NotFoundException(`Class Section with ID ${id} not found`);
    return section;
  }

  async update(id: string, dto: UpdateClassSectionDto) {
    await this.findOne(id);
    return this.prisma.classSection.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.classSection.delete({ where: { id } });
  }
}