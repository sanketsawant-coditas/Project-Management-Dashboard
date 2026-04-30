import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/Button/Button';
import { Badge } from '@/components/Badge/Badge';
import UserForm from './UserForm';
import { useUsers } from '@/hooks/useUsers';
import { userService } from '@/services/userService';
import styles from './UsersList.module.scss';
import { toast } from 'react-hot-toast/headless';

export default function UsersList() {
  const { user: currentUser } = useAuth();
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null); // will be User | null

  const { users, totalPages, loading, refetch } = useUsers(page, 10, roleFilter);

  const isSuperAdmin = currentUser?.role === 'super-admin';
  const isAdmin = currentUser?.role === 'admin';

const handleDelete = async (id: string) => {
  if (!confirm('Delete user?')) return;
  try {
    await userService.delete(id);
    toast.success('User deleted successfully');
    refetch();
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Delete failed');
  }
};

const handleToggleStatus = async (id: string) => {
  try {
    await userService.toggleStatus(id);
    toast.success('Status toggled successfully');
    refetch();
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Toggle failed');
  }
};

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
                {(isSuperAdmin || isAdmin) && (
                  <Button variant="secondary" onClick={() => { setEditingUser(u); setShowForm(true); }}>Edit</Button>
                )}
                {(isSuperAdmin || isAdmin) && (
                  <Button variant="secondary" onClick={() => handleToggleStatus(u.id)}>Toggle Status</Button>
                )}
                {isSuperAdmin && (
                  <Button variant="danger" onClick={() => handleDelete(u.id)}>Delete</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>

      {showForm && (
        <UserForm
          user={editingUser}
          onClose={() => {
            setShowForm(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}