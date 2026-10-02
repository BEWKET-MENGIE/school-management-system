import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role: UserRole;
  };
}

@Controller('results')
@UseGuards(RolesGuard)
export class ResultsController {
  @Get('my-results')
  getMyResults(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return { userId };
  }
}
