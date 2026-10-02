import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AnnouncementsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAnnouncementDto) {
    return this.prisma.announcement.create({
      data: dto,
      include: {
        author: { select: { email: true, role: true } },
      },
    });
  }

  async findAllForUser(role?: UserRole, gradeLevel?: number) {
    return this.prisma.announcement.findMany({
      where: {
        OR: [
          { targetRole: null, targetGrade: null },
          { targetRole: role },
          { targetGrade: gradeLevel },
        ],
      },
      include: {
        author: { select: { email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
