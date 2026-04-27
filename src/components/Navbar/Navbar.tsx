import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import styles from './Navbar.module.scss';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    if (!user) return;
    setIsLoggingOut(true);
    setError(null);
    try {
      await logout();              
      navigate('/login');
    } catch (err: any) {
      console.error('Logout failed:', err);
      setError(err.response?.data?.message || 'Logout failed. Please try again.');
      setIsLoggingOut(false);
      setTimeout(() => setError(null), 5000);
    }
  };

  if (!user) return null;

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Project Dashboard</div>
        <div className={styles.links}>
        <Link to="/dashboard">Dashboard</Link>
        {(user.role === 'admin' || user.role === 'super-admin') && <Link to="/users">Users</Link>}
        <Link to="/projects">Projects</Link>
        <Link to="/profile">Profile</Link>  
      </div>
      <div className={styles.userInfo}>
        <span className={styles.role}>{user.role}</span>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={styles.logoutBtn}
        >
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </nav>
  );
}