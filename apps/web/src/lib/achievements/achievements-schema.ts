import { z } from "zod";

import { API_BASE_URL } from "@/lib/api-base";

const SERVER_URL = (API_BASE_URL ?? "").replace(/\/$/, "");
const ACHIEVEMENT_TEXT_REPLACEMENTS = [
  ["&amp;", "&"],
  ["&#39;", "'"],
  ["&quot;", '"'],
  ["&nbsp;", " "],
  ["&lt;", "<"],
  ["&gt;", ">"],
] as const;

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

export const normalizeAchievementText = (
  value: string | null | undefined,
): string => {
  if (!value) {
    return "";
  }

  let normalized = value;

  for (let pass = 0; pass < 2; pass += 1) {
    let nextValue = normalized;

    for (const [entity, replacement] of ACHIEVEMENT_TEXT_REPLACEMENTS) {
      nextValue = nextValue.replaceAll(entity, replacement);
    }

    if (nextValue === normalized) {
      break;
    }

    normalized = nextValue;
  }

  return normalized.replace(/\s+/g, " ").trim();
};
