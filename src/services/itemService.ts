import api from "@/lib/axios";
import type { Paginated } from "@/types/api";
import type {
  Category,
  DashboardStats,
  Item,
  ItemFilters,
  ItemType,
  MyReportsResponse,
} from "@/types/item";

export const getItems = (params?: ItemFilters) =>
  api
    .get<Paginated<Item>>("/items", { params })
    .then((r) => r.data.data ?? []);

export const getRecentLost = () =>
  api.get<{ data: Item[] }>("/items/recent-lost").then((r) => r.data.data);

export const getItem = (id: number | string) =>
  api.get<{ data: Item }>(`/items/${id}`).then((r) => r.data.data);

export const createItem = (formData: FormData) =>
  api
    .post<{ data: Item; message: string }>("/items", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);

export const updateItem = (id: number | string, formData: FormData) =>
  api
    .post(`/items/${id}?_method=PUT`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);

export const deleteItem = (id: number | string) =>
  api.delete(`/items/${id}`).then((r) => r.data);

export const getCategories = () =>
  api.get<{ data: Category[] }>("/categories").then((r) => r.data.data);

export const getDashboardStats = () =>
  api.get<DashboardStats>("/dashboard/stats").then((r) => r.data);

export const getMyReports = (type?: ItemType) =>
  api
    .get<MyReportsResponse>("/my-reports", { params: type ? { type } : undefined })
    .then((r) => r.data);

export const getResolvedReports = () =>
  api.get<{ data: Item[] }>("/my-reports/resolved").then((r) => r.data.data);
