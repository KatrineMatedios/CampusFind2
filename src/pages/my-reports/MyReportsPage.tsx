import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, ClipboardList, Plus, X } from "lucide-react";
import ItemCard from "@/components/items/ItemCard";
import Alert from "@/components/ui/Alert";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import Tabs from "@/components/ui/Tabs";
import { getErrorMessage } from "@/lib/format";
import { getMyReports } from "@/services/itemService";
import type { Item, ItemType } from "@/types/item";

type ReportTab = "all" | ItemType;

export default function MyReportsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState<ReportTab>("all");
  const [items, setItems] = useState<Item[]>([]);
  const [counts, setCounts] = useState({ all: 0, lost: 0, found: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(
    (location.state as { message?: string } | null)?.message ?? "",
  );

  useEffect(() => {
    if (message) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [message, navigate, location.pathname]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    getMyReports(tab === "all" ? undefined : tab)
      .then((response) => {
        if (!active) return;
        setItems(response.data);
        setCounts(response.counts);
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
  }, [tab]);

  return (
    <div>
      <PageHeader
        title="My Reports"
        subtitle="Track the items you reported and their status."
        action={
          <Link
            to="/report"
            className="inline-flex items-center gap-1 rounded-xl bg-brand-brown px-3 py-2 text-[11px] font-semibold text-white"
          >
            <Plus size={13} /> New
          </Link>
        }
      />

      {message ? (
        <div className="mb-4 flex items-start gap-2">
          <Alert variant="success" className="flex-1">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={14} /> {message}
            </span>
          </Alert>
          <button
            type="button"
            onClick={() => setMessage("")}
            className="mt-2 text-stone-400 hover:text-stone-600"
            aria-label="Dismiss message"
          >
            <X size={15} />
          </button>
        </div>
      ) : null}

      {error ? <Alert variant="error" className="mb-4">{error}</Alert> : null}

      <Tabs
        options={[
          { value: "all", label: "All", count: counts.all },
          { value: "lost", label: "Lost", count: counts.lost },
          { value: "found", label: "Found", count: counts.found },
        ]}
        value={tab}
        onChange={setTab}
        className="mb-4 max-w-md"
      />

      {loading ? (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl border border-brand-sand/80 bg-white"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={22} />}
          title={`No ${tab === "all" ? "" : tab} reports yet`}
          description="When you report a lost or found item, you can track it here."
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
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <Link
        to="/resolved"
        className="mt-5 flex items-center justify-between rounded-2xl border border-brand-sand bg-white px-4 py-3 text-xs font-semibold text-stone-700 shadow-sm transition hover:border-brand-brown/25"
      >
        <span className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          View resolved items
        </span>
        <span className="text-stone-300">→</span>
      </Link>
    </div>
  );
}
