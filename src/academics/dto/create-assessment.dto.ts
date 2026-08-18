import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { AssessmentType } from '@prisma/client';

export class CreateAssessmentDto {
  @IsNotEmpty()
  @IsString()
  teacherSubjectClassId: string;

  @IsNotEmpty()
  @IsString()
  termId: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsEnum(AssessmentType)
  type: AssessmentType; // e.g., "MIDTERM", "HOMEWORK"

  @IsNotEmpty()
  @IsNumber()
  weightPercentage: number; // e.g., 30.0

  @IsOptional()
  @IsNumber()
  maxScore?: number;
}