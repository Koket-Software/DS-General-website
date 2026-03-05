import type { ApiSuccessResponse } from "@suba-company-template/types/api";

import type { Testimonial } from "./testimonial-schema";

import { LANDING_API_ENDPOINTS } from "@/lib/API_ENDPOINTS";
import apiClient from "@/lib/axios";

export type PublicTestimonialListResponse = ApiSuccessResponse<Testimonial[]>;

export const fetchPublicTestimonials = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const { data } = await apiClient.get<PublicTestimonialListResponse>(
    LANDING_API_ENDPOINTS.TESTIMONIALS_CLIENT,
    { params },
  );

  return data;
};
