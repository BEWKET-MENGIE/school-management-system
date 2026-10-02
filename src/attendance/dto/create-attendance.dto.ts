import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { AttendanceStatus } from '@prisma/client';

export class CreateAttendanceDto {
  @IsUUID()
  @IsNotEmpty()
  studentId!: string;

  @IsUUID()
  @IsNotEmpty()
  classSectionId!: string;

  @IsUUID()
  @IsNotEmpty()
  recordedById!: string; // Teacher ID

  @IsEnum(AttendanceStatus)
  @IsNotEmpty()
  status!: AttendanceStatus;

  @IsOptional()
  @IsString()
  remarks?: string;
}
