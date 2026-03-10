import { createSsrController } from "./controller";
import { createSsrRoutes } from "./routes";
import { db } from "../../shared/db";
import type { ModuleDeps } from "../types";

export const initSsrModule = (_deps: ModuleDeps = { db }) => {
  const controller = createSsrController();

  const clientRouter = createSsrRoutes(controller);

  return { clientRouter };
};
