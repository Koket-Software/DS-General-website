import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import {
  deleteNewsletter,
  fetchNewsletters,
  updateNewsletter,
  type DeleteNewsletterResponse,
  type NewsletterDetailResponse,
} from "./newsletter-api";
import {
  normalizeNewsletterListParams,
  type NewsletterListParams,
  type UpdateNewsletter,
} from "./newsletter-schema";

import { AUTH_API_ENDPOINTS } from "@/lib/API_ENDPOINTS";

export const newsletterKeys = {
  all: [AUTH_API_ENDPOINTS.NEWSLETTERS] as const,
  lists: () => [...newsletterKeys.all] as const,
  list: (params: NewsletterListParams) =>
    [...newsletterKeys.all, params] as const,
  detail: (id: number) => [`${AUTH_API_ENDPOINTS.NEWSLETTERS}/${id}`] as const,
};

export const useNewslettersQuery = (params: Partial<NewsletterListParams>) => {
  const normalizedParams = normalizeNewsletterListParams(params);

  return useQuery({
    queryKey: newsletterKeys.list(normalizedParams),
    queryFn: () => fetchNewsletters(normalizedParams),
  });
};

type UpdateStatusOptions = Omit<
  UseMutationOptions<
    NewsletterDetailResponse,
    Error,
    { id: number; data: UpdateNewsletter }
  >,
  "mutationFn"
>;

export const useUpdateNewsletterStatusMutation = (
  options?: UpdateStatusOptions,
) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, ...rest } = options || {};

  return useMutation<
    NewsletterDetailResponse,
    Error,
    { id: number; data: UpdateNewsletter }
  >({
    mutationFn: ({ id, data }) => updateNewsletter(id, data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: newsletterKeys.detail(args[1].id),
      });
      onSuccess?.(...args);
    },
    ...(onError && { onError }),
    ...rest,
  });
};

type DeleteOptions = Omit<
  UseMutationOptions<DeleteNewsletterResponse, Error, number>,
  "mutationFn"
>;

export const useDeleteNewsletterMutation = (options?: DeleteOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, ...rest } = options || {};

  return useMutation<DeleteNewsletterResponse, Error, number>({
    mutationFn: deleteNewsletter,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.lists() });
      queryClient.removeQueries({ queryKey: newsletterKeys.detail(args[1]) });
      onSuccess?.(...args);
    },
    ...(onError && { onError }),
    ...rest,
  });
};
