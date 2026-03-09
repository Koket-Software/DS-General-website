import type { ApiSuccessResponse } from "@suba-company-template/types/api";

import type {
  Newsletter,
  NewsletterListParams,
  UpdateNewsletter,
} from "./newsletter-schema";

import { AUTH_API_ENDPOINTS } from "@/lib/API_ENDPOINTS";
import apiClient from "@/lib/axios";

interface PaginatedNewsletterResponse {
  success: boolean;
  data: Newsletter[];
  meta: {
    timestamp: string;
    requestId: string;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export type NewsletterListResponse = PaginatedNewsletterResponse;
export type NewsletterDetailResponse = ApiSuccessResponse<Newsletter>;
export type DeleteNewsletterResponse = ApiSuccessResponse<{ message: string }>;

export const fetchNewsletters = async (params: NewsletterListParams) => {
  const { data } = await apiClient.get<NewsletterListResponse>(
    AUTH_API_ENDPOINTS.NEWSLETTERS,
    { params },
  );

  return data;
};

export const updateNewsletter = async (
  id: number,
  payload: UpdateNewsletter,
): Promise<NewsletterDetailResponse> => {
  const { data } = await apiClient.patch<NewsletterDetailResponse>(
    `${AUTH_API_ENDPOINTS.NEWSLETTERS}/${id}`,
    payload,
  );

  return data;
};

export const deleteNewsletter = async (
  id: number,
): Promise<DeleteNewsletterResponse> => {
  const { data } = await apiClient.delete<DeleteNewsletterResponse>(
    `${AUTH_API_ENDPOINTS.NEWSLETTERS}/${id}`,
  );

  return data;
};
