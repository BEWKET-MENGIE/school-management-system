import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Student, StudentTermSummary, Prisma } from '@prisma/client';

interface PerformanceStudent {
  studentId: string;
  admissionNumber: string;
  fullName: string;
  gender: string;
  totalMarksObtained: number;
  totalPossibleMarks: number;
  averagePercentage: number;
  gpa: number | null;
  promotionStatus: string;
  subjectBreakdown: Array<{
    subjectCode: string;
    subjectName: string;
    marksObtained: number;
    totalMarks: number;
    grade: string | null;
  }>;
}

type StudentWithResultsAndSummary = Prisma.StudentGetPayload<{
  include: {
    results: {
      include: {
        examination: {
          include: { subject: true };
        };
      };
    };
    termSummaries: true;
  };
}>;

type AcademicYearWithTerms = Prisma.AcademicYearGetPayload<{
  include: { terms: true };
}>;

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStudentReportCardByUserId(userId: string): Promise<Student> {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException(
        'No student profile found linked to this account.',
      );
    }

    return student;
  }

  async getSectionRankings(classSectionId: string, termId: string) {
    const section = await this.prisma.classSection.findUnique({
      where: { id: classSectionId },
    });

    if (!section) {
      throw new NotFoundException('Class section not found.');
    }

    const students: StudentWithResultsAndSummary[] =
      await this.prisma.student.findMany({
        where: {
          sectionId: classSectionId,
          status: 'ACTIVE',
        },
        include: {
          results: {
            where: {
              examination: { termId },
            },
            include: {
              examination: {
                include: { subject: true },
              },
            },
          },
          termSummaries: {
            where: { termId },
          },
        },
      });

    const performanceList: PerformanceStudent[] = students.map((student) => {
      let totalMarksObtained = 0;
      let totalPossibleMarks = 0;

      const subjectBreakdown = student.results.map((res) => {
        totalMarksObtained += res.marksObtained;
        totalPossibleMarks += res.examination.totalMarks;

        return {
          subjectCode: res.examination.subject.code,
          subjectName: res.examination.subject.name,
          marksObtained: res.marksObtained,
          totalMarks: res.examination.totalMarks,
          grade: res.grade,
        };
      });

      const averagePercentage =
        totalPossibleMarks > 0
          ? (totalMarksObtained / totalPossibleMarks) * 100
          : 0;

      const termSummary: StudentTermSummary | undefined =
        student.termSummaries[0];

      return {
        studentId: student.id,
        admissionNumber: student.admissionNumber,
        fullName: `${student.firstName} ${student.lastName}`,
        gender: student.gender,
        totalMarksObtained,
        totalPossibleMarks,
        averagePercentage: Number(averagePercentage.toFixed(2)),
        gpa: termSummary?.termGpa ?? null,
        promotionStatus: termSummary?.promotionStatus ?? 'PENDING',
        subjectBreakdown,
      };
    });

    performanceList.sort((a, b) => {
      return b.totalMarksObtained - a.totalMarksObtained;
    });

    let currentRank = 1;
    const rankedRoster = performanceList.map((student, index, array) => {
      if (
        index > 0 &&
        student.totalMarksObtained < array[index - 1].totalMarksObtained
      ) {
        currentRank = index + 1;
      }
      return {
        rank: currentRank,
        ...student,
      };
    });

    return {
      sectionInfo: {
        sectionId: section.id,
        gradeLevel: section.gradeLevel,
        sectionName: section.sectionName,
        stream: section.stream,
      },
      termId,
      totalRankedStudents: rankedRoster.length,
      masterRoster: rankedRoster,
    };
  }

  async getEnrollmentStatistics(academicYearId?: string) {
    const targetYear: AcademicYearWithTerms | null = academicYearId
      ? await this.prisma.academicYear.findUnique({
          where: { id: academicYearId },
          include: { terms: true },
        })
      : await this.prisma.academicYear.findFirst({
          where: { isCurrent: true },
          include: { terms: true },
        });

    if (!targetYear) {
      throw new NotFoundException('Academic year not found.');
    }

    const enrollmentGroups = await this.prisma.studentEnrollment.groupBy({
      by: ['gradeLevel', 'stream'],
      where: {
        academicYearId: targetYear.id,
      },
      _count: {
        studentId: true,
      },
    });

    let totalSchoolStudents = 0;
    const gradeBreakdown: Record<
      number,
      { total: number; streams: Record<string, number> }
    > = {};

    enrollmentGroups.forEach((group) => {
      const grade = group.gradeLevel;
      const stream = group.stream;
      const count = group._count.studentId;

      if (!gradeBreakdown[grade]) {
        gradeBreakdown[grade] = {
          total: 0,
          streams: {},
        };
      }

      gradeBreakdown[grade].total += count;
      gradeBreakdown[grade].streams[stream] = count;
      totalSchoolStudents += count;
    });

    const semesterStats = await Promise.all(
      targetYear.terms.map(async (term) => {
        const activeInSemester = await this.prisma.studentTermSummary.count({
          where: { termId: term.id },
        });

        return {
          termId: term.id,
          termName: term.termName,
          isCurrent: term.isCurrent,
          startDate: term.startDate,
          endDate: term.endDate,
          registeredStudents: activeInSemester || totalSchoolStudents,
        };
      }),
    );

    return {
      academicYear: {
        id: targetYear.id,
        yearName: targetYear.yearName,
        isCurrent: targetYear.isCurrent,
      },
      schoolTotals: {
        totalRegisteredStudents: totalSchoolStudents,
      },
      gradeLevelBreakdown: gradeBreakdown,
      semesterBreakdown: semesterStats,
    };
  }
}
