import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsInt,
  IsEnum,
  IsDateString,
  IsIn,
} from 'class-validator'; // <-- Added IsIn
import { Stream } from '@prisma/client';

export class CreateTeacherDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

export class CreateStudentDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsIn(['MALE', 'FEMALE']) // <-- Added this block
  gender: string; // <-- Added gender

  @IsString()
  admissionNumber: string;

  @IsInt()
  currentGradeLevel: number;

  @IsOptional()
  @IsEnum(Stream)
  currentStream?: Stream;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  sectionId?: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsString()
  relationship?: string;
}

export class CreateParentDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  // Made required to ensure Prisma database compliance
  @IsString()
  phone: string;
}
