export class TermEntity {
  id: string;
  termName: string;
  academicYearId: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<TermEntity>) {
    Object.assign(this, partial);
  }
}