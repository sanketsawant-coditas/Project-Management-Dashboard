import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/axios';
import styles from './Dashboard.module.scss';

interface Statistics {
  total: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  upcomingDeadlines: Array<{ id: string; name: string; endDate: string }>;
}

// Format status keys: in_progress -> "In Progress", on_hold -> "On Hold"
const formatStatus = (status: string): string => {
  const map: Record<string, string> = {
    in_progress: 'In Progress',
    on_hold: 'On Hold',
    planning: 'Planning',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  return map[status] || status;
};

// Format priority keys: high -> "High", urgent -> "Urgent"
const formatPriority = (priority: string): string => {
  const map: Record<string, string> = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    urgent: 'Urgent',
  };
  return map[priority] || priority;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/projects/statistics');
        setStats(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className={styles.loading}>Loading dashboard...</div>;

  return (
    <div className={styles.container}>
      <h1>Welcome back, {user?.name} ({user?.role})</h1>

      <div className={styles.cards}>
        {/* Total Projects Card */}
        <div className={styles.card}>
          <h3>Total Projects</h3>
          <p className={styles.number}>{stats?.total || 0}</p>
        </div>

        {/* By Status Card */}
        <div className={styles.card}>
          <h3>By Status</h3>
          {stats?.byStatus && Object.entries(stats.byStatus).map(([status, count]) => (
            <div key={status} className={styles.statItem}>
              <span className={styles.statLabel}>{formatStatus(status)}</span>
              <span className={styles.statCount}>{count}</span>
            </div>
          ))}
        </div>

        {/* By Priority Card */}
        <div className={styles.card}>
          <h3>By Priority</h3>
          {stats?.byPriority && Object.entries(stats.byPriority).map(([priority, count]) => (
            <div key={priority} className={styles.statItem}>
              <span className={styles.statLabel}>{formatPriority(priority)}</span>
              <span className={styles.statCount}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {stats?.upcomingDeadlines && stats.upcomingDeadlines.length > 0 && (
        <div className={styles.deadlines}>
          <h2>Upcoming Deadlines</h2>
          <ul>
            {stats.upcomingDeadlines.map(project => (
              <li key={project.id}>
                {project.name} - Due {new Date(project.endDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}