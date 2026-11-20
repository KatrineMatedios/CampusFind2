import api from "@/lib/axios";
import type { AppNotification } from "@/types/notification";

export const getNotifications = () =>
  api
    .get<{ data: AppNotification[]; unread: number }>("/notifications")
    .then((r) => r.data);

export const markNotificationRead = (id: string) =>
  api.patch(`/notifications/${id}/read`).then((r) => r.data);

export const markAllNotificationsRead = () =>
  api.patch("/notifications/read-all").then((r) => r.data);
