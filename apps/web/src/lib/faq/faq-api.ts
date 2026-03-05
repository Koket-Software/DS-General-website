import type { ApiSuccessResponse } from "@suba-company-template/types/api";

import type { Faq } from "./faq-schema";

import { LANDING_API_ENDPOINTS } from "@/lib/API_ENDPOINTS";
import apiClient from "@/lib/axios";

export type PublicFaqListResponse = ApiSuccessResponse<Faq[]>;

export const fetchPublicFaqs = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "createdAt" | "question";
  sortOrder?: "asc" | "desc";
}) => {
  const { data } = await apiClient.get<PublicFaqListResponse>(
    LANDING_API_ENDPOINTS.FAQS_CLIENT,
    { params },
  );

  return data;
};
