import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateAnnouncementDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsOptional()
  @IsEnum(UserRole)
  targetRole?: UserRole;

  @IsOptional()
  @IsInt()
  @Min(9)
  @Max(12)
  targetGrade?: number;

  @IsUUID()
  @IsNotEmpty()
  authorId!: string;
}
