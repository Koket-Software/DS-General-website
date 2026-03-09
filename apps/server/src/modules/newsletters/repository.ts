import { eq } from "@suba-company-template/db/orm";
import { newsletters } from "@suba-company-template/db/schema";

import type {
  CreateNewsletterInput,
  NewsletterSortField,
  NewslettersQuery,
} from "./validators";
import type { DbClient } from "../../shared/db";
import {
  buildListResult,
  combineWhere,
  countRecords,
  createQueryBuilder,
  optionalEq,
} from "../../shared/query";
import { stripUndefinedValues } from "../../shared/utils/object";

const newsletterQueryBuilder = createQueryBuilder<
  typeof newsletters,
  NewsletterSortField
>({
  table: newsletters,
  searchFields: [newsletters.email, newsletters.fullName],
  sortFields: {
    createdAt: newsletters.createdAt,
    email: newsletters.email,
    subscribedAt: newsletters.subscribedAt,
  },
  defaultSortField: "createdAt",
});

export type NewsletterRepositoryUpdateInput = Partial<{
  fullName: string | null;
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt: string | null;
}>;

export const createNewsletterRepository = (db: DbClient) => {
  return {
    async findAll(query: NewslettersQuery) {
      const { page, limit, search, sortBy, sortOrder, isActive } = query;

      const whereClause = combineWhere(
        optionalEq(newsletters.isActive, isActive),
        newsletterQueryBuilder.applySearch(search),
      );

      const baseQuery = db.select().from(newsletters);
      const queryWithWhere = whereClause
        ? baseQuery.where(whereClause)
        : baseQuery;

      const sortedQuery = newsletterQueryBuilder.applySort(
        queryWithWhere,
        sortBy,
        sortOrder,
      );
      const finalQuery = newsletterQueryBuilder.applyPagination(
        sortedQuery,
        page,
        limit,
      );

      const items = await finalQuery;
      const total = await countRecords(db, newsletters, whereClause);

      return buildListResult(items, total, page, limit);
    },

    async findById(id: number) {
      const result = await db
        .select()
        .from(newsletters)
        .where(eq(newsletters.id, id))
        .limit(1);

      return result[0] ?? null;
    },

    async findByEmail(email: string) {
      const result = await db
        .select()
        .from(newsletters)
        .where(eq(newsletters.email, email))
        .limit(1);

      return result[0] ?? null;
    },

    async create(data: CreateNewsletterInput) {
      const [created] = await db
        .insert(newsletters)
        .values({
          email: data.email,
          fullName: data.fullName ?? null,
        })
        .returning();

      if (!created) throw new Error("Failed to create newsletter subscriber");
      return created;
    },

    async update(id: number, data: NewsletterRepositoryUpdateInput) {
      const sanitized = stripUndefinedValues(data);

      const [updated] = await db
        .update(newsletters)
        .set(sanitized)
        .where(eq(newsletters.id, id))
        .returning();

      return updated;
    },

    async delete(id: number) {
      const [deleted] = await db
        .delete(newsletters)
        .where(eq(newsletters.id, id))
        .returning();

      return deleted;
    },
  };
};

export type NewsletterRepository = ReturnType<
  typeof createNewsletterRepository
>;
