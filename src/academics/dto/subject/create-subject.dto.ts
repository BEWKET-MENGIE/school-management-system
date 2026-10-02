import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Subject name is required (e.g., Mathematics).' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Subject code is required (e.g., MATH-101).' })
  code: string;

  @IsInt()
  @Min(1)
  @Max(12)
  gradeLevel: number;

  @IsString()
  @IsOptional()
  description?: string;
}