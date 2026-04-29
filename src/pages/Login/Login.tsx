import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/axios';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import styles from './Login.module.scss';
import { authService } from '@/services/authService';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [lastAttemptCredentials, setLastAttemptCredentials] = useState<FormData | null>(null);
  const [fieldsChanged, setFieldsChanged] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const watchedEmail = watch('email');
  const watchedPassword = watch('password');

  useEffect(() => {
    if (lastAttemptCredentials) {
      const changed =
        watchedEmail !== lastAttemptCredentials.email ||
        watchedPassword !== lastAttemptCredentials.password;
      setFieldsChanged(changed);
    } else {
      setFieldsChanged(false);
    }
  }, [watchedEmail, watchedPassword, lastAttemptCredentials]);

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      const res = await authService.login(data.email, data.password);
      const { access_token, user } = res.data;
      login(access_token, user);
      navigate('/dashboard');
    } catch (err: any) {
      setLastAttemptCredentials(data);
      setServerError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const isButtonDisabled = isSubmitting || (lastAttemptCredentials !== null && !fieldsChanged);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Project Management System</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input label="Email" {...register('email')} error={errors.email?.message} autoComplete="off" />
          <Input label="Password" type="password" {...register('password')} error={errors.password?.message} autoComplete="off" />
          {serverError && <div className={styles.error}>{serverError}</div>}
          <Button type="submit" loading={isSubmitting} disabled={isButtonDisabled}>
            Login
          </Button>
        </form>
        <div className={styles.testCreds}>Forgot Password?</div>
      </div>
    </div>
  );
}