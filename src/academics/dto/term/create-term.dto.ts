import { IsString, IsNotEmpty, IsDateString, IsBoolean, IsOptional } from 'class-validator';

export class CreateTermDto {
  @IsString()
  @IsNotEmpty({ message: 'Term name is required (e.g., Term 1).' })
  termName: string;

  @IsString()
  @IsNotEmpty({ message: 'Academic year ID is required.' })
  academicYearId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsBoolean()
  @IsOptional()
  isCurrent?: boolean;
}