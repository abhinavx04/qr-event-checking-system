import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userStr = localStorage.getItem('user');
  
  if (!userStr) {
    console.log('No user found in DashboardLayout');
    navigate('/login');
    return null;
  }

  const user: User = JSON.parse(userStr);
  console.log('Dashboard user:', user);

  const isAdmin = user.role === UserRole.ADMIN;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-width duration-300 ease-in-out bg-indigo-700 text-white`}>
        <div className="h-16 flex items-center justify-between px-4">
          <span className={`${isSidebarOpen ? 'block' : 'hidden'} text-xl font-semibold`}>
            QR Event System
          </span>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md hover:bg-indigo-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              )}
            </svg>
          </button>
        </div>

        <nav className="mt-5 px-2">
          <a
            href="/dashboard"
            className="group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-indigo-600"
          >
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {isSidebarOpen && <span>Dashboard</span>}
          </a>

          <a
            href="/events"
            className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-indigo-600"
          >
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {isSidebarOpen && <span>Events</span>}
          </a>

          {isAdmin && (
            <>
              <a
                href="/users"
                className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-indigo-600"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                {isSidebarOpen && <span>Users</span>}
              </a>

              <a
                href="/reports"
                className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-indigo-600"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {isSidebarOpen && <span>Reports</span>}
              </a>
            </>
          )}
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <div className="flex items-center px-2 py-2">
            <img
              className="h-8 w-8 rounded-full"
              src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
              alt={user.name}
            />
            {isSidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs">{user.role}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="mt-2 w-full flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-indigo-600"
          >
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};