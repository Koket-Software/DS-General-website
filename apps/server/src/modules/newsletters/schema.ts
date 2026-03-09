import { z } from "zod";

export const newsletterResponseSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  fullName: z.string().nullable(),
  isActive: z.boolean(),
  subscribedAt: z.string(),
  unsubscribedAt: z.string().nullable(),
  createdAt: z.string(),
});

export type NewsletterResponse = z.infer<typeof newsletterResponseSchema>;
