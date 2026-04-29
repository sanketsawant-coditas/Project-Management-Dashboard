import api from '@/api/axios';
import type User from '@/types/user.types';
import type { PaginatedResponse } from './type.api';

// Assuming PaginatedResponse is in types/api.types.ts

export const userService = {
  getAll: (page: number, limit: number) =>
    api.get<PaginatedResponse<User>>(`/users?page=${page}&limit=${limit}`),

  getByRole: (role: string, page: number, limit: number) =>
    api.get<PaginatedResponse<User>>(`/users/role/${role}?page=${page}&limit=${limit}`),

  getById: (id: string) => api.get<User>(`/users/${id}`),

  create: (data: Partial<User> & { password: string }) =>
    api.post<User>('/users', data),

  update: (id: string, data: Partial<User>) =>
    api.patch(`/users/${id}`, data),

  delete: (id: string) => api.delete(`/users/${id}`),

  toggleStatus: (id: string) =>
    api.patch(`/users/${id}/toggle-status`),
};