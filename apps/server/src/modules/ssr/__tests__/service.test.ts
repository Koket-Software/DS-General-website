import { describe, expect, it } from "bun:test";

import {
  generateHtmlShell,
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

  it("reuses the home OG payload for non-home static pages", () => {
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

    expect(aboutMeta.ogImage).toBe("/og_image_ds.webp");
    expect(aboutMeta.ogTitle).toBe(baseConfig.defaultTitle);
    expect(aboutMeta.ogDescription).toBe(baseConfig.defaultDescription);
    expect(aboutMeta.ogUrl).toBe("/");
  });

  it("renders static home OG tags while preserving page-specific title and canonical", () => {
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
    const html = generateHtmlShell(aboutMeta, baseConfig);

    expect(html).toContain(
      "<title>About DS General PLC | DS General PLC</title>",
    );
    expect(html).toContain(
      '<link rel="canonical" href="https://dsgeneralplc.com/about" />',
    );
    expect(html).toContain(
      '<meta property="og:title" content="DS General PLC | We&#039;re Building the Future" />',
    );
    expect(html).toContain(
      '<meta property="og:url" content="https://dsgeneralplc.com/" />',
    );
    expect(html).toContain(
      '<meta property="og:image" content="https://dsgeneralplc.com/og_image_ds.webp" />',
    );
  });
});
