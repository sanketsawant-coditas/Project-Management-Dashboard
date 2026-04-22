import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/axios';
import { Button } from '@/components/Button/Button';
import { Badge } from '@/components/Badge/Badge';
import styles from './UsersList.module.scss';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
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
      if (roleFilter) url = `/users/role/${roleFilter}?page=${page}&limit=10`;
      const res = await api.get(url);
      setUsers(res.data.users || res.data);
      setTotalPages(res.data.totalPages || Math.ceil((res.data.length || 0) / 10));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete user?')) return;
    await api.delete(`/users/${id}`);
    fetchUsers();
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    await api.patch(`/users/${id}/toggle-status`);
    fetchUsers();
  };

  const isSuperAdmin = currentUser?.role === 'super-admin';
  const isAdmin = currentUser?.role === 'admin';

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
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td><Badge variant={u.role === 'super-admin' ? 'warning' : u.role === 'admin' ? 'success' : 'default'}>{u.role}</Badge></td>
              <td><Badge variant={u.status === 'active' ? 'success' : 'danger'}>{u.status}</Badge></td>
              <td>
                {(isSuperAdmin || isAdmin) && <Button variant="secondary" onClick={() => { setEditingUser(u); setShowForm(true); }}>Edit</Button>}
                {(isSuperAdmin || isAdmin) && <Button variant="secondary" onClick={() => handleToggleStatus(u.id, u.status)}>Toggle Status</Button>}
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

// UserForm Modal (simplified – you can move to separate file)
function UserForm({ user, onClose }: { user?: User | null; onClose: () => void }) {
  const { user: currentUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', password: '', role: user?.role || 'user' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (user) {
        await api.patch(`/users/${user.id}`, form);
      } else {
        await api.post('/users', form);
      }
      onClose();
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>{user ? 'Edit User' : 'Create User'}</h2>
        <form onSubmit={handleSubmit}>
          <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          {!user && <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />}
          <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            {currentUser?.role === 'super-admin' && <option value="super-admin">Super Admin</option>}
          </select>
          <Button type="submit" loading={loading}>Save</Button>
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
        </form>
      </div>
    </div>
  );
}