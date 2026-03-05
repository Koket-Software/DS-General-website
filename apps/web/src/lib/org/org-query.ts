import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";

import { fetchPublicOrg } from "./org-api";
import { normalizePublicOrgParams, type PublicOrgParams } from "./org-schema";

import { LANDING_API_ENDPOINTS } from "@/lib/API_ENDPOINTS";

export const publicOrgKeys = {
  all: [LANDING_API_ENDPOINTS.ORG_CLIENT] as const,
  lists: () => [...publicOrgKeys.all] as const,
  list: (params: PublicOrgParams) => [...publicOrgKeys.all, params] as const,
};

export const publicOrgQueryOptions = (params?: Partial<PublicOrgParams>) => {
  const normalizedParams = normalizePublicOrgParams(params);

  return queryOptions({
    queryKey: publicOrgKeys.list(normalizedParams),
    queryFn: () => fetchPublicOrg(normalizedParams),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
};

export const usePublicOrgQuery = (params?: Partial<PublicOrgParams>) =>
  useQuery(publicOrgQueryOptions(params));
