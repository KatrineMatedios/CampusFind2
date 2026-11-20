import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Camera,
  CheckCircle2,
  MapPin,
  PackageSearch,
  Send,
  Tag,
  X,
} from "lucide-react";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PageHeader from "@/components/ui/PageHeader";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { getErrorMessage } from "@/lib/format";
import { createItem, getCategories } from "@/services/itemService";
import type { Category, ItemType } from "@/types/item";

export default function ReportItemPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [type, setType] = useState<ItemType>("lost");
  const [form, setForm] = useState({
    name: "",
    category_id: "",
    date_reported: new Date().toISOString().slice(0, 10),
    location: "",
    description: "",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setError("Could not load categories. Please refresh the page."));
  }, []);

  useEffect(() => {
    if (!photo) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const update = (key: keyof typeof form, value: string) =>
    setForm((previous) => ({ ...previous, [key]: value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("name", form.name);
      formData.append("category_id", form.category_id);
      formData.append("date_reported", form.date_reported);
      formData.append("location", form.location);
      formData.append("description", form.description);
      if (photo) formData.append("photo", photo);

      await createItem(formData);
      navigate("/my-reports", {
        replace: true,
        state: { message: "Your report was submitted successfully." },
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <PageHeader
        title="Report an Item"
        subtitle="Help the community return lost belongings to their owners."
      />

      {error ? (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      ) : null}

      <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-2">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-brand-sand/50 p-1.5 lg:col-span-2">
          <button
            type="button"
            onClick={() => setType("lost")}
            className={`rounded-xl px-3 py-2.5 text-xs font-bold transition ${
              type === "lost"
                ? "bg-[#F8D7D7] text-[#9B2C2C] shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            🔍 I Lost Something
          </button>
          <button
            type="button"
            onClick={() => setType("found")}
            className={`rounded-xl px-3 py-2.5 text-xs font-bold transition ${
              type === "found"
                ? "bg-[#CDE8C8] text-[#2F6B2A] shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            🎁 I Found Something
          </button>
        </div>

        <section className="space-y-3.5 rounded-2xl border border-brand-sand/80 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-brand-sand/60 pb-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-sand/60 text-brand-brown">
              <PackageSearch size={16} />
            </span>
            <div>
              <p className="text-xs font-bold text-stone-800">Item details</p>
              <p className="text-[10px] text-stone-400">
                Tell us what {type === "lost" ? "you lost" : "you found"}.
              </p>
            </div>
          </div>

          <Input
            label={type === "lost" ? "Item Name *" : "Item Name *"}
            placeholder={
              type === "lost" ? "e.g. Black wireless headphones" : "e.g. Blue water bottle"
            }
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            maxLength={150}
            required
          />

          <Select
            label="Category *"
            placeholder="Select a category"
            options={categories.map((category) => ({
              value: category.id,
              label: category.name,
            }))}
            value={form.category_id}
            onChange={(event) => update("category_id", event.target.value)}
            required
          />

          <div className="grid grid-cols-1 gap-3.5">
            <Input
              label={type === "lost" ? "Date Lost *" : "Date Found *"}
              type="date"
              icon={<CalendarDays size={16} />}
              value={form.date_reported}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(event) => update("date_reported", event.target.value)}
              required
            />

            <Input
              label={type === "lost" ? "Where did you lose it? *" : "Where did you find it? *"}
              placeholder="e.g. Library, 2nd Floor"
              icon={<MapPin size={16} />}
              value={form.location}
              onChange={(event) => update("location", event.target.value)}
              maxLength={200}
              required
            />
          </div>

          <Textarea
            label="Description *"
            placeholder="Include color, brand, markings, and any details that can help identify the item."
            rows={4}
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
            maxLength={3000}
            required
          />
        </section>

        <section className="rounded-2xl border border-brand-sand/80 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-stone-800">Photo</p>
              <p className="text-[10px] text-stone-400">Optional · JPG or PNG, max 5MB</p>
            </div>
            <Tag size={15} className="text-stone-300" />
          </div>

          {preview ? (
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={preview}
                alt="Selected item"
                className="h-44 w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setPhoto(null)}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur"
                aria-label="Remove photo"
              >
                <X size={15} />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-brand-sand bg-brand-cream/60 px-4 py-7 text-center transition hover:border-brand-brown/40 hover:bg-brand-cream">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-brown shadow-sm">
                <Camera size={18} />
              </span>
              <span className="text-xs font-semibold text-brand-brown">
                Add a photo
              </span>
              <span className="text-[10px] text-stone-400">
                Tap to choose from your device
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg"
                className="sr-only"
                onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
              />
            </label>
          )}
        </section>

        <div className="lg:col-span-2">
          <Button
            type="submit"
            fullWidth
            loading={submitting}
            leftIcon={<Send size={16} />}
          >
            Submit Report
          </Button>
        </div>

        <p className="flex items-center justify-center gap-1.5 pb-2 text-[10px] text-stone-400 lg:col-span-2">
          <CheckCircle2 size={11} /> Your report will be visible to the campus
          community.
        </p>
      </form>
    </div>
  );
}
