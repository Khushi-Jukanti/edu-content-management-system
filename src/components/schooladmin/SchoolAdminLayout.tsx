
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SchoolAdminSidebar } from './SchoolAdminSidebar';

export const SchoolAdminLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated or not a school admin
  if (!user || user.role !== 'schooladmin') {
    return <Navigate to="/admin/login" replace />;
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SchoolAdminSidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
