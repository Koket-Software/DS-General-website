import { createAchievementController } from "./controller";
import { createAchievementRepository } from "./repository";
import { createAchievementRoutes } from "./routes";
import { createAchievementService } from "./service";
import { db } from "../../shared/db";
import type { ModuleDeps } from "../types";

export const initAchievementsModule = (deps: ModuleDeps = { db }) => {
  const repository = createAchievementRepository(deps.db);
  const service = createAchievementService(repository);
  const controller = createAchievementController(service);
  const { router, clientRouter } = createAchievementRoutes(controller);

  return { router, clientRouter };
};

export type AchievementsModule = ReturnType<typeof initAchievementsModule>;

export * from "./schema";
export * from "./validators";
