import type { UserRole } from "@/types/user";

export function roleLabel(role: UserRole | undefined | null): string {
  if (role === "admin") return "System Administrator";
  if (role === "staff") return "Lost & Found Staff";
  return "Student";
}

export function flagCode(id: number): string {
  return `FLAG-${String(id).padStart(4, "0")}`;
}

export function reportCode(id: number): string {
  return `RPT-${String(id).padStart(4, "0")}`;
}

export function auditActionLabel(action: string): string {
  return action
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
