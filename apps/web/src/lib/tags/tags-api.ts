import type { ApiSuccessResponse } from "@suba-company-template/types/api";

import type { PublicTag } from "./tags-schema";

import { LANDING_API_ENDPOINTS } from "@/lib/API_ENDPOINTS";
import apiClient from "@/lib/axios";

export type PublicTagsListResponse = ApiSuccessResponse<PublicTag[]>;

export interface PublicTagsParams {
  page?: number;
  limit?: number;
  search?: string;
}

/**
 * Fetches public tags list with optional filtering
 */
export const fetchPublicTags = async (params?: PublicTagsParams) => {
  const { data } = await apiClient.get<PublicTagsListResponse>(
    LANDING_API_ENDPOINTS.TAGS_CLIENT,
    { params },
  );

  return data;
};
