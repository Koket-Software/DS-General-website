import type { ApiSuccessResponse } from "@suba-company-template/types/api";

import type {
  PublicCaseStudyDetail,
  PublicCaseStudyListItem,
} from "./case-study-schema";

import { LANDING_API_ENDPOINTS } from "@/lib/API_ENDPOINTS";
import apiClient from "@/lib/axios";

export type PublicCaseStudiesListResponse = ApiSuccessResponse<
  PublicCaseStudyListItem[]
>;
export type PublicCaseStudyDetailResponse =
  ApiSuccessResponse<PublicCaseStudyDetail>;

export interface PublicCaseStudiesParams {
  page?: number;
  limit?: number;
  search?: string;
  tagId?: number;
  clientId?: number;
  serviceId?: number;
}

/**
 * Fetches public case studies list with optional filtering
 */
export const fetchPublicCaseStudies = async (
  params?: PublicCaseStudiesParams,
) => {
  const { data } = await apiClient.get<PublicCaseStudiesListResponse>(
    LANDING_API_ENDPOINTS.CASE_STUDIES_CLIENT,
    { params },
  );

  return data;
};

/**
 * Fetches a single public case study by slug
 */
export const fetchPublicCaseStudyBySlug = async (slug: string) => {
  const { data } = await apiClient.get<PublicCaseStudyDetailResponse>(
    `${LANDING_API_ENDPOINTS.CASE_STUDIES_CLIENT}/${slug}`,
  );

  return data;
};
