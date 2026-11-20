import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Camera,
  MapPin,
  PackageSearch,
  QrCode,
  ShieldCheck,
  Store,
  X,
} from "lucide-react";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/ui/PageHeader";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";
import Textarea from "@/components/ui/Textarea";
import { formatDate, formatDateTime, getErrorMessage, toDateTimeInput } from "@/lib/format";
import { getItem } from "@/services/itemService";
import { submitClaim } from "@/services/claimService";
import type { Claim } from "@/types/claim";
import type { Item } from "@/types/item";

const pickupLocations = [
  "Campus Lost & Found Desk",
  "Student Affairs Office",
  "Main Gate Security Office",
  "Library Front Desk",
  "Engineering Building Lobby",
];

export default function VerifyOwnershipPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [identifiers, setIdentifiers] = useState("");
  const [pickupLocation, setPickupLocation] = useState(pickupLocations[0]);
  const [pickupTime, setPickupTime] = useState(
    toDateTimeInput(new Date(Date.now() + 24 * 60 * 60 * 1000)),
  );
  const [proofPhoto, setProofPhoto] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [claim, setClaim] = useState<Claim | null>(null);

  useEffect(() => {
    let active = true;
    getItem(id ?? "")
      .then((response) => {
        if (active) setItem(response);
      })
      .catch((err) => {
        if (active) setLoadError(getErrorMessage(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!item) return;
    setError("");
    setSubmitting(true);

    try {
      const response = await submitClaim(item.id, {
        identifiers,
        pickup_location: pickupLocation,
        pickup_time: new Date(pickupTime).toISOString(),
        proof_photo: proofPhoto,
      });
      setClaim(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spinner label="Loading item…" className="py-24" />;
  }

  if (loadError || !item) {
    return (
      <div>
        <PageHeader title="Verify Ownership" showBack />
        <Alert variant="error">{loadError || "This item could not be found."}</Alert>
      </div>
    );
  }

  const unavailable = item.status !== "open";

  return (
    <div className="mx-auto w-full max-w-4xl">
      <PageHeader
        title="Verify Ownership"
        subtitle="Confirm the item is yours before submitting a claim."
        showBack
      />

      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-brand-sand/80 bg-white p-3 shadow-sm">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-sand/50 text-brand-brown/60">
          {item.photo_url ? (
            <img src={item.photo_url} alt={item.name} className="h-full w-full object-cover" />
          ) : (
            <PackageSearch size={26} />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-wide text-brand-brown">
            Claiming
          </p>
          <p className="line-clamp-1 text-sm font-bold text-stone-800">{item.name}</p>
          <p className="mt-0.5 flex items-center gap-1 text-[10px] text-stone-500">
            <MapPin size={11} /> {item.location}
          </p>
          <p className="text-[10px] text-stone-400">
            Found {formatDate(item.date_reported)}
          </p>
        </div>
      </div>

      {unavailable ? (
        <Alert variant="info" className="mb-4">
          This item is no longer available to claim. It may already have an active claim
          or have been resolved.
        </Alert>
      ) : null}
      {error ? (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      ) : null}

      <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-2">
        <section className="space-y-3.5 rounded-2xl border border-brand-sand/80 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-brand-sand/60 pb-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-sand/60 text-brand-brown">
              <ClipboardCheck size={16} />
            </span>
            <div>
              <p className="text-xs font-bold text-stone-800">Proof of ownership</p>
              <p className="text-[10px] text-stone-400">
                Describe details only the owner would know.
              </p>
            </div>
          </div>

          <Textarea
            label="Unique identifiers / markings *"
            placeholder="e.g. The case has a small scratch on the top left, and the wallpaper shows a photo of a golden retriever."
            rows={5}
            value={identifiers}
            onChange={(event) => setIdentifiers(event.target.value)}
            minLength={10}
            maxLength={2000}
            required
          />

          <div>
            <p className="mb-1.5 text-xs font-semibold text-stone-700">
              Photo proof <span className="font-normal text-stone-400">(optional)</span>
            </p>
            {proofPhoto ? (
              <div className="flex items-center justify-between rounded-xl border border-brand-sand bg-brand-cream px-3 py-2.5">
                <span className="flex min-w-0 items-center gap-2 text-[11px] font-medium text-stone-600">
                  <Camera size={15} className="shrink-0 text-brand-brown" />
                  <span className="truncate">{proofPhoto.name}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setProofPhoto(null)}
                  className="text-stone-400 hover:text-stone-600"
                  aria-label="Remove proof photo"
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-brand-sand bg-brand-cream/60 px-4 py-4 text-[11px] font-semibold text-brand-brown transition hover:border-brand-brown/40">
                <Camera size={15} />
                Upload a photo of the item with you
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  className="sr-only"
                  onChange={(event) => setProofPhoto(event.target.files?.[0] ?? null)}
                />
              </label>
            )}
          </div>
        </section>

        <section className="space-y-3.5 rounded-2xl border border-brand-sand/80 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-brand-sand/60 pb-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-sand/60 text-brand-brown">
              <Store size={16} />
            </span>
            <div>
              <p className="text-xs font-bold text-stone-800">Pickup details</p>
              <p className="text-[10px] text-stone-400">
                Choose where and when you can collect the item.
              </p>
            </div>
          </div>

          <Select
            label="Preferred pickup location *"
            options={pickupLocations.map((location) => ({
              value: location,
              label: location,
            }))}
            value={pickupLocation}
            onChange={(event) => setPickupLocation(event.target.value)}
            required
          />

          <Input
            label="Preferred pickup date & time *"
            type="datetime-local"
            icon={<CalendarClock size={16} />}
            value={pickupTime}
            min={toDateTimeInput(new Date(Date.now() + 60 * 60 * 1000))}
            onChange={(event) => setPickupTime(event.target.value)}
            required
          />
        </section>

        <div className="lg:col-span-2">
          <Button
            type="submit"
            fullWidth
            loading={submitting}
            disabled={unavailable}
            leftIcon={<ShieldCheck size={16} />}
          >
            Submit Ownership Claim
          </Button>
        </div>

        <p className="flex items-center justify-center gap-1.5 pb-2 text-center text-[10px] leading-relaxed text-stone-400 lg:col-span-2">
          <CheckCircle2 size={11} /> False claims may be reported to Student Affairs.
        </p>
      </form>

      <Modal
        open={Boolean(claim)}
        onClose={() => navigate(`/items/${item.id}`)}
        title="Your Claim is Confirmed"
        subtitle="Show this QR code at the Campus Lost & Found Desk together with a valid ID."
        size="md"
      >
        {claim ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center rounded-2xl bg-brand-cream p-4">
              <div className="rounded-xl bg-white p-3 shadow-sm">
                <QRCodeSVG
                  value={claim.qr_code}
                  size={168}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#4E2C1C"
                />
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                <QrCode size={12} /> Claim code
              </p>
              <p className="mt-1 font-mono text-sm font-bold tracking-wide text-brand-brown">
                {claim.qr_code}
              </p>
            </div>

            <div className="space-y-2 text-[11px] leading-relaxed text-stone-600">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-brown text-[9px] font-bold text-white">
                  1
                </span>
                Visit the <span className="font-semibold">Campus Lost &amp; Found Desk</span> at{" "}
                {claim.pickup_location}.
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-brown text-[9px] font-bold text-white">
                  2
                </span>
                Show this QR code and a valid student ID.
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-brown text-[9px] font-bold text-white">
                  3
                </span>
                Staff will verify and release your item.
              </div>
            </div>

            <div className="rounded-xl bg-brand-sand/40 p-3 text-[10px] text-brand-brown">
              Preferred pickup: {formatDateTime(claim.pickup_time)}
            </div>

            <div className="space-y-2">
              <Button
                type="button"
                fullWidth
                onClick={() => navigate("/my-reports")}
              >
                Go to My Reports
              </Button>
              <Link
                to={`/items/${item.id}`}
                className="block text-center text-[11px] font-semibold text-stone-500 hover:text-brand-brown"
              >
                Back to item details
              </Link>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
