import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/hooks/useApi";
import { dashService } from "@/services/dashService";
import styles from "./Dashboard.module.scss";

export default function AdminDashboard() {
  const { user } = useAuth();

  const {
    execute: getStatistics,
    loading: statsLoading,
    data: statsResponse,
    error: statsError,
  } = useApi(dashService.getStatistics);

  const stats = statsResponse?.data;

  useEffect(() => {
    getStatistics();
  }, [user?.role]);

  if (statsLoading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  if (statsError) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>
          ⚠️ Failed to load project statistics. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>
        Welcome back, {user?.name} ({user?.role})
      </h1>

      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>Total Projects</h3>
          <p className={styles.number}>{stats?.total || 0}</p>
        </div>

        <div className={styles.card}>
          <h3>By Status</h3>
          {stats?.byStatus &&
            Object.entries(stats.byStatus).map(([status, count]) => (
              <div key={status} className={styles.statItem}>
                <span className={styles.statLabel}>{status}</span>
                <span className={styles.statCount}>{count as number}</span>
              </div>
            ))}
        </div>

        <div className={styles.card}>
          <h3>By Priority</h3>
          {stats?.byPriority &&
            Object.entries(stats.byPriority).map(([priority, count]) => (
              <div key={priority} className={styles.statItem}>
                <span className={styles.statLabel}>{priority}</span>
                <span className={styles.statCount}>{count as number}</span>
              </div>
            ))}
        </div>
      </div>

      {stats?.upcomingDeadlines && stats.upcomingDeadlines.length > 0 && (
        <div className={styles.deadlines}>
          <h2>Upcoming Deadlines</h2>
          <ul>
            {stats.upcomingDeadlines.map((project) => (
              <li key={project.id}>
                {project.name} – Due{" "}
                {new Date(project.endDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
