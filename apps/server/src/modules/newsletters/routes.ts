import { Hono } from "hono";

import type { NewsletterController } from "./controller";
import {
  createNewsletterSchema,
  newsletterIdParamSchema,
  newslettersQuerySchema,
  updateNewsletterSchema,
} from "./validators";
import {
  adminNamespace,
  validateBody,
  validateParams,
  validateQuery,
} from "../../core/middleware";
import { requireAuth, requireRole } from "../../shared/auth/guards";

export const createNewsletterRoutes = (controller: NewsletterController) => {
  const clientRouter = new Hono();

  clientRouter.post("/", validateBody(createNewsletterSchema), (c) =>
    controller.subscribeNewsletter(c),
  );

  const router = new Hono();

  router.use("/*", adminNamespace);
  router.use("/*", requireAuth);
  router.use("/*", requireRole("admin"));

  router.get("/", validateQuery(newslettersQuerySchema), (c) =>
    controller.listNewsletters(c),
  );
  router.patch(
    "/:id",
    validateParams(newsletterIdParamSchema),
    validateBody(updateNewsletterSchema),
    (c) => controller.updateNewsletterStatus(c),
  );
  router.delete("/:id", validateParams(newsletterIdParamSchema), (c) =>
    controller.deleteNewsletter(c),
  );

  return { router, clientRouter };
};
