import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  markAttendance(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.markAttendance(createAttendanceDto);
  }

  @Get('section/:sectionId')
  findBySection(
    @Param('sectionId') sectionId: string,
    @Query('date') date?: string,
  ) {
    return this.attendanceService.findBySectionAndDate(sectionId, date);
  }
}
