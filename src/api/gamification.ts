import { api } from "@/lib/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export type RankTier =
  | "ASPIRANT"
  | "CONSTABLE"
  | "SUB_INSPECTOR"
  | "INSPECTOR"
  | "COMMISSIONER";

export interface LeaderboardEntry {
  id: string;
  name: string;
  email: string;
  xpPoints: number;
  rankTier: RankTier;
  streakDays: number;
  lastActiveDate: string | null;
}

export interface LeaderboardResponse {
  students: LeaderboardEntry[];
  total: number;
  limit: number;
  offset: number;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  iconUrl: string | null;
  criteria: string;
  _count: { userBadges: number };
}

export interface UserBadgeRecord {
  id: string;
  badgeId: string;
  awardedAt: string;
  badge: Omit<BadgeDefinition, "_count">;
}

export interface AdminUserGamificationProfile {
  id: string;
  name: string;
  email: string;
  xpPoints: number;
  rankTier: RankTier;
  streakDays: number;
  lastActiveDate: string | null;
  badges: UserBadgeRecord[];
}

export interface AdjustXPPayload {
  delta: number;
  reason: string;
}

export interface SetStreakPayload {
  days: number;
}

export interface AwardBadgePayload {
  badgeId: string;
}

export interface CreateBadgePayload {
  name: string;
  description: string;
  criteria: string;
  iconUrl?: string;
}

// ─── API calls ────────────────────────────────────────────────────────────────

export const getLeaderboard = async (
  limit = 50,
  offset = 0
): Promise<LeaderboardResponse> => {
  const { data } = await api.get("/gamification/leaderboard", {
    params: { limit, offset },
  });
  return data.data;
};

export const getAdminUserProfile = async (
  userId: string
): Promise<AdminUserGamificationProfile> => {
  const { data } = await api.get(`/gamification/users/${userId}`);
  return data.data;
};

export const adjustXP = async (
  userId: string,
  payload: AdjustXPPayload
): Promise<{ id: string; xpPoints: number; rankTier: RankTier }> => {
  const { data } = await api.patch(`/gamification/users/${userId}/xp`, payload);
  return data.data;
};

export const setStreak = async (
  userId: string,
  payload: SetStreakPayload
): Promise<{ id: string; streakDays: number }> => {
  const { data } = await api.patch(
    `/gamification/users/${userId}/streak`,
    payload
  );
  return data.data;
};

export const awardBadge = async (
  userId: string,
  payload: AwardBadgePayload
): Promise<UserBadgeRecord> => {
  const { data } = await api.post(
    `/gamification/users/${userId}/badges`,
    payload
  );
  return data.data;
};

export const listBadges = async (): Promise<BadgeDefinition[]> => {
  const { data } = await api.get("/gamification/badges");
  return data.data;
};

export const createBadge = async (
  payload: CreateBadgePayload
): Promise<BadgeDefinition> => {
  const { data } = await api.post("/gamification/badges", payload);
  return data.data;
};

export const deleteBadge = async (badgeId: string): Promise<void> => {
  await api.delete(`/gamification/badges/${badgeId}`);
};
