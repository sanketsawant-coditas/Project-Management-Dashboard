import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/Badge/Badge";
import styles from "./Profile.module.scss";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.avatar}>👤</div>
          <h1>{user.name}</h1>
          <Badge
            variant={
              user.role === "super-admin"
                ? "warning"
                : user.role === "admin"
                  ? "success"
                  : "default"
            }
          >
            {user.role}
          </Badge>
        </div>
        <div className={styles.info}>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <Badge variant={user.isActive ? "success" : "danger"}>
              {user.isActive ? "Active" : "Inactive"}
            </Badge>
          </p>
          <p>
            <strong>Member since:</strong>{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Optional: show assigned projects – you can add this later */}
    </div>
  );
}
