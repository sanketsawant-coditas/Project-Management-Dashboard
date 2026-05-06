import type User from "@/types/user.types";

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
