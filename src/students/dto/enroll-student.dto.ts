import { IsString, IsNotEmpty, IsOptional, IsInt, IsDateString } from 'class-validator';

export class EnrollStudentDto {
  @IsString()
  @IsNotEmpty()
  admissionNumber: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsInt()
  currentGradeLevel: number;

  @IsOptional()
  currentStream?: any;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsOptional()
  sectionId?: string;
}