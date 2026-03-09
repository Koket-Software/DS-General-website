import type { NewsletterRepository } from "./repository";
import type {
  CreateNewsletterInput,
  NewslettersQuery,
  UpdateNewsletterInput,
} from "./validators";
import { NotFoundError } from "../../core/http";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const normalizeName = (name: string | null | undefined) => {
  if (!name) return null;
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const isUniqueViolation = (error: unknown) => {
  if (!(error instanceof Error)) return false;
  return (
    error.message.includes("unique constraint") ||
    error.message.includes("newsletters_email_unique")
  );
};

export const createNewsletterService = (repository: NewsletterRepository) => {
  return {
    async getNewsletters(query: NewslettersQuery) {
      return repository.findAll(query);
    },

    async subscribeNewsletter(data: CreateNewsletterInput) {
      const email = normalizeEmail(data.email);
      const fullName = normalizeName(data.fullName);

      const existing = await repository.findByEmail(email);
      if (!existing) {
        try {
          return await repository.create({ email, fullName });
        } catch (error) {
          // Handle race condition where another request created the row first.
          if (!isUniqueViolation(error)) throw error;

          const createdByOtherRequest = await repository.findByEmail(email);
          if (!createdByOtherRequest) throw error;
          return createdByOtherRequest;
        }
      }

      const updates: {
        fullName?: string | null;
        isActive?: boolean;
        subscribedAt?: string;
        unsubscribedAt?: string | null;
      } = {};

      if (fullName && fullName !== existing.fullName) {
        updates.fullName = fullName;
      }

      if (!existing.isActive) {
        updates.isActive = true;
        updates.unsubscribedAt = null;
        updates.subscribedAt = new Date().toISOString();
      }

      if (Object.keys(updates).length === 0) {
        return existing;
      }

      const updated = await repository.update(existing.id, updates);
      return updated ?? existing;
    },

    async updateNewsletterStatus(id: number, data: UpdateNewsletterInput) {
      const existing = await repository.findById(id);
      if (!existing) {
        throw new NotFoundError(
          `Newsletter subscriber with id ${id} not found`,
        );
      }

      if (data.isActive) {
        if (existing.isActive && existing.unsubscribedAt === null) {
          return existing;
        }

        const updated = await repository.update(id, {
          isActive: true,
          unsubscribedAt: null,
          ...(existing.isActive
            ? {}
            : { subscribedAt: new Date().toISOString() }),
        });

        return updated ?? existing;
      }

      if (!existing.isActive && existing.unsubscribedAt) {
        return existing;
      }

      const updated = await repository.update(id, {
        isActive: false,
        unsubscribedAt: existing.unsubscribedAt ?? new Date().toISOString(),
      });

      return updated ?? existing;
    },

    async deleteNewsletter(id: number) {
      const existing = await repository.findById(id);
      if (!existing) {
        throw new NotFoundError(
          `Newsletter subscriber with id ${id} not found`,
        );
      }

      return repository.delete(id);
    },
  };
};

export type NewsletterService = ReturnType<typeof createNewsletterService>;
