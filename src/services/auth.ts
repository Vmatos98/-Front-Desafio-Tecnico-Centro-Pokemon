import { api } from './api';
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', credentials);
    return data;
  },
  
  async getProfile(): Promise<User> {
    const { data } = await api.get<User>('/auth/profile');
    return data;
  }
};
