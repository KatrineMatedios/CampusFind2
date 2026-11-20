import Badge from "@/components/ui/Badge";
import type { ItemStatus, ItemType } from "@/types/item";

export function TypeBadge({ type }: { type: ItemType }) {
  return (
    <Badge variant={type} dot>
      {type === "lost" ? "LOST" : "FOUND"}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: ItemStatus }) {
  if (status === "resolved") {
    return <Badge variant="resolved">Resolved</Badge>;
  }
  if (status === "claim_pending") {
    return <Badge variant="progress">Claim pending</Badge>;
  }
  return <Badge variant="neutral">Open</Badge>;
}

export function ActivityStatusBadge({ status }: { status: ItemStatus | null }) {
  if (status === "resolved") {
    return <Badge variant="resolved">Resolved</Badge>;
  }
  return <Badge variant="progress">In progress</Badge>;
}
