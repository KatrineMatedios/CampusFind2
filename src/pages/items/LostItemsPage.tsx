import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import ItemList from "@/components/items/ItemList";
import ItemCard from "@/components/items/ItemCard";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/ui/PageHeader";
import { getErrorMessage } from "@/lib/format";
import { getItems } from "@/services/itemService";
import type { Item } from "@/types/item";

export default function LostItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contactItem, setContactItem] = useState<Item | null>(null);

  useEffect(() => {
    let active = true;
    getItems({ type: "lost" })
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

  const reporter = contactItem?.reporter;
  const email = reporter?.email ?? "lostandfound@university.edu";
  const subject = encodeURIComponent(
    `CampusFind: About your lost item "${contactItem?.name ?? ""}"`,
  );

  return (
    <div>
      <PageHeader
        title="Lost Items"
        subtitle="Someone may have found it. Reach out or keep browsing."
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
        emptyTitle="No lost items right now"
        emptyDescription="When students report lost belongings, they will appear here."
        emptyAction={
          <Link
            to="/report"
            className="rounded-xl bg-brand-brown px-4 py-2 text-xs font-semibold text-white"
          >
            Report a Lost Item
          </Link>
        }
        renderAction={(item) => (
          <ItemCard
            item={item}
            actionLabel="Contact"
            actionIcon={<MessageCircle size={14} />}
            actionVariant="secondary"
            onAction={() => setContactItem(item)}
          />
        )}
      />

      <Modal
        open={Boolean(contactItem)}
        onClose={() => setContactItem(null)}
        title="Contact the reporter"
        subtitle={
          contactItem
            ? `Ask ${contactItem.reporter?.full_name ?? "the reporter"} if they have seen your item.`
            : undefined
        }
      >
        {contactItem ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-brand-cream p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">
                Item
              </p>
              <p className="mt-0.5 text-sm font-bold text-stone-800">{contactItem.name}</p>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-stone-500">
                <MapPin size={12} /> {contactItem.location}
              </p>
            </div>

            <div className="space-y-2">
              <a
                href={`mailto:${email}?subject=${subject}`}
                className="flex items-center gap-3 rounded-xl border border-brand-sand bg-white p-3 transition hover:bg-brand-cream"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-sand/60 text-brand-brown">
                  <Mail size={16} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] font-semibold uppercase tracking-wide text-stone-400">
                    Email
                  </span>
                  <span className="block truncate text-xs font-medium text-stone-700">
                    {email}
                  </span>
                </span>
              </a>

              {reporter?.contact_number ? (
                <a
                  href={`tel:${reporter.contact_number}`}
                  className="flex items-center gap-3 rounded-xl border border-brand-sand bg-white p-3 transition hover:bg-brand-cream"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-sand/60 text-brand-brown">
                    <Phone size={16} />
                  </span>
                  <span>
                    <span className="block text-[10px] font-semibold uppercase tracking-wide text-stone-400">
                      Contact number
                    </span>
                    <span className="block text-xs font-medium text-stone-700">
                      {reporter.contact_number}
                    </span>
                  </span>
                </a>
              ) : null}
            </div>

            <div className="rounded-xl bg-brand-sand/35 p-3 text-[10px] leading-relaxed text-brand-brown">
              For safety, meet in a public campus area. Never share passwords or send
              money to claim an item.
            </div>

            <a href={`mailto:${email}?subject=${subject}`}>
              <Button type="button" fullWidth leftIcon={<Mail size={15} />}>
                Send an Email
              </Button>
            </a>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
