export interface User {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'organizer' | 'admin';
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'organizer';
  }