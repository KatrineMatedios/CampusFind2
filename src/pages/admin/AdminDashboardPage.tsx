import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Backpack,
  FileText,
  Flag as FlagIcon,
  Hand,
  Package,
  PackageSearch,
  Plus,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import Alert from "@/components/ui/Alert";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import * as adminService from "@/services/adminService";
import { flagCode } from "@/lib/formatAdmin";
import { formatDateTime, getErrorMessage } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import type { AdminStats, Flag } from "@/types/admin";
import type { ReactNode } from "react";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [flags, setFlags] = useState<Flag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [statsResult, flagsResult] = await Promise.all([
          adminService.getStats(),
          adminService.getFlags({ per_page: 5 }),
        ]);
        if (active) {
          setStats(statsResult);
          setFlags(flagsResult.data);
        }
      } catch (err) {
        if (active) setError(getErrorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {error ? <Alert variant="error">{error}</Alert> : null}

      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-3xl bg-brand-brown p-6 text-white shadow-lg shadow-brand-brown/20 lg:p-8">
        <div
          className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-24 top-10 h-24 w-24 rounded-full border border-white/15"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-16 right-40 h-40 w-40 rounded-full bg-white/5"
          aria-hidden="true"
        />
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60">
          Welcome back
        </p>
        <h2 className="mt-2 text-2xl font-bold leading-tight lg:text-3xl">
          Hi, {user?.first_name ?? "Administrator"}!
        </h2>
        <p className="mt-2 max-w-md text-xs leading-relaxed text-white/70 lg:text-sm">
          Manage, moderate, and oversee the Campus Lost &amp; Found platform.
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <Button
            variant="primary"
            className="bg-white text-brand-brown hover:bg-brand-cream"
            onClick={() => navigate("/admin/flags")}
          >
            Moderation Queue
          </Button>
          <Button
            variant="outline"
            className="border-white/30 bg-transparent text-white hover:border-white/60 hover:bg-white/10"
            onClick={() => navigate("/admin/audit")}
          >
            System Logs
          </Button>
        </div>
      </section>

      {/* Statistics */}
      <section aria-label="Platform statistics" className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
        <Link to="/admin/reports?type=lost" className="block">
          <StatCard
            loading={loading}
            value={stats?.lost}
            label="Lost Items"
            background="bg-[#F8D7D7]"
            icon={<Backpack size={20} />}
          />
        </Link>
        <Link to="/admin/reports?type=found" className="block">
          <StatCard
            loading={loading}
            value={stats?.found}
            label="Found Items"
            background="bg-[#CFE6F5]"
            icon={<Hand size={20} />}
          />
        </Link>
        <Link to="/admin/reports?status=resolved" className="block">
          <StatCard
            loading={loading}
            value={stats?.resolved}
            label="Total Resolved"
            background="bg-[#D3EBCC]"
            icon={<TrendingUp size={20} />}
          />
        </Link>
      </section>

      {/* Quick actions */}
      <section aria-label="Quick actions">
        <h3 className="mb-3 text-sm font-bold text-stone-800">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <QuickAction
            to="/admin/users"
            icon={<Plus size={18} />}
            title="Add User"
            description="Create or edit accounts."
          />
          <QuickAction
            to="/admin/flags"
            icon={<ShieldCheck size={18} />}
            title="Moderation Queue"
            description="Review flagged items."
            badge={stats?.open_flags}
          />
          <QuickAction
            to="/admin/items"
            icon={<Package size={18} />}
            title="Database"
            description="Search all items."
          />
          <QuickAction
            to="/admin/audit"
            icon={<FileText size={18} />}
            title="Audit Logs"
            description="Review system activity."
          />
        </div>
      </section>

      {/* Recent system flags */}
      <section aria-label="Recent system flags">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-800">Recent System Flags</h3>
          <Link
            to="/admin/flags"
            className="text-xs font-semibold text-brand-brown underline-offset-2 hover:underline"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div className="space-y-2.5" aria-busy="true">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="flex animate-pulse items-center gap-3 rounded-2xl border border-brand-sand/80 bg-white p-3.5"
              >
                <div className="h-14 w-14 shrink-0 rounded-xl bg-brand-sand/60" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 rounded bg-brand-sand/60" />
                  <div className="h-4 w-2/3 rounded bg-brand-sand/40" />
                  <div className="h-3 w-1/2 rounded bg-brand-sand/40" />
                </div>
              </div>
            ))}
          </div>
        ) : flags.length === 0 ? (
          <EmptyState
            icon={<FlagIcon size={22} />}
            title="No flags yet"
            description="Flagged reports and ownership disputes will appear here for review."
          />
        ) : (
          <ul className="space-y-2.5">
            {flags.map((flag) => (
              <li
                key={flag.id}
                onClick={() => navigate("/admin/flags")}
                className="flex cursor-pointer flex-col gap-3 rounded-2xl border border-brand-sand/80 bg-white p-3.5 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-sand/50 text-brand-brown/60">
                    {flag.item?.photo_url ? (
                      <img src={flag.item.photo_url} alt={flag.item.name} className="h-full w-full object-cover" />
                    ) : (
                      <PackageSearch size={20} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-brand-cream px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-brand-brown">
                        {flagCode(flag.id)}
                      </span>
                      <FlagStatusBadge status={flag.status} />
                    </div>
                    <p className="mt-1 truncate text-sm font-bold text-stone-800">
                      {flag.item?.name ?? "Deleted item"}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-stone-500">
                      {flag.reason}
                      {flag.details ? ` — ${flag.details}` : ""}
                    </p>
                    <p className="mt-1 text-[10px] font-medium text-stone-400">
                      {formatDateTime(flag.created_at)}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 sm:pl-2">
                  <Link to="/admin/flags">
                    <Button size="sm" variant="outline" fullWidth className="sm:w-auto">
                      Review
                    </Button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({
  value,
  label,
  background,
  icon,
  loading,
}: {
  value: number | undefined;
  label: string;
  background: string;
  icon: ReactNode;
  loading?: boolean;
}) {
  return (
    <article
      className={cn(
        "relative rounded-2xl border border-white/60 p-4 shadow-sm transition hover:shadow-md lg:p-5",
        background,
      )}
    >
      <ArrowUpRight size={16} className="absolute right-3.5 top-3.5 text-stone-800/40" />
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 text-stone-800 shadow-sm">
        {icon}
      </div>
      {loading || value === undefined ? (
        <div className="mt-3 h-8 w-14 animate-pulse rounded bg-white/70" />
      ) : (
        <p className="mt-3 text-3xl font-bold leading-none text-stone-800 lg:text-4xl">{value}</p>
      )}
      <p className="mt-1.5 text-[11px] font-semibold text-stone-600">{label}</p>
    </article>
  );
}

function QuickAction({
  to,
  icon,
  title,
  description,
  badge,
}: {
  to: string;
  icon: ReactNode;
  title: string;
  description: string;
  badge?: number;
}) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-brand-sand/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-sand/60 text-brand-brown transition group-hover:bg-brand-brown group-hover:text-white">
          {icon}
        </div>
        {typeof badge === "number" && badge > 0 ? (
          <Badge variant="danger">{badge}</Badge>
        ) : null}
      </div>
      <p className="mt-3 text-sm font-bold text-stone-800">{title}</p>
      <p className="mt-0.5 text-[11px] leading-snug text-stone-500">{description}</p>
    </Link>
  );
}

export function FlagStatusBadge({ status }: { status: Flag["status"] }) {
  if (status === "open") return <Badge variant="danger" dot>Open</Badge>;
  if (status === "resolved") return <Badge variant="success">Resolved</Badge>;
  return <Badge variant="neutral">Dismissed</Badge>;
}
