import { useState, useCallback } from 'react';
import { setCookie, deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth';
import { LoginCredentials, RegisterCredentials } from '../types/auth';
import { api } from '../services/api';
import { AxiosError } from 'axios';

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      
      // Save token in cookies (accessible to Next.js Middleware)
      setCookie('sim_int_token', response.access_token, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
      
      // Set default header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${response.access_token}`;
      
      router.push('/pokedex');
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{message: string}>;
      if (axiosError.response?.status === 401 || axiosError.response?.status === 404) {
         setError('E-mail ou senha incorretos.');
      } else {
         setError(axiosError.response?.data?.message || 'Ocorreu um erro ao fazer login.');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.register(credentials);
      
      // Auto login after register
      await login({ email: credentials.email, password: credentials.password });
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{message: string}>;
      if (axiosError.response?.status === 409) {
          setError('Este e-mail já está em uso.');
      } else {
          setError(axiosError.response?.data?.message || 'Ocorreu um erro ao registrar.');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  const logout = useCallback(() => {
    deleteCookie('sim_int_token');
    delete api.defaults.headers.common['Authorization'];
    router.push('/login');
  }, [router]);

  return {
    login,
    register,
    logout,
    isLoading,
    error,
  };
}
