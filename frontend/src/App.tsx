import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';

// Temporary Home Component
const HomePage = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  return (
    <div className="min-h-screen bg-[#121212] text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-[#1E1E1E] rounded-xl shadow-lg p-8">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <svg viewBox="0 0 24 24" className="w-16 h-16 mx-auto text-blue-500" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h1 className="text-3xl font-bold">Welcome to EventSphere</h1>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-400">
                Logged in as: <span className="text-gray-200">{user.email}</span>
              </p>
              <p className="text-gray-400">
                Role: <span className="text-gray-200 capitalize">{user.role || 'User'}</span>
              </p>
            </div>

            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/login';
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to="/" replace /> : 
              <LoginPage />
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? 
              <Navigate to="/" replace /> : 
              <RegisterPage />
          } 
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* Example of a nested protected route for future dashboard */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-[#121212] text-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-3xl font-bold">Dashboard Coming Soon</h1>
                  <p className="mt-2 text-gray-400">This section is under development</p>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;