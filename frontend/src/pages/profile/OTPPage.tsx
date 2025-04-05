import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserRole } from '@/types/user';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { authService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export function OTPPage() {
  useProtectedRoute({ 
    requiredRoles: [UserRole.ADMIN], 
    redirectTo: '/login'
  });
  
  const { user, updateUser } = useAuth();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [token, setToken] = useState('');
  const [step, setStep] = useState<'initial' | 'setup' | 'enable' | 'disable'>('initial');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.otpEnabled) {
      setStep('disable');
    } else {
      setStep('initial');
    }
  }, [user]);

  const handleSetupOTP = async () => {
    setLoading(true);
    try {
      const response = await authService.setupOTP();
      setQrCode(response.qrCode);
      setSecret(response.secret);
      setStep('setup');
      toast.success('Configuration OTP initiée');
    } catch (error) {
      console.error('Erreur lors de la configuration OTP:', error);
      toast.error('Erreur lors de la configuration OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleEnableOTP = async () => {
    if (!token) {
      toast.error('Veuillez saisir un code OTP');
      return;
    }

    setLoading(true);
    try {
      await authService.verifyAndEnableOTP(token);
      
      if (user) {
        updateUser({
          ...user,
          otpEnabled: true
        });
      }
      
      setStep('disable');
      setToken('');
      toast.success('OTP activé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'activation OTP:', error);
      toast.error('Code OTP invalide');
    } finally {
      setLoading(false);
    }
  };

  const handleDisableOTP = async () => {
    if (!token) {
      toast.error('Veuillez saisir un code OTP');
      return;
    }

    setLoading(true);
    try {
      await authService.disableOTP(token);
      
      if (user) {
        updateUser({
          ...user,
          otpEnabled: false
        });
      }
      
      setStep('initial');
      setToken('');
      toast.success('OTP désactivé avec succès');
    } catch (error) {
      console.error('Erreur lors de la désactivation OTP:', error);
      toast.error('Code OTP invalide');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Configuration de l'authentification à deux facteurs (2FA)</CardTitle>
          <CardDescription>
            Sécurisez votre compte administrateur avec une couche de protection supplémentaire
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {step === 'initial' && (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                L'authentification à deux facteurs (2FA) ajoute une couche de sécurité supplémentaire à votre compte. 
                Une fois activée, vous aurez besoin d'un code unique généré par une application d'authentification 
                en plus de votre mot de passe pour vous connecter.
              </p>
              
              <Button 
                onClick={handleSetupOTP}
                disabled={loading}
              >
                {loading ? 'Configuration...' : 'Configurer l\'authentification 2FA'}
              </Button>
            </div>
          )}
          
          {step === 'setup' && qrCode && secret && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">1. Scannez le code QR</h3>
                <p className="text-muted-foreground">
                  Utilisez une application d'authentification comme Google Authenticator, 
                  Microsoft Authenticator ou Authy pour scanner ce code QR.
                </p>
                <div className="flex justify-center py-4">
                  <img src={qrCode} alt="QR Code" className="max-w-[200px]" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">2. Sauvegarde de secours</h3>
                <p className="text-muted-foreground">
                  Si vous ne pouvez pas scanner le code QR, vous pouvez saisir manuellement cette clé secrète 
                  dans votre application d'authentification:
                </p>
                <div className="p-2 bg-muted rounded-md font-mono text-center">
                  {secret}
                </div>
                <p className="text-sm text-muted-foreground italic">
                  Conservez cette clé en lieu sûr. Elle vous permettra de récupérer l'accès en cas de perte 
                  de votre appareil.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">3. Vérification</h3>
                <p className="text-muted-foreground">
                  Entrez le code à 6 chiffres généré par votre application d'authentification pour activer la 2FA.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="token">Code de vérification</Label>
                  <Input
                    id="token"
                    placeholder="123456"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    maxLength={6}
                  />
                </div>
                <Button 
                  onClick={handleEnableOTP}
                  disabled={loading || !token}
                  className="w-full mt-2"
                >
                  {loading ? 'Vérification...' : 'Activer l\'authentification 2FA'}
                </Button>
              </div>
            </div>
          )}
          
          {step === 'disable' && (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                L'authentification à deux facteurs est actuellement <strong>activée</strong> pour votre compte.
                Pour la désactiver, veuillez saisir un code de votre application d'authentification.
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="disableToken">Code de vérification</Label>
                <Input
                  id="disableToken"
                  placeholder="123456"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  maxLength={6}
                />
              </div>
              
              <Button 
                variant="destructive"
                onClick={handleDisableOTP}
                disabled={loading || !token}
              >
                {loading ? 'Désactivation...' : 'Désactiver l\'authentification 2FA'}
              </Button>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            <p>Statut 2FA: <strong>{user?.otpEnabled ? 'Activé' : 'Désactivé'}</strong></p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 