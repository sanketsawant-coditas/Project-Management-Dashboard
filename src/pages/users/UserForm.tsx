import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/axios';
import { Button } from '@/components/Button/Button';
import styles from './UserForm.module.scss';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: 'active' | 'inactive';
}

interface Props {
  user?: User | null;
  onClose: () => void;
}

interface FormState {
  name: string;
  email: string;
  password: string;
  role: string;
  status: 'active' | 'inactive';
}

export default function UserForm({ user, onClose }: Props) {
  const { user: currentUser } = useAuth();
  const [form, setForm] = useState<FormState>({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'user',
    status: user?.status || 'active',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        status: user.status || 'active',
      });
    } else {
      setForm({ name: '', email: '', password: '', role: 'user', status: 'active' });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!form.name.trim()) {
      setError('Name is required');
      setLoading(false);
      return;
    }
    if (!form.email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }
    if (!user && !form.password) {
      setError('Password is required for new user');
      setLoading(false);
      return;
    }
    if (form.password && form.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      if (user) {
        const payload: any = {
          name: form.name,
          email: form.email,
          role: form.role,
          status: form.status,
        };
        if (form.password) payload.password = form.password;
        await api.patch(`/users/${user.id}`, payload);
      } else {
        await api.post('/users', {
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const getRoleOptions = () => {
    if (currentUser?.role === 'super-admin') {
      return ['user', 'admin', 'super-admin'];
    }
    if (currentUser?.role === 'admin') {
      return ['user', 'admin'];
    }
    return ['user'];
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>{user ? 'Edit User' : 'Create User'}</h2>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder={user ? 'New password (optional)' : 'Password'}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            {getRoleOptions().map((role) => (
              <option key={role} value={role}>
                {role === 'super-admin' ? 'Super Admin' : role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
          {user && (
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as 'active' | 'inactive' })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          )}
          <div className={styles.buttons}>
            <Button type="submit" loading={loading}>
              {user ? 'Update' : 'Create'}
            </Button>
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}