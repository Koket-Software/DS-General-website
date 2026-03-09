import { z } from "zod";

import {
  paginationSchema,
  sortSchema,
  searchSchema,
} from "../../shared/query/parser";
import { buildUpdateSchema } from "../../shared/validators/update";

const urlRefine = (val: string) =>
  val.startsWith("http") || val.startsWith("/");
const urlErrorMessage = "Must be a valid URL or relative path starting with /";

const parseOptionalInt = (val: string | null | undefined) => {
  if (val === null || val === undefined || val === "") {
    return undefined;
  }

  const parsed = Number.parseInt(val, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const parseOptionalBoolean = (val: string | null | undefined) => {
  if (val === null || val === undefined || val === "") {
    return undefined;
  }

  if (val === "true") return true;
  if (val === "false") return false;
  return undefined;
};

export const achievementSortFields = [
  "createdAt",
  "title",
  "position",
] as const;
export type AchievementSortField = (typeof achievementSortFields)[number];
const achievementSortSchema = sortSchema.extend({
  sortBy: z.enum(achievementSortFields).optional(),
});

export const createAchievementSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().refine(urlRefine, urlErrorMessage),
  position: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const createAchievementFormSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    position: z
      .string()
      .nullable()
      .transform((val) => parseOptionalInt(val))
      .refine(
        (val) => val === undefined || (Number.isInteger(val) && val >= 0),
        "Position must be a non-negative integer",
      )
      .optional(),
    isActive: z
      .string()
      .nullable()
      .transform((val) => parseOptionalBoolean(val))
      .refine((val) => val === undefined || typeof val === "boolean", {
        message: "isActive must be true or false",
      })
      .optional(),
    image: z
      .instanceof(File)
      .nullable()
      .transform((val) => (val === null ? undefined : val))
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.image) {
      ctx.addIssue({
        code: "custom",
        message: "Image is required",
        path: ["image"],
      });
    }
  });

export const updateAchievementSchema = buildUpdateSchema(
  createAchievementSchema,
);

export const updateAchievementFormSchema = z
  .object({
    title: z
      .string()
      .min(1)
      .nullable()
      .transform((val) => (val === null ? undefined : val))
      .optional(),
    description: z
      .string()
      .min(1)
      .nullable()
      .transform((val) => (val === null ? undefined : val))
      .optional(),
    position: z
      .string()
      .nullable()
      .transform((val) => parseOptionalInt(val))
      .refine(
        (val) => val === undefined || (Number.isInteger(val) && val >= 0),
        "Position must be a non-negative integer",
      )
      .optional(),
    isActive: z
      .string()
      .nullable()
      .transform((val) => parseOptionalBoolean(val))
      .refine((val) => val === undefined || typeof val === "boolean", {
        message: "isActive must be true or false",
      })
      .optional(),
    image: z
      .instanceof(File)
      .nullable()
      .transform((val) => (val === null ? undefined : val))
      .optional(),
    imageUrl: z
      .string()
      .refine(urlRefine, urlErrorMessage)
      .nullable()
      .transform((val) => (val === null ? undefined : val))
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const achievementsQuerySchema = paginationSchema
  .merge(achievementSortSchema)
  .merge(searchSchema)
  .extend({
    isActive: z.coerce.boolean().optional(),
  });

export const publicAchievementsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(6),
  search: z.string().trim().optional(),
});

export const achievementIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const reorderAchievementsSchema = z
  .object({
    items: z
      .array(
        z.object({
          id: z.number().int().positive(),
          position: z.number().int().min(0),
        }),
      )
      .min(1),
  })
  .superRefine((data, ctx) => {
    const ids = data.items.map((item) => item.id);
    const positions = data.items.map((item) => item.position);

    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({
        code: "custom",
        message: "Duplicate achievement ids are not allowed",
        path: ["items"],
      });
    }

    if (new Set(positions).size !== positions.length) {
      ctx.addIssue({
        code: "custom",
        message: "Duplicate positions are not allowed",
        path: ["items"],
      });
    }
  });

export type CreateAchievementInput = z.infer<typeof createAchievementSchema>;
export type CreateAchievementFormInput = z.infer<
  typeof createAchievementFormSchema
>;
export type UpdateAchievementInput = z.infer<typeof updateAchievementSchema>;
export type UpdateAchievementFormInput = z.infer<
  typeof updateAchievementFormSchema
>;
export type AchievementsQuery = z.infer<typeof achievementsQuerySchema>;
export type PublicAchievementsQuery = z.infer<
  typeof publicAchievementsQuerySchema
>;
export type AchievementIdParams = z.infer<typeof achievementIdParamSchema>;
export type ReorderAchievementsInput = z.infer<
  typeof reorderAchievementsSchema
>;
