import { z } from "zod";

import {
  paginationSchema,
  searchSchema,
  sortSchema,
} from "../../shared/query/parser";

export const newsletterSortFields = [
  "createdAt",
  "email",
  "subscribedAt",
] as const;
export type NewsletterSortField = (typeof newsletterSortFields)[number];

const newsletterSortSchema = sortSchema.extend({
  sortBy: z.enum(newsletterSortFields).optional(),
});

export const createNewsletterSchema = z.object({
  email: z.string().email("Valid email is required"),
  fullName: z.string().trim().max(120).nullish(),
});

export const updateNewsletterSchema = z.object({
  isActive: z.boolean(),
});

export const newslettersQuerySchema = paginationSchema
  .merge(newsletterSortSchema)
  .merge(searchSchema)
  .extend({
    sortBy: z.enum(newsletterSortFields).optional(),
    isActive: z.coerce.boolean().optional(),
  });

export const newsletterIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreateNewsletterInput = z.infer<typeof createNewsletterSchema>;
export type UpdateNewsletterInput = z.infer<typeof updateNewsletterSchema>;
export type NewslettersQuery = z.infer<typeof newslettersQuerySchema>;
export type NewsletterIdParams = z.infer<typeof newsletterIdParamSchema>;
