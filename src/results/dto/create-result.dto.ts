import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateResultDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  marksObtained: number;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsNotEmpty()
  @IsString()
  examinationId: string;

  @IsNotEmpty()
  @IsString()
  studentId: string;
}
