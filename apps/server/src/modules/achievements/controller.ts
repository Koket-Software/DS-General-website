import type { Context } from "hono";

import type { AchievementService } from "./service";
import {
  achievementIdParamSchema,
  achievementsQuerySchema,
  createAchievementFormSchema,
  createAchievementSchema,
  publicAchievementsQuerySchema,
  reorderAchievementsSchema,
  updateAchievementFormSchema,
  updateAchievementSchema,
  type AchievementIdParams,
  type AchievementsQuery,
  type CreateAchievementInput,
  type PublicAchievementsQuery,
  type ReorderAchievementsInput,
  type UpdateAchievementInput,
} from "./validators";
import {
  BadRequestError,
  ValidationError,
  paginatedResponse,
  successResponse,
} from "../../core/http";
import {
  FileUploadError,
  uploadAchievementImage,
} from "../../shared/storage/uploadFile";

export const createAchievementController = (service: AchievementService) => {
  return {
    async listAchievements(c: Context) {
      const query =
        (c.get("validatedQuery") as AchievementsQuery | undefined) ??
        achievementsQuerySchema.parse(c.req.query());

      const result = await service.getAchievements(query);
      return paginatedResponse(c, result.items, {
        page: result.page,
        limit: result.limit,
        total: result.total,
      });
    },

    async getAchievement(c: Context) {
      const { id } =
        (c.get("validatedParams") as AchievementIdParams | undefined) ??
        achievementIdParamSchema.parse(c.req.param());

      const achievement = await service.getAchievementById(id);
      return successResponse(c, achievement);
    },

    async createAchievement(c: Context) {
      const formData = await c.req.formData();
      const formInput = {
        title: formData.get("title"),
        description: formData.get("description"),
        position: formData.get("position"),
        isActive: formData.get("isActive"),
        image: formData.get("image"),
      };

      const validatedData = createAchievementFormSchema.parse(formInput);
      if (!validatedData.image) {
        throw new BadRequestError("Image is required");
      }

      let imageUrl: string;
      try {
        imageUrl = await uploadAchievementImage(validatedData.image);
      } catch (error) {
        if (error instanceof FileUploadError) {
          throw new BadRequestError(error.message);
        }
        throw error;
      }

      const payload: CreateAchievementInput =
        (c.get("validatedBody") as CreateAchievementInput | undefined) ??
        createAchievementSchema.parse({
          title: validatedData.title,
          description: validatedData.description,
          imageUrl,
          position: validatedData.position,
          isActive: validatedData.isActive,
        });

      const achievement = await service.createAchievement(payload);
      return successResponse(c, achievement, 201);
    },

    async updateAchievement(c: Context) {
      const { id } =
        (c.get("validatedParams") as AchievementIdParams | undefined) ??
        achievementIdParamSchema.parse(c.req.param());

      const contentType = c.req.header("content-type") ?? "";
      if (contentType.includes("multipart/form-data")) {
        const formData = await c.req.formData();

        const formInput = {
          title: formData.get("title"),
          description: formData.get("description"),
          position: formData.get("position"),
          isActive: formData.get("isActive"),
          image: formData.get("image"),
          imageUrl: formData.get("imageUrl"),
        };

        const validatedData = updateAchievementFormSchema.parse(formInput);

        let imageUrl = validatedData.imageUrl;
        if (validatedData.image) {
          try {
            imageUrl = await uploadAchievementImage(validatedData.image);
          } catch (error) {
            if (error instanceof FileUploadError) {
              throw new BadRequestError(error.message);
            }
            throw error;
          }
        }

        const payload: UpdateAchievementInput =
          (c.get("validatedBody") as UpdateAchievementInput | undefined) ??
          updateAchievementSchema.parse({
            title: validatedData.title,
            description: validatedData.description,
            position: validatedData.position,
            isActive: validatedData.isActive,
            imageUrl,
          });

        const achievement = await service.updateAchievement(id, payload);
        return successResponse(c, achievement);
      }

      const payload: UpdateAchievementInput =
        (c.get("validatedBody") as UpdateAchievementInput | undefined) ??
        updateAchievementSchema.parse(await c.req.json());

      const achievement = await service.updateAchievement(id, payload);
      return successResponse(c, achievement);
    },

    async deleteAchievement(c: Context) {
      const { id } =
        (c.get("validatedParams") as AchievementIdParams | undefined) ??
        (() => {
          const parsed = Number.parseInt(c.req.param("id"), 10);
          if (Number.isNaN(parsed)) {
            throw new ValidationError("Invalid achievement ID");
          }
          return { id: parsed };
        })();

      await service.deleteAchievement(id);
      return successResponse(c, {
        message: "Achievement deleted successfully",
      });
    },

    async reorderAchievements(c: Context) {
      const payload =
        (c.get("validatedBody") as ReorderAchievementsInput | undefined) ??
        reorderAchievementsSchema.parse(await c.req.json());

      await service.reorderAchievements(payload);
      return successResponse(c, {
        message: "Achievements reordered successfully",
      });
    },

    async listPublicAchievements(c: Context) {
      const query =
        (c.get("validatedQuery") as PublicAchievementsQuery | undefined) ??
        publicAchievementsQuerySchema.parse(c.req.query());

      const result = await service.getPublicAchievements(query);
      return paginatedResponse(c, result.items, {
        page: result.page,
        limit: result.limit,
        total: result.total,
      });
    },
  };
};

export type AchievementController = ReturnType<
  typeof createAchievementController
>;
