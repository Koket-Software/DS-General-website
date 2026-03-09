import type { ApiSuccessResponse } from "@suba-company-template/types/api";
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import { createPublicNewsletterSubscriber } from "./newsletters-api";
import type {
  CreatePublicNewsletterInput,
  NewsletterSubscriber,
} from "./newsletters-schema";

import { LANDING_API_ENDPOINTS } from "@/lib/API_ENDPOINTS";

export const publicNewsletterKeys = {
  all: [LANDING_API_ENDPOINTS.NEWSLETTERS_CLIENT] as const,
};

export const useCreatePublicNewsletterMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiSuccessResponse<NewsletterSubscriber>,
      Error,
      CreatePublicNewsletterInput
    >,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options || {};

  return useMutation<
    ApiSuccessResponse<NewsletterSubscriber>,
    Error,
    CreatePublicNewsletterInput
  >({
    mutationFn: createPublicNewsletterSubscriber,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: publicNewsletterKeys.all });
      onSuccess?.(...args);
    },
    ...rest,
  });
};
