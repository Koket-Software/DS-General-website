import { describe, expect, it } from "bun:test";

import type { NewsletterRepository } from "../repository";
import { createNewsletterService } from "../service";

type Subscriber = {
  id: number;
  email: string;
  fullName: string | null;
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt: string | null;
  createdAt: string;
};

const createRepositoryMock = (
  overrides: Partial<NewsletterRepository>,
): NewsletterRepository => {
  return {
    findAll: async () => ({ items: [], total: 0, page: 1, limit: 10 }),
    findById: async () => null,
    findByEmail: async () => null,
    create: async () => {
      throw new Error("create not mocked");
    },
    update: async () => undefined,
    delete: async () => undefined,
    ...overrides,
  } as NewsletterRepository;
};

const buildSubscriber = (overrides: Partial<Subscriber> = {}): Subscriber => ({
  id: 1,
  email: "john@example.com",
  fullName: "John",
  isActive: true,
  subscribedAt: "2026-01-01T00:00:00.000Z",
  unsubscribedAt: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

describe("newsletter service", () => {
  it("creates a new subscriber with normalized email and trimmed name", async () => {
    const repository = createRepositoryMock({
      findByEmail: async () => null,
      create: async (data) => {
        expect(data.email).toBe("john@example.com");
        expect(data.fullName).toBe("John Doe");
        return buildSubscriber({
          email: data.email,
          fullName: data.fullName ?? null,
        });
      },
    });

    const service = createNewsletterService(repository);

    const result = await service.subscribeNewsletter({
      email: "  JOHN@Example.com ",
      fullName: "  John Doe  ",
    });

    expect(result.email).toBe("john@example.com");
    expect(result.fullName).toBe("John Doe");
  });

  it("is idempotent for an active duplicate without a name", async () => {
    const existing = buildSubscriber();
    let updateCalled = false;

    const repository = createRepositoryMock({
      findByEmail: async () => existing,
      update: async () => {
        updateCalled = true;
        return existing;
      },
    });

    const service = createNewsletterService(repository);

    const result = await service.subscribeNewsletter({
      email: "john@example.com",
      fullName: undefined,
    });

    expect(updateCalled).toBe(false);
    expect(result).toEqual(existing);
  });

  it("reactivates inactive duplicate and updates provided name", async () => {
    const existing = buildSubscriber({
      isActive: false,
      fullName: null,
      unsubscribedAt: "2026-02-01T00:00:00.000Z",
    });

    let updateCalled = false;

    const repository = createRepositoryMock({
      findByEmail: async () => existing,
      update: async (_id, data) => {
        updateCalled = true;
        expect(data.isActive).toBe(true);
        expect(data.unsubscribedAt).toBeNull();
        expect(typeof data.subscribedAt).toBe("string");
        return buildSubscriber({
          ...existing,
          isActive: true,
          unsubscribedAt: null,
          fullName: "Abel Tesfaye",
          subscribedAt: data.subscribedAt ?? existing.subscribedAt,
        });
      },
    });

    const service = createNewsletterService(repository);

    const result = await service.subscribeNewsletter({
      email: "john@example.com",
      fullName: " Abel Tesfaye ",
    });

    expect(updateCalled).toBe(true);
    expect(result.isActive).toBe(true);
    expect(result.fullName).toBe("Abel Tesfaye");
  });

  it("deactivates active subscriber and sets unsubscribedAt", async () => {
    const existing = buildSubscriber({ isActive: true, unsubscribedAt: null });

    let updateCalled = false;

    const repository = createRepositoryMock({
      findById: async () => existing,
      update: async (_id, data) => {
        updateCalled = true;
        expect(data.isActive).toBe(false);
        expect(typeof data.unsubscribedAt).toBe("string");
        return buildSubscriber({
          ...existing,
          isActive: false,
          unsubscribedAt: data.unsubscribedAt ?? null,
        });
      },
    });

    const service = createNewsletterService(repository);

    const result = await service.updateNewsletterStatus(existing.id, {
      isActive: false,
    });

    expect(updateCalled).toBe(true);
    expect(result.isActive).toBe(false);
  });

  it("throws when deleting a missing subscriber", async () => {
    const repository = createRepositoryMock({
      findById: async () => null,
    });

    const service = createNewsletterService(repository);

    await expect(service.deleteNewsletter(999)).rejects.toThrow(
      "Newsletter subscriber with id 999 not found",
    );
  });
});
