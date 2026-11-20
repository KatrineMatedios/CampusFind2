import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, Search, UserRound } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";
import { getNotifications } from "@/services/notificationService";

function titleFor(pathname: string) {
  if (pathname === "/") return "Dashboard";
  if (pathname.startsWith("/browse")) return "Browse Items";
  if (pathname.startsWith("/report")) return "Report an Item";
  if (pathname.startsWith("/items/lost")) return "Lost Items";
  if (pathname.startsWith("/items/found")) return "Found Items";
  if (/^\/items\/[^/]+\/claim/.test(pathname)) return "Verify Ownership";
  if (pathname.startsWith("/items/")) return "Item Details";
  if (pathname.startsWith("/my-reports")) return "My Reports";
  if (pathname.startsWith("/resolved")) return "Resolved Items";
  if (pathname.startsWith("/profile/personal-information")) return "Personal Information";
  if (pathname.startsWith("/profile/activity")) return "Activity History";
  if (pathname.startsWith("/profile")) return "My Profile";
  if (pathname.startsWith("/notifications")) return "Notifications";
  if (pathname.startsWith("/help")) return "Help & Support";
  return "CampusFind";
}

export default function DesktopHeader() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
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

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const term = query.trim();
    navigate(term ? `/browse?search=${encodeURIComponent(term)}` : "/browse");
  };

  return (
    <header className="sticky top-0 z-30 hidden border-b border-brand-sand/70 bg-brand-cream/85 px-8 py-3.5 backdrop-blur lg:block">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-6">
        <div className="min-w-0 shrink-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">
            CampusFind
          </p>
          <h1 className="truncate text-lg font-bold leading-tight text-stone-800">
            {titleFor(location.pathname)}
          </h1>
        </div>

        <form onSubmit={handleSearch} className="ml-auto w-full max-w-sm">
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the campus feed…"
            icon={<Search size={16} />}
            aria-label="Search items"
            className="bg-white/80"
          />
        </form>

        <div className="flex shrink-0 items-center gap-1.5">
          <Link
            to="/notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-stone-600 transition hover:bg-brand-sand/60"
            aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
          >
            <Bell size={19} />
            {unread > 0 ? (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-brown px-1 text-[9px] font-bold text-white">
                {unread > 9 ? "9+" : unread}
              </span>
            ) : null}
          </Link>
          <Link
            to="/profile"
            aria-label="Open profile"
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition hover:bg-brand-sand/50"
          >
            <Avatar
              src={user?.avatar_url}
              name={user?.full_name ?? "CampusFind"}
              size="sm"
              className="ring-2 ring-brand-sand"
            />
            <span className="hidden text-left xl:block">
              <span className="block max-w-[9rem] truncate text-xs font-semibold text-stone-700">
                {user?.full_name}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-stone-400">
                <UserRound size={10} />
                {user?.role === "staff" ? "Staff" : user?.student_id}
              </span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
