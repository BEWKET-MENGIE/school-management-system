import { IsNotEmpty, IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Subject name cannot be empty' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Subject code cannot be empty' })
  code: string;

  @IsInt()
  @Min(9, { message: 'Grade level cannot be lower than 9' })
  @Max(12, { message: 'Grade level cannot be higher than 12' })
  @IsNotEmpty({ message: 'Grade level is required' })
  gradeLevel: number;

  @IsString()
  @IsOptional()
  description?: string;
}