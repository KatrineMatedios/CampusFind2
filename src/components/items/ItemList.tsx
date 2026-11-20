import { PackageSearch } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import ItemCard from "./ItemCard";
import type { Item } from "@/types/item";
import type { ReactNode } from "react";

interface ItemListProps {
  items: Item[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  renderAction?: (item: Item) => ReactNode;
}

function SkeletonCard() {
  return (
    <div className="flex animate-pulse items-start gap-3 rounded-2xl border border-brand-sand/80 bg-white p-3">
      <div className="h-20 w-20 shrink-0 rounded-xl bg-brand-sand/60" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-3 w-16 rounded bg-brand-sand/60" />
        <div className="h-4 w-3/4 rounded bg-brand-sand/60" />
        <div className="h-3 w-1/2 rounded bg-brand-sand/40" />
        <div className="h-3 w-2/3 rounded bg-brand-sand/40" />
      </div>
    </div>
  );
}

export default function ItemList({
  items,
  loading = false,
  emptyTitle = "Nothing here yet",
  emptyDescription = "Try a different search or check back later.",
  emptyAction,
  renderAction,
}: ItemListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3" aria-busy="true" aria-label="Loading items">
        {[0, 1, 2].map((index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<PackageSearch size={22} />}
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
      {items.map((item) => (
        <div key={item.id}>{renderAction ? renderAction(item) : <ItemCard item={item} />}</div>
      ))}
    </div>
  );
}
