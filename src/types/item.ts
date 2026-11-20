export type ItemType = "lost" | "found";
export type ItemStatus = "open" | "claim_pending" | "resolved";

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Reporter {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  student_id: string;
  contact_number: string | null;
  avatar_url: string | null;
}

export interface Item {
  id: number;
  user_id: number;
  type: ItemType;
  name: string;
  category: Category;
  category_id: number;
  location: string;
  description: string;
  photo_url: string | null;
  date_reported: string;
  status: ItemStatus;
  created_at: string;
  reporter?: Reporter;
  claims_count?: number;
}

export interface ItemFilters {
  type?: ItemType;
  category?: number | string;
  search?: string;
  status?: ItemStatus;
}

export interface DashboardStats {
  lost: number;
  found: number;
  resolved: number;
}

export interface MyReportsResponse {
  data: Item[];
  counts: {
    all: number;
    lost: number;
    found: number;
  };
}
