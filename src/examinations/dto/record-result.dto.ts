import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class RecordResultDto {
  @IsUUID()
  @IsNotEmpty()
  examinationId!: string;

  @IsUUID()
  @IsNotEmpty()
  studentId!: string;

  @IsNumber()
  @Min(0)
  marksObtained!: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}
