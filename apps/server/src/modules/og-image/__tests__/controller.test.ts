import { describe, expect, it } from "bun:test";
import type { Context } from "hono";

import {
  createOgImageController,
  type OgImageControllerDeps,
} from "../controller";

function createContext(input: {
  url: string;
  slug?: string;
  query?: Record<string, string | undefined>;
}): Context {
  return {
    req: {
      url: input.url,
      param: () => ({ slug: input.slug ?? "" }),
      query: (key: string) => input.query?.[key],
    },
    redirect: (location: string, status = 302) =>
      new Response(null, {
        status,
        headers: { Location: location },
      }),
    text: (text: string, status = 200) => new Response(text, { status }),
  } as unknown as Context;
}

const createDeps = (): OgImageControllerDeps => ({
  db: {} as never,
  blogRepository: {
    findPublishedBySlug: async () => null,
  },
  serviceRepository: {
    findPublishedBySlug: async () => null,
  },
  caseStudyRepository: {
    findPublishedBySlug: async () => null,
  },
  vacancyRepository: {
    findPublishedBySlug: async () => null,
  },
});

describe("OG image controller fallback behavior", () => {
  it("redirects to static OG image when blog slug is missing", async () => {
    const controller = createOgImageController(createDeps());
    const response = await controller.getBlogOgImage(
      createContext({
        url: "https://dsgeneralplc.com/api/og/blog",
        slug: "",
      }),
    );

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toContain("/og_image_ds.webp");
  });

  it("redirects to static OG image for /api/og/default", async () => {
    const controller = createOgImageController(createDeps());
    const response = await controller.getDefaultOgImage(
      createContext({
        url: "https://dsgeneralplc.com/api/og/default",
      }),
    );

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toContain("/og_image_ds.webp");
  });

  it("redirects to static OG image when page title is missing", async () => {
    const controller = createOgImageController(createDeps());
    const response = await controller.getPageOgImage(
      createContext({
        url: "https://dsgeneralplc.com/api/og/page",
        query: {},
      }),
    );

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toContain("/og_image_ds.webp");
  });
});
