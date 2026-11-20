import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Edit3, Flag as FlagIcon, PackageSearch, Search, Trash2 } from "lucide-react";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";
import Textarea from "@/components/ui/Textarea";
import FilterChips from "@/components/items/FilterChips";
import * as adminService from "@/services/adminService";
import * as itemService from "@/services/itemService";
import { getErrorMessage } from "@/lib/format";
import { StatusBadge, TypeBadge } from "@/components/items/StatusBadge";
import type { Item, ItemStatus, ItemType } from "@/types/item";
import type { AdminListMeta } from "@/types/admin";
import type { Category } from "@/types/item";

const STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "claim_pending", label: "Claim pending" },
  { value: "resolved", label: "Resolved" },
];

export default function ReportsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [meta, setMeta] = useState<AdminListMeta | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const typeFilter = (searchParams.get("type") ?? "") as "" | ItemType;
  const statusFilter = (searchParams.get("status") ?? "") as "" | ItemStatus;
  const categoryFilter = searchParams.get("category") ? Number(searchParams.get("category")) : "";
  const page = Number(searchParams.get("page") ?? "1") || 1;

  function setFilter(key: string, value: string | number | null) {
    const next = new URLSearchParams(searchParams);
    if (value === "" || value === null || value === undefined) {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
    if (key !== "page") next.delete("page");
    setSearchParams(next, { replace: true });
  }

  const [editing, setEditing] = useState<Item | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category_id: 0,
    location: "",
    description: "",
    date_reported: "",
  });

  const [flagTarget, setFlagTarget] = useState<Item | null>(null);
  const [flagReason, setFlagReason] = useState("");
  const [flagDetails, setFlagDetails] = useState("");
  const [flagSaving, setFlagSaving] = useState(false);
  const [flagError, setFlagError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const result = await adminService.getAdminItems({
        search: search || undefined,
        type: typeFilter || undefined,
        status: statusFilter || undefined,
        category: categoryFilter || undefined,
        page,
        per_page: 12,
      });
      setItems(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    itemService.getCategories().then(setCategories).catch(() => undefined);
  }, []);

  function openEdit(item: Item) {
    setEditing(item);
    setForm({
      name: item.name,
      category_id: item.category_id,
      location: item.location,
      description: item.description,
      date_reported: item.date_reported,
    });
    setFormError(null);
  }

  async function submitEdit(event: React.FormEvent) {
    event.preventDefault();
    if (!editing) return;
    setSaving(true);
    setFormError(null);
    try {
      await adminService.updateAdminItem(editing.id, {
        ...form,
        category_id: Number(form.category_id),
      });
      setEditing(null);
      await load();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(item: Item, status: ItemStatus) {
    try {
      await adminService.updateAdminItemStatus(item.id, status);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function submitFlag(event: React.FormEvent) {
    event.preventDefault();
    if (!flagTarget) return;
    setFlagSaving(true);
    setFlagError(null);
    try {
      await adminService.flagItem({
        item_id: flagTarget.id,
        reason: flagReason,
        details: flagDetails || undefined,
      });
      setFlagTarget(null);
      setFlagReason("");
      setFlagDetails("");
    } catch (err) {
      setFlagError(getErrorMessage(err));
    } finally {
      setFlagSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminService.deleteAdminItem(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-stone-800 lg:text-2xl">Manage Reports</h2>
        <p className="mt-1 text-xs text-stone-500 lg:text-sm">
          Review, edit, approve, reject, and flag lost &amp; found reports.
        </p>
      </div>

      {error ? <Alert variant="error">{error}</Alert> : null}

      {/* Filters */}
      <div className="space-y-3">
        <FilterChips
          options={[
            { value: "", label: "All" },
            { value: "lost", label: "Lost" },
            { value: "found", label: "Found" },
          ]}
          value={typeFilter}
          onChange={(v) => {
            setFilter("type", v);
          }}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Input
            placeholder="Search reports by name, location..."
            value={search}
            onChange={(e) => {
              setFilter("search", e.target.value);
            }}
            icon={<Search size={15} />}
          />
          <Select
            value={statusFilter}
            onChange={(e) => {
              setFilter("status", e.target.value);
            }}
            placeholder="All statuses"
            options={STATUS_OPTIONS}
          />
          <Select
            value={categoryFilter}
            onChange={(e) => {
              setFilter("category", e.target.value ? Number(e.target.value) : "");
            }}
            placeholder="All categories"
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner label="Loading reports…" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Search size={22} />}
          title="No reports found"
          description="Adjust the filters or search to find reports."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-brand-sand/80 bg-white shadow-sm">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="border-b border-brand-sand/70 bg-brand-cream/60 text-[11px] uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Item</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Reporter</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-sand/40">
              {items.map((item) => (
                <tr key={item.id} className="transition hover:bg-brand-cream/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-sand/50 text-brand-brown/60">
                        {item.photo_url ? (
                          <img src={item.photo_url} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <PackageSearch size={16} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-stone-800">{item.name}</p>
                        <p className="truncate text-[11px] text-stone-500">{item.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <TypeBadge type={item.type} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-stone-600">
                    {item.reporter?.full_name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-stone-600">{item.category?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-xs text-stone-500">
                    {new Date(item.date_reported).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {item.status !== "open" ? (
                        <Button size="sm" variant="ghost" onClick={() => changeStatus(item, "open")}>
                          Approve
                        </Button>
                      ) : null}
                      {item.status !== "resolved" ? (
                        <Button size="sm" variant="ghost" onClick={() => changeStatus(item, "resolved")}>
                          Resolve
                        </Button>
                      ) : null}
                      <Button size="sm" variant="ghost" onClick={() => openEdit(item)} aria-label="Edit">
                        <Edit3 size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setFlagTarget(item);
                          setFlagReason("");
                          setFlagDetails("");
                          setFlagError(null);
                        }}
                        aria-label="Flag"
                      >
                        <FlagIcon size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setDeleteTarget(item)}
                        aria-label="Delete"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta && meta.last_page > 1 ? (
        <div className="flex items-center justify-between text-xs text-stone-600">
          <span>
            Page {meta.current_page} of {meta.last_page} ({meta.total} reports)
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={meta.current_page <= 1}
              onClick={() => setFilter("page", Math.max(1, page - 1))}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={meta.current_page >= meta.last_page}
              onClick={() => setFilter("page", page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}

      {/* Edit modal */}
      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Edit Report"
        subtitle={editing ? `Report #${editing.id}` : undefined}
        size="lg"
      >
        {formError ? (
          <Alert variant="error" className="mb-4">
            {formError}
          </Alert>
        ) : null}
        <form onSubmit={submitEdit} className="space-y-4">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <Select
            label="Category"
            value={form.category_id}
            onChange={(e) => setForm((f) => ({ ...f, category_id: Number(e.target.value) }))}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            required
          />
          <Input
            label="Location"
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            required
          />
          <Input
            label="Date reported"
            type="date"
            value={form.date_reported}
            onChange={(e) => setForm((f) => ({ ...f, date_reported: e.target.value }))}
            required
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={4}
            required
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Save changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Flag modal */}
      <Modal
        open={Boolean(flagTarget)}
        onClose={() => setFlagTarget(null)}
        title="Flag Report"
        subtitle={flagTarget ? flagTarget.name : undefined}
        size="md"
      >
        {flagError ? (
          <Alert variant="error" className="mb-4">
            {flagError}
          </Alert>
        ) : null}
        <form onSubmit={submitFlag} className="space-y-4">
          <Input
            label="Reason"
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            placeholder="e.g. Duplicate report, Ownership dispute"
            required
          />
          <Textarea
            label="Details (optional)"
            value={flagDetails}
            onChange={(e) => setFlagDetails(e.target.value)}
            rows={3}
            placeholder="Additional context for reviewers."
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setFlagTarget(null)}>
              Cancel
            </Button>
            <Button type="submit" loading={flagSaving}>
              Create Flag
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete report"
        subtitle="This action cannot be undone."
        size="sm"
      >
        <p className="text-sm text-stone-600">
          Delete{" "}
          <span className="font-bold text-stone-800">{deleteTarget?.name}</span>? Its photo and any
          related claims will be removed.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button type="button" variant="danger" loading={deleting} onClick={() => void confirmDelete()}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
