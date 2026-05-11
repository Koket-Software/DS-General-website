import { z } from "zod";

export const publicVacancyTagSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

export const publicVacancyStatusSchema = z.enum([
  "DRAFT",
  "PUBLISHED",
  "CLOSED",
  "ARCHIVED",
]);

export const publicVacancySchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string().nullable(),
  description: z.string().optional().default(""),
  featuredImageUrl: z.string().nullable(),
  department: z.string().nullable(),
  location: z.string().nullable(),
  workplaceType: z.string().nullable(),
  employmentType: z.string().nullable(),
  seniority: z.string().nullable(),
  salaryMin: z.number().nullable(),
  salaryMax: z.number().nullable(),
  salaryCurrency: z.string().nullable(),
  externalApplyUrl: z.string().nullable(),
  applyEmail: z.string().nullable(),
  status: publicVacancyStatusSchema,
  publishedAt: z.string().nullable(),
  deadlineAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  tags: z.array(publicVacancyTagSchema).default([]),
  applicationCount: z.number().default(0),
});

export const publicVacanciesParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  sortBy: z
    .enum(["publishedAt", "deadlineAt", "createdAt", "title"])
    .default("publishedAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  openOnly: z.boolean().optional(),
});

export const publicVacanciesRouteSearchSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().min(1).max(100).optional(),
  search: z.string().trim().optional(),
  sortBy: z
    .enum(["publishedAt", "deadlineAt", "createdAt", "title"])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  openOnly: z.boolean().optional(),
});

export const createPublicVacancyApplicationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email(),
  phone: z.string().optional(),
  resume: z.instanceof(File).optional(),
  portfolioUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
  coverLetter: z.string().max(10000).optional(),
});

export type PublicVacancy = z.infer<typeof publicVacancySchema>;
export type PublicVacanciesParams = z.infer<typeof publicVacanciesParamsSchema>;
export type CreatePublicVacancyApplicationInput = z.infer<
  typeof createPublicVacancyApplicationSchema
>;

export const normalizePublicVacanciesParams = (
  params?: Partial<PublicVacanciesParams>,
): PublicVacanciesParams => {
  const parsed = publicVacanciesParamsSchema.parse(params ?? {});

  return {
    ...parsed,
    search: parsed.search?.trim() || undefined,
  };
};
