import { IsString, IsInt, Min, Max, IsEnum } from 'class-validator';
import { Stream } from '@prisma/client';

export class CreateSectionDto {
  @IsString()
  sectionName: string; // e.g., "A", "B" for 9-10, or "NS-1", "SS-1" for 11-12

  @IsInt()
  @Min(9)
  @Max(12)
  gradeLevel: number; // 9, 10, 11, or 12

  @IsEnum(Stream)
  stream: Stream; // NONE for 9-10; NATURAL_SCIENCE or SOCIAL_SCIENCE for 11-12
}