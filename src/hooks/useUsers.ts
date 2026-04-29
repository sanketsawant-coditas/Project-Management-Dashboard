import { useState, useEffect, useCallback } from 'react';
import { userService } from '@/services/userService';
import type User from '@/types/user.types';


export const useUsers = (page: number, limit: number, roleFilter: string) => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      let res;
      if (roleFilter) {
        res = await userService.getByRole(roleFilter, page, limit);
      } else {
        res = await userService.getAll(page, limit);
      }
      setUsers(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setUsers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, limit, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, totalPages, loading, refetch: fetchUsers };
};