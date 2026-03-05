import type { ApiSuccessResponse } from "@suba-company-template/types/api";
import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import {
  fetchPublicVacancies,
  fetchPublicVacancyBySlug,
  submitPublicVacancyApplication,
} from "./vacancies-api";
import {
  normalizePublicVacanciesParams,
  type CreatePublicVacancyApplicationInput,
  type PublicVacanciesParams,
  type PublicVacancy,
} from "./vacancies-schema";

import { LANDING_API_ENDPOINTS } from "@/lib/API_ENDPOINTS";

export const publicVacancyKeys = {
  all: [LANDING_API_ENDPOINTS.VACANCIES_CLIENT] as const,
  lists: () => [...publicVacancyKeys.all] as const,
  list: (params: PublicVacanciesParams) =>
    [...publicVacancyKeys.all, params] as const,
  details: () => [...publicVacancyKeys.all] as const,
  detailBySlug: (slug: string) =>
    [`${LANDING_API_ENDPOINTS.VACANCIES_CLIENT}/slug/${slug}`] as const,
};

export const publicVacanciesQueryOptions = (
  params?: Partial<PublicVacanciesParams>,
) => {
  const normalizedParams = normalizePublicVacanciesParams(params);

  return queryOptions({
    queryKey: publicVacancyKeys.list(normalizedParams),
    queryFn: () => fetchPublicVacancies(normalizedParams),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });
};

export const publicVacancyBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: publicVacancyKeys.detailBySlug(slug),
    queryFn: () => fetchPublicVacancyBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 1000 * 60,
  });

export const usePublicVacanciesQuery = (
  params?: Partial<PublicVacanciesParams>,
) => useQuery(publicVacanciesQueryOptions(params));

export const usePublicVacancyBySlugQuery = (slug: string) =>
  useQuery(publicVacancyBySlugQueryOptions(slug));

export const useSubmitPublicVacancyApplicationMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiSuccessResponse<{ id: number; status: string; createdAt: string }>,
      Error,
      {
        vacancyId: number | string;
        payload: CreatePublicVacancyApplicationInput;
      }
    >,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options || {};

  return useMutation<
    ApiSuccessResponse<{ id: number; status: string; createdAt: string }>,
    Error,
    { vacancyId: number | string; payload: CreatePublicVacancyApplicationInput }
  >({
    mutationFn: ({ vacancyId, payload }) =>
      submitPublicVacancyApplication(vacancyId, payload),
    onSuccess: (...args) => {
      // Keep vacancy list/detail fresh after application submit.
      queryClient.invalidateQueries({ queryKey: publicVacancyKeys.all });
      onSuccess?.(...args);
    },
    ...rest,
  });
};

export type PublicVacancyListResult = { data: PublicVacancy[] };
export type PublicVacancyDetailResult = { data: PublicVacancy };
