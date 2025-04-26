import { Navigate } from 'react-router-dom';
import { User, UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles = [] }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  console.log('Token:', token);
  console.log('User string:', userStr);

  if (!token || !userStr) {
    console.log('No token or user data, redirecting to login');
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  try {
    const user: User = JSON.parse(userStr);
    if (!user || !user.id) {
      console.log('Invalid user data, redirecting to login');
      localStorage.clear();
      return <Navigate to="/login" replace />;
    }

    console.log('Valid user found:', user);

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role as UserRole)) {
      console.log('User role not authorized:', user.role);
      return <Navigate to={user.role === UserRole.ADMIN ? '/admin/dashboard' : '/dashboard'} replace />;
    }

    return <>{children}</>;
  } catch (error) {
    console.error('Error parsing user data:', error);
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;