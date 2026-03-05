import type { ApiSuccessResponse } from "@suba-company-template/types/api";
import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import { createPublicContact, fetchPublicContacts } from "./contacts-api";
import {
  normalizePublicContactsParams,
  type CreatePublicContactInput,
  type PublicContact,
  type PublicContactsParams,
} from "./contacts-schema";

import { LANDING_API_ENDPOINTS } from "@/lib/API_ENDPOINTS";

export const publicContactKeys = {
  all: [LANDING_API_ENDPOINTS.CONTACT_US_CLIENT] as const,
  lists: () => [...publicContactKeys.all] as const,
  list: (params: PublicContactsParams) =>
    [...publicContactKeys.all, params] as const,
};

export const publicContactsQueryOptions = (
  params?: Partial<PublicContactsParams>,
) => {
  const normalizedParams = normalizePublicContactsParams(params);

  return queryOptions({
    queryKey: publicContactKeys.list(normalizedParams),
    queryFn: () => fetchPublicContacts(normalizedParams),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });
};

export const usePublicContactsQuery = (
  params?: Partial<PublicContactsParams>,
) => useQuery(publicContactsQueryOptions(params));

export const useCreatePublicContactMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiSuccessResponse<PublicContact>,
      Error,
      CreatePublicContactInput
    >,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options || {};

  return useMutation<
    ApiSuccessResponse<PublicContact>,
    Error,
    CreatePublicContactInput
  >({
    mutationFn: createPublicContact,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: publicContactKeys.all });
      onSuccess?.(...args);
    },
    ...rest,
  });
};
