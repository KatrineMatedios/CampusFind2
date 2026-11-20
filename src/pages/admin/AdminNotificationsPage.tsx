import { useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";
import * as notificationService from "@/services/notificationService";
import { formatDateTime, getErrorMessage } from "@/lib/format";
import type { AppNotification } from "@/types/notification";

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const result = await notificationService.getNotifications();
      setNotifications(result.data);
      setUnread(result.unread);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function markRead(id: string) {
    try {
      await notificationService.markNotificationRead(id);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function markAll() {
    try {
      await notificationService.markAllNotificationsRead();
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-800 lg:text-2xl">Notifications</h2>
          <p className="mt-1 text-xs text-stone-500 lg:text-sm">
            System notifications and announcements.
          </p>
        </div>
        {unread > 0 ? (
          <Button size="sm" variant="outline" leftIcon={<CheckCheck size={14} />} onClick={() => void markAll()}>
            Mark all as read
          </Button>
        ) : null}
      </div>

      {error ? <Alert variant="error">{error}</Alert> : null}

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner label="Loading notifications…" />
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={<Bell size={22} />}
          title="No notifications"
          description="You're all caught up."
        />
      ) : (
        <ul className="space-y-2.5">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`rounded-2xl border p-4 shadow-sm transition ${
                n.read_at ? "border-brand-sand/60 bg-white" : "border-brand-brown/30 bg-brand-cream/70"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-stone-800">{n.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-stone-600">{n.message}</p>
                  <p className="mt-1.5 text-[10px] font-medium text-stone-400">
                    {formatDateTime(n.created_at)}
                    {n.category ? ` · ${n.category}` : ""}
                  </p>
                </div>
                {!n.read_at ? (
                  <Button size="sm" variant="ghost" onClick={() => void markRead(n.id)}>
                    Mark read
                  </Button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
