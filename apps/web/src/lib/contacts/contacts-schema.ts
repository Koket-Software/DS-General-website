import { z } from "zod";

export const publicContactSchema = z.object({
  id: z.number(),
  fullName: z.string(),
  contact: z.string(),
  message: z.string(),
  serviceId: z.number().nullable(),
  isHandled: z.boolean(),
  createdAt: z.string(),
});

export const createPublicContactSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  contact: z.string().min(1, "Contact information is required"),
  message: z.string().min(1, "Message is required"),
  serviceId: z.number().int().positive(),
});

export const publicContactsParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(50).default(20),
  search: z.string().trim().optional(),
  serviceId: z.number().int().positive().optional(),
  sortBy: z.enum(["createdAt", "fullName"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type PublicContact = z.infer<typeof publicContactSchema>;
export type CreatePublicContactInput = z.infer<
  typeof createPublicContactSchema
>;
export type PublicContactsParams = z.infer<typeof publicContactsParamsSchema>;

export const normalizePublicContactsParams = (
  params?: Partial<PublicContactsParams>,
): PublicContactsParams => {
  const parsed = publicContactsParamsSchema.parse(params ?? {});

  return {
    ...parsed,
    search: parsed.search?.trim() || undefined,
  };
};
