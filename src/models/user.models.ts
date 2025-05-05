export interface UserModel {
  key?: string;
  fullName: string;
  email: string;
  emailVerified?: boolean;
  avatar?: string;
  status?: string;
  role?: 'teacher' | 'admin' | 'supervisor' | 'student'
}
