
import React, { createContext, useState, useContext, useEffect } from 'react';

// Define the admin user type
type AdminUser = {
  username: string;
  isAdmin: boolean;
};

// Define the auth context type
type AuthContextType = {
  user: AdminUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  isLoading: boolean;
};

// Default admin credentials
const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123',
  email: 'admin@example.com',
};

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check credentials against default admin
    if (username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password) {
      const adminUser = { username, isAdmin: true };
      setUser(adminUser);
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminUser');
  };

  // Forgot password function (simulated)
  const forgotPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if email matches default admin
    const success = email === DEFAULT_ADMIN.email;
    
    setIsLoading(false);
    return success;
  };

  // Context value
  const value = {
    user,
    login,
    logout,
    forgotPassword,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
