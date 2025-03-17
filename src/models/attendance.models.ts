export interface EnrolledStudents {
  key: string;
  classKey: string;
  student: string;
}
export interface Attendance {
  key: string;
  enrollKey: string;
  date: string;
  status: 'absent' | 'tardy' | 'present';
  comments?: string;

}
