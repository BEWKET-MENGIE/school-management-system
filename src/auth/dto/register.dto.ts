import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  Matches,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from '@prisma/client'; // Removed Stream and StudentStatus

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @Matches(
    /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    {
      message:
        'Email username must contain both letters and at least one number.',
    },
  )
  @Transform(({ value }: { value: string }) => value?.toLowerCase().trim())
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'Password must contain at least one letter, one number, and one special character.',
  })
  password: string;

  @IsEnum(UserRole, {
    message:
      'Role must be a valid UserRole (ADMIN, TEACHER, STUDENT, PARENT, ACCOUNTANT)',
  })
  role: UserRole;

  @IsString()
  @IsNotEmpty({ message: 'First name is required.' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required.' })
  lastName: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  admissionNumber?: string;

  @IsNumber()
  @IsOptional()
  currentGradeLevel?: number;
}
