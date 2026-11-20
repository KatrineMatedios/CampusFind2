import api from "@/lib/axios";
import type { Item, ItemStatus, ItemType } from "@/types/item";
import type { UserRole } from "@/types/user";
import type {
  AdminListResponse,
  AdminStats,
  AdminUser,
  AdminUserPayload,
  AuditLog,
  Flag,
  FlagStatus,
  SettingsMap,
} from "@/types/admin";

export interface AdminUserFilters {
  search?: string;
  role?: UserRole | "";
  status?: "active" | "inactive" | "";
  page?: number;
  per_page?: number;
}

export interface AdminItemFilters {
  search?: string;
  type?: ItemType | "";
  category?: number | string | "";
  status?: ItemStatus | "";
  page?: number;
  per_page?: number;
}

export interface AdminFlagFilters {
  search?: string;
  status?: FlagStatus | "";
  page?: number;
  per_page?: number;
}

export interface AdminActivityFilters {
  search?: string;
  action?: string;
  page?: number;
  per_page?: number;
}

// Dashboard
export const getStats = () =>
  api.get<AdminStats>("/admin/stats").then((r) => r.data);

// Users
export const getUsers = (params?: AdminUserFilters) =>
  api.get<AdminListResponse<AdminUser>>("/admin/users", { params }).then((r) => r.data);

export const createUser = (payload: AdminUserPayload) =>
  api.post<{ data: AdminUser; message: string }>("/admin/users", payload).then((r) => r.data);

export const updateUser = (id: number, payload: AdminUserPayload) =>
  api.put<{ data: AdminUser; message: string }>(`/admin/users/${id}`, payload).then((r) => r.data);

export const updateUserStatus = (id: number, is_active: boolean) =>
  api.patch<{ data: AdminUser; message: string }>(`/admin/users/${id}/status`, { is_active })
    .then((r) => r.data);

export const deleteUser = (id: number) =>
  api.delete<{ message: string }>(`/admin/users/${id}`).then((r) => r.data);

// Items / reports
export const getAdminItems = (params?: AdminItemFilters) =>
  api.get<AdminListResponse<Item>>("/admin/items", { params }).then((r) => r.data);

export const updateAdminItem = (
  id: number,
  payload: Partial<{
    name: string;
    category_id: number;
    date_reported: string;
    location: string;
    description: string;
    status: ItemStatus;
  }>,
) => api.put<{ data: Item; message: string }>(`/admin/items/${id}`, payload).then((r) => r.data);

export const updateAdminItemStatus = (id: number, status: ItemStatus) =>
  api.patch<{ data: Item; message: string }>(`/admin/items/${id}/status`, { status })
    .then((r) => r.data);

export const deleteAdminItem = (id: number) =>
  api.delete<{ message: string }>(`/admin/items/${id}`).then((r) => r.data);

// Flags
export const getFlags = (params?: AdminFlagFilters) =>
  api.get<AdminListResponse<Flag>>("/admin/flags", { params }).then((r) => r.data);

export const flagItem = (payload: { item_id: number; reason: string; details?: string }) =>
  api.post<{ data: Flag; message: string }>("/admin/flags", payload).then((r) => r.data);

export const updateFlag = (
  id: number,
  payload: { status: FlagStatus; admin_note?: string },
) =>
  api.patch<{ data: Flag; message: string }>(`/admin/flags/${id}`, payload).then((r) => r.data);

// Audit logs
export const getActivity = (params?: AdminActivityFilters) =>
  api.get<AdminListResponse<AuditLog>>("/admin/activity", { params }).then((r) => r.data);

// Settings
export const getSettings = () =>
  api.get<{ data: SettingsMap }>("/admin/settings").then((r) => r.data.data);

export const saveSettings = (settings: SettingsMap) =>
  api.put<{ data: SettingsMap; message: string }>("/admin/settings", { settings })
    .then((r) => r.data);

// Platform notices (broadcast notification to all active users)
export const sendNotice = (payload: { title: string; message: string }) =>
  api.post<{ message: string }>("/admin/notices", payload).then((r) => r.data);
