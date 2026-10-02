import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UserRole } from '@prisma/client';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  create(@Body() dto: CreateAnnouncementDto) {
    return this.announcementsService.create(dto);
  }

  @Get()
  findAll(@Query('role') role?: UserRole, @Query('grade') grade?: string) {
    return this.announcementsService.findAllForUser(
      role,
      grade ? parseInt(grade, 10) : undefined,
    );
  }
}
