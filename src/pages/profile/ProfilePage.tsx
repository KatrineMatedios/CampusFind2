import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  BookOpenCheck,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  History,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import Avatar from "@/components/ui/Avatar";
import PageHeader from "@/components/ui/PageHeader";
import Spinner from "@/components/ui/Spinner";
import Alert from "@/components/ui/Alert";
import { getErrorMessage } from "@/lib/format";
import { getProfile } from "@/services/profileService";
import type { ProfileResponse, User } from "@/types/user";

const menuItems = [
  {
    to: "/profile/personal-information",
    label: "Personal Information",
    description: "Name, program, contact details",
    icon: UserRound,
  },
  {
    to: "/profile/activity",
    label: "My Activity History",
    description: "Reports and status updates",
    icon: History,
  },
  {
    to: "/notifications",
    label: "Notifications",
    description: "Claims and campus updates",
    icon: Bell,
  },
  {
    to: "/resolved",
    label: "Resolved Items",
    description: "Items successfully returned",
    icon: BookOpenCheck,
  },
  {
    to: "/help",
    label: "Help & Support",
    description: "FAQs and contact options",
    icon: CircleHelp,
  },
];

export default function ProfilePage() {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getProfile()
      .then((response) => {
        if (!active) return;
        setProfile(response);
        setUser(response.data);
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [setUser]);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const currentUser: User | null = profile?.data ?? user;
  const stats = profile?.stats;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <PageHeader title="My Profile" subtitle="Manage your account and activity." />

      {error ? <Alert variant="error" className="mb-4">{error}</Alert> : null}

      {loading ? (
        <Spinner label="Loading profile…" className="py-20" />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-5">
          <div className="space-y-4">
            <section className="relative overflow-hidden rounded-3xl bg-brand-brown p-5 text-white shadow-lg shadow-brand-brown/20 lg:p-6">
              <div
                className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10"
                aria-hidden="true"
              />
              <div className="relative flex items-center gap-4">
                <div className="relative">
                  <Avatar
                    src={currentUser?.avatar_url}
                    name={currentUser?.full_name ?? "Student"}
                    size="xl"
                    className="ring-4 ring-white/20"
                  />
                  <Link
                    to="/profile/personal-information"
                    className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-brand-brown shadow"
                    aria-label="Edit profile photo"
                  >
                    <Pencil size={12} />
                  </Link>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="truncate text-xl font-bold leading-tight lg:text-2xl">
                    {currentUser?.full_name}
                  </h1>
                  <p className="mt-0.5 truncate text-[11px] text-white/75 lg:text-xs">
                    {currentUser?.college_program ?? "Student"}
                  </p>
                  <p className="mt-1 text-[10px] font-medium text-white/60">
                    Student ID: {currentUser?.student_id}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-[10px] text-white/60">
                    <Mail size={10} /> {currentUser?.email}
                  </p>
                </div>
              </div>

              <div className="relative mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white/10 px-3 py-2.5 text-center backdrop-blur">
                  <p className="text-lg font-bold">{stats?.reports ?? 0}</p>
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-white/60">
                    My Reports
                  </p>
                </div>
                <div className="rounded-xl bg-white/10 px-3 py-2.5 text-center backdrop-blur">
                  <p className="text-lg font-bold">{stats?.resolved ?? 0}</p>
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-white/60">
                    Resolved
                  </p>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-3 gap-2">
              <Link
                to="/report"
                className="rounded-2xl border border-brand-sand/80 bg-white p-3 text-center shadow-sm transition hover:shadow-md"
              >
                <ClipboardList size={17} className="mx-auto text-brand-brown" />
                <p className="mt-1 text-[10px] font-semibold text-stone-600">Report Item</p>
              </Link>
              <Link
                to="/my-reports"
                className="rounded-2xl border border-brand-sand/80 bg-white p-3 text-center shadow-sm transition hover:shadow-md"
              >
                <ShieldCheck size={17} className="mx-auto text-brand-brown" />
                <p className="mt-1 text-[10px] font-semibold text-stone-600">My Reports</p>
              </Link>
              <Link
                to="/browse"
                className="rounded-2xl border border-brand-sand/80 bg-white p-3 text-center shadow-sm transition hover:shadow-md"
              >
                <MapPin size={17} className="mx-auto text-brand-brown" />
                <p className="mt-1 text-[10px] font-semibold text-stone-600">Browse</p>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <section className="overflow-hidden rounded-2xl border border-brand-sand/80 bg-white shadow-sm">
              {menuItems.map(({ to, label, description, icon: Icon }, index) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-3 px-4 py-3 transition hover:bg-brand-cream ${
                    index > 0 ? "border-t border-brand-sand/60" : ""
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-sand/50 text-brand-brown">
                    <Icon size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 text-xs font-semibold text-stone-700">
                      {label}
                      {to === "/notifications" && (stats?.unread_notifications ?? 0) > 0 ? (
                        <span className="rounded-full bg-brand-brown px-1.5 text-[9px] font-bold text-white">
                          {stats?.unread_notifications}
                        </span>
                      ) : null}
                    </span>
                    <span className="block text-[10px] text-stone-400">{description}</span>
                  </span>
                  <ChevronRight size={15} className="text-stone-300" />
                </Link>
              ))}
            </section>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-600 transition hover:bg-red-100"
            >
              <LogOut size={15} /> Logout
            </button>

            <p className="text-center text-[10px] text-stone-400">
              CampusFind · Student Lost &amp; Found System
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
