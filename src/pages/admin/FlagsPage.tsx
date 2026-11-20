import { useEffect, useState } from "react";
import { Flag as FlagIcon, PackageSearch, Plus, Search } from "lucide-react";
import Alert from "@/components/ui/Alert";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";
import Textarea from "@/components/ui/Textarea";
import FilterChips from "@/components/items/FilterChips";
import * as adminService from "@/services/adminService";
import { flagCode } from "@/lib/formatAdmin";
import { formatDateTime, getErrorMessage } from "@/lib/format";
import type { Flag, FlagStatus } from "@/types/admin";
import type { Item } from "@/types/item";

export default function FlagsPage() {
  const [flags, setFlags] = useState<Flag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | FlagStatus>("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<{ current_page: number; last_page: number; total: number } | null>(null);

  const [editing, setEditing] = useState<Flag | null>(null);
  const [note, setNote] = useState("");
  const [nextStatus, setNextStatus] = useState<FlagStatus>("resolved");
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Create-flag modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [flagItemId, setFlagItemId] = useState<number | "">("");
  const [flagReason, setFlagReason] = useState("");
  const [flagDetails, setFlagDetails] = useState("");
  const [flagSaving, setFlagSaving] = useState(false);
  const [flagError, setFlagError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const result = await adminService.getFlags({
        search: search || undefined,
        status: statusFilter || undefined,
        page,
        per_page: 10,
      });
      setFlags(result.data);
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
  }, [search, statusFilter, page]);

  useEffect(() => {
    if (!createOpen) return;
    adminService
      .getAdminItems({ per_page: 100 })
      .then((r) => setItems(r.data))
      .catch(() => undefined);
  }, [createOpen]);

  function openEdit(flag: Flag, status: FlagStatus) {
    setEditing(flag);
    setNextStatus(status);
    setNote(flag.admin_note ?? "");
    setEditError(null);
  }

  async function submitCreateFlag() {
    if (!flagItemId || !flagReason.trim()) {
      setFlagError("Please select an item and provide a reason.");
      return;
    }
    setFlagSaving(true);
    setFlagError(null);
    try {
      await adminService.flagItem({
        item_id: Number(flagItemId),
        reason: flagReason.trim(),
        details: flagDetails.trim() || undefined,
      });
      setCreateOpen(false);
      setFlagItemId("");
      setFlagReason("");
      setFlagDetails("");
      await load();
    } catch (err) {
      setFlagError(getErrorMessage(err));
    } finally {
      setFlagSaving(false);
    }
  }

  async function submitEdit() {
    if (!editing) return;
    setSaving(true);
    setEditError(null);
    try {
      await adminService.updateFlag(editing.id, { status: nextStatus, admin_note: note || undefined });
      setEditing(null);
      await load();
    } catch (err) {
      setEditError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-800 lg:text-2xl">Flagged &amp; Disputes</h2>
          <p className="mt-1 text-xs text-stone-500 lg:text-sm">
            Review flagged reports, ownership disputes, and resolve or dismiss them.
          </p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={() => setCreateOpen(true)}>
          Flag a Report
        </Button>
      </div>

      {error ? <Alert variant="error">{error}</Alert> : null}

      <FilterChips
        options={[
          { value: "", label: "All" },
          { value: "open", label: "Open" },
          { value: "resolved", label: "Resolved" },
          { value: "dismissed", label: "Dismissed" },
        ]}
        value={statusFilter}
        onChange={(v) => {
          setStatusFilter(v as "" | FlagStatus);
          setPage(1);
        }}
      />

      <Input
        placeholder="Search flags by reason, item name..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        icon={<Search size={15} />}
      />

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner label="Loading flags…" />
        </div>
      ) : flags.length === 0 ? (
        <EmptyState
          icon={<FlagIcon size={22} />}
          title="No flags found"
          description="Flagged reports and disputes will appear here for review."
        />
      ) : (
        <ul className="space-y-3">
          {flags.map((flag) => (
            <li
              key={flag.id}
              className="rounded-2xl border border-brand-sand/80 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-sand/50 text-brand-brown/60">
                  {flag.item?.photo_url ? (
                    <img src={flag.item.photo_url} alt={flag.item.name} className="h-full w-full object-cover" />
                  ) : (
                    <PackageSearch size={20} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-brand-cream px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-brand-brown">
                      {flagCode(flag.id)}
                    </span>
                    <FlagStatusBadge status={flag.status} />
                    <span className="text-[10px] font-medium text-stone-400">
                      {formatDateTime(flag.created_at)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-bold text-stone-800">
                    {flag.item?.name ?? "Deleted item"}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-stone-600">{flag.reason}</p>
                  {flag.details ? (
                    <p className="mt-1 text-xs leading-relaxed text-stone-500">{flag.details}</p>
                  ) : null}
                  {flag.admin_note ? (
                    <p className="mt-2 rounded-lg bg-brand-cream/60 px-2.5 py-1.5 text-[11px] text-stone-600">
                      <span className="font-bold text-brand-brown">Admin note:</span> {flag.admin_note}
                    </p>
                  ) : null}
                  {flag.reporter ? (
                    <p className="mt-1.5 text-[10px] text-stone-400">
                      Reported by {flag.reporter.full_name}
                      {flag.resolver ? ` · Resolved by ${flag.resolver.full_name}` : ""}
                    </p>
                  ) : null}
                </div>
                {flag.status === "open" ? (
                  <div className="flex shrink-0 gap-2">
                    <Button size="sm" variant="secondary" onClick={() => openEdit(flag, "resolved")}>
                      Resolve
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => openEdit(flag, "dismissed")}>
                      Dismiss
                    </Button>
                  </div>
                ) : (
                  <div className="flex shrink-0 gap-2">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(flag, "open")}>
                      Reopen
                    </Button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {meta && meta.last_page > 1 ? (
        <div className="flex items-center justify-between text-xs text-stone-600">
          <span>
            Page {meta.current_page} of {meta.last_page} ({meta.total} flags)
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={meta.current_page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={meta.current_page >= meta.last_page}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={
          nextStatus === "resolved"
            ? "Resolve Flag"
            : nextStatus === "dismissed"
              ? "Dismiss Flag"
              : "Reopen Flag"
        }
        subtitle={editing?.item?.name}
        size="md"
      >
        {editError ? (
          <Alert variant="error" className="mb-4">
            {editError}
          </Alert>
        ) : null}
        <div className="space-y-3">
          <p className="text-sm text-stone-600">
            {nextStatus === "resolved"
              ? "Mark this flag as resolved. You can add a note explaining the outcome."
              : nextStatus === "dismissed"
                ? "Dismiss this flag if it does not require action."
                : "Reopen this flag for further review."}
          </p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Optional admin note"
            className="w-full resize-none rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-brand-brown focus:ring-2 focus:ring-brand-brown/15"
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button type="button" loading={saving} onClick={() => void submitEdit()}>
              {nextStatus === "resolved"
                ? "Resolve"
                : nextStatus === "dismissed"
                  ? "Dismiss"
                  : "Reopen"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create flag modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Flag a Report"
        subtitle="Create a new flag or dispute on a report."
        size="md"
      >
        {flagError ? (
          <Alert variant="error" className="mb-4">
            {flagError}
          </Alert>
        ) : null}
        <div className="space-y-4">
          <Select
            label="Report"
            value={flagItemId}
            onChange={(e) => setFlagItemId(e.target.value ? Number(e.target.value) : "")}
            placeholder="Select a report"
            options={items.map((item) => ({
              value: item.id,
              label: `#${item.id} — ${item.name}`,
            }))}
          />
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
            <Button type="button" variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="button" loading={flagSaving} onClick={() => void submitCreateFlag()}>
              Create Flag
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function FlagStatusBadge({ status }: { status: FlagStatus }) {
  if (status === "open") return <Badge variant="danger" dot>Open</Badge>;
  if (status === "resolved") return <Badge variant="success">Resolved</Badge>;
  return <Badge variant="neutral">Dismissed</Badge>;
}
