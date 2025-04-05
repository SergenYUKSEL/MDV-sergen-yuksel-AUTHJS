import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from 'next-themes';
import { Header } from './components/Header';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { EtudiantDetailsPage } from './pages/etudiant/DetailsPage';
import { EtudiantsListPage } from './pages/intervenants/EtudiantsListPage';
import { IntervenantsListPage } from './pages/admin/IntervenantsListPage';
import { OAuthCallbackPage } from './pages/OAuthCallbackPage';
import { OTPPage } from './pages/profile/OTPPage';

// Styles
import './App.css';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/auth/callback" element={<OAuthCallbackPage />} />
                
                {/* Routes étudiants */}
                <Route path="/etudiant/details" element={<EtudiantDetailsPage />} />
                
                {/* Route profile pour tous */}
                <Route path="/profile" element={<EtudiantDetailsPage />} />
                
                {/* Routes intervenants */}
                <Route path="/intervenants/etudiants" element={<EtudiantsListPage />} />
                
                {/* Routes admin */}
                <Route path="/admin/intervenants" element={<IntervenantsListPage />} />
                
                {/* Route OTP */}
                <Route path="/profile/otp" element={<OTPPage />} />
                
                {/* Route par défaut */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </main>
            <footer className="py-4 border-t text-center text-sm text-muted-foreground">
              <p>CiveLampus &copy; {new Date().getFullYear()} - Tous droits réservés</p>
            </footer>
          </div>
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
