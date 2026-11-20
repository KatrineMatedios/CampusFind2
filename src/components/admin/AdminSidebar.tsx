import { NavLink, Link } from "react-router-dom";
import {
  Bell,
  FileText,
  Flag,
  Home,
  LogOut,
  Megaphone,
  Package,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { roleLabel } from "@/lib/formatAdmin";

export const ADMIN_NAV = [
  { to: "/admin", label: "Home", icon: Home, end: true },
  { to: "/admin/users", label: "User Management", icon: Users, end: false },
  { to: "/admin/reports", label: "Manage Reports", icon: FileText, end: false },
  { to: "/admin/flags", label: "Flagged & Disputes", icon: Flag, end: false },
  { to: "/admin/items", label: "All Items Database", icon: Package, end: false },
  { to: "/admin/audit", label: "Audit Logs", icon: ShieldCheck, end: false },
  { to: "/admin/settings", label: "System Settings", icon: Settings, end: false },
  { to: "/admin/notifications", label: "Notifications", icon: Bell, end: false },
];

interface AdminSidebarProps {
  onCreateNotice?: () => void;
  onNavigate?: () => void;
  className?: string;
}

export default function AdminSidebar({ onCreateNotice, onNavigate, className }: AdminSidebarProps) {
  const { user, logout } = useAuth();

  const content = (
    <div className="flex h-full flex-col bg-brand-brown text-white">
      {/* Brand */}
      <div className={cn("flex items-start justify-between gap-2 px-5 pb-4 pt-6", !onNavigate && "pt-8")}>
        <Link to="/admin" className="flex items-center gap-2.5" onClick={onNavigate}>
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-brown shadow-sm">
            <ShieldCheck size={22} strokeWidth={2.25} />
          </span>
          <span className="leading-none">
            <span className="block text-lg font-bold tracking-tight text-white">CampusFind</span>
            <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.2em] text-white/60">
              Lost &amp; Found
            </span>
          </span>
        </Link>
        {onNavigate ? (
          <button
            type="button"
            onClick={onNavigate}
            className="rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        ) : null}
      </div>

      {/* Create notice */}
      <div className="px-5 pb-5">
        <Button
          type="button"
          fullWidth
          leftIcon={<Megaphone size={16} />}
          className="bg-white text-brand-brown shadow-sm hover:bg-brand-cream"
          onClick={() => {
            onCreateNotice?.();
            onNavigate?.();
          }}
        >
          Create Notice
        </Button>
      </div>

      {/* Navigation */}
      <nav className="no-scrollbar flex-1 space-y-1 overflow-y-auto px-3" aria-label="Admin navigation">
        {ADMIN_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition",
                isActive
                  ? "bg-brand-brown-dark text-white shadow-sm"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
              )
            }
          >
            <item.icon size={17} className="shrink-0" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Admin profile */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
          <Avatar name={user?.full_name ?? "Admin User"} size="sm" className="ring-white/30" />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-xs font-bold text-white">{user?.full_name ?? "Admin User"}</p>
            <p className="mt-0.5 truncate text-[10px] font-medium text-white/60">
              {roleLabel(user?.role)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            className="rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <aside className={cn("w-64 shrink-0", className)} aria-label="Admin sidebar">
      {content}
    </aside>
  );
}
