import {
  PUBLIC_ROUTE_PATHS,
  getStaticSeoRoute,
  joinUrl,
} from "@suba-company-template/types";
import { describe, expect, it } from "vitest";

import {
  buildSeoMeta,
  getDefaultOgImageUrl,
  SITE_METADATA,
} from "@/lib/og-utils";
import {
  buildArticleDetailHead,
  buildLeafStaticPageHead,
  buildStaticPageHead,
} from "@/lib/seo";

const getMetaContent = (
  meta: Array<Record<string, unknown>>,
  key: string,
  attribute: "property" | "name" = "property",
) => {
  const item = meta.find((entry) => entry[attribute] === key);
  return item?.content as string | undefined;
};

describe("OG defaults and route metadata", () => {
  const homeRoute = getStaticSeoRoute(PUBLIC_ROUTE_PATHS.home());

  it("uses static branded OG image as default", () => {
    const defaultImage = getDefaultOgImageUrl();
    expect(defaultImage).toContain("/og_image_ds.webp");

    const seo = buildSeoMeta({ path: "/" });
    expect(seo.ogImage).toContain("/og_image_ds.webp");
  });

  it("maps the home route to the shared static OG payload", () => {
    const homeHead = buildStaticPageHead(PUBLIC_ROUTE_PATHS.home());

    expect(getMetaContent(homeHead.meta, "og:image")).toContain(
      "/og_image_ds.webp",
    );
    expect(getMetaContent(homeHead.meta, "og:title")).toBe(homeRoute?.title);
    expect(getMetaContent(homeHead.meta, "og:description")).toBe(
      homeRoute?.description,
    );
    expect(getMetaContent(homeHead.meta, "og:url")).toBe(
      joinUrl(SITE_METADATA.siteUrl, PUBLIC_ROUTE_PATHS.home()),
    );
  });

  it("uses page-specific OG payloads for non-home static pages", () => {
    const aboutHead = buildStaticPageHead(PUBLIC_ROUTE_PATHS.about());

    expect(getMetaContent(aboutHead.meta, "og:image")).toContain(
      "/og_image_ds.webp",
    );
    expect(getMetaContent(aboutHead.meta, "og:title")).toBe(
      "About DS General PLC",
    );
    expect(getMetaContent(aboutHead.meta, "og:description")).toBe(
      "Learn how DS General PLC combines sourcing, construction, and operational delivery into one integrated execution model.",
    );
    expect(getMetaContent(aboutHead.meta, "og:url")).toBe(
      joinUrl(SITE_METADATA.siteUrl, PUBLIC_ROUTE_PATHS.about()),
    );
    expect(getMetaContent(aboutHead.meta, "description", "name")).toBe(
      "Learn how DS General PLC combines sourcing, construction, and operational delivery into one integrated execution model.",
    );
    expect(aboutHead.meta.find((entry) => "title" in entry)?.title).toBe(
      "About DS General PLC",
    );
  });

  it("uses page-specific OG payloads for dynamic detail pages", () => {
    const articleHead = buildArticleDetailHead({
      slug: "freight-resilience",
      title: "Freight resilience",
      excerpt: "Operational playbook",
      featuredImageUrl: "https://cdn.example.com/freight.webp",
    });

    expect(getMetaContent(articleHead.meta, "og:image")).toBe(
      "https://cdn.example.com/freight.webp",
    );
    expect(getMetaContent(articleHead.meta, "og:title")).toBe(
      "Freight resilience | DS General PLC",
    );
    expect(getMetaContent(articleHead.meta, "og:description")).toBe(
      "Operational playbook",
    );
    expect(getMetaContent(articleHead.meta, "og:url")).toBe(
      joinUrl(
        SITE_METADATA.siteUrl,
        PUBLIC_ROUTE_PATHS.article("freight-resilience"),
      ),
    );
    expect(getMetaContent(articleHead.meta, "description", "name")).toBe(
      "Operational playbook",
    );
    expect(articleHead.meta.find((entry) => "title" in entry)?.title).toBe(
      "Freight resilience | DS General PLC",
    );
  });

  it("suppresses parent static heads when a nested detail route is active", () => {
    const parentHead = buildLeafStaticPageHead(PUBLIC_ROUTE_PATHS.articles(), {
      match: { routeId: "/_landing/articles" },
      matches: [
        { routeId: "/_landing" },
        { routeId: "/_landing/articles" },
        { routeId: "/_landing/articles/$slug" },
      ],
    });

    expect(parentHead.meta).toHaveLength(0);
    expect(parentHead.links).toHaveLength(0);

    const leafHead = buildLeafStaticPageHead(PUBLIC_ROUTE_PATHS.articles(), {
      match: { routeId: "/_landing/articles" },
      matches: [{ routeId: "/_landing" }, { routeId: "/_landing/articles" }],
    });

    expect(leafHead.links).toEqual([
      {
        rel: "canonical",
        href: joinUrl(SITE_METADATA.siteUrl, PUBLIC_ROUTE_PATHS.articles()),
      },
    ]);
  });
});
