import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import { StudentDashboard } from './pages/dashboard/StudentDashboard';
import { AdminDashboard } from './pages/dashboard/AdminDashboard';
import { User, UserRole } from './types';

function App() {
  const DashboardComponent = () => {
    const userStr = localStorage.getItem('user');
    console.log('Dashboard user string:', userStr);

    if (!userStr) {
      console.log('No user found, redirecting to login');
      return <Navigate to="/login" />;
    }

    try {
      const user: User = JSON.parse(userStr);
      console.log('User role:', user.role);
      return user.role === UserRole.ADMIN ? <AdminDashboard /> : <StudentDashboard />;
    } catch (error) {
      console.error('Error parsing user:', error);
      return <Navigate to="/login" />;
    }
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardComponent />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;