import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsNumber()
  @Min(9, { message: 'Grade level must be 9 or higher' })
  gradeLevel!: number;

  @IsString()
  @IsOptional()
  description?: string;
}
