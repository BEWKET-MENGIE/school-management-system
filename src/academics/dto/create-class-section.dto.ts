import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class CreateClassSectionDto {
  @IsNotEmpty()
  @IsString()
  sectionName: string;

  @IsInt()
  @Min(1)
  gradeLevel: number;
}