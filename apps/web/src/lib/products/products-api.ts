import type { ApiSuccessResponse } from "@suba-company-template/types/api";

import type {
  PublicProductDetail,
  PublicProductListItem,
} from "./products-schema";

import { LANDING_API_ENDPOINTS } from "@/lib/API_ENDPOINTS";
import apiClient from "@/lib/axios";

export type PublicProductsListResponse = ApiSuccessResponse<
  PublicProductListItem[]
>;
export type PublicProductDetailResponse =
  ApiSuccessResponse<PublicProductDetail>;

export interface PublicProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  tagId?: number;
}

/**
 * Fetches public products list with optional filtering
 */
export const fetchPublicProducts = async (params?: PublicProductsParams) => {
  const { data } = await apiClient.get<PublicProductsListResponse>(
    LANDING_API_ENDPOINTS.PRODUCTS_CLIENT,
    { params },
  );

  return data;
};

/**
 * Fetches a single public product by slug
 */
export const fetchPublicProductBySlug = async (slug: string) => {
  const { data } = await apiClient.get<PublicProductDetailResponse>(
    `${LANDING_API_ENDPOINTS.PRODUCTS_CLIENT}/${slug}`,
  );

  return data;
};
