import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Alert from "@/components/ui/Alert";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";
import Avatar from "@/components/ui/Avatar";
import * as adminService from "@/services/adminService";
import { auditActionLabel } from "@/lib/formatAdmin";
import { formatDateTime, getErrorMessage } from "@/lib/format";
import type { AuditLog, AdminListMeta } from "@/types/admin";

const ACTION_OPTIONS = [
  { value: "reported", label: "Reported" },
  { value: "updated", label: "Updated" },
  { value: "claimed", label: "Claimed" },
  { value: "resolved", label: "Resolved" },
  { value: "user_created", label: "User Created" },
  { value: "user_updated", label: "User Updated" },
  { value: "user_deactivated", label: "User Deactivated" },
  { value: "user_activated", label: "User Activated" },
  { value: "user_deleted", label: "User Deleted" },
  { value: "item_updated", label: "Item Updated" },
  { value: "item_status_updated", label: "Item Status Changed" },
  { value: "item_deleted", label: "Item Deleted" },
  { value: "flag_created", label: "Flag Created" },
  { value: "flag_resolved", label: "Flag Resolved" },
  { value: "flag_dismissed", label: "Flag Dismissed" },
  { value: "settings_updated", label: "Settings Updated" },
  { value: "notice_sent", label: "Notice Sent" },
];

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [meta, setMeta] = useState<AdminListMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [page, setPage] = useState(1);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const result = await adminService.getActivity({
        search: search || undefined,
        action: actionFilter || undefined,
        page,
        per_page: 15,
      });
      setLogs(result.data);
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
  }, [search, actionFilter, page]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-stone-800 lg:text-2xl">Audit Logs</h2>
        <p className="mt-1 text-xs text-stone-500 lg:text-sm">
          Review important administrator and system activity.
        </p>
      </div>

      {error ? <Alert variant="error">{error}</Alert> : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          placeholder="Search activity descriptions..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          icon={<Search size={15} />}
        />
        <Select
          value={actionFilter}
          onChange={(e) => {
            setActionFilter(e.target.value);
            setPage(1);
          }}
          placeholder="All actions"
          options={ACTION_OPTIONS}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner label="Loading logs…" />
        </div>
      ) : logs.length === 0 ? (
        <EmptyState
          icon={<Search size={22} />}
          title="No activity found"
          description="Adjust the filters to find logged actions."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-brand-sand/80 bg-white shadow-sm">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-brand-sand/70 bg-brand-cream/60 text-[11px] uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Date &amp; Time</th>
                <th className="px-4 py-3 font-semibold">Administrator</th>
                <th className="px-4 py-3 font-semibold">Action</th>
                <th className="px-4 py-3 font-semibold">Description</th>
                <th className="px-4 py-3 font-semibold">Item</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-sand/40">
              {logs.map((log) => (
                <tr key={log.id} className="transition hover:bg-brand-cream/30">
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-stone-500">
                    {formatDateTime(log.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={log.user?.full_name ?? "System"} size="sm" className="h-7 w-7" />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-stone-800">
                          {log.user?.full_name ?? "System"}
                        </p>
                        <p className="truncate text-[10px] text-stone-400">{log.user?.role ?? ""}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="brown">{auditActionLabel(log.action)}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-stone-600">{log.description}</td>
                  <td className="px-4 py-3 text-xs text-stone-600">
                    {log.item_name ?? (log.item_id ? `#${log.item_id}` : "—")}
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
            Page {meta.current_page} of {meta.last_page} ({meta.total} entries)
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
    </div>
  );
}
