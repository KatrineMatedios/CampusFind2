export interface AppNotification {
  id: string;
  title: string;
  message: string;
  url: string | null;
  category: string;
  read_at: string | null;
  created_at: string;
}
