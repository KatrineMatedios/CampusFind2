import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CalendarDays,
  ChevronRight,
  HandHeart,
  Mail,
  MapPin,
  PackageSearch,
  ShieldCheck,
  Tag,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { StatusBadge, TypeBadge } from "@/components/items/StatusBadge";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import Spinner from "@/components/ui/Spinner";
import { formatDate, getErrorMessage } from "@/lib/format";
import { getItem } from "@/services/itemService";
import type { Item } from "@/types/item";

export default function ItemDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    getItem(id ?? "")
      .then((response) => {
        if (active) setItem(response);
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
  }, [id]);

  if (loading) {
    return <Spinner label="Loading item…" className="py-24" />;
  }

  if (error || !item) {
    return (
      <div>
        <PageHeader title="Item Details" showBack />
        <Alert variant="error">{error || "This item could not be found."}</Alert>
        <Link
          to="/browse"
          className="mt-4 block text-center text-xs font-semibold text-brand-brown hover:underline"
        >
          Back to Browse
        </Link>
      </div>
    );
  }

  const isOwn = item.user_id === user?.id;
  const canClaim = item.type === "found" && item.status === "open" && !isOwn;
  const contactEmail = item.reporter?.email ?? "lostandfound@university.edu";
  const subject = encodeURIComponent(`CampusFind: Item "${item.name}"`);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4">
      <PageHeader title="Item Details" showBack />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start lg:gap-6">
        <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-3xl border border-brand-sand/80 bg-brand-sand/45 text-brand-brown/50 shadow-sm lg:h-[28rem]">
          {item.photo_url ? (
            <img
              src={item.photo_url}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <PackageSearch size={52} />
              <p className="text-[10px] font-medium uppercase tracking-widest text-brand-brown/60">
                No photo provided
              </p>
            </div>
          )}
          <div className="absolute left-3 top-3 flex gap-1.5">
            <TypeBadge type={item.type} />
            {item.status !== "open" ? <StatusBadge status={item.status} /> : null}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-brand-sand/80 bg-white p-4 shadow-sm lg:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-brown">
              {item.category?.name}
            </p>
            <h1 className="mt-0.5 text-xl font-bold leading-tight text-stone-800 lg:text-2xl">
              {item.name}
            </h1>
            <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-stone-600 lg:text-sm">
              {item.description}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <div className="rounded-xl bg-brand-cream p-3">
                <p className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide text-stone-400">
                  <CalendarDays size={11} /> Date {item.type === "lost" ? "Lost" : "Found"}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-stone-700">
                  {formatDate(item.date_reported)}
                </p>
              </div>
              <div className="rounded-xl bg-brand-cream p-3">
                <p className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide text-stone-400">
                  <Tag size={11} /> Category
                </p>
                <p className="mt-1 text-[11px] font-semibold text-stone-700">
                  {item.category?.name}
                </p>
              </div>
              <div className="col-span-2 rounded-xl bg-brand-cream p-3">
                <p className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide text-stone-400">
                  <MapPin size={11} /> Location
                </p>
                <p className="mt-1 text-[11px] font-semibold text-stone-700">
                  {item.location}
                </p>
              </div>
            </div>

            {item.reporter ? (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-brand-sand/80 p-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-sand/60 text-brand-brown">
                  <UserRound size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-stone-400">
                    Reported by
                  </p>
                  <p className="truncate text-xs font-semibold text-stone-700">
                    {isOwn ? "You" : item.reporter.full_name}
                  </p>
                </div>
                <ChevronRight size={15} className="text-stone-300" />
              </div>
            ) : null}

            {item.status === "claim_pending" ? (
              <Alert variant="info" className="mt-4">
                An ownership claim is currently being reviewed by the Lost &amp; Found
                Desk.
              </Alert>
            ) : null}
            {item.status === "resolved" ? (
              <Alert variant="success" className="mt-4">
                This item has been resolved and reunited with its owner.
              </Alert>
            ) : null}
          </div>

          <div className="space-y-2.5">
            {canClaim ? (
              <Button
                type="button"
                fullWidth
                leftIcon={<HandHeart size={16} />}
                onClick={() => navigate(`/items/${item.id}/claim`)}
              >
                This is Mine — Verify Ownership
              </Button>
            ) : null}

            {item.type === "lost" && !isOwn ? (
              <a href={`mailto:${contactEmail}?subject=${subject}`} className="block">
                <Button
                  type="button"
                  fullWidth
                  variant="secondary"
                  leftIcon={<Mail size={16} />}
                >
                  Contact Reporter
                </Button>
              </a>
            ) : null}

            {isOwn ? (
              <Link to="/my-reports" className="block">
                <Button type="button" fullWidth variant="outline">
                  View in My Reports
                </Button>
              </Link>
            ) : null}
          </div>

          <div className="flex items-start gap-2 rounded-2xl bg-brand-sand/35 p-3.5 text-[10px] leading-relaxed text-brand-brown">
            <ShieldCheck size={15} className="mt-0.5 shrink-0" />
            <p>
              For your safety, meet in a public campus area and bring a valid student ID.
              Never send money to claim an item.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
