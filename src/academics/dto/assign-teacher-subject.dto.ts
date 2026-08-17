// src/academics/dto/assign-teacher-subject.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class AssignTeacherSubjectDto {
  @IsString()
  @IsNotEmpty()
  teacherId: string;

  @IsString()
  @IsNotEmpty()
  subjectId: string;

  @IsString()
  @IsNotEmpty()
  classSectionId: string;

  @IsString()
  @IsNotEmpty()
  academicYearId: string; // <--- Add this field
}