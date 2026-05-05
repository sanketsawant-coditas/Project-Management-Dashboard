import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/Badge/Badge";
import { useApi } from "@/hooks/useApi";
import { dashService } from "@/services/dashService";
import styles from "./Dashboard.module.scss";

export default function UserDashboard() {
  const { user } = useAuth();

  const {
    execute: getProjects,
    loading: projectsLoading,
    data: projectsResponse,
    error: projectsError,
  } = useApi(dashService.getAssignedProjects);

  const allProjects = projectsResponse?.data?.data || [];
  const assignedProjects = allProjects.filter((p: any) =>
    p.members?.some((m: any) => m.userId === user?.id),
  );

  useEffect(() => {
    getProjects();
  }, [user?.role]);

  if (projectsLoading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  if (projectsError) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>
          ⚠️ Failed to load your assigned projects. Please refresh the page.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>
        Welcome back, {user?.name} ({user?.role})
      </h1>

      <div className={styles.card}>
        <h2>Your Profile</h2>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
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
