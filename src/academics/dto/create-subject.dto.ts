// src/academics/dto/create-subject.dto.ts
import { IsString, IsInt, Min, Max } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  name: string; // e.g., "Mathematics Grade 10"

  @IsString()
  code: string; // e.g., "MATH-10"

  @IsInt()
  @Min(9)
  @Max(12)
  gradeLevel: number; // 9, 10, 11, or 12
}