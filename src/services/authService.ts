import api from '@/api/axios';
import type User from '@/types/user.types';
import type { LoginResponse } from '../types/api.types';


export const authService = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password }),

  logout: () => api.post('/auth/logout'),

  getCurrentUser: () => api.get<User>('/users/me'),
};