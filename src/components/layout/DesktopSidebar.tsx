import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Bell,
  BookOpenCheck,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  HandHeart,
  Home,
  LayoutDashboard,
  LogOut,
  PackageSearch,
  Plus,
  Search,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import Avatar from "@/components/ui/Avatar";
import BrandLogo from "@/components/ui/BrandLogo";
import { cn } from "@/lib/utils";
import { getNotifications } from "@/services/notificationService";

const navigation = [
  { to: "/", label: "Home", icon: Home },
  { to: "/browse", label: "Browse Items", icon: Search },
  { to: "/items/lost", label: "Lost Items", icon: PackageSearch },
  { to: "/items/found", label: "Found Items", icon: HandHeart },
  { to: "/my-reports", label: "My Reports", icon: ClipboardList },
  { to: "/resolved", label: "Resolved Items", icon: BookOpenCheck },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/help", label: "Help & Support", icon: CircleHelp },
];

export default function DesktopSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-brand-sand/70 bg-white/85 px-4 py-6 backdrop-blur lg:flex">
      <div className="px-2">
        <BrandLogo />
      </div>

      <Link
        to="/report"
        className="mt-7 flex items-center justify-center gap-2 rounded-2xl bg-brand-brown px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-brown/20 transition hover:bg-brand-brown-dark"
      >
        <Plus size={17} strokeWidth={2.5} /> Report an Item
      </Link>

      <nav className="mt-6 flex-1 space-y-1 overflow-y-auto no-scrollbar">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">
          Menu
        </p>
        {navigation.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                isActive
                  ? "bg-brand-brown text-white shadow-sm"
                  : "text-stone-600 hover:bg-brand-sand/50 hover:text-stone-800",
              )
            }
          >
            <Icon size={17} />
            <span className="flex-1">{label}</span>
            {to === "/notifications" && unread > 0 ? (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-brown px-1.5 text-[10px] font-bold text-white">
                {unread > 9 ? "9+" : unread}
              </span>
            ) : null}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 border-t border-brand-sand/70 pt-4">
        {user?.role === "admin" || user?.role === "staff" ? (
          <Link
            to="/admin"
            className="mb-2 flex items-center gap-3 rounded-xl bg-brand-brown px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-brown-dark"
          >
            <LayoutDashboard size={17} /> Admin Dashboard
          </Link>
        ) : null}
        <Link
          to="/profile"
          className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-brand-cream"
        >
          <Avatar
            src={user?.avatar_url}
            name={user?.full_name ?? "CampusFind"}
            size="md"
            className="ring-2 ring-brand-sand"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-stone-800">
              {user?.full_name}
            </p>
            <p className="truncate text-[11px] text-stone-500">
              {user?.role === "staff"
                ? "Lost & Found Staff"
                : user?.college_program ?? user?.student_id}
            </p>
          </div>
          <ChevronRight size={15} className="shrink-0 text-stone-300" />
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={17} /> Log out
        </button>
      </div>
    </aside>
  );
}
