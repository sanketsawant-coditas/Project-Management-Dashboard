import { useState, useEffect, useCallback } from 'react';
import { userService } from '@/services/userService';
import type User  from '@/types/user.types';

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
      let usersArray: User[] = [];
      let totalPagesFromApi = 1;

      if (Array.isArray(res.data)) {
        usersArray = res.data;
        totalPagesFromApi = 1; 
      } else if (res.data.data && Array.isArray(res.data.data)) {
        usersArray = res.data.data;
        totalPagesFromApi = res.data.totalPages || 1;
      } else {
        usersArray = [];
      }

      setUsers(usersArray);
      setTotalPages(totalPagesFromApi);
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