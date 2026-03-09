import type { ApiSuccessResponse } from "@suba-company-template/types/api";

import type {
  CreatePublicNewsletterInput,
  NewsletterSubscriber,
} from "./newsletters-schema";

import { LANDING_API_ENDPOINTS } from "@/lib/API_ENDPOINTS";
import apiClient from "@/lib/axios";

export type PublicNewsletterSubscribeResponse =
  ApiSuccessResponse<NewsletterSubscriber>;

export const createPublicNewsletterSubscriber = async (
  payload: CreatePublicNewsletterInput,
) => {
  const { data } = await apiClient.post<PublicNewsletterSubscribeResponse>(
    LANDING_API_ENDPOINTS.NEWSLETTERS_CLIENT,
    payload,
  );

  return data;
};
