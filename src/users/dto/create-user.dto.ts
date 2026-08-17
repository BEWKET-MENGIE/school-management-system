import { IsEmail, IsString, MinLength, IsOptional, IsInt, IsEnum, IsDateString } from 'class-validator';
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
  @MinLength(6)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

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
  @MinLength(6)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  // Made required to ensure Prisma database compliance
  @IsString()
  phone: string;
}