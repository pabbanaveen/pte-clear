import { api } from './api';
import { User } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<{ user: User; token: string }>('/auth/login', credentials);
    
    if (response.success && response.data) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  register: async (userData: RegisterData) => {
    return await api.post<{ user: User; token: string }>('/auth/register', userData);
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },

  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.role === 'admin';
  },

  refreshToken: async () => {
    return await api.post<{ token: string }>('/auth/refresh');
  },

  resetPassword: async (email: string) => {
    return await api.post('/auth/reset-password', { email });
  },

  updateProfile: async (userData: Partial<User>) => {
    return await api.put<User>('/auth/profile', userData);
  },
};
