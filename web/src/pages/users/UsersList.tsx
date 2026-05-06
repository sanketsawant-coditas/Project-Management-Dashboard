import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/Button/Button";
import { Badge } from "@/components/Badge/Badge";
import UserForm from "./UserForm";
import { useUsers } from "@/hooks/useUsers";
import { userService } from "@/services/userService";
import styles from "./UsersList.module.scss";
import { Navigate } from "react-router-dom";
import { useApi } from "@/hooks/useApi";
import toast from "react-hot-toast"; 
import type User from "@/types/user.types";

export default function UsersList() {
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { users, totalPages, loading, refetch } = useUsers(page, 10, roleFilter);

  const { execute: deleteUser, loading: isDeleting } = useApi(userService.deleteUser);
  const { execute: toggleStatus, loading: isToggling } = useApi(userService.toggleStatus);

  const isSuperAdmin = currentUser?.role === "super-admin";
  const isAdmin = currentUser?.role === "admin";

  const filteredUsers = useMemo(() => {
    if (!debouncedSearch.trim()) return users;
    const lowerSearch = debouncedSearch.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(lowerSearch) ||
        u.email.toLowerCase().includes(lowerSearch)
    );
  }, [users, debouncedSearch]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete user?")) return;
    const result = await deleteUser(id);
    if (result) {
      toast.success("User deleted successfully");
      refetch();
    }
  };

  const handleToggleStatus = async (id: string) => {
    const result = await toggleStatus(id);
    if (result) {
      toast.success("Status toggled successfully");
      refetch();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (!isSuperAdmin && !isAdmin) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Users</h1>
        {(isSuperAdmin || isAdmin) && (
          <Button onClick={() => { setEditingUser(null); setShowForm(true); }}>
            Create User
          </Button>
        )}
      </div>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="super-admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      {loading && <div>Loading...</div>}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <Badge variant={u.role === "super-admin" ? "warning" : u.role === "admin" ? "success" : "default"}>
                  {u.role}
                </Badge>
              </td>
              <td>
                <Badge variant={u.isActive ? "success" : "danger"}>
                  {u.isActive ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td>
                {(isSuperAdmin || isAdmin) && (
                  <Button variant="secondary" onClick={() => { setEditingUser(u); setShowForm(true); }}>
                    Edit
                  </Button>
                )}
                {(isSuperAdmin || isAdmin) && (
                  <Button variant="secondary" onClick={() => handleToggleStatus(u.id)} disabled={isToggling}>
                    Toggle Status
                  </Button>
                )}
                {isSuperAdmin && (
                  <Button variant="danger" onClick={() => handleDelete(u.id)} disabled={isDeleting}>
                    Delete
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>

      {showForm && (
        <UserForm
          key={editingUser?.id || "create"}
          user={editingUser}
          onClose={() => {
            setShowForm(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}