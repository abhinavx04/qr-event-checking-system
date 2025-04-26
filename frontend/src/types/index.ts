export interface LoginCredentials {
  identifier: string;  // This can be either email or studentId
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  studentId: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}