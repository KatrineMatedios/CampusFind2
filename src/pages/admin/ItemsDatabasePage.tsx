import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PackageSearch, Search } from "lucide-react";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";
import FilterChips from "@/components/items/FilterChips";
import { StatusBadge, TypeBadge } from "@/components/items/StatusBadge";
import * as adminService from "@/services/adminService";
import * as itemService from "@/services/itemService";
import { getErrorMessage } from "@/lib/format";
import type { Item, ItemStatus, ItemType } from "@/types/item";
import type { AdminListMeta } from "@/types/admin";
import type { Category } from "@/types/item";

export default function ItemsDatabasePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [meta, setMeta] = useState<AdminListMeta | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const typeFilter = (searchParams.get("type") ?? "") as "" | ItemType;
  const statusFilter = (searchParams.get("status") ?? "") as "" | ItemStatus;
  const categoryFilter = searchParams.get("category") ? Number(searchParams.get("category")) : "";
  const page = Number(searchParams.get("page") ?? "1") || 1;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function setFilter(key: string, value: string | number | null) {
    const next = new URLSearchParams(searchParams);
    if (value === "" || value === null || value === undefined) next.delete(key);
    else next.set(key, String(value));
    if (key !== "page") next.delete("page");
    setSearchParams(next, { replace: true });
  }

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

  async function changeStatus(item: Item, status: ItemStatus) {
    try {
      await adminService.updateAdminItemStatus(item.id, status);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-stone-800 lg:text-2xl">All Items Database</h2>
        <p className="mt-1 text-xs text-stone-500 lg:text-sm">
          Search and filter every lost &amp; found record in the system.
        </p>
      </div>

      {error ? <Alert variant="error">{error}</Alert> : null}

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
          placeholder="Search by name, location, description..."
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
          options={[
            { value: "open", label: "Open" },
            { value: "claim_pending", label: "Claim pending" },
            { value: "resolved", label: "Resolved" },
          ]}
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

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner label="Loading items…" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<PackageSearch size={22} />}
          title="No items found"
          description="Adjust the filters or search to find records."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-brand-sand/80 bg-white shadow-sm">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-brand-sand/70 bg-brand-cream/60 text-[11px] uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Item</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Reporter</th>
                <th className="px-4 py-3 font-semibold">Claims</th>
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
                  <td className="px-4 py-3 text-xs text-stone-600">{item.category?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-xs text-stone-600">{item.reporter?.full_name ?? "—"}</td>
                  <td className="px-4 py-3 text-xs text-stone-600">{item.claims_count ?? 0}</td>
                  <td className="px-4 py-3 text-xs text-stone-500">
                    {new Date(item.date_reported).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={`/items/${item.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg px-2 py-1 text-xs font-semibold text-brand-brown hover:bg-brand-sand/40"
                      >
                        View
                      </a>
                      {item.status !== "open" ? (
                        <Button size="sm" variant="ghost" onClick={() => changeStatus(item, "open")}>
                          Reopen
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" onClick={() => changeStatus(item, "resolved")}>
                          Resolve
                        </Button>
                      )}
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
            Page {meta.current_page} of {meta.last_page} ({meta.total} items)
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
    </div>
  );
}
