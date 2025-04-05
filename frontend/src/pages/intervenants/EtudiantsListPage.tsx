import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserRole, User } from '@/types/user';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { userService } from '@/services/api';
import { toast } from 'sonner';
import { Trash } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function EtudiantsListPage() {
  useProtectedRoute({ 
    requiredRoles: [UserRole.INTERVENANT, UserRole.ADMIN], 
    redirectTo: '/login'
  });
  
  const { user } = useAuth();
  const [etudiants, setEtudiants] = useState<User[]>([]);
  const [filteredEtudiants, setFilteredEtudiants] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === UserRole.ADMIN;

  useEffect(() => {
    const fetchEtudiants = async () => {
      try {
        const data = await userService.getAllEtudiants();
        setEtudiants(data);
        setFilteredEtudiants(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des étudiants', error);
        toast.error('Erreur lors de la récupération de la liste des étudiants');
      } finally {
        setLoading(false);
      }
    };

    fetchEtudiants();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEtudiants(etudiants);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = etudiants.filter(
        (etudiant) =>
          etudiant.username.toLowerCase().includes(term) ||
          etudiant.email.toLowerCase().includes(term) ||
          etudiant.details?.nom?.toLowerCase().includes(term) ||
          etudiant.details?.prenom?.toLowerCase().includes(term) ||
          etudiant.details?.formation?.toLowerCase().includes(term)
      );
      setFilteredEtudiants(filtered);
    }
  }, [searchTerm, etudiants]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteEtudiant = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      try {
        await userService.deleteUser(id);
        setEtudiants(prevEtudiants => prevEtudiants.filter(etudiant => etudiant.id !== id));
        toast.success('Étudiant supprimé avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'étudiant', error);
        toast.error('Erreur lors de la suppression de l\'étudiant');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Liste des Étudiants</CardTitle>
          <CardDescription>
            Gérez et consultez les informations des étudiants
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <Input
                type="search"
                placeholder="Rechercher un étudiant..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="max-w-sm"
              />
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                <p className="mt-2 text-muted-foreground">Chargement des étudiants...</p>
              </div>
            ) : filteredEtudiants.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucun étudiant trouvé</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-left">Nom</th>
                      <th className="py-2 px-4 text-left">Prénom</th>
                      <th className="py-2 px-4 text-left">Email</th>
                      <th className="py-2 px-4 text-left">Formation</th>
                      <th className="py-2 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEtudiants.map((etudiant) => (
                      <tr key={etudiant.id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-4">{etudiant.details?.nom || '-'}</td>
                        <td className="py-2 px-4">{etudiant.details?.prenom || '-'}</td>
                        <td className="py-2 px-4">{etudiant.email}</td>
                        <td className="py-2 px-4">{etudiant.details?.formation || '-'}</td>
                        <td className="py-2 px-4 text-right">
                          {isAdmin && (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteEtudiant(etudiant.id)}
                            >
                              <Trash className="h-4 w-4 mr-1" />
                              Supprimer
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 