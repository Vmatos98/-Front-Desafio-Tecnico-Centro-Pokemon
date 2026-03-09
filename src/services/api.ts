import axios from 'axios';
import { getCookie } from 'cookies-next';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

// Request interceptor for API calls
api.interceptors.request.use(
  async (config) => {
    // Custom configurations like auth headers can be added here
    config.headers.Accept = 'application/json';
    
    // Inject token if available
    const token = getCookie('sim_int_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    Promise.reject(error)
  }
);
