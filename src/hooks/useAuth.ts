import { useState, useEffect } from 'react';
import { CONFIG } from '../lib/config';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount and when storage changes
  const checkAuthStatus = () => {
    const authStatus = localStorage.getItem(CONFIG.STORAGE_KEYS.ADMIN_AUTH);
    const isAuth = authStatus === 'true';
    setIsAuthenticated(isAuth);
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuthStatus();
    
    // Listen for storage changes (in case auth is changed in another tab)
    const handleStorageChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (password: string) => {
    console.log('useAuth login called with password:', password);
    console.log('Expected password: admin123');
    console.log('Password match:', password === 'admin123');
    
    // Simple password check - replace with proper auth in production
    if (password === 'admin123') {
      console.log('Setting authentication to true');
      localStorage.setItem(CONFIG.STORAGE_KEYS.ADMIN_AUTH, 'true');
      setIsAuthenticated(true);
      return true;
    }
    console.log('Authentication failed');
    return false;
  };

  const logout = () => {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.ADMIN_AUTH);
    setIsAuthenticated(false);
  };

  return { isAuthenticated, isLoading, login, logout };
} 