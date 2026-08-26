import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTeacherSubjectClassDto {
  @IsNotEmpty()
  @IsString()
  teacherId: string;

  @IsNotEmpty()
  @IsString()
  subjectId: string;

  @IsNotEmpty()
  @IsString()
  classSectionId: string;

  @IsNotEmpty()
  @IsString()
  academicYearId: string;
}
