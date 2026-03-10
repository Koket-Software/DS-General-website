import { describe, expect, it } from "vitest";

import {
  buildSeoMeta,
  getDefaultOgImageUrl,
  getPageOgImageUrl,
} from "@/lib/og-utils";
import { buildStaticPageHead } from "@/lib/seo";

const getMetaContent = (
  meta: Array<Record<string, unknown>>,
  key: string,
  attribute: "property" | "name" = "property",
) => {
  const item = meta.find((entry) => entry[attribute] === key);
  return item?.content as string | undefined;
};

describe("OG defaults and route metadata", () => {
  it("uses static branded OG image as default", () => {
    const defaultImage = getDefaultOgImageUrl();
    expect(defaultImage).toContain("/og_image_ds.webp");

    const seo = buildSeoMeta({ path: "/" });
    expect(seo.ogImage).toContain("/og_image_ds.webp");
  });

  it("maps home route to static OG image", () => {
    const homeHead = buildStaticPageHead("/");
    const homeOgImage = getMetaContent(homeHead.meta, "og:image");

    expect(homeOgImage).toBeDefined();
    expect(homeOgImage).toContain("/og_image_ds.webp");
  });

  it("keeps non-home static pages on dynamic /api/og/page URLs", () => {
    const aboutHead = buildStaticPageHead("/about");
    const aboutOgImage = getMetaContent(aboutHead.meta, "og:image");

    expect(aboutOgImage).toBeDefined();
    expect(aboutOgImage).toContain("/api/og/page?");

    const dynamicPageOg = getPageOgImageUrl({
      title: "About DS General PLC",
      description: "Route-level OG metadata",
      theme: "about",
    });
    expect(dynamicPageOg).toContain("/api/og/page?");
  });
});
