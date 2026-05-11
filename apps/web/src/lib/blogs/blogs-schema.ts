import { z } from "zod";

export const publicAuthorSocialSchema = z.object({
  id: z.number(),
  handle: z.string().nullable(),
  fullUrl: z.string().nullable(),
  title: z.string(),
  iconUrl: z.string().nullable(),
  baseUrl: z.string(),
});

export const publicBlogAuthorSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().optional(),
  image: z.string().nullable(),
  socials: z.array(publicAuthorSocialSchema).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const publicBlogTagSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

export const publicBlogSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string().nullable(),
  content: z.string(),
  featuredImageUrl: z.string().nullable(),
  authorId: z.string(),
  author: publicBlogAuthorSchema.nullable(),
  publishDate: z.string().nullable(),
  readTimeMinutes: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  tags: z.array(publicBlogTagSchema).default([]),
});

export const publicBlogsParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(12),
  search: z.string().trim().optional(),
  sortBy: z.enum(["publishDate", "createdAt", "title"]).default("publishDate"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  tagId: z.number().int().positive().optional(),
  authorId: z.string().optional(),
  cursor: z.string().optional(),
});

export const publicBlogsRouteSearchSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().min(1).max(100).optional(),
  search: z.string().trim().optional(),
  sortBy: z.enum(["publishDate", "createdAt", "title"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  tagId: z.number().int().positive().optional(),
  authorId: z.string().optional(),
  cursor: z.string().optional(),
});

export type PublicBlog = z.infer<typeof publicBlogSchema>;
export type PublicBlogTag = z.infer<typeof publicBlogTagSchema>;
export type PublicBlogsParams = z.infer<typeof publicBlogsParamsSchema>;

export const normalizePublicBlogsParams = (
  params?: Partial<PublicBlogsParams>,
): PublicBlogsParams => {
  const parsed = publicBlogsParamsSchema.parse(params ?? {});

  return {
    ...parsed,
    search: parsed.search?.trim() || undefined,
  };
};
