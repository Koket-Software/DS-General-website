import type { Context } from "hono";

import type { NewsletterService } from "./service";
import {
  createNewsletterSchema,
  newsletterIdParamSchema,
  newslettersQuerySchema,
  updateNewsletterSchema,
  type CreateNewsletterInput,
  type NewsletterIdParams,
  type NewslettersQuery,
  type UpdateNewsletterInput,
} from "./validators";
import { paginatedResponse, successResponse } from "../../core/http";

export const createNewsletterController = (service: NewsletterService) => {
  return {
    async listNewsletters(c: Context) {
      const query =
        (c.get("validatedQuery") as NewslettersQuery | undefined) ??
        newslettersQuerySchema.parse(c.req.query());

      const result = await service.getNewsletters(query);
      return paginatedResponse(c, result.items, {
        page: result.page,
        limit: result.limit,
        total: result.total,
      });
    },

    async subscribeNewsletter(c: Context) {
      const data =
        (c.get("validatedBody") as CreateNewsletterInput | undefined) ??
        createNewsletterSchema.parse(await c.req.json());

      const subscriber = await service.subscribeNewsletter(data);
      return successResponse(c, subscriber, 201);
    },

    async updateNewsletterStatus(c: Context) {
      const { id } =
        (c.get("validatedParams") as NewsletterIdParams | undefined) ??
        newsletterIdParamSchema.parse(c.req.param());

      const data =
        (c.get("validatedBody") as UpdateNewsletterInput | undefined) ??
        updateNewsletterSchema.parse(await c.req.json());

      const updated = await service.updateNewsletterStatus(id, data);
      return successResponse(c, updated);
    },

    async deleteNewsletter(c: Context) {
      const { id } =
        (c.get("validatedParams") as NewsletterIdParams | undefined) ??
        newsletterIdParamSchema.parse(c.req.param());

      await service.deleteNewsletter(id);
      return successResponse(c, {
        message: "Newsletter subscriber deleted successfully",
      });
    },
  };
};

export type NewsletterController = ReturnType<
  typeof createNewsletterController
>;
