import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role: UserRole;
  };
}

@Controller('reports')
@UseGuards(RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('student-report-card')
  @Roles(UserRole.STUDENT)
  async getMyReportCard(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.reportsService.getStudentReportCardByUserId(userId);
  }

  @Get('enrollment-stats')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ACCOUNTANT)
  async getEnrollmentStatistics(
    @Param('academicYearId') academicYearId?: string,
  ) {
    return this.reportsService.getEnrollmentStatistics(academicYearId);
  }
}
