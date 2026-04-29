import api from '@/api/axios';
import type { PaginatedResponse } from './type.api';
import type { Project } from '@/types';


export const projectService = {
  getAll: (page: number, limit: number, status?: string, priority?: string) => {
    let url = `/projects?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    if (priority) url += `&priority=${priority}`;
    return api.get<PaginatedResponse<Project>>(url);
  },

  getById: (id: string) => api.get<Project>(`/projects/${id}`),

  create: (data: Partial<Project>) => api.post<Project>('/projects', data),

  update: (id: string, data: Partial<Project>) =>
    api.patch(`/projects/${id}`, data),

  delete: (id: string) => api.delete(`/projects/${id}`),

  addMember: (projectId: string, userId: string) =>
    api.post(`/projects/${projectId}/members/${userId}`),

  removeMember: (projectId: string, userId: string) =>
    api.delete(`/projects/${projectId}/members/${userId}`),

  getStatistics: () => api.get('/projects/statistics'),
};