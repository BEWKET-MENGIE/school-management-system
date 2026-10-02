import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { ExamType } from '@prisma/client';

export class CreateExaminationDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsEnum(ExamType)
  type: ExamType;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsNumber()
  totalMarks: number;

  @IsNotEmpty()
  @IsString()
  termId: string;

  @IsNotEmpty()
  @IsString()
  subjectId: string;
}
