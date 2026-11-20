import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HandHeart } from "lucide-react";
import ItemList from "@/components/items/ItemList";
import ItemCard from "@/components/items/ItemCard";
import Alert from "@/components/ui/Alert";
import PageHeader from "@/components/ui/PageHeader";
import { useAuth } from "@/components/auth/AuthProvider";
import { getErrorMessage } from "@/lib/format";
import { getItems } from "@/services/itemService";
import type { Item } from "@/types/item";

export default function FoundItemsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getItems({ type: "found" })
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
        title="Found Items"
        subtitle="Think one of these is yours? Verify ownership to claim it."
        action={
          <Link
            to="/report"
            className="rounded-xl bg-brand-brown px-3 py-2 text-[11px] font-semibold text-white"
          >
            Report
          </Link>
        }
      />

      {error ? <Alert variant="error" className="mb-4">{error}</Alert> : null}

      <ItemList
        items={items}
        loading={loading}
        emptyTitle="No found items right now"
        emptyDescription="Found something? Report it so the owner can find it."
        emptyAction={
          <Link
            to="/report"
            className="rounded-xl bg-brand-brown px-4 py-2 text-xs font-semibold text-white"
          >
            Report a Found Item
          </Link>
        }
        renderAction={(item) => {
          const own = item.user_id === user?.id;
          const unavailable = item.status !== "open";
          return (
            <ItemCard
              item={item}
              actionLabel={
                own ? "Your Report" : unavailable ? "Claim in Progress" : "This is Mine"
              }
              actionIcon={<HandHeart size={14} />}
              actionVariant={unavailable || own ? "outline" : "primary"}
              actionDisabled={own || unavailable}
              onAction={() => navigate(`/items/${item.id}/claim`)}
            />
          );
        }}
      />
    </div>
  );
}
