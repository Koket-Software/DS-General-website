import { createNewsletterController } from "./controller";
import { createNewsletterRepository } from "./repository";
import { createNewsletterRoutes } from "./routes";
import { createNewsletterService } from "./service";
import { db } from "../../shared/db";
import type { ModuleDeps } from "../types";

export const initNewslettersModule = (deps: ModuleDeps = { db }) => {
  const repository = createNewsletterRepository(deps.db);
  const service = createNewsletterService(repository);
  const controller = createNewsletterController(service);
  const { router, clientRouter } = createNewsletterRoutes(controller);

  return { router, clientRouter };
};

export * from "./schema";
export * from "./validators";
