import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRole } from '@/types/user';

export function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Bienvenue sur CiveLampus</h1>
          <p className="mt-4 text-xl text-muted-foreground">
            La plateforme de formation en distanciel sécurisée
          </p>
        </div>

        {isAuthenticated ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Carte pour étudiants */}
            {user?.role === UserRole.ETUDIANT && (
              <Card>
                <CardHeader>
                  <CardTitle>Mon profil</CardTitle>
                  <CardDescription>
                    Consultez et modifiez vos informations personnelles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Accédez à vos détails personnels, mettez à jour vos coordonnées et consultez vos informations de formation.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to="/etudiant/details">
                      Voir mon profil
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Carte pour intervenants */}
            {(user?.role === UserRole.INTERVENANT || user?.role === UserRole.ADMIN) && (
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des étudiants</CardTitle>
                  <CardDescription>
                    Consultez la liste des étudiants inscrits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Accédez à la liste complète des étudiants, consultez leurs profils et leurs informations détaillées.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to="/intervenants/etudiants">
                      Voir les étudiants
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Carte pour administrateurs */}
            {user?.role === UserRole.ADMIN && (
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des intervenants</CardTitle>
                  <CardDescription>
                    Consultez la liste des intervenants (accès protégé par OTP)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Accédez à la liste complète des intervenants. Cette section nécessite une authentification à deux facteurs pour un niveau de sécurité accru.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to="/admin/intervenants">
                      Voir les intervenants
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Carte pour tous les utilisateurs connectés */}
            {user?.role !== UserRole.ETUDIANT && (
              <Card>
                <CardHeader>
                  <CardTitle>Mon profil</CardTitle>
                  <CardDescription>
                    Gérez votre compte utilisateur
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Modifiez vos paramètres personnels, changez votre mot de passe ou configurez l'authentification à deux facteurs.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to="/profile">
                      Gérer mon profil
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Commencer</CardTitle>
                <CardDescription>
                  Créez un compte pour accéder à nos formations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Rejoignez CiveLampus en créant un compte pour accéder à nos formations en ligne et à notre plateforme d'apprentissage.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/register">
                    S'inscrire
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Déjà membre ?</CardTitle>
                <CardDescription>
                  Connectez-vous à votre compte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Accédez à votre espace personnel pour suivre vos formations et consulter vos informations.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/login">
                    Se connecter
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold tracking-tight">À propos de CiveLampus</h2>
          <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
            CiveLampus est une plateforme de formation en distanciel qui sécurise l'accès à des sections
            spécifiques de son application web en fonction du rôle des utilisateurs. La plateforme est
            conçue pour les étudiants, les intervenants et les administrateurs, avec des contrôles d'accès
            adaptés à chaque profil.
          </p>
        </div>
      </div>
    </div>
  );
} 