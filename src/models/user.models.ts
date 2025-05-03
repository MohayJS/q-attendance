export interface IUser {
  key: string;
  fullName: string;
  email: string;
  emailVerified?: boolean;
  avatar?: string;
  role?: 'teacher' | 'admin' | 'supervisor' | 'student'
}
