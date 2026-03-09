import { z } from "zod";

export const newsletterSubscriberSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  fullName: z.string().nullable(),
  isActive: z.boolean(),
  subscribedAt: z.string(),
  unsubscribedAt: z.string().nullable(),
  createdAt: z.string(),
});

export const createPublicNewsletterSchema = z.object({
  email: z.string().trim().email("Valid email is required"),
  fullName: z.string().trim().max(120).nullish(),
});

export type NewsletterSubscriber = z.infer<typeof newsletterSubscriberSchema>;
export type CreatePublicNewsletterInput = z.infer<
  typeof createPublicNewsletterSchema
>;

export const normalizeCreatePublicNewsletterInput = (
  payload: CreatePublicNewsletterInput,
): CreatePublicNewsletterInput => {
  const parsed = createPublicNewsletterSchema.parse(payload);
  return {
    email: parsed.email.trim(),
    fullName: parsed.fullName?.trim() || undefined,
  };
};
