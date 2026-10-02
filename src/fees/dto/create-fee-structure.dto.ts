import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateFeeStructureDto {
  @IsString()
  @IsNotEmpty()
  title!: string; // e.g., "Grade 9 Semester 1 Tuition Fee"

  @IsNumber()
  @Min(0)
  amount!: number;

  @IsInt()
  @Min(9)
  @Max(12)
  gradeLevel!: number; // 9, 10, 11, or 12

  @IsDateString()
  @IsNotEmpty()
  dueDate!: string;

  @IsUUID()
  @IsNotEmpty()
  academicYearId!: string;
}
