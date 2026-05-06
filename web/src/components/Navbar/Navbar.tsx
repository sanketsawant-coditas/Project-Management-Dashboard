import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';
import styles from './Navbar.module.scss';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const { execute: logoutApi, loading: isLoggingOut } = useApi(() => logout());

  const handleLogout = async () => {
    const result = await logoutApi(); 
    if (result !== undefined) {
      navigate('/login');
    } else {
      setError('Logout failed. Please try again.');
      setTimeout(() => setError(null), 5000);
    }
  };

  if (!user) return null;

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/dashboard">Project Dashboard</Link>
      </div>
      <div className={styles.links}>
        {(user.role === 'admin' || user.role === 'super-admin') && <Link to="/users">Users</Link>}
        <Link to="/projects">Projects</Link>
        <Link to="/profile">Profile</Link>
      </div>
      <div className={styles.userInfo}>
        <span className={styles.role}>{user.role}</span>
        <button onClick={handleLogout} disabled={isLoggingOut} className={styles.logoutBtn}>
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </nav>
  );
}