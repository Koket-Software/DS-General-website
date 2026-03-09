import {
  keepPreviousData,
  queryOptions,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";

import {
  fetchPublicAchievements,
  type PublicAchievementsParams,
} from "./achievements-api";
import type { ClientAchievement } from "./achievements-schema";

import { LANDING_API_ENDPOINTS } from "@/lib/API_ENDPOINTS";

export const achievementsKeys = {
  all: [LANDING_API_ENDPOINTS.ACHIEVEMENTS_CLIENT] as const,
  list: (params: Required<PublicAchievementsParams>) =>
    [LANDING_API_ENDPOINTS.ACHIEVEMENTS_CLIENT, params] as const,
};

const normalizeParams = (
  params?: PublicAchievementsParams,
): Required<PublicAchievementsParams> => ({
  page: params?.page ?? 1,
  limit: params?.limit ?? 6,
  search: params?.search?.trim() || "",
});

export const publicAchievementsQueryOptions = (
  params?: PublicAchievementsParams,
) => {
  const normalized = normalizeParams(params);

  return queryOptions({
    queryKey: achievementsKeys.list(normalized),
    queryFn: () =>
      fetchPublicAchievements({
        ...normalized,
        search: normalized.search || undefined,
      }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2,
  });
};

interface PublicAchievementsListResponse {
  data: ClientAchievement[];
}

export const usePublicAchievementsQuery = (
  params?: PublicAchievementsParams,
): UseQueryResult<PublicAchievementsListResponse, Error> =>
  useQuery(publicAchievementsQueryOptions(params));
