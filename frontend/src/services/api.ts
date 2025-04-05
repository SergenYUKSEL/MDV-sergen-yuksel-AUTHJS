import axios from 'axios';
import { AuthResponse, LoginData, RegisterData, User } from '../types/user';

interface MongoDBUser extends Omit<User, 'id'> {
  _id: string;
}

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem('token');
  },

  verifyOTP: async (token: string, userId: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/verify-login-otp', { token, userId });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  setupOTP: async (): Promise<{ secret: string; qrCode: string }> => {
    const response = await api.post('/auth/setup-otp');
    return response.data;
  },

  verifyAndEnableOTP: async (token: string): Promise<{ message: string }> => {
    const response = await api.post('/auth/verify-otp', { token });
    return response.data;
  },

  disableOTP: async (token: string): Promise<{ message: string }> => {
    const response = await api.post('/auth/disable-otp', { token });
    return response.data;
  },
};

export const userService = {
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<{ user: MongoDBUser }>('/users/me');
    
    console.log("Réponse de /users/me:", response.data);
    
    const user = response.data.user;
    
    if (user._id && !(user as any).id) {
      (user as any).id = user._id;
    }
    
    return user as any as User;
  },

  getEtudiantDetails: async (id: string): Promise<User> => {
    const response = await api.get<{ user: MongoDBUser }>(`/users/etudiants/${id}`);
    const user = response.data.user;
    
    if (user._id && !(user as any).id) {
      (user as any).id = user._id;
    }
    
    return user as any as User;
  },

  getAllEtudiants: async (): Promise<User[]> => {
    const response = await api.get<{ etudiants: MongoDBUser[] }>('/users/etudiants');
    
    const etudiants = response.data.etudiants.map(etudiant => {
      if (etudiant._id && !(etudiant as any).id) {
        (etudiant as any).id = etudiant._id;
      }
      return etudiant as any as User;
    });
    
    return etudiants;
  },

  getAllIntervenants: async (otp: string): Promise<User[]> => {
    const response = await api.post<{ intervenants: MongoDBUser[] }>('/users/intervenants/verify-otp', { 
      token: otp
    });
    
    const intervenants = response.data.intervenants.map(intervenant => {
      if (intervenant._id && !(intervenant as any).id) {
        (intervenant as any).id = intervenant._id;
      }
      return intervenant as any as User;
    });
    
    return intervenants;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    console.log(`Mise à jour de l'utilisateur avec l'id: ${id}`, data);
    const response = await api.put<{ user: MongoDBUser }>(`/users/${id}`, data);
    console.log("Réponse de updateUser:", response.data);
    
    const user = response.data.user;
    
    if (user._id && !(user as any).id) {
      (user as any).id = user._id;
    }
    
    return user as any as User;
  },
  
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

export default api; 