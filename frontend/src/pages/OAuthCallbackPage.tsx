import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { userService } from '@/services/api';
import { toast } from 'sonner';

export function OAuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        if (!token) {
          setError('Token manquant dans l\'URL');
          return;
        }
        
        localStorage.setItem('token', token);
        
        const userData = await userService.getCurrentUser();
        updateUser(userData);
        
        toast.success('Connexion avec Google réussie');
        navigate('/');
      } catch (error) {
        console.error('Erreur lors de l\'authentification Google:', error);
        setError('Erreur lors de l\'authentification avec Google');
        toast.error('Échec de la connexion avec Google');
        navigate('/login');
      }
    };

    handleCallback();
  }, [location, navigate, updateUser]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-md">
          <h2 className="text-lg font-medium text-red-700 mb-2">Erreur d'authentification</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
          >
            Retour à la page de connexion
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Authentification en cours...</p>
          <p className="text-sm text-muted-foreground">Vous allez être redirigé automatiquement</p>
        </div>
      )}
    </div>
  );
} 