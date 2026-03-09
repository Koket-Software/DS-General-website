import type { AchievementRepository } from "./repository";
import type {
  AchievementsQuery,
  CreateAchievementInput,
  PublicAchievementsQuery,
  ReorderAchievementsInput,
  UpdateAchievementInput,
} from "./validators";
import { BadRequestError, NotFoundError } from "../../core/http";

export const createAchievementService = (repository: AchievementRepository) => {
  return {
    async getAchievements(query: AchievementsQuery) {
      return repository.findAll(query);
    },

    async getAchievementById(id: number) {
      const achievement = await repository.findById(id);
      if (!achievement) {
        throw new NotFoundError(`Achievement with id ${id} not found`);
      }

      return achievement;
    },

    async createAchievement(data: CreateAchievementInput) {
      return repository.create(data);
    },

    async updateAchievement(id: number, data: UpdateAchievementInput) {
      const existing = await repository.findById(id);
      if (!existing) {
        throw new NotFoundError(`Achievement with id ${id} not found`);
      }

      return repository.update(id, data);
    },

    async deleteAchievement(id: number) {
      const existing = await repository.findById(id);
      if (!existing) {
        throw new NotFoundError(`Achievement with id ${id} not found`);
      }

      return repository.delete(id);
    },

    async reorderAchievements(input: ReorderAchievementsInput) {
      const ids = input.items.map((item) => item.id);
      const existing = await repository.findByIds(ids);

      if (existing.length !== ids.length) {
        throw new BadRequestError("One or more achievements do not exist");
      }

      await repository.reorder(input);
    },

    async getPublicAchievements(query: PublicAchievementsQuery) {
      const clampedQuery = {
        ...query,
        limit: Math.min(query.limit, 100),
      };

      return repository.findPublic(clampedQuery);
    },
  };
};

export type AchievementService = ReturnType<typeof createAchievementService>;
