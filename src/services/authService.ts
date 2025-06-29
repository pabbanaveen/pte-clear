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

export interface AuthToken {
  token: string;
  refreshToken?: string;
}

// Dummy API responses for testing (will be replaced with real backend calls)
const DUMMY_USERS = [
  {
    email: 'admin@pte.com',
    password: 'admin123',
    createdAt: '2023-10-01T12:00:00Z',
    user: {
      id: '1',
      name: 'Admin User',
      email: 'admin@pte.com',
      avatar: 'https://images.pexels.com/photos/5303547/pexels-photo-5303547.jpeg',
      role: 'admin' as const,
      progress: {
        totalTests: 25,
        completedTests: 20,
        averageScore: 85,
        strongAreas: ['Reading', 'Listening', 'Writing'],
        weakAreas: ['Speaking'],
      } 
    } as User,
  },
  {
    email: 'user@pte.com',
    password: 'user123',
    createdAt: '2023-10-01T12:00:00Z',
    user: {
      id: '2',
      name: 'John Doe',
      email: 'user@pte.com',
      avatar: 'https://images.pexels.com/photos/5303547/pexels-photo-5303547.jpeg',
      role: 'user' as const,
      progress: {
        totalTests: 15,
        completedTests: 8,
        averageScore: 78,
        strongAreas: ['Reading', 'Listening'],
        weakAreas: ['Speaking', 'Writing'],
      }
    } as User,
  }
];

// Generate a dummy JWT-like token
const generateToken = (): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    sub: Date.now().toString(),
    iat: Math.floor(Date.now() / 1000)
  }));
  const signature = btoa('dummy-signature-' + Date.now());
  return `${header}.${payload}.${signature}`;
};

// Dummy API call simulator
const simulateApiCall = <T>(data: T, delay: number = 500): Promise<{ success: boolean; data: T; message?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data });
    }, delay);
  });
};

export const authService = {
  // Login function
  login: async (credentials: LoginCredentials): Promise<{ success: boolean; data?: { user: User; token: string }; message?: string }> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user in dummy data
      const userData = DUMMY_USERS.find(u => 
        u.email === credentials.email && u.password === credentials.password
      );

      if (!userData) {
        return { 
          success: false, 
          message: 'Invalid email or password' 
        };
      }

      const token = generateToken();

      const authData = {
        user: { ...userData.user, createdAt: userData.createdAt },
        token
      };

      // Store in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData.user));

      // Real API call (commented for now)
      /*
      const response = await api.post<{ user: User; token: string }>('/auth/login', credentials);
      
      if (response.success && response.data) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response;
      */

      return { success: true, data: authData };

    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'Login failed. Please try again.' 
      };
    }
  },

  register: async (userData: RegisterData) => {
    // Real API call (commented for now)
    // return await api.post<{ user: User; token: string }>('/auth/register', userData);
    
    // Dummy implementation
    return simulateApiCall({ 
      user: { 
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        role: userData.role || 'user'
      }, 
      token: generateToken() 
    });
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
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.role === 'admin';
  },

  refreshToken: async () => {
    // Real API call (commented for now)
    // return await api.post<{ token: string }>('/auth/refresh');
    
    // Dummy implementation
    const newToken = generateToken();
    localStorage.setItem('authToken', newToken);
    
    return simulateApiCall({ token: newToken });
  },

  resetPassword: async (email: string) => {
    // Real API call (commented for now)
    // return await api.post('/auth/reset-password', { email });
    
    return simulateApiCall({ message: 'Password reset email sent' });
  },

  updateProfile: async (userData: Partial<User>) => {
    // Real API call (commented for now)
    // return await api.put<User>('/auth/profile', userData);
    
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return simulateApiCall(updatedUser);
    }
    
    return { success: false, data: null, message: 'User not found' };
  },

  // Initialize auth state from localStorage
  initializeAuth: (): { isAuthenticated: boolean; user: User | null } => {
    const isAuthenticated = authService.isAuthenticated();
    const user = isAuthenticated ? authService.getCurrentUser() : null;
    
    return { isAuthenticated, user };
  }
};