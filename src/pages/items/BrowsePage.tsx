import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PackageSearch, Search } from "lucide-react";
import FilterChips from "@/components/items/FilterChips";
import ItemList from "@/components/items/ItemList";
import Alert from "@/components/ui/Alert";
import EmptyState from "@/components/ui/EmptyState";
import Input from "@/components/ui/Input";
import PageHeader from "@/components/ui/PageHeader";
import { getErrorMessage } from "@/lib/format";
import { getCategories, getItems } from "@/services/itemService";
import type { Category, Item, ItemType } from "@/types/item";

export default function BrowsePage() {
  const [searchParams] = useSearchParams();
  const querySearch = searchParams.get("search") ?? "";
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState(querySearch);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setSearch(querySearch);
  }, [querySearch]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 350);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    const type: ItemType | undefined =
      filter === "lost" || filter === "found" ? filter : undefined;
    const category = filter.startsWith("cat-") ? filter.slice(4) : undefined;

    getItems({ type, category, search: debouncedSearch.trim() || undefined })
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
  }, [filter, debouncedSearch]);

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "lost", label: "Lost" },
    { value: "found", label: "Found" },
    ...categories.map((category) => ({
      value: `cat-${category.id}`,
      label: category.name,
    })),
  ];

  return (
    <div>
      <PageHeader
        title="Browse Items"
        subtitle="Search lost and found reports across campus."
        action={
          <Link
            to="/report"
            className="rounded-xl bg-brand-brown px-3 py-2 text-[11px] font-semibold text-white"
          >
            Report
          </Link>
        }
      />

      <div className="space-y-3">
        <Input
          type="search"
          placeholder="Search item, location, or keyword…"
          icon={<Search size={16} />}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search items"
        />

        <FilterChips options={filterOptions} value={filter} onChange={setFilter} />

        <div className="flex items-center justify-between pt-1">
          <p className="text-[11px] font-medium text-stone-500">
            {loading
              ? "Searching…"
              : `${items.length} item${items.length === 1 ? "" : "s"} found`}
          </p>
          {debouncedSearch ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-[11px] font-semibold text-brand-brown hover:underline"
            >
              Clear search
            </button>
          ) : null}
        </div>

        {error ? <Alert variant="error">{error}</Alert> : null}

        <ItemList
          items={items}
          loading={loading}
          emptyTitle="No matching items"
          emptyDescription="Try another keyword or category. You can also report the item yourself so others can watch for it."
          emptyAction={
            <Link
              to="/report"
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-brown px-4 py-2 text-xs font-semibold text-white"
            >
              <PackageSearch size={14} /> Report an Item
            </Link>
          }
        />

        {!loading && items.length > 0 ? (
          <EmptyState
            className="border-solid bg-brand-sand/25 py-4"
            icon={<Search size={18} />}
            title="Can't find it?"
            description="Report your lost item so the campus community can keep an eye out."
            action={
              <Link
                to="/report"
                className="text-xs font-semibold text-brand-brown hover:underline"
              >
                Create a lost item report →
              </Link>
            }
          />
        ) : null}
      </div>
    </div>
  );
}
