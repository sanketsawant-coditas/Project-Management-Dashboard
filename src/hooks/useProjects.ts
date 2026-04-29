import { useState, useEffect, useCallback } from 'react';
import { projectService } from '@/services/projectService';
import type { Project } from '@/types';

export const useProjects = (page: number, limit: number, statusFilter: string, priorityFilter: string) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await projectService.getAll(page, limit, statusFilter, priorityFilter);
      setProjects(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter, priorityFilter]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, totalPages, loading, refetch: fetchProjects };
};