import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateAcademicYearDto {
  @IsNotEmpty()
  @IsString()
  yearName: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;
}
