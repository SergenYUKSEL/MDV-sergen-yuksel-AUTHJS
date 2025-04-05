export enum UserRole {
  ETUDIANT = 'etudiant',
  INTERVENANT = 'intervenant',
  ADMIN = 'admin'
}

export interface UserDetails {
  nom?: string;
  prenom?: string;
  dateNaissance?: string;
  adresse?: string;
  telephone?: string;
  formation?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  details?: UserDetails;
  otpEnabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
  requireOTP?: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginData {
  email: string;
  password: string;
} 