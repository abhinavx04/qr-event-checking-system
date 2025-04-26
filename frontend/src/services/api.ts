import axios from 'axios';
import { LoginCredentials, RegisterCredentials } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (credentials: RegisterCredentials) => {
    try {
      const response = await api.post('/auth/register', credentials);
      return response.data;
    } catch (error: any) {
      console.error('Registration API error:', error.response?.data || error);
      throw error.response?.data || error;
    }
  },
  login: (credentials: LoginCredentials) => 
    api.post('/auth/login', credentials),
  
  verifyToken: () => 
    api.get('/auth/verify'),
};

export default api;