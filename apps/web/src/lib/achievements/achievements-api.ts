import type { ApiSuccessResponse } from "@suba-company-template/types/api";

import type { ClientAchievement } from "./achievements-schema";

import { LANDING_API_ENDPOINTS } from "@/lib/API_ENDPOINTS";
import apiClient from "@/lib/axios";

export type PublicAchievementsResponse = ApiSuccessResponse<
  ClientAchievement[]
>;

export type PublicAchievementsParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export const fetchPublicAchievements = async (
  params?: PublicAchievementsParams,
) => {
  const { data } = await apiClient.get<PublicAchievementsResponse>(
    LANDING_API_ENDPOINTS.ACHIEVEMENTS_CLIENT,
    { params },
  );

  return data;
};
