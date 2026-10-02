import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ExaminationsService } from './examinations.service';
import { CreateExaminationDto } from './dto/create-examination.dto';
import { RecordResultDto } from './dto/record-result.dto';

@Controller('examinations')
export class ExaminationsController {
  constructor(private readonly examinationsService: ExaminationsService) {}

  @Post()
  createExam(@Body() createExaminationDto: CreateExaminationDto) {
    return this.examinationsService.createExamination(createExaminationDto);
  }

  @Get()
  findAllExams() {
    return this.examinationsService.findAllExaminations();
  }

  @Post('results')
  recordResult(@Body() recordResultDto: RecordResultDto) {
    return this.examinationsService.recordResult(recordResultDto);
  }

  @Get('report-card/:studentId')
  getReportCard(
    @Param('studentId') studentId: string,
    @Query('termId') termId: string,
  ) {
    return this.examinationsService.getStudentReportCard(studentId, termId);
  }
}
