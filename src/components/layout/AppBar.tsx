import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Bell,
  BookOpenCheck,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Home,
  LogOut,
  Menu,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import Avatar from "@/components/ui/Avatar";
import BrandLogo from "@/components/ui/BrandLogo";
import { cn } from "@/lib/utils";
import { getNotifications } from "@/services/notificationService";

const menuLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/browse", label: "Browse Items", icon: Search },
  { to: "/my-reports", label: "My Reports", icon: ClipboardList },
  { to: "/resolved", label: "Resolved Items", icon: BookOpenCheck },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/help", label: "Help & Support", icon: CircleHelp },
];

export default function AppBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let active = true;
    if (!user) return;

    getNotifications()
      .then((response) => {
        if (active) setUnread(response.unread);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [user]);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-brand-sand/70 bg-brand-cream/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-stone-600 transition hover:bg-brand-sand/60"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <BrandLogo compact />
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              to="/notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-stone-600 transition hover:bg-brand-sand/60"
              aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
            >
              <Bell size={19} />
              {unread > 0 ? (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-brown px-1 text-[9px] font-bold text-white">
                  {unread > 9 ? "9+" : unread}
                </span>
              ) : null}
            </Link>
            <Link to="/profile" aria-label="Open profile">
              <Avatar
                src={user?.avatar_url}
                name={user?.full_name ?? "CampusFind"}
                size="sm"
                className="ring-2 ring-brand-sand"
              />
            </Link>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-stone-900/40"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 flex w-[78%] max-w-xs flex-col bg-brand-cream p-5 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <BrandLogo />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="rounded-full p-1.5 text-stone-500 transition hover:bg-brand-sand"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-5 flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-brand-sand/80">
              <Avatar
                src={user?.avatar_url}
                name={user?.full_name ?? "CampusFind"}
                size="md"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-stone-800">
                  {user?.full_name}
                </p>
                <p className="truncate text-[11px] text-stone-500">
                  {user?.college_program ?? user?.student_id}
                </p>
              </div>
            </div>

            <nav className="flex-1 space-y-1">
              {menuLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                      isActive
                        ? "bg-brand-brown text-white"
                        : "text-stone-600 hover:bg-brand-sand/60",
                    )
                  }
                >
                  <Icon size={17} />
                  <span className="flex-1">{label}</span>
                  <ChevronRight size={14} className="opacity-50" />
                </NavLink>
              ))}
              <NavLink
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-brand-sand/60"
              >
                <UserRound size={17} />
                <span className="flex-1">My Profile</span>
                <ChevronRight size={14} className="opacity-50" />
              </NavLink>
            </nav>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              <LogOut size={17} />
              Logout
            </button>
          </aside>
        </div>
      ) : null}
    </>
  );
}
