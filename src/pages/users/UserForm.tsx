import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/axios';
import { Button } from '@/components/Button/Button';
import styles from './UserForm.module.scss';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

interface Props {
  user?: User | null;
  onClose: () => void;
}

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().optional(),
  role: z.enum(['user', 'admin', 'super-admin']),
  isActive: z.boolean().optional(),
});

type FormData = z.infer<typeof userSchema>;

export default function UserForm({ user, onClose }: Props) {
  const { user: currentUser } = useAuth();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
      isActive: true,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
      setValue('role', user.role as 'user' | 'admin' | 'super-admin');
      setValue('isActive', user.isActive);
      setValue('password', ''); // always empty for edit
    }
  }, [user, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      if (user) {
        // Edit user – only send fields that are allowed to change
        const payload: any = {
          name: data.name,
          email: data.email,
          role: data.role,
          isActive: data.isActive,
        };
        if (data.password) payload.password = data.password;
        await api.patch(`/users/${user.id}`, payload);
      } else {
        // Create user – password required
        await api.post('/users', {
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        });
      }
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save user');
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              type="text"
              placeholder="Name"
              {...register('name')}
            />
            {errors.name && <span className={styles.error}>{errors.name.message}</span>}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              {...register('email')}
            />
            {errors.email && <span className={styles.error}>{errors.email.message}</span>}
          </div>

          <div>
            <input
              type="password"
              placeholder={user ? 'New password (optional)' : 'Password'}
              {...register('password')}
            />
            {errors.password && <span className={styles.error}>{errors.password.message}</span>}
          </div>

          <div>
            <select {...register('role')}>
              {getRoleOptions().map((role) => (
                <option key={role} value={role}>
                  {role === 'super-admin' ? 'Super Admin' : role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
            {errors.role && <span className={styles.error}>{errors.role.message}</span>}
          </div>

          {user && (
            <div className={styles.checkboxGroup}>
              <label>
                <input type="checkbox" {...register('isActive')} />
                Active
              </label>
            </div>
          )}

          <div className={styles.buttons}>
            <Button type="submit" loading={isSubmitting}>
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