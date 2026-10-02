import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';

export class CreateClassSectionDto {
  @IsString()
  @IsNotEmpty({ message: 'Section name is required (e.g., Grade 9-A).' })
  sectionName: string;

  @IsInt()
  @Min(1)
  @Max(12)
  gradeLevel: number;
}