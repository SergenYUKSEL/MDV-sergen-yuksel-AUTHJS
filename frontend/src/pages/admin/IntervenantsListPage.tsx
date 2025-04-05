import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UserRole, User } from '@/types/user';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { userService } from '@/services/api';
import { toast } from 'sonner';

export function IntervenantsListPage() {
  useProtectedRoute({ 
    requiredRoles: [UserRole.ADMIN], 
    redirectTo: '/login'
  });
  
  const [intervenants, setIntervenants] = useState<User[]>([]);
  const [filteredIntervenants, setFilteredIntervenants] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  const verifyOTP = async () => {
    if (!otpCode) {
      toast.error('Veuillez saisir un code OTP');
      return;
    }
    
    setLoading(true);
    
    try {
      const data = await userService.getAllIntervenants(otpCode);
      setIntervenants(data);
      setFilteredIntervenants(data);
      setOtpVerified(true);
      toast.success('Accès autorisé');
    } catch (error) {
      console.error('Erreur lors de la vérification OTP', error);
      toast.error('Code OTP invalide ou accès refusé');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (otpVerified) {
      if (searchTerm.trim() === '') {
        setFilteredIntervenants(intervenants);
      } else {
        const term = searchTerm.toLowerCase();
        const filtered = intervenants.filter(
          (intervenant) =>
            intervenant.username.toLowerCase().includes(term) ||
            intervenant.email.toLowerCase().includes(term) ||
            intervenant.details?.nom?.toLowerCase().includes(term) ||
            intervenant.details?.prenom?.toLowerCase().includes(term)
        );
        setFilteredIntervenants(filtered);
      }
    }
  }, [searchTerm, intervenants, otpVerified]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Liste des Intervenants</CardTitle>
          <CardDescription>
            Gérez et consultez les informations des intervenants - Accès protégé par OTP
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {!otpVerified ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4 max-w-md mx-auto">
              <div className="w-full space-y-2">
                <Label htmlFor="otp">Code de vérification (OTP)</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Saisissez le code de votre application d'authentification pour accéder à cette section sécurisée.
                </p>
              </div>
              
              <Button 
                className="w-full" 
                onClick={verifyOTP}
                disabled={loading}
              >
                {loading ? 'Vérification...' : 'Vérifier le code OTP'}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <Input
                  type="search"
                  placeholder="Rechercher un intervenant..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="max-w-sm"
                />
              </div>
              
              {filteredIntervenants.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Aucun intervenant trouvé</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-4 text-left">Nom</th>
                        <th className="py-2 px-4 text-left">Prénom</th>
                        <th className="py-2 px-4 text-left">Email</th>
                        <th className="py-2 px-4 text-left">Nom d'utilisateur</th>
                        <th className="py-2 px-4 text-left">Adresse</th>
                        <th className="py-2 px-4 text-left">Téléphone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredIntervenants.map((intervenant) => (
                        <tr key={intervenant.id} className="border-b hover:bg-muted/50">
                          <td className="py-2 px-4">{intervenant.details?.nom || '-'}</td>
                          <td className="py-2 px-4">{intervenant.details?.prenom || '-'}</td>
                          <td className="py-2 px-4">{intervenant.email}</td>
                          <td className="py-2 px-4">{intervenant.username}</td>
                          <td className="py-2 px-4">{intervenant.details?.adresse || '-'}</td>
                          <td className="py-2 px-4">{intervenant.details?.telephone || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 