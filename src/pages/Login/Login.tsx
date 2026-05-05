import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/Input/Input";
import { Button } from "@/components/Button/Button";
import styles from "./Login.module.scss";
import { authService } from "@/services/authService";
import { loginSchema, type LoginFormData } from "@/schemas/auth.schema";
import { useApi } from "@/hooks/useApi";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { execute: loginApi, loading } = useApi(authService.login);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await loginApi(data.email, data.password);
    if (result) {
      const { access_token, user } = result.data;
      login(access_token, user);
      toast.success(`Welcome back, ${user.name}!`);
      navigate("/dashboard");
    } else {
      reset(data);
      setError("root", { message: "Invalid email or password" });
    }
  };

  const isButtonDisabled = loading || !isDirty;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Project Management System</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email"
            {...register("email")}
            error={errors.email?.message}
            autoComplete="off"
          />
          <Input
            label="Password"
            type="password"
            {...register("password")}
            error={errors.password?.message}
            autoComplete="off"
          />
          {errors.root && (
            <div className={styles.error}>{errors.root.message}</div>
          )}
          <Button type="submit" loading={loading} disabled={isButtonDisabled}>
            Login
          </Button>
        </form>
        <div className={styles.testCreds}>Forgot Password?</div>
      </div>
    </div>
  );
}
