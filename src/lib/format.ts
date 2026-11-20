import axios from "axios";
import type { ValidationErrors } from "@/types/api";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";

  // Date-only values (e.g. 2026-11-05) should not shift by timezone.
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (dateOnly) {
    const [, year, month, day] = dateOnly;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    if (Number.isNaN(date.getTime())) return value;
    return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${formatDate(value)} · ${date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  })}`;
}

export function timeAgo(value: string): string {
  const date = new Date(value);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(value);
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ValidationErrors>(error)) {
    // No response received: network failure, CORS block, mixed-content block,
    // DNS failure, or an unreachable/wrong API URL.
    if (!error.response) {
      // Detect likely mixed-content (HTTPS page calling HTTP API)
      const requestUrl = error.config?.url ?? "";
      const baseUrl = error.config?.baseURL ?? "";
      const fullUrl = `${baseUrl}${requestUrl}`;
      if (fullUrl.startsWith("http://") && typeof window !== "undefined" && window.location.protocol === "https:") {
        return "Mixed content blocked: the page is HTTPS but the API URL uses HTTP. Update VITE_API_URL to use https://.";
      }

      if (error.code === "ERR_NETWORK") {
        return "Cannot reach the server. Check your internet connection, verify VITE_API_URL is set to your deployed backend URL (https://.../api), and ensure the backend is deployed and running.";
      }
      if (error.code === "ECONNABORTED") {
        return "The request timed out. The backend may be waking up (free hosting cold start) — wait 30–60 seconds and try again.";
      }
      return (
        error.message ||
        "Cannot reach the server. Check your internet connection and API configuration."
      );
    }

    const firstError = error.response?.data?.errors
      ? Object.values(error.response.data.errors)[0]?.[0]
      : undefined;
    return (
      firstError ??
      error.response?.data?.message ??
      `Server error (${error.response.status}). Please try again.`
    );
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function toDateTimeInput(date: Date): string {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}
