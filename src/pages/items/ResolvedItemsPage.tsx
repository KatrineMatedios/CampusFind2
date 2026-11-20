import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpenCheck } from "lucide-react";
import ItemCard from "@/components/items/ItemCard";
import Alert from "@/components/ui/Alert";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import { getErrorMessage } from "@/lib/format";
import { getResolvedReports } from "@/services/itemService";
import type { Item } from "@/types/item";

export default function ResolvedItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getResolvedReports()
      .then((response) => {
        if (active) setItems(response);
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

  return (
    <div>
      <PageHeader
        title="Resolved Items"
        subtitle="Reports that have been successfully reunited with their owners."
      />

      {error ? <Alert variant="error" className="mb-4">{error}</Alert> : null}

      {loading ? (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
          {[0, 1].map((index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl border border-brand-sand/80 bg-white"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<BookOpenCheck size={22} />}
          title="No resolved items yet"
          description="Once an item you reported is returned, it will appear here."
          action={
            <Link
              to="/my-reports"
              className="rounded-xl bg-brand-brown px-4 py-2 text-xs font-semibold text-white"
            >
              View My Reports
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

      {!loading && items.length > 0 ? (
        <p className="mt-4 text-center text-[10px] text-stone-400">
          {items.length} resolved report{items.length === 1 ? "" : "s"} · Thank you for
          keeping campus connected.
        </p>
      ) : null}
    </div>
  );
}
