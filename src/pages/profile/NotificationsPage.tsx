import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, BellRing, CheckCheck, PackageCheck } from "lucide-react";
import Alert from "@/components/ui/Alert";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import { getErrorMessage, timeAgo } from "@/lib/format";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services/notificationService";
import type { AppNotification } from "@/types/notification";

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getNotifications()
      .then((response) => {
        if (!active) return;
        setNotifications(response.data);
        setUnread(response.unread);
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
  }, []);

  const handleOpen = async (notification: AppNotification) => {
    if (!notification.read_at) {
      try {
        await markNotificationRead(notification.id);
        setNotifications((previous) =>
          previous.map((entry) =>
            entry.id === notification.id
              ? { ...entry, read_at: new Date().toISOString() }
              : entry,
          ),
        );
        setUnread((previous) => Math.max(0, previous - 1));
      } catch {
        // Opening the notification is still useful if marking it read fails.
      }
    }

    if (notification.url) navigate(notification.url);
  };

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsRead();
      const now = new Date().toISOString();
      setNotifications((previous) =>
        previous.map((entry) => ({ ...entry, read_at: entry.read_at ?? now })),
      );
      setUnread(0);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <PageHeader
        title="Notifications"
        subtitle={
          unread > 0
            ? `${unread} unread notification${unread === 1 ? "" : "s"}`
            : "You're all caught up."
        }
        showBack
        action={
          unread > 0 ? (
            <button
              type="button"
              onClick={handleMarkAll}
              className="inline-flex items-center gap-1 rounded-xl bg-brand-sand/60 px-2.5 py-2 text-[10px] font-semibold text-brand-brown"
            >
              <CheckCheck size={13} /> Mark all
            </button>
          ) : undefined
        }
      />

      {error ? <Alert variant="error" className="mb-4">{error}</Alert> : null}

      {loading ? (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="h-20 animate-pulse rounded-2xl border border-brand-sand/80 bg-white"
            />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={<Bell size={22} />}
          title="No notifications"
          description="Updates about your reports and claims will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2">
          {notifications.map((notification) => {
            const isClaim = notification.category === "claim";
            const unreadItem = !notification.read_at;
            return (
              <button
                key={notification.id}
                type="button"
                onClick={() => handleOpen(notification)}
                className={`flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left shadow-sm transition hover:shadow-md ${
                  unreadItem
                    ? "border-brand-brown/20 bg-white"
                    : "border-brand-sand/70 bg-white/70"
                }`}
              >
                <span
                  className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isClaim
                      ? "bg-[#CDE8C8] text-[#2F6B2A]"
                      : "bg-brand-sand/60 text-brand-brown"
                  }`}
                >
                  {isClaim ? <PackageCheck size={18} /> : <BellRing size={17} />}
                  {unreadItem ? (
                    <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand-brown" />
                  ) : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-stone-800">
                      {notification.title}
                    </span>
                    <span className="shrink-0 text-[9px] text-stone-400">
                      {timeAgo(notification.created_at)}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-relaxed text-stone-500">
                    {notification.message}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
