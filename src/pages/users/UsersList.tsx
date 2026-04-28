import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/axios';
import { Button } from '@/components/Button/Button';
import { Badge } from '@/components/Badge/Badge';
import UserForm from './UserForm';
import styles from './UsersList.module.scss';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export default function UsersList() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let url = `/users?page=${page}&limit=10`;
      if (roleFilter) {
        url = `/users/role/${roleFilter}?page=${page}&limit=10`;
      }
      const res = await api.get(url);
      
      let usersArray: User[] = [];
      let totalPagesFromApi = 1;
      
      if (res.data.data && Array.isArray(res.data.data)) {
        usersArray = res.data.data;
        totalPagesFromApi = res.data.totalPages || 1;
      } else if (Array.isArray(res.data)) {
        usersArray = res.data;
        totalPagesFromApi = 1;
      } else if (res.data.users && Array.isArray(res.data.users)) {
        usersArray = res.data.users;
        totalPagesFromApi = res.data.totalPages || 1;
      } else {
        usersArray = [];
      }
      
      setUsers(usersArray);
      setTotalPages(totalPagesFromApi);
    } catch (error) {
      console.error(error);
      setUsers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete user?')) return;
    await api.delete(`/users/${id}`);
    fetchUsers();
  };
  const handleToggleStatus = async (id: string) => {
    await api.patch(`/users/${id}/toggle-status`);
    fetchUsers();
  };

  const isSuperAdmin = currentUser?.role === 'super-admin';
  const isAdmin = currentUser?.role === 'admin';

  if (!isSuperAdmin && !isAdmin) {
    return <div className={styles.accessDenied}>Access denied. Only admins can view users.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Users</h1>
        {(isSuperAdmin || isAdmin) && (
          <Button onClick={() => { setEditingUser(null); setShowForm(true); }}>Create User</Button>
        )}
      </div>
      <div className={styles.filters}>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="super-admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>
      {loading && <div>Loading...</div>}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <Badge variant={u.role === 'super-admin' ? 'warning' : u.role === 'admin' ? 'success' : 'default'}>
                  {u.role}
                </Badge>
              </td>
              <td>
                <Badge variant={u.isActive ? 'success' : 'danger'}>
                  {u.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td>
                {(isSuperAdmin || isAdmin) && <Button variant="secondary" onClick={() => { setEditingUser(u); setShowForm(true); }}>Edit</Button>}
                {(isSuperAdmin || isAdmin) && (
                  <Button variant="secondary" onClick={() => handleToggleStatus(u.id)}>
                    Toggle Status
                  </Button>
                )}
                {isSuperAdmin && <Button variant="danger" onClick={() => handleDelete(u.id)}>Delete</Button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage(p => p-1)}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(p => p+1)}>Next</button>
      </div>
      {showForm && <UserForm user={editingUser} onClose={() => { setShowForm(false); fetchUsers(); }} />}
    </div>
  );
}