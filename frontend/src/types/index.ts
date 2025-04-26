export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student'
}

export interface LoginCredentials {
  identifier: string;  // email or studentId
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  studentId: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  data: {
    user: User;
  };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizerId: string;
  capacity: number;
  registeredCount: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  status: 'registered' | 'attended' | 'absent';
  checkInTime?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  totalAttendance: number;
}