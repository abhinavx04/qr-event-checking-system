import axios from 'axios';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      console.log('Sending login request:', { identifier: credentials.identifier });
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      
      console.log('Login response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error: any) {
      console.error('Login API error:', error);
      throw error.response?.data || error;
    }
  },
  
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      console.log('Sending registration request:', {
        name: credentials.name,
        email: credentials.email,
        role: credentials.role
      });
      
      const response = await api.post<AuthResponse>('/auth/register', credentials);
      
      console.log('Registration response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error: any) {
      console.error('Registration API error:', error);
      throw error.response?.data || error;
    }
  },

  verifyToken: async (): Promise<AuthResponse> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      console.log('Verifying token...');
      const response = await api.get<AuthResponse>('/auth/me'); // Changed from /auth/verify to /auth/me
      
      console.log('Token verification response:', response.data);
      
      // Update local storage with fresh user data if needed
      if (response.data?.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Token verification error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error.response?.data || error;
    }
  }
};

export default api;