export type UserRole = "student" | "staff" | "admin";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  student_id: string;
  email: string;
  college_program: string | null;
  contact_number: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_active?: boolean;
  created_at: string;
}

export interface ProfileStats {
  reports: number;
  resolved: number;
  lost: number;
  found: number;
  claims: number;
  unread_notifications: number;
}

export interface ProfileResponse {
  data: User;
  stats: ProfileStats;
}

export interface ActivityEntry {
  id: number;
  action: string;
  description: string;
  item_id: number | null;
  item_name: string | null;
  item_type: "lost" | "found" | null;
  item_status: "open" | "claim_pending" | "resolved" | null;
  created_at: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
  remember?: boolean;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  student_id: string;
  email: string;
  password: string;
  password_confirmation: string;
  terms_accepted: boolean;
}
