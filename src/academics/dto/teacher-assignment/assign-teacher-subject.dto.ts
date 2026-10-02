import { IsString, IsNotEmpty } from 'class-validator';

export class AssignTeacherSubjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Teacher ID is required.' })
  teacherId: string;

  @IsString()
  @IsNotEmpty({ message: 'Subject ID is required.' })
  subjectId: string;

  @IsString()
  @IsNotEmpty({ message: 'Class Section ID is required.' })
  classSectionId: string;

  @IsString()
  @IsNotEmpty({ message: 'Academic Year ID is required.' })
  academicYearId: string;
}