import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { FeesService } from './fees.service';
import { CreateFeeStructureDto } from './dto/create-fee-structure.dto';
import { CreateFeePaymentDto } from './dto/create-fee-payment.dto';

@Controller('fees')
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Post('structures')
  createStructure(@Body() dto: CreateFeeStructureDto) {
    return this.feesService.createFeeStructure(dto);
  }

  @Get('structures')
  findAllStructures(@Query('gradeLevel') gradeLevel?: string) {
    return this.feesService.findAllFeeStructures(
      gradeLevel ? parseInt(gradeLevel, 10) : undefined,
    );
  }

  @Post('payments')
  recordPayment(@Body() dto: CreateFeePaymentDto) {
    return this.feesService.recordPayment(dto);
  }

  @Get('payments/student/:studentId')
  getStudentHistory(@Param('studentId') studentId: string) {
    return this.feesService.getStudentPaymentHistory(studentId);
  }
}
