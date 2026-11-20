import api from "@/lib/axios";
import type { Claim, ClaimPayload, ClaimStatus } from "@/types/claim";

export const submitClaim = (itemId: number | string, payload: ClaimPayload) => {
  const formData = new FormData();
  formData.append("identifiers", payload.identifiers);
  formData.append("pickup_location", payload.pickup_location);
  formData.append("pickup_time", payload.pickup_time);
  if (payload.proof_photo) {
    formData.append("proof_photo", payload.proof_photo);
  }

  return api
    .post<{ data: Claim; message: string }>(`/items/${itemId}/claims`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
};

export const getClaim = (id: number | string) =>
  api.get<{ data: Claim }>(`/claims/${id}`).then((r) => r.data.data);

export const updateClaimStatus = (id: number | string, status: ClaimStatus) =>
  api.patch(`/claims/${id}/status`, { status }).then((r) => r.data);
