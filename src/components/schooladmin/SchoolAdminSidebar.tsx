
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Navigation items for school admin
const navItems = [
  { title: 'Dashboard', path: '/schooladmin/dashboard', icon: 'layout-dashboard' },
  { title: 'Teachers', path: '/schooladmin/teachers', icon: 'graduation-cap' },
  { title: 'User Actions', path: '/schooladmin/user-actions', icon: 'activity' },
];

export const SchoolAdminSidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // Check if current path matches nav item
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="w-64 bg-white border-r border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-green-600">School Admin</h2>
        <p className="text-sm text-gray-500">Management Portal</p>
      </div>
      
      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-2 text-sm rounded-md ${
              isActive(item.path)
                ? 'bg-green-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </span>
            {item.title}
          </Link>
        ))}
      </nav>
      
      {/* Footer */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
        {user && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{user.username}</span>
            <button
              onClick={logout}
              className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
