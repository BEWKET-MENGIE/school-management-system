import { AcademicYear } from '@prisma/client';

export class AcademicYearEntity implements AcademicYear {
  id: string;
  yearName: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;

  constructor(partial: Partial<AcademicYearEntity>) {
    Object.assign(this, partial);
  }
}