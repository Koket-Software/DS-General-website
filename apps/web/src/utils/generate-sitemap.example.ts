/**
 * Example usage of sitemap generation utilities.
 */

/* eslint-disable no-console */

import { generateFullSitemap, generateSitemap } from "./generate-sitemap";

export function exampleBasicSitemap() {
  const sitemap = generateSitemap({
    baseUrl: "https://dsgeneralplc.com",
    routes: [
      {
        loc: "https://dsgeneralplc.com/",
        lastmod: "2026-03-10",
        changefreq: "daily",
        priority: 1,
      },
      {
        loc: "https://dsgeneralplc.com/about",
        lastmod: "2026-03-10",
        changefreq: "weekly",
        priority: 0.9,
      },
    ],
  });

  console.log(sitemap);
}

export async function exampleFullSitemap() {
  const sitemap = await generateFullSitemap("https://dsgeneralplc.com", {
    prettyPrint: true,
    includeDynamicRoutes: true,
  });

  console.log(
    `Generated sitemap with ${sitemap.split("<url>").length - 1} URLs`,
  );
}

if (import.meta.main) {
  exampleBasicSitemap();
  void exampleFullSitemap();
}
