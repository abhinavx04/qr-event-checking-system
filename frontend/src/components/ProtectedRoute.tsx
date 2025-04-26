import { Navigate } from 'react-router-dom';
import { User } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  console.log('Token:', token);
  console.log('User string:', userStr);

  if (!token || !userStr) {
    console.log('No token or user data, redirecting to login');
    localStorage.clear(); // Clear any invalid data
    return <Navigate to="/login" />;
  }

  try {
    const user: User = JSON.parse(userStr);
    if (!user || !user.id) {
      console.log('Invalid user data, redirecting to login');
      localStorage.clear();
      return <Navigate to="/login" />;
    }
    console.log('Valid user found:', user);
    return <>{children}</>;
  } catch (error) {
    console.error('Error parsing user data:', error);
    localStorage.clear(); // Clear invalid data
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;