export interface LoginCredentials {
  identifier: string;  // This can be either email or studentId
  password: string;
}

export interface RegisterCredentials {
  name: string;
  identifier: string;
  studentId?: string;
  password: string;
  role: string;
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

export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student'
}
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}