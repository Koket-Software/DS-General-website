import {
  and,
  asc,
  desc,
  eq,
  inArray,
  type SQL,
} from "@suba-company-template/db/orm";
import { achievements } from "@suba-company-template/db/schema";

import type {
  AchievementSortField,
  AchievementsQuery,
  CreateAchievementInput,
  PublicAchievementsQuery,
  ReorderAchievementsInput,
  UpdateAchievementInput,
} from "./validators";
import type { DbClient } from "../../shared/db";
import {
  buildListResult,
  countRecords,
  createQueryBuilder,
} from "../../shared/query";
import { stripUndefinedValues } from "../../shared/utils/object";

const achievementQueryBuilder = createQueryBuilder<
  typeof achievements,
  AchievementSortField
>({
  table: achievements,
  searchFields: [achievements.title, achievements.description],
  sortFields: {
    createdAt: achievements.createdAt,
    title: achievements.title,
    position: achievements.position,
  },
  defaultSortField: "createdAt",
});

export const createAchievementRepository = (db: DbClient) => {
  return {
    async findAll(query: AchievementsQuery) {
      const { page, limit, search, sortBy, sortOrder, isActive } = query;

      const conditions: SQL[] = [];
      if (typeof isActive === "boolean") {
        conditions.push(eq(achievements.isActive, isActive));
      }

      const searchCondition = achievementQueryBuilder.applySearch(search);
      if (searchCondition) {
        conditions.push(searchCondition);
      }

      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      const baseQuery = db.select().from(achievements);
      const queryWithWhere = whereClause
        ? baseQuery.where(whereClause)
        : baseQuery;

      const sortedQuery = achievementQueryBuilder.applySort(
        queryWithWhere,
        sortBy,
        sortOrder,
      );
      const finalQuery = achievementQueryBuilder.applyPagination(
        sortedQuery,
        page,
        limit,
      );

      const items = await finalQuery;
      const total = await countRecords(db, achievements, whereClause);

      return buildListResult(items, total, page, limit);
    },

    async findById(id: number) {
      const result = await db
        .select()
        .from(achievements)
        .where(eq(achievements.id, id))
        .limit(1);
      return result[0] ?? null;
    },

    async findByIds(ids: number[]) {
      if (ids.length === 0) return [];
      return db
        .select()
        .from(achievements)
        .where(inArray(achievements.id, ids));
    },

    async findMaxPosition() {
      const result = await db
        .select()
        .from(achievements)
        .orderBy(desc(achievements.position))
        .limit(1);

      return result[0]?.position ?? -1;
    },

    async create(data: CreateAchievementInput) {
      const insertData: CreateAchievementInput = {
        ...data,
        position:
          typeof data.position === "number"
            ? data.position
            : (await this.findMaxPosition()) + 1,
      };

      const [created] = await db
        .insert(achievements)
        .values(insertData)
        .returning();
      if (!created) {
        throw new Error("Failed to create achievement");
      }
      return created;
    },

    async update(id: number, data: UpdateAchievementInput) {
      const sanitized = stripUndefinedValues(data);

      const [updated] = await db
        .update(achievements)
        .set({
          ...sanitized,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(achievements.id, id))
        .returning();

      return updated;
    },

    async delete(id: number) {
      const [deleted] = await db
        .delete(achievements)
        .where(eq(achievements.id, id))
        .returning();

      return deleted;
    },

    async reorder(input: ReorderAchievementsInput) {
      await db.transaction(async (tx) => {
        for (const item of input.items) {
          await tx
            .update(achievements)
            .set({
              position: item.position,
              updatedAt: new Date().toISOString(),
            })
            .where(eq(achievements.id, item.id));
        }
      });
    },

    async findPublic(query: PublicAchievementsQuery) {
      const { page, limit, search } = query;

      const conditions: SQL[] = [eq(achievements.isActive, true)];
      const searchCondition = achievementQueryBuilder.applySearch(search);
      if (searchCondition) {
        conditions.push(searchCondition);
      }

      const whereClause = and(...conditions);

      const baseQuery = db
        .select({
          id: achievements.id,
          title: achievements.title,
          description: achievements.description,
          imageUrl: achievements.imageUrl,
          position: achievements.position,
          createdAt: achievements.createdAt,
        })
        .from(achievements)
        .where(whereClause)
        .orderBy(asc(achievements.position), desc(achievements.createdAt));

      const items = await achievementQueryBuilder.applyPagination(
        baseQuery,
        page,
        limit,
      );
      const total = await countRecords(db, achievements, whereClause);

      return buildListResult(items, total, page, limit);
    },
  };
};

export type AchievementRepository = ReturnType<
  typeof createAchievementRepository
>;
