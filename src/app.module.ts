import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AcademicsModule } from './academics/academics.module';
import { StudentsModule } from './students/students.module'; // <-- Import this
import { DepartmentsModule } from './departments/departments.module';
import { ClassSectionsModule } from './class-sections/class-sections.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    AcademicsModule,
    StudentsModule,
    DepartmentsModule,
    ClassSectionsModule, // <-- Add it here
  ],
})
export class AppModule {}