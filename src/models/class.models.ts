import type { UserModel } from './user.models';

export interface ClassModel {
  key?: string;
  name: string;
  classCode: string;
  teachers?: UserModel[];
  section: string;
  academicYear: string;
  enrolled?: UserModel[];  // Keeping for backward compatibility
  enrolledStudents?: string[]; // Array of student keys
}
