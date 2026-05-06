import { useAuth } from "@/context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import styles from "./Dashboard.module.scss";

export default function Dashboard() {
  const { user } = useAuth();

  const isAdmin = user?.role === "admin" || user?.role === "super-admin";
  const isRegularUser = user?.role === "user";

  if (isAdmin) return <AdminDashboard />;
  if (isRegularUser) return <UserDashboard />;

  // Fallback: unknown role
  return (
    <div className={styles.container}>
      <p>Unknown role. Please contact support.</p>
    </div>
  );
}
