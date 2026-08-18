import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateSubjectDto {
  @IsNotEmpty()
  @IsString()
  name: string; // e.g., "Mathematics Grade 10"

  @IsNotEmpty()
  @IsString()
  code: string; // e.g., "MATH-10"

  @IsNotEmpty()
  @IsInt()
  gradeLevel: number; // e.g., 10
}