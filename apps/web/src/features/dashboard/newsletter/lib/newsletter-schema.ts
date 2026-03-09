import { z } from "zod";

export const newsletterSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  fullName: z.string().nullable(),
  isActive: z.boolean(),
  subscribedAt: z.string(),
  unsubscribedAt: z.string().nullable(),
  createdAt: z.string(),
});

export const updateNewsletterSchema = z.object({
  isActive: z.boolean(),
});

export type Newsletter = z.infer<typeof newsletterSchema>;
export type UpdateNewsletter = z.infer<typeof updateNewsletterSchema>;

export const newsletterListParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "email", "subscribedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  isActive: z.boolean().optional(),
});

export type NewsletterListParams = z.infer<typeof newsletterListParamsSchema>;

export const normalizeNewsletterListParams = (
  params: Partial<NewsletterListParams>,
): NewsletterListParams => {
  const parsed = newsletterListParamsSchema.parse(params);
  return {
    ...parsed,
    search: parsed.search?.trim() || undefined,
  };
};
