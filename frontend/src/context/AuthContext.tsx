import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, LoginData, RegisterData, AuthResponse } from '../types/user';
import { authService, userService } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => void;
  verifyOTP: (token: string, userId: string) => Promise<AuthResponse>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


interface MongoDBUser extends Omit<User, 'id'> {
  _id: string;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await userService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Erreur d\'authentification:', error);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await authService.login(data);
      if (!response.requireOTP) {
        const mongoUser = response.user as unknown as MongoDBUser;
        if (mongoUser._id && !response.user.id) {
          (response.user as any).id = mongoUser._id;
        }
        setUser(response.user);
        setIsAuthenticated(true);
      }
      return response;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await authService.register(data);
      localStorage.removeItem('token');
      return response;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw error;
    }
  };

  const logout = (): void => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const verifyOTP = async (token: string, userId: string): Promise<AuthResponse> => {
    try {
      const response = await authService.verifyOTP(token, userId);
      const mongoUser = response.user as unknown as MongoDBUser;
      if (mongoUser._id && !response.user.id) {
        (response.user as any).id = mongoUser._id;
      }
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      console.error('Erreur de vérification OTP:', error);
      throw error;
    }
  };

  const updateUser = (updatedUser: User): void => {
    const mongoUser = updatedUser as unknown as MongoDBUser & { id?: string };
    if (mongoUser._id && !mongoUser.id) {
      (updatedUser as any).id = mongoUser._id;
    }
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        verifyOTP,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}; 