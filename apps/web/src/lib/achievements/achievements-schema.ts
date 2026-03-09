import { z } from "zod";

import { API_BASE_URL } from "@/lib/api-base";

const SERVER_URL = (API_BASE_URL ?? "").replace(/\/$/, "");

export const clientAchievementSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  position: z.number(),
  createdAt: z.string(),
});

export type ClientAchievement = z.infer<typeof clientAchievementSchema>;

export const getAchievementImageUrl = (
  imageUrl: string | null | undefined,
): string | undefined => {
  if (!imageUrl) return undefined;
  if (imageUrl.startsWith("http")) return imageUrl;
  return `${SERVER_URL}${imageUrl}`;
};
