import { z } from "zod";

export const achievementResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  position: z.number(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const publicAchievementResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  position: z.number(),
  createdAt: z.string(),
});

export type AchievementResponse = z.infer<typeof achievementResponseSchema>;
export type PublicAchievementResponse = z.infer<
  typeof publicAchievementResponseSchema
>;
