// src/academics/dto/create-term.dto.ts
import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateTermDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}