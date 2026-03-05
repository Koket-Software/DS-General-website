import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";

import { fetchPublicSocials } from "./socials-api";
import {
  normalizePublicSocialsParams,
  type PublicSocialsParams,
} from "./socials-schema";

import { LANDING_API_ENDPOINTS } from "@/lib/API_ENDPOINTS";

export const publicSocialKeys = {
  all: [LANDING_API_ENDPOINTS.SOCIALS_CLIENT] as const,
  lists: () => [...publicSocialKeys.all] as const,
  list: (params: PublicSocialsParams) =>
    [...publicSocialKeys.all, params] as const,
};

export const publicSocialsQueryOptions = (
  params?: Partial<PublicSocialsParams>,
) => {
  const normalizedParams = normalizePublicSocialsParams(params);

  return queryOptions({
    queryKey: publicSocialKeys.list(normalizedParams),
    queryFn: () => fetchPublicSocials(normalizedParams),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
};

export const usePublicSocialsQuery = (params?: Partial<PublicSocialsParams>) =>
  useQuery(publicSocialsQueryOptions(params));
