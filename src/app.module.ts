import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // 1. Import ConfigModule
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AcademicYearsModule } from './academic-years/academic-years.module';
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { AcademicsModule } from './academics/academics.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ExaminationsModule } from './examinations/examinations.module';
import { ResultsModule } from './results/results.module';
import { FeesModule } from './fees/fees.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { ReportsModule } from './reports/reports.module';
import { BackupModule } from './backup/backup.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 2. Set isGlobal to true
    }),
    PrismaModule,
    AuthModule,
    AcademicYearsModule,
    UsersModule,
    StudentsModule,
    TeachersModule,
    AcademicsModule,
    AttendanceModule,
    ExaminationsModule,
    ResultsModule,
    FeesModule,
    AnnouncementsModule,
    ReportsModule,
    BackupModule,
  ],
})
export class AppModule {}
