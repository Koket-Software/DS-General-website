import type { ApiSuccessResponse } from "@suba-company-template/types/api";

import type { PublicBlog, PublicBlogsParams } from "./blogs-schema";

import { LANDING_API_ENDPOINTS } from "@/lib/API_ENDPOINTS";
import apiClient from "@/lib/axios";

export type PublicBlogsResponse = ApiSuccessResponse<PublicBlog[]>;
export type PublicBlogDetailResponse = ApiSuccessResponse<PublicBlog>;

export const fetchPublicBlogs = async (params?: PublicBlogsParams) => {
  const { data } = await apiClient.get<PublicBlogsResponse>(
    LANDING_API_ENDPOINTS.BLOG_CLIENT,
    { params },
  );

  return data;
};

export const fetchPublicBlogBySlug = async (slug: string) => {
  const { data } = await apiClient.get<PublicBlogDetailResponse>(
    `${LANDING_API_ENDPOINTS.BLOG_CLIENT}/slug/${slug}`,
  );

  return data;
};
