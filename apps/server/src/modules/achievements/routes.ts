import { Hono } from "hono";

import type { AchievementController } from "./controller";
import {
  achievementIdParamSchema,
  achievementsQuerySchema,
  createAchievementSchema,
  publicAchievementsQuerySchema,
  reorderAchievementsSchema,
  updateAchievementSchema,
} from "./validators";
import {
  adminNamespace,
  validateBody,
  validateParams,
  validateQuery,
} from "../../core/middleware";
import { requireAuth, requireRole } from "../../shared/auth/guards";

export const createAchievementRoutes = (controller: AchievementController) => {
  const clientRouter = new Hono();

  clientRouter.get("/", validateQuery(publicAchievementsQuerySchema), (c) =>
    controller.listPublicAchievements(c),
  );

  const router = new Hono();

  router.use("/*", adminNamespace);
  router.use("/*", requireAuth);
  router.use("/*", requireRole("admin"));

  router.get("/", validateQuery(achievementsQuerySchema), (c) =>
    controller.listAchievements(c),
  );
  router.get("/:id", validateParams(achievementIdParamSchema), (c) =>
    controller.getAchievement(c),
  );
  router.post("/", validateBody(createAchievementSchema), (c) =>
    controller.createAchievement(c),
  );
  router.patch("/reorder", validateBody(reorderAchievementsSchema), (c) =>
    controller.reorderAchievements(c),
  );
  router.patch(
    "/:id",
    validateParams(achievementIdParamSchema),
    validateBody(updateAchievementSchema),
    (c) => controller.updateAchievement(c),
  );
  router.delete("/:id", validateParams(achievementIdParamSchema), (c) =>
    controller.deleteAchievement(c),
  );

  return { router, clientRouter };
};
