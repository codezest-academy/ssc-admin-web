import { api } from "@/lib/axios";

export type Role = "SUPER_ADMIN" | "ADMIN" | "STAFF" | "STUDENT";
export type SubscriptionTier = "FREE" | "PRO" | "ELITE";
export type StudyPersona =
  | "FULL_TIME_ASPIRANT"
  | "PART_TIME_ASPIRANT"
  | "REPEAT_ASPIRANT";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  subscriptionTier: SubscriptionTier;
  isEmailVerified: boolean;
  isActive: boolean;
  onboardingComplete: boolean;
  studyPersona: StudyPersona | null;
  targetExam: string | null;
  createdAt: string;
}

export interface UpdateRolePayload {
  role: Role;
}

export const getUsers = async (): Promise<AdminUser[]> => {
  const { data } = await api.get("/users");
  return data.data;
};

export const updateUserRole = async (
  userId: string,
  payload: UpdateRolePayload
): Promise<AdminUser> => {
  const { data } = await api.patch(`/users/${userId}/role`, payload);
  return data.data;
};

export const toggleUserStatus = async (userId: string): Promise<AdminUser> => {
  const { data } = await api.patch(`/users/${userId}/toggle-status`);
  return data.data;
};

export const updateProfile = async (payload: { name: string }): Promise<AdminUser> => {
  const { data } = await api.patch("/users/me", payload);
  return data.data;
};

export const updatePassword = async (payload: { currentPassword: string; newPassword: string }): Promise<void> => {
  await api.patch("/users/me/password", payload);
};
