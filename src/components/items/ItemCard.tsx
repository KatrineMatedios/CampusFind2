import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, ChevronRight, MapPin, PackageSearch } from "lucide-react";
import Button from "@/components/ui/Button";
import { StatusBadge, TypeBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import type { Item } from "@/types/item";

interface ItemCardProps {
  item: Item;
  actionLabel?: string;
  actionIcon?: ReactNode;
  onAction?: () => void;
  actionVariant?: "primary" | "secondary" | "outline" | "ghost";
  actionDisabled?: boolean;
  className?: string;
}

export default function ItemCard({
  item,
  actionLabel,
  actionIcon,
  onAction,
  actionVariant = "secondary",
  actionDisabled = false,
  className,
}: ItemCardProps) {
  const navigate = useNavigate();

  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border border-brand-sand/80 bg-white shadow-sm transition hover:shadow-md",
        className,
      )}
    >
      <button
        type="button"
        className="flex w-full items-start gap-3 p-3 text-left"
        onClick={() => navigate(`/items/${item.id}`)}
      >
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-sand/50 text-brand-brown/60">
          {item.photo_url ? (
            <img
              src={item.photo_url}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <PackageSearch size={28} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-start justify-between gap-2">
            <TypeBadge type={item.type} />
            {item.status !== "open" ? <StatusBadge status={item.status} /> : null}
          </div>
          <h3 className="line-clamp-1 text-sm font-bold leading-snug text-stone-800">
            {item.name}
          </h3>
          <p className="mt-0.5 text-[11px] font-medium text-brand-brown">
            {item.category?.name}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-stone-500">
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              <span className="line-clamp-1">{item.location}</span>
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays size={11} />
              {formatDate(item.date_reported)}
            </span>
          </div>
        </div>

        <ChevronRight size={16} className="mt-1 shrink-0 text-stone-300" />
      </button>

      {actionLabel && onAction ? (
        <div className="px-3 pb-3">
          <Button
            type="button"
            size="sm"
            fullWidth
            variant={actionVariant}
            leftIcon={actionIcon}
            disabled={actionDisabled}
            onClick={(event) => {
              event.stopPropagation();
              onAction();
            }}
          >
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </article>
  );
}
