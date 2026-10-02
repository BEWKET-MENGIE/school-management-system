export class ClassSectionEntity {
  id: string;
  sectionName: string;
  gradeLevel: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ClassSectionEntity>) {
    Object.assign(this, partial);
  }
}