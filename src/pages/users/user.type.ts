import type User from "@/types/user.types";

export interface UserFormProps {
  user?: User | null;
  onClose: () => void;
}