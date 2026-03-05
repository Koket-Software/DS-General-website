import { z } from "zod";

export const publicSocialSchema = z.object({
  id: z.number(),
  title: z.string(),
  iconUrl: z.string().nullable(),
  baseUrl: z.string(),
});

export const publicSocialsParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(50).default(20),
  cursor: z.string().optional(),
});

export type PublicSocial = z.infer<typeof publicSocialSchema>;
export type PublicSocialsParams = z.infer<typeof publicSocialsParamsSchema>;

export const normalizePublicSocialsParams = (
  params?: Partial<PublicSocialsParams>,
): PublicSocialsParams => publicSocialsParamsSchema.parse(params ?? {});
