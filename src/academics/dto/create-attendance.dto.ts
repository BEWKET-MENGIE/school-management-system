// src/academics/dto/create-attendance.dto.ts
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AttendanceStatus, AttendanceType } from '@prisma/client';

export class CreateAttendanceDto {
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsEnum(AttendanceType)
  type: AttendanceType;

  @IsNotEmpty()
  @IsString()
  termId: string;

  @IsOptional()
  @IsString()
  date?: string;
}