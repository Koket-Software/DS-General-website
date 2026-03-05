import type { ApiSuccessResponse } from "@suba-company-template/types/api";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";

import { fetchPublicBlogBySlug, fetchPublicBlogs } from "./blogs-api";
import {
  normalizePublicBlogsParams,
  type PublicBlog,
  type PublicBlogsParams,
} from "./blogs-schema";

import { LANDING_API_ENDPOINTS } from "@/lib/API_ENDPOINTS";

export const publicBlogKeys = {
  all: [LANDING_API_ENDPOINTS.BLOG_CLIENT] as const,
  lists: () => [...publicBlogKeys.all] as const,
  list: (params: PublicBlogsParams) => [...publicBlogKeys.all, params] as const,
  details: () => [...publicBlogKeys.all] as const,
  detailBySlug: (slug: string) =>
    [`${LANDING_API_ENDPOINTS.BLOG_CLIENT}/slug/${slug}`] as const,
};

export const publicBlogsQueryOptions = (
  params?: Partial<PublicBlogsParams>,
) => {
  const normalizedParams = normalizePublicBlogsParams(params);

  return queryOptions({
    queryKey: publicBlogKeys.list(normalizedParams),
    queryFn: () => fetchPublicBlogs(normalizedParams),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2,
  });
};

export const publicBlogBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: publicBlogKeys.detailBySlug(slug),
    queryFn: () => fetchPublicBlogBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  });

export const usePublicBlogsQuery = (
  params?: Partial<PublicBlogsParams>,
): UseQueryResult<ApiSuccessResponse<PublicBlog[]>, Error> =>
  useQuery(publicBlogsQueryOptions(params));

export const usePublicBlogBySlugQuery = (
  slug: string,
): UseQueryResult<ApiSuccessResponse<PublicBlog>, Error> =>
  useQuery(publicBlogBySlugQueryOptions(slug));
