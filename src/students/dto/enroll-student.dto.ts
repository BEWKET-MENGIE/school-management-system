import { IsString, IsNotEmpty, IsInt, IsEnum, IsOptional, Min, Max, IsIn } from 'class-validator';
import { Stream } from '@prisma/client';

export class EnrollStudentDto {
  @IsString()
  @IsNotEmpty()
  userId: string; 

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
  @IsIn(['MALE', 'FEMALE'])
  gender: string;

  @IsInt()
  @Min(9)
  @Max(12)
  currentGradeLevel: number; 

  @IsEnum(Stream)
  @IsOptional()
  currentStream?: Stream;

  @IsString()
  @IsNotEmpty()
  sectionId: string; 
}