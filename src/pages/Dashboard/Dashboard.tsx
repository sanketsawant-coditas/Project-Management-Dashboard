import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/Badge/Badge";
import { useApi } from "@/hooks/useApi";
import { dashService } from "@/services/dashService";
import styles from "./Dashboard.module.scss";

export default function Dashboard() {
  const { user } = useAuth();
  const {
    execute: getStatistics,
    loading: statsLoading,
    data: statsResponse,
  } = useApi(dashService.getStatistics);
  const {
    execute: getProjects,
    loading: projectsLoading,
    data: projectsResponse,
  } = useApi(dashService.getAssignedProjects);

  const isAdmin = user?.role === "admin" || user?.role === "super-admin";
  const isRegularUser = user?.role === "user";

  // Extract the actual data from the Axios response
  const stats = statsResponse?.data; // now of type Statistics | undefined
  const allProjects = projectsResponse?.data?.data || [];
  const assignedProjects = allProjects.filter((p: any) =>
    p.members?.some((m: any) => m.userId === user?.id)
  );

  useEffect(() => {
    if (isAdmin) {
      getStatistics();
    } else if (isRegularUser) {
      getProjects();
    }
  }, [isAdmin, isRegularUser, getStatistics, getProjects]);

  const isLoading = (isAdmin && statsLoading) || (isRegularUser && projectsLoading);
  if (isLoading) return <div className={styles.loading}>Loading dashboard...</div>;

  // Regular user view
  if (isRegularUser) {
    return (
      <div className={styles.container}>
        <h1>Welcome back, {user?.name} ({user?.role})</h1>
        <div className={styles.card}>
          <h2>Your Profile</h2>
          <p><strong>Email:</strong> {user?.email}</p>
          <p>
            <strong>Status:</strong>{" "}
            <Badge variant={user?.isActive ? "success" : "danger"}>
              {user?.isActive ? "Active" : "Inactive"}
            </Badge>
          </p>
        </div>
        <div className={styles.card}>
          <h2>Your Assigned Projects ({assignedProjects.length})</h2>
          {assignedProjects.length === 0 ? (
            <p>No projects assigned.</p>
          ) : (
            <ul>
              {assignedProjects.map((p: any) => (
                <li key={p.id}>
                  {p.name} – {p.status} – {p.progress}%
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  // Admin / Super Admin view
  return (
    <div className={styles.container}>
      <h1>Welcome back, {user?.name} ({user?.role})</h1>
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
                <span className={styles.statCount}>{count}</span>
              </div>
            ))}
        </div>
        <div className={styles.card}>
          <h3>By Priority</h3>
          {stats?.byPriority &&
            Object.entries(stats.byPriority).map(([priority, count]) => (
              <div key={priority} className={styles.statItem}>
                <span className={styles.statLabel}>{priority}</span>
                <span className={styles.statCount}>{count}</span>
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