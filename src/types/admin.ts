import type { Item } from "./item";
import type { User, UserRole } from "./user";

export type AdminUser = User & { is_active: boolean };

export type FlagStatus = "open" | "resolved" | "dismissed";

export interface Flag {
  id: number;
  item_id: number;
  item?: Item;
  reason: string;
  details: string | null;
  status: FlagStatus;
  admin_note: string | null;
  reported_by: number | null;
  reporter?: User | null;
  resolved_by: number | null;
  resolver?: User | null;
  resolved_at: string | null;
  created_at: string;
}

export interface AdminStats {
  lost: number;
  found: number;
  resolved: number;
  total_items: number;
  users: number;
  active_users: number;
  open_flags: number;
  pending_claims: number;
}

export interface AuditLog {
  id: number;
  action: string;
  description: string;
  user_id: number;
  user: {
    id: number;
    full_name: string;
    role: UserRole;
    avatar_url: string | null;
  } | null;
  item_id: number | null;
  item_name: string | null;
  created_at: string;
}

export type SettingsMap = Record<string, string>;

export interface AdminListMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface AdminListResponse<T> {
  data: T[];
  meta: AdminListMeta;
}

export interface AdminUserPayload {
  first_name: string;
  last_name: string;
  student_id: string;
  email: string;
  college_program?: string | null;
  contact_number?: string | null;
  role: UserRole;
  password?: string;
}
