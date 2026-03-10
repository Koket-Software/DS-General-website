import { describe, expect, it } from "bun:test";

import {
  createDefaultMeta,
  createHomeMeta,
  createStaticPageMeta,
} from "../service";
import type { SsrConfig } from "../types";

const baseConfig: SsrConfig = {
  siteName: "DS General PLC",
  siteUrl: "https://dsgeneralplc.com",
  defaultTitle: "DS General PLC | We're Building the Future",
  defaultDescription:
    "DS General PLC delivers reliable engineering, trading, and operational solutions for high-impact business sectors in Ethiopia.",
  twitterHandle: "@dsgeneralplc",
  locale: "en_US",
  themeColor: "#4962E1",
  ogDefaultPath: "/og_image_ds.webp",
  logoPath: "/favicon.ico",
  keywords: ["ds general plc", "engineering", "trading"],
};

describe("SSR meta builders", () => {
  it("uses static OG asset for both default and home meta", () => {
    const defaultMeta = createDefaultMeta("/", baseConfig);
    const homeMeta = createHomeMeta("/", baseConfig);

    expect(defaultMeta.ogImage).toBe("/og_image_ds.webp");
    expect(homeMeta.ogImage).toBe("/og_image_ds.webp");
  });

  it("keeps non-home static pages on dynamic page OG endpoint", () => {
    const aboutMeta = createStaticPageMeta(
      "/about",
      {
        title: "About DS General PLC",
        description: "About page",
        category: "About",
        pageTheme: "about",
        highlights: ["Mission-led", "Integrated delivery"],
      },
      baseConfig,
    );

    expect(aboutMeta.ogImage).toContain("/api/og/page?");
    expect(aboutMeta.ogImage).toContain("theme=about");
  });
});
