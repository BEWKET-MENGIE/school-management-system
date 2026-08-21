import { IsInt, Min, Max, IsString, IsNotEmpty } from 'class-validator';

export class CreateClassSectionDto {
  @IsInt()
  @Min(9, { message: 'Grade level cannot be lower than 9' }) // Enforces SRS constraint
  @Max(12, { message: 'Grade level cannot be higher than 12' }) // Enforces SRS constraint
  gradeLevel: number;

  @IsString()
  @IsNotEmpty()
  sectionName: string; // e.g., "A", "B", "C"
}