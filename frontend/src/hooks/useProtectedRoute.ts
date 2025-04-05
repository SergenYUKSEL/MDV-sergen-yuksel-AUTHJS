import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types/user';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

interface UseProtectedRouteOptions {
  requiredRoles?: UserRole[];
  redirectTo?: string;
}

export const useProtectedRoute = (options: UseProtectedRouteOptions = {}) => {
  const { requiredRoles = [], redirectTo = '/login' } = options;
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        toast.error('Vous devez être connecté pour accéder à cette page');
        navigate(redirectTo);
        return;
      }

      if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
        toast.error('Vous n\'avez pas les permissions nécessaires pour accéder à cette page');
        navigate('/');
      }
    }
  }, [isAuthenticated, user, isLoading, navigate, redirectTo, requiredRoles]);

  return { isAuthenticated, user, isLoading };
}; 