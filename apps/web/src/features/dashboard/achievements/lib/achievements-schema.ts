import { IMAGE_MIME_TYPES } from "@suba-company-template/types";
import { z } from "zod";

import { createListParamsSchema, normalizeListParams } from "@/lib/list-params";

const imageFileSchema = z
  .instanceof(File)
  .refine(
    (file) =>
      IMAGE_MIME_TYPES.includes(file.type as (typeof IMAGE_MIME_TYPES)[number]),
    "Image must be a supported image type",
  );

const baseAchievementFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  position: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const achievementSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  position: z.number().int().min(0),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createAchievementSchema = baseAchievementFormSchema
  .extend({
    image: imageFileSchema.optional(),
  })
  .superRefine((val, ctx) => {
    if (!val.image) {
      ctx.addIssue({
        code: "custom",
        message: "Image is required",
        path: ["image"],
      });
    }
  });

export const updateAchievementFormSchema = baseAchievementFormSchema.extend({
  image: imageFileSchema.optional(),
});

export const updateAchievementSchema = achievementSchema.partial();

export const achievementsListParamsSchema = createListParamsSchema({
  sortBy: ["createdAt", "title", "position"] as const,
  defaultSortBy: "createdAt",
  extra: {
    isActive: z.boolean().optional(),
  },
});

export const reorderAchievementsSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.number().int().positive(),
        position: z.number().int().min(0),
      }),
    )
    .min(1),
});

export type Achievement = z.infer<typeof achievementSchema>;
export type CreateAchievementInput = z.infer<typeof createAchievementSchema>;
export type UpdateAchievementFormInput = z.infer<
  typeof updateAchievementFormSchema
>;
export type UpdateAchievementInput = z.infer<typeof updateAchievementSchema>;
export type AchievementFormValues = z.infer<typeof baseAchievementFormSchema>;
export type AchievementUpdatePayload = z.infer<
  typeof baseAchievementFormSchema
> & {
  imageUrl?: string;
  image?: File;
};
export type ReorderAchievementsInput = z.infer<
  typeof reorderAchievementsSchema
>;
export type AchievementsListParams = z.infer<
  typeof achievementsListParamsSchema
>;

export const normalizeAchievementsListParams = normalizeListParams(
  achievementsListParamsSchema,
);
