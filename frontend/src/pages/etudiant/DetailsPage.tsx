import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { userService } from '@/services/api';

export function EtudiantDetailsPage() {
  const { user: _ } = useProtectedRoute({ 
    redirectTo: '/login'
  });
  
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: user?.details?.nom || '',
    prenom: user?.details?.prenom || '',
    dateNaissance: user?.details?.dateNaissance || '',
    adresse: user?.details?.adresse || '',
    telephone: user?.details?.telephone || '',
    formation: user?.details?.formation || '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.details?.nom || '',
        prenom: user.details?.prenom || '',
        dateNaissance: user.details?.dateNaissance || '',
        adresse: user.details?.adresse || '',
        telephone: user.details?.telephone || '',
        formation: user.details?.formation || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Utilisateur:", user);
    
    const userId = user?.id || (user as any)?._id;
    
    if (!user || !userId) {
      toast.error('Impossible de mettre à jour le profil: ID utilisateur manquant');
      console.error("Objet user:", user);
      return;
    }
    
    setLoading(true);
    
    try {
      const updatedUser = await userService.updateUser(userId, {
        details: {
          ...user.details,
          ...formData
        }
      });
      
      updateUser(updatedUser);
      setIsEditing(false);
      toast.success('Informations mises à jour avec succès');
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la mise à jour des informations');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Mes Informations</CardTitle>
          <CardDescription>
            Informations personnelles de {user.username}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="nom" className="text-sm font-medium">Nom</label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="prenom" className="text-sm font-medium">Prénom</label>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="dateNaissance" className="text-sm font-medium">Date de naissance</label>
                  <input
                    type="date"
                    id="dateNaissance"
                    name="dateNaissance"
                    value={formData.dateNaissance}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="telephone" className="text-sm font-medium">Téléphone</label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="adresse" className="text-sm font-medium">Adresse</label>
                  <input
                    type="text"
                    id="adresse"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="formation" className="text-sm font-medium">Formation</label>
                  <input
                    type="text"
                    id="formation"
                    name="formation"
                    value={formData.formation}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Nom</h3>
                  <p className="text-base">{user.details?.nom || 'Non renseigné'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Prénom</h3>
                  <p className="text-base">{user.details?.prenom || 'Non renseigné'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Date de naissance</h3>
                  <p className="text-base">
                    {user.details?.dateNaissance 
                      ? new Date(user.details.dateNaissance).toLocaleDateString() 
                      : 'Non renseignée'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Téléphone</h3>
                  <p className="text-base">{user.details?.telephone || 'Non renseigné'}</p>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Adresse</h3>
                  <p className="text-base">{user.details?.adresse || 'Non renseignée'}</p>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Formation</h3>
                  <p className="text-base">{user.details?.formation || 'Non renseignée'}</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="button" 
                  onClick={() => setIsEditing(true)}
                >
                  Modifier mes informations
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            <p>Membre depuis: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 