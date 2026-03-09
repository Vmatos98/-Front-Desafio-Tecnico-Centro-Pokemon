import { api } from './api';
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  register: async (credentials: RegisterCredentials): Promise<{ access_token: string }> => {
    const { data } = await api.post('/auth/register', credentials);
    return data;
  },
  
  getProfile: async (): Promise<User> => {
    const { data } = await api.get('/auth/profile');
    return data;
  }
};
