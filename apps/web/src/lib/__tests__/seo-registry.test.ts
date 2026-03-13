import {
  PUBLIC_ROUTE_PATHS,
  buildArticleJsonLd,
  buildRobotsContent,
  getStaticSeoRoute,
  isNoindexRoute,
  isPublicRenderableRoute,
  joinUrl,
  normalizeSeoPath,
} from "@suba-company-template/types";
import { describe, expect, it } from "vitest";

describe("shared SEO registry", () => {
  it("normalizes canonical paths", () => {
    expect(
      normalizeSeoPath("/articles/supply-chain/?utm_source=test#section"),
    ).toBe("/articles/supply-chain");
    expect(normalizeSeoPath("/")).toBe("/");
  });

  it("joins site URLs without preserving query variants", () => {
    expect(joinUrl("https://dsgeneralplc.com/", "/contact/?ref=ad")).toBe(
      "https://dsgeneralplc.com/contact",
    );
    expect(joinUrl("https://dsgeneralplc.com", "/")).toBe(
      "https://dsgeneralplc.com/",
    );
  });

  it("builds robots directives for indexable and restricted pages", () => {
    expect(buildRobotsContent()).toBe("index, follow");
    expect(buildRobotsContent({ index: false, follow: false })).toBe(
      "noindex, nofollow",
    );
  });

  it("classifies static, dynamic, and restricted routes correctly", () => {
    expect(getStaticSeoRoute(PUBLIC_ROUTE_PATHS.articles())?.title).toBe(
      "Articles & Insights",
    );
    expect(getStaticSeoRoute(PUBLIC_ROUTE_PATHS.projects())?.title).toBe(
      "Client Projects",
    );
    expect(isPublicRenderableRoute(PUBLIC_ROUTE_PATHS.article("freight"))).toBe(
      true,
    );
    expect(
      isPublicRenderableRoute(PUBLIC_ROUTE_PATHS.project("axum-upgrade")),
    ).toBe(true);
    expect(isNoindexRoute("/dashboard/services/create")).toBe(true);
    expect(isPublicRenderableRoute("/dashboard/services/create")).toBe(false);
  });

  it("builds article structured data with the expected schema type", () => {
    const jsonLd = buildArticleJsonLd({
      title: "Freight resilience",
      description: "Operational playbook",
      url: "https://dsgeneralplc.com/articles/freight-resilience",
      authorName: "DS General Editorial",
      datePublished: "2026-03-10",
      dateModified: "2026-03-11",
    });

    expect(jsonLd["@type"]).toBe("BlogPosting");
    expect(jsonLd.author).toEqual({
      "@type": "Person",
      name: "DS General Editorial",
    });
  });
});
