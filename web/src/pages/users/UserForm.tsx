import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";
import { Button } from "@/components/Button/Button";
import styles from "./UserForm.module.scss";
import type { UserFormProps } from "./user.type";
import { userSchema, type UserFormData } from "@/schemas/user.schema";
import { useApi } from "@/hooks/useApi";
import { userService } from "@/services/userService";
import toast from "react-hot-toast";

export default function UserForm({ user, onClose }: UserFormProps) {
  const { user: currentUser } = useAuth();
  const isEditMode = !!user;

  const {execute: createUser, loading: isCreating } = useApi(userService.create);
  const {execute: updateUser, loading: isUpdating } = useApi(userService.update);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
      isActive: true,
    },
  });
  //
  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("role", user.role as "user" | "admin" | "super-admin");
      setValue("isActive", user.isActive);
      setValue("password", "");
    }
  }, [user, setValue]);

  const onSubmit = async (data: UserFormData) => {
    if(isEditMode){
      const payload = {
        name: data.name,
        email: data.email,
        role: data.role,
        isActive: data.isActive,
        ...(data.password) ? {password: data.password} : {},
      }
      const result = await updateUser(user!.id, payload);
      if(result){
        toast.success("User updated sucessfully");
        onClose();
      }
    }else{
     const result = await createUser({
        name: data.name,
        email: data.email,
        password: data.password!,
        role: data.role,
      });
      if (result) {
        toast.success("User created successfully");
        onClose();
      }
    }
  };

  const isLoading = isSubmitting || isCreating || isUpdating


  const getRoleOptions = () => {
    if (currentUser?.role === "super-admin") {
      return ["user", "admin", "super-admin"] as const;
    }
    if (currentUser?.role === "admin") {
      return ["user", "admin"] as const;
    }
    return ["user"] as const;
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>{isEditMode ? "Edit User" : "Create User"}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input type="text" placeholder="Name" {...register("name")} />
            {errors.name && (
              <span className={styles.error}>{errors.name.message}</span>
            )}
          </div>

          <div>
            <input type="email" placeholder="Email" {...register("email")} />
            {errors.email && (
              <span className={styles.error}>{errors.email.message}</span>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder={user ? "New password (optional)" : "Password"}
              {...register("password")}
            />
            {errors.password && (
              <span className={styles.error}>{errors.password.message}</span>
            )}
          </div>

          <div>
            <select {...register("role")}>
              {getRoleOptions().map((role) => (
                <option key={role} value={role}>
                  {role === "super-admin"
                    ? "Super Admin"
                    : role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
            {errors.role && (
              <span className={styles.error}>{errors.role.message}</span>
            )}
          </div>

          {isEditMode  && (
            <div className={styles.checkboxGroup}>
              <label>
                <input type="checkbox" {...register("isActive")} />
                Active
              </label>
            </div>
          )}

          <div className={styles.buttons}>
            <Button type="submit" loading={isSubmitting}>
              {isEditMode  ? "Update" : "Create"}
            </Button>
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
