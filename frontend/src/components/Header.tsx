import { Link, useNavigate } from 'react-router-dom';
import { 
  NavigationMenu, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  navigationMenuTriggerStyle 
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types/user';
import { useAuth } from '@/context/AuthContext';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-primary">
          CiveLampus
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <NavigationMenu>
                <NavigationMenuList>
                  {/* Menu de navigation pour étudiants */}
                  {user?.role === UserRole.ETUDIANT && (
                    <NavigationMenuItem>
                      <NavigationMenuLink 
                        asChild
                        className={navigationMenuTriggerStyle()}
                      >
                        <Link to="/etudiant/details">Mon profil</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )}

                  {/* Menu de navigation pour intervenants */}
                  {(user?.role === UserRole.INTERVENANT || user?.role === UserRole.ADMIN) && (
                    <NavigationMenuItem>
                      <NavigationMenuLink 
                        asChild
                        className={navigationMenuTriggerStyle()}
                      >
                        <Link to="/intervenants/etudiants">Liste des étudiants</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )}

                  {/* Menu de navigation pour admin */}
                  {user?.role === UserRole.ADMIN && (
                    <NavigationMenuItem>
                      <NavigationMenuLink 
                        asChild
                        className={navigationMenuTriggerStyle()}
                      >
                        <Link to="/admin/intervenants">Liste des intervenants</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )}

                  {/* Lien Mon compte pour intervenants et admin */}
                  {user?.role !== UserRole.ETUDIANT && (
                    <NavigationMenuItem>
                      <NavigationMenuLink 
                        asChild
                        className={navigationMenuTriggerStyle()}
                      >
                        <Link to="/etudiant/details">Mon profil</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )}
                  
                  {/* Lien OTP pour admin */}
                  {user?.role === UserRole.ADMIN && !user.otpEnabled && (
                    <NavigationMenuItem>
                      <NavigationMenuLink 
                        asChild
                        className={navigationMenuTriggerStyle()}
                      >
                        <Link to="/profile/otp">Configurer OTP</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )}

                  {/* Bouton de déconnexion pour tous les utilisateurs */}
                  <NavigationMenuItem>
                    <Button variant="ghost" onClick={handleLogout}>
                      Déconnexion
                    </Button>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/login">Connexion</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Inscription</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 