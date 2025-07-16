import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, isAuthenticated, getUser, logout as logoutService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  updateProfile: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuth = () => {
      try {
        console.log('AuthContext - Starting auth check...');
        const authenticated = isAuthenticated();
        const currentUser = getUser();
        
        console.log('AuthContext - checkAuth result:', {
          authenticated,
          currentUser,
          token: localStorage.getItem('authToken'),
          userFromStorage: localStorage.getItem('user')
        });
        
        setIsLoggedIn(authenticated);
        setUser(currentUser);
      } catch (error) {
        console.error('AuthContext - Error checking auth:', error);
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setIsLoading(false);
        console.log('AuthContext - Auth check completed, isLoading set to false');
      }
    };

    // Ejecutar inmediatamente
    checkAuth();
  }, []);

  const login = (userData: User) => {
    try {
      console.log('AuthContext - login called with:', userData);
      setUser(userData);
      setIsLoggedIn(true);
      console.log('AuthContext - state after login:', { user: userData, isLoggedIn: true });
    } catch (error) {
      console.error('AuthContext - Error in login:', error);
    }
  };

  const logout = () => {
    try {
      console.log('AuthContext: Iniciando logout...');
      logoutService();
      setUser(null);
      setIsLoggedIn(false);
      console.log('AuthContext: Logout completado');
    } catch (error) {
      console.error('AuthContext: Error durante logout:', error);
      // Forzar limpieza del estado
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  const updateUser = (userData: User) => {
    try {
      console.log('AuthContext - updateUser called with:', userData);
      setUser(userData);
      // También actualizar en localStorage
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('AuthContext - Error updating user:', error);
    }
  };

  const updateProfile = (userData: User) => {
    try {
      console.log('AuthContext - updateProfile called with:', userData);
      setUser(userData);
      // También actualizar en localStorage
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('AuthContext - Error updating profile:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoggedIn,
    isLoading,
    login,
    logout,
    updateUser,
    updateProfile,
  };

  console.log('AuthContext - Current state:', { user, isLoggedIn, isLoading });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 