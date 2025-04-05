import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/user';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const registerSchema = z.object({
  username: z.string().min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string(),
  role: z.nativeEnum(UserRole)
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: UserRole.ETUDIANT
  });
  
  const [errors, setErrors] = useState<Partial<RegisterFormData & { root: string }>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof RegisterFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRoleChange = (value: UserRole) => {
    setFormData((prev) => ({ ...prev, role: value }));
    if (errors.role) {
      setErrors((prev) => ({ ...prev, role: undefined }));
    }
  };

  const validateForm = (): boolean => {
    try {
      registerSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Partial<RegisterFormData & { root: string }> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            const path = err.path[0] as keyof RegisterFormData;
            if (path === 'role') {
              formattedErrors.role = err.message as any;
            } else {
              formattedErrors[path] = err.message;
            }
          } else {
            formattedErrors.root = err.message;
          }
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const { confirmPassword, ...registerData } = formData;
      
      await register(registerData);
      
      toast.success('Inscription réussie. Veuillez vous connecter.');
      navigate('/login');
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'Échec de l\'inscription';
      toast.error(errorMessage);
      
      if (errorMessage.includes('email') || errorMessage.includes('adresse e-mail')) {
        setErrors((prev) => ({ ...prev, email: 'Cet email est déjà utilisé' }));
      } else if (errorMessage.includes('username') || errorMessage.includes('nom d\'utilisateur')) {
        setErrors((prev) => ({ ...prev, username: 'Ce nom d\'utilisateur est déjà utilisé' }));
      } else {
        setErrors((prev) => ({ ...prev, root: errorMessage }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Inscription</CardTitle>
          <CardDescription>
            Créez votre compte CiveLampus
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.root && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{errors.root}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="votreNom"
                value={formData.username}
                onChange={handleChange}
                required
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Select 
                value={formData.role} 
                onValueChange={handleRoleChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.ETUDIANT}>Étudiant</SelectItem>
                  <SelectItem value={UserRole.INTERVENANT}>Intervenant</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Inscription...' : 'S\'inscrire'}
            </Button>
            
            <div className="mt-4 text-center">
              <span className="text-sm text-muted-foreground">
                Déjà un compte?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Se connecter
                </Link>
              </span>
            </div>
          </form>
        </CardContent>
        
        <CardFooter>
          <div className="w-full text-center text-sm text-muted-foreground">
            <p>
              En vous inscrivant, vous acceptez nos conditions d'utilisation
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 