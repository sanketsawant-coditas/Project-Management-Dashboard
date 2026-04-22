import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/axios';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import styles from './Login.module.scss';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post('/auth/login', data);
      const { access_token, user } = res.data;
      login(access_token, user);
      navigate('/dashboard');
    } catch (err: any) {
      setError('root', { message: err.response?.data?.message || 'Login failed' });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Project Management System</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input label="Email" {...register('email')} error={errors.email?.message} />
          <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
          {errors.root && <div className={styles.error}>{errors.root.message}</div>}
          <Button type="submit" loading={isSubmitting}>Login</Button>
        </form>
        <div className={styles.testCreds}>superadmin@test.com / password123</div>
      </div>
    </div>
  );
}