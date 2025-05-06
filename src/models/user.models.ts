export interface UserModel {
  key?: string;
  fullName: string;
  email: string;
  emailVerified?: boolean;
  avatar?: string;
  status?: 'active' | 'inactive' | 'pending';
  role?: 'teacher' | 'admin' | 'supervisor' | 'student'
}
