import type { Item } from "./item";
import type { User } from "./user";

export type ClaimStatus = "pending" | "confirmed" | "rejected" | "collected";

export interface Claim {
  id: number;
  item_id: number;
  user_id: number;
  identifiers: string;
  proof_photo_url: string | null;
  pickup_location: string;
  pickup_time: string;
  qr_code: string;
  status: ClaimStatus;
  created_at: string;
  item?: Item;
  claimant?: User;
}

export interface ClaimPayload {
  identifiers: string;
  pickup_location: string;
  pickup_time: string;
  proof_photo?: File | null;
}
