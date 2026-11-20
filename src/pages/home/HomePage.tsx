import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  ClipboardList,
  MapPin,
  PackageSearch,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import ItemCard from "@/components/items/ItemCard";
import Alert from "@/components/ui/Alert";
import EmptyState from "@/components/ui/EmptyState";
import { getErrorMessage } from "@/lib/format";
import {
  getDashboardStats,
  getRecentLost,
} from "@/services/itemService";
import type { DashboardStats, Item } from "@/types/item";

const quickActions = [
  {
    to: "/report",
    label: "Report Item",
    description: "Lost or found",
    icon: Plus,
    tone: "bg-brand-brown text-white",
  },
  {
    to: "/browse",
    label: "Browse Items",
    description: "Explore reports",
    icon: Search,
    tone: "bg-brand-sand text-brand-brown",
  },
  {
    to: "/my-reports",
    label: "My Reports",
    description: "Track updates",
    icon: ClipboardList,
    tone: "bg-[#F8D7D7] text-[#9B2C2C]",
  },
  {
    to: "/resolved",
    label: "Resolved",
    description: "Reunited items",
    icon: BookOpenCheck,
    tone: "bg-[#CDE8C8] text-[#2F6B2A]",
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([getDashboardStats(), getRecentLost()])
      .then(([statsResponse, recentResponse]) => {
        if (!active) return;
        setStats(statsResponse);
        setRecent(recentResponse);
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
  }, []);

  const firstName = user?.first_name ?? "Student";

  return (
    <div className="space-y-5 lg:space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-brand-brown p-5 text-white shadow-lg shadow-brand-brown/20 lg:p-8">
        <div
          className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10 lg:h-64 lg:w-64"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-16 right-16 h-32 w-32 rounded-full bg-white/5"
          aria-hidden="true"
        />
        <div className="relative lg:max-w-2xl">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60">
            <Sparkles size={12} /> Welcome back
          </p>
          <h1 className="mt-1 text-2xl font-bold leading-tight lg:text-4xl">Hi, {firstName}!</h1>
          <p className="mt-1.5 max-w-[16rem] text-xs leading-relaxed text-white/75 lg:max-w-none lg:text-sm">
            Lost something on campus? Report it or browse what others have found.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 lg:mt-6">
            <Link
              to="/report"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-brand-brown transition hover:bg-brand-cream lg:px-4 lg:py-2.5 lg:text-sm"
            >
              <Plus size={14} strokeWidth={2.5} /> Report Item
            </Link>
            <Link
              to="/browse"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/25 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-white/10 lg:px-4 lg:py-2.5 lg:text-sm"
            >
              <Search size={14} /> Browse
            </Link>
          </div>
        </div>
      </section>

      {error ? <Alert variant="error">{error}</Alert> : null}

      <section className="grid grid-cols-2 gap-3 lg:gap-4">
        <Link
          to="/items/lost"
          className="rounded-2xl border border-brand-sand/80 bg-white p-4 shadow-sm transition hover:shadow-md lg:p-5"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F8D7D7] text-[#9B2C2C] lg:h-10 lg:w-10">
              <PackageSearch size={17} />
            </span>
            <ArrowRight size={15} className="text-stone-300" />
          </div>
          <p className="mt-3 text-2xl font-bold text-stone-800 lg:text-3xl">
            {loading ? "—" : stats?.lost ?? 0}
          </p>
          <p className="text-[11px] font-semibold text-stone-500 lg:text-xs">Lost Items</p>
        </Link>

        <Link
          to="/items/found"
          className="rounded-2xl border border-brand-sand/80 bg-white p-4 shadow-sm transition hover:shadow-md lg:p-5"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#CDE8C8] text-[#2F6B2A] lg:h-10 lg:w-10">
              <TrendingUp size={17} />
            </span>
            <ArrowRight size={15} className="text-stone-300" />
          </div>
          <p className="mt-3 text-2xl font-bold text-stone-800 lg:text-3xl">
            {loading ? "—" : stats?.found ?? 0}
          </p>
          <p className="text-[11px] font-semibold text-stone-500 lg:text-xs">Found Items</p>
        </Link>
      </section>

      <section>
        <h2 className="mb-2.5 text-sm font-bold text-stone-800 lg:mb-3 lg:text-base">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {quickActions.map(({ to, label, description, icon: Icon, tone }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 rounded-2xl border border-brand-sand/80 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md lg:p-4"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}
              >
                <Icon size={18} />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-bold text-stone-800 lg:text-sm">{label}</span>
                <span className="block text-[10px] text-stone-400 lg:text-[11px]">{description}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-2.5 flex items-center justify-between lg:mb-3">
          <h2 className="text-sm font-bold text-stone-800 lg:text-base">Recent Lost Items</h2>
          <Link
            to="/items/lost"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-brown hover:underline"
          >
            View All <ArrowRight size={12} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {[0, 1].map((index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-2xl border border-brand-sand/80 bg-white"
              />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <EmptyState
            icon={<PackageSearch size={22} />}
            title="No lost items reported yet"
            description="Be the first to report a lost item so the community can help."
            action={
              <Link
                to="/report"
                className="rounded-xl bg-brand-brown px-4 py-2 text-xs font-semibold text-white"
              >
                Report an Item
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {recent.slice(0, 4).map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {!loading && recent.length > 0 ? (
          <div className="mt-3 flex items-center justify-center gap-3 text-[10px] text-stone-400">
            <span className="flex items-center gap-1">
              <CalendarDays size={11} /> Updated daily
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={11} /> Campus-wide reports
            </span>
          </div>
        ) : null}
      </section>

      {stats && stats.resolved > 0 ? (
        <section className="rounded-2xl bg-brand-sand/40 px-4 py-3 text-center">
          <p className="text-xs font-semibold text-brand-brown">
            {stats.resolved} item{stats.resolved === 1 ? "" : "s"} reunited with their
            owners
          </p>
          <p className="mt-0.5 text-[10px] text-stone-500">
            Every report helps someone get their belongings back.
          </p>
        </section>
      ) : null}
    </div>
  );
}
