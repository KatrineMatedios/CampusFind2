import api from "@/lib/axios";
import type {
  LoginPayload,
  RegisterPayload,
  User,
} from "@/types/user";

interface AuthResponse {
  user: User;
  token: string;
}

export const login = (payload: LoginPayload) =>
  api.post<AuthResponse>("/login", payload).then((r) => r.data);

export const register = (payload: RegisterPayload) =>
  api.post<AuthResponse>("/register", payload).then((r) => r.data);

export const me = () =>
  api.get<{ data: User }>("/me").then((r) => r.data.data);

export const logout = () => api.post("/logout").then((r) => r.data);

export const forgotPassword = (identifier: string) =>
  api
    .post<{ message: string; email?: string }>("/forgot-password", { identifier })
    .then((r) => r.data);

export const resetPassword = (payload: {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}) => api.post("/reset-password", payload).then((r) => r.data);
