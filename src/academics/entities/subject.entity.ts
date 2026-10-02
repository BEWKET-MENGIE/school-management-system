export class SubjectEntity {
  id: string;
  name: string;
  code: string;
  gradeLevel: number;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<SubjectEntity>) {
    Object.assign(this, partial);
  }
}