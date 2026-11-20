import api from "@/lib/axios";
import type { ActivityEntry, ProfileResponse, User } from "@/types/user";

export const getProfile = () =>
  api.get<ProfileResponse>("/profile").then((r) => r.data);

export const updateProfile = (payload: {
  first_name?: string;
  last_name?: string;
  email?: string;
  college_program?: string | null;
  contact_number?: string | null;
}) =>
  api
    .put<{ data: User; message: string }>("/profile", payload)
    .then((r) => r.data);

export const updateAvatar = (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return api
    .post<{ data: User; message: string }>("/profile/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
};

export const getActivity = (filter: "all" | "reports" | "updates") =>
  api
    .get<{ data: ActivityEntry[] }>("/profile/activity", { params: { filter } })
    .then((r) => r.data.data);
