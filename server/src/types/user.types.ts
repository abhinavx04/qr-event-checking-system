export enum UserRole {
    STUDENT = 'student',
    ADMIN = 'admin'
  }
  
  export interface IUser {
    name: string;
    email: string;
    studentId: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
  }