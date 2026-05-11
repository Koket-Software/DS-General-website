/* eslint-disable no-console */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import "./load-root-env";

import {
  generateFullSitemap,
  generateRobotsTxt,
} from "../src/utils/generate-sitemap";

async function main() {
  const envBaseUrl =
    process.env.VITE_SITE_URL || process.env.VITE_FRONTEND_URL || "";
  const baseUrl = /localhost|127\.0\.0\.1/.test(envBaseUrl)
    ? "https://dsgeneralplc.com"
    : envBaseUrl || "https://dsgeneralplc.com";
  const strictDynamicRoutes = process.env.SITEMAP_STRICT_DYNAMIC === "true";
  const publicDir = resolve(process.cwd(), "public");
  const sitemapPath = resolve(publicDir, "sitemap.xml");
  const robotsPath = resolve(publicDir, "robots.txt");

  console.log("Generating sitemap and robots.txt...");

  try {
    const [sitemap, robots] = await Promise.all([
      generateFullSitemap(baseUrl, {
        prettyPrint: true,
        includeDynamicRoutes: true,
        strictDynamicRoutes,
        onDynamicRouteWarning: (message) => {
          console.warn(message);
        },
      }),
      Promise.resolve(generateRobotsTxt(baseUrl)),
    ]);

    writeFileSync(sitemapPath, sitemap, "utf-8");
    writeFileSync(robotsPath, `${robots}\n`, "utf-8");

    console.log(`Sitemap generated at: ${sitemapPath}`);
    console.log(`Robots generated at: ${robotsPath}`);
    console.log(`Base URL: ${baseUrl}`);
    console.log(`Total URLs: ${sitemap.split("<url>").length - 1}`);
  } catch (error) {
    console.error("Error generating SEO artifacts:", error);
    process.exit(1);
  }
}

main();
