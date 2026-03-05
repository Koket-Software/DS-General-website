import type { ApiSuccessResponse } from "@suba-company-template/types/api";

import type {
  PublicServiceDetail,
  PublicServiceListItem,
} from "./services-schema";

import { LANDING_API_ENDPOINTS } from "@/lib/API_ENDPOINTS";
import apiClient from "@/lib/axios";

export type PublicServicesListResponse = ApiSuccessResponse<
  PublicServiceListItem[]
>;
export type PublicServiceDetailResponse =
  ApiSuccessResponse<PublicServiceDetail>;

export interface PublicServicesParams {
  page?: number;
  limit?: number;
  search?: string;
  tagId?: number;
  sortBy?: "title" | "createdAt";
  sortOrder?: "asc" | "desc";
}

/**
 * Fetches public services list with optional filtering
 */
export const fetchPublicServices = async (params?: PublicServicesParams) => {
  const { data } = await apiClient.get<PublicServicesListResponse>(
    LANDING_API_ENDPOINTS.SERVICES_CLIENT,
    { params },
  );

  return data;
};

/**
 * Fetches a single public service by slug
 */
export const fetchPublicServiceBySlug = async (slug: string) => {
  const { data } = await apiClient.get<PublicServiceDetailResponse>(
    `${LANDING_API_ENDPOINTS.SERVICES_CLIENT}/${slug}`,
  );

  return data;
};
