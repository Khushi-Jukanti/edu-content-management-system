
import React, { createContext, useState, useContext, useEffect } from 'react';

// Define the user type with multiple roles
type User = {
  username: string;
  role: 'admin' | 'schooladmin' | 'teacher';
  schoolId?: string; // For school admin and teachers
};

// Define the auth context type
type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  isLoading: boolean;
};

// Default credentials for different roles
const DEFAULT_USERS = [
  {
    username: 'admin',
    password: 'admin123',
    email: 'admin@example.com',
    role: 'admin' as const,
  },
  {
    username: 'schooladmin',
    password: 'school123',
    email: 'schooladmin@example.com',
    role: 'schooladmin' as const,
    schoolId: 'school1',
  },
  {
    username: 'teacher',
    password: 'teacher123',
    email: 'teacher@example.com',
    role: 'teacher' as const,
    schoolId: 'school1',
  },
];

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
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
    
    // Check credentials against default users
    const foundUser = DEFAULT_USERS.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      const userData: User = {
        username: foundUser.username,
        role: foundUser.role,
        schoolId: foundUser.schoolId,
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Forgot password function (simulated)
  const forgotPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if email matches any default user
    const success = DEFAULT_USERS.some(u => u.email === email);
    
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
