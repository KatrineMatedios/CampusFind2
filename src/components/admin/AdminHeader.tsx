import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import Avatar from "@/components/ui/Avatar";
import * as notificationService from "@/services/notificationService";
import { roleLabel } from "@/lib/formatAdmin";

const TITLES: Array<[string, string]> = [
  ["/admin/users", "User Management"],
  ["/admin/reports", "Manage Reports"],
  ["/admin/flags", "Flagged & Disputes"],
  ["/admin/items", "All Items Database"],
  ["/admin/audit", "Audit Logs"],
  ["/admin/settings", "System Settings"],
  ["/admin/notifications", "Notifications"],
  ["/admin", "Admin Dashboard"],
];

export default function AdminHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [unread, setUnread] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    notificationService
      .getNotifications()
      .then((r) => {
        if (active) setUnread(r.unread);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [pathname]);

  const title = TITLES.find(([prefix]) => pathname.startsWith(prefix))?.[1] ?? "Admin Dashboard";

  return (
    <header className="sticky top-0 z-30 border-b border-brand-sand/70 bg-brand-cream/95 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3 lg:px-8 lg:py-4">
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-brown shadow-sm ring-1 ring-brand-sand/70 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        <h1 className="hidden min-w-0 truncate text-base font-bold text-stone-800 sm:block lg:text-lg">
          {title}
        </h1>

        <form
          className="relative ml-auto hidden max-w-md flex-1 sm:block lg:max-w-lg"
          onSubmit={(event) => {
            event.preventDefault();
            navigate(`/admin/items${query.trim() ? `?search=${encodeURIComponent(query.trim())}` : ""}`);
          }}
        >
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search reports, users, audit logs..."
            className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-xs text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-brand-brown focus:ring-2 focus:ring-brand-brown/15"
            aria-label="Search reports, users, audit logs"
          />
        </form>

        <div className="ml-auto flex items-center gap-2 sm:ml-0">
          <Link
            to="/admin/notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white text-stone-600 shadow-sm ring-1 ring-brand-sand/70 transition hover:text-brand-brown"
            aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
          >
            <Bell size={17} />
            {unread > 0 ? (
              <span
                className={cn(
                  "absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white",
                )}
              >
                {unread > 9 ? "9+" : unread}
              </span>
            ) : null}
          </Link>

          <div className="flex items-center gap-2.5 rounded-xl bg-white px-2.5 py-1.5 shadow-sm ring-1 ring-brand-sand/70">
            <Avatar name={user?.full_name ?? "Admin User"} size="sm" className="h-8 w-8" />
            <div className="hidden leading-tight sm:block">
              <p className="text-xs font-bold text-stone-800">{user?.full_name ?? "Admin User"}</p>
              <p className="text-[10px] font-medium text-stone-500">{roleLabel(user?.role)}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
