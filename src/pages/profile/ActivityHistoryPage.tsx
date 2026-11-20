import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  ClipboardList,
  History,
  MessageSquare,
  PackageSearch,
  RefreshCw,
} from "lucide-react";
import { ActivityStatusBadge, TypeBadge } from "@/components/items/StatusBadge";
import Alert from "@/components/ui/Alert";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import Tabs from "@/components/ui/Tabs";
import { getErrorMessage, timeAgo } from "@/lib/format";
import { getActivity } from "@/services/profileService";
import type { ActivityEntry } from "@/types/user";

type ActivityFilter = "all" | "reports" | "updates";

const actionIcon = (action: string) => {
  switch (action) {
    case "reported":
      return <ClipboardList size={14} />;
    case "claimed":
      return <PackageSearch size={14} />;
    case "resolved":
      return <CheckCircle2 size={14} />;
    case "updated":
      return <RefreshCw size={14} />;
    default:
      return <MessageSquare size={14} />;
  }
};

export default function ActivityHistoryPage() {
  const [filter, setFilter] = useState<ActivityFilter>("all");
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    getActivity(filter)
      .then((response) => {
        if (active) setEntries(response);
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
  }, [filter]);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <PageHeader
        title="My Activity History"
        subtitle="Every report, claim, and update in one place."
        showBack
      />

      {error ? <Alert variant="error" className="mb-4">{error}</Alert> : null}

      <Tabs
        options={[
          { value: "all", label: "All" },
          { value: "reports", label: "Reports" },
          { value: "updates", label: "Updates" },
        ]}
        value={filter}
        onChange={setFilter}
        className="mb-4 max-w-md"
      />

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="h-20 animate-pulse rounded-2xl border border-brand-sand/80 bg-white"
            />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <EmptyState
          icon={<History size={22} />}
          title="No activity yet"
          description="Report an item or submit a claim and your activity will show up here."
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
        <div className="relative space-y-3">
          <div
            className="absolute bottom-3 left-[19px] top-3 w-px bg-brand-sand"
            aria-hidden="true"
          />
          {entries.map((entry) => (
            <div key={entry.id} className="relative flex gap-3">
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-brand-brown shadow-sm ring-1 ring-brand-sand">
                {actionIcon(entry.action)}
              </span>
              <div className="min-w-0 flex-1 rounded-2xl border border-brand-sand/80 bg-white p-3 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {entry.item_type ? <TypeBadge type={entry.item_type} /> : null}
                      <ActivityStatusBadge status={entry.item_status} />
                    </div>
                    <p className="mt-1.5 text-xs font-semibold leading-snug text-stone-700">
                      {entry.description}
                    </p>
                  </div>
                </div>
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <p className="text-[10px] text-stone-400">{timeAgo(entry.created_at)}</p>
                  {entry.item_id ? (
                    <Link
                      to={`/items/${entry.item_id}`}
                      className="text-[10px] font-semibold text-brand-brown hover:underline"
                    >
                      View item →
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
