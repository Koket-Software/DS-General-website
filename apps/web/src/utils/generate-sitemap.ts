import {
  PUBLIC_ROUTE_PATHS,
  PUBLIC_STATIC_SEO_ROUTES,
  joinUrl,
  normalizeSeoPath,
} from "@suba-company-template/types";

import { fetchPublicBlogs } from "@/lib/blogs/blogs-api";
import { fetchPublicBusinessSectors } from "@/lib/business-sectors/business-sectors-api";
import { fetchPublicCaseStudies } from "@/lib/case-study/case-study-api";
import { fetchPublicServices } from "@/lib/services/services-api";
import { fetchPublicVacancies } from "@/lib/vacancies/vacancies-api";

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
}

interface SitemapOptions {
  baseUrl: string;
  routes: SitemapUrl[];
  prettyPrint?: boolean;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toDateString(value?: Date | string | null): string | undefined {
  if (!value) {
    return undefined;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString().split("T")[0];
}

export function generateSitemap(options: SitemapOptions): string {
  const { routes, prettyPrint = true } = options;
  const indent = prettyPrint ? "  " : "";
  const newline = prettyPrint ? "\n" : "";

  const header = `<?xml version="1.0" encoding="UTF-8"?>${newline}<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${newline}`;

  const urls = routes
    .map((route) => {
      const url = `${indent}<url>${newline}${indent}${indent}<loc>${escapeXml(route.loc)}</loc>${newline}`;

      const lastmod = route.lastmod
        ? `${indent}${indent}<lastmod>${escapeXml(route.lastmod)}</lastmod>${newline}`
        : "";

      const changefreq = route.changefreq
        ? `${indent}${indent}<changefreq>${route.changefreq}</changefreq>${newline}`
        : "";

      const priority =
        route.priority !== undefined
          ? `${indent}${indent}<priority>${route.priority.toFixed(1)}</priority>${newline}`
          : "";

      return `${url}${lastmod}${changefreq}${priority}${indent}</url>`;
    })
    .join(newline);

  return `${header}${urls}${newline}</urlset>`;
}

function getStaticRoutes(buildDate: string, baseUrl: string): SitemapUrl[] {
  return PUBLIC_STATIC_SEO_ROUTES.map((route) => ({
    loc: joinUrl(baseUrl, route.path),
    lastmod: buildDate,
    changefreq: route.sitemap.changefreq,
    priority: route.sitemap.priority,
  }));
}

async function getDynamicRoutes(
  buildDate: string,
  baseUrl: string,
): Promise<SitemapUrl[]> {
  const settled = await Promise.allSettled([
    fetchPublicBlogs({
      page: 1,
      limit: 100,
      sortBy: "publishDate",
      sortOrder: "desc",
    }),
    fetchPublicVacancies({
      page: 1,
      limit: 100,
      sortBy: "publishedAt",
      sortOrder: "desc",
    }),
    fetchPublicServices({
      page: 1,
      limit: 100,
      sortBy: "createdAt",
      sortOrder: "desc",
    }),
    fetchPublicBusinessSectors({
      page: 1,
      limit: 100,
      sortBy: "publishDate",
      sortOrder: "desc",
    }),
    fetchPublicCaseStudies({
      page: 1,
      limit: 100,
    }),
  ]);

  const [
    blogsResult,
    vacanciesResult,
    servicesResult,
    sectorsResult,
    caseStudiesResult,
  ] = settled;

  const routes: SitemapUrl[] = [];

  if (blogsResult.status === "fulfilled") {
    routes.push(
      ...blogsResult.value.data.map((article) => ({
        loc: joinUrl(baseUrl, PUBLIC_ROUTE_PATHS.article(article.slug)),
        lastmod:
          toDateString(article.updatedAt) ??
          toDateString(article.publishDate) ??
          toDateString(article.createdAt) ??
          buildDate,
        changefreq: "weekly" as const,
        priority: 0.7,
      })),
    );
  }

  if (vacanciesResult.status === "fulfilled") {
    routes.push(
      ...vacanciesResult.value.data.map((vacancy) => ({
        loc: joinUrl(baseUrl, PUBLIC_ROUTE_PATHS.careerDetail(vacancy.slug)),
        lastmod:
          toDateString(vacancy.updatedAt) ??
          toDateString(vacancy.publishedAt) ??
          toDateString(vacancy.createdAt) ??
          buildDate,
        changefreq: "weekly" as const,
        priority: 0.7,
      })),
    );
  }

  if (servicesResult.status === "fulfilled") {
    routes.push(
      ...servicesResult.value.data.map((service) => ({
        loc: joinUrl(baseUrl, PUBLIC_ROUTE_PATHS.service(service.slug)),
        lastmod: buildDate,
        changefreq: "weekly" as const,
        priority: 0.75,
      })),
    );
  }

  if (sectorsResult.status === "fulfilled") {
    routes.push(
      ...sectorsResult.value.data.map((sector) => ({
        loc: joinUrl(baseUrl, PUBLIC_ROUTE_PATHS.sector(sector.slug)),
        lastmod:
          toDateString(sector.updatedAt) ??
          toDateString(sector.publishDate) ??
          toDateString(sector.createdAt) ??
          buildDate,
        changefreq: "monthly" as const,
        priority: 0.65,
      })),
    );
  }

  if (caseStudiesResult.status === "fulfilled") {
    routes.push(
      ...caseStudiesResult.value.data.map((project) => ({
        loc: joinUrl(baseUrl, PUBLIC_ROUTE_PATHS.project(project.slug)),
        lastmod: toDateString(project.createdAt) ?? buildDate,
        changefreq: "weekly" as const,
        priority: 0.75,
      })),
    );
  }

  return routes;
}

export async function generateFullSitemap(
  baseUrl: string,
  options?: {
    prettyPrint?: boolean;
    buildDate?: string;
    includeDynamicRoutes?: boolean;
  },
): Promise<string> {
  const buildDate =
    options?.buildDate ??
    new Date().toISOString().split("T")[0] ??
    "1970-01-01";
  const normalizedBaseUrl = joinUrl(baseUrl, "/").replace(/\/+$/, "");

  const routes = [
    ...getStaticRoutes(buildDate, normalizedBaseUrl),
    ...((options?.includeDynamicRoutes ?? true)
      ? await getDynamicRoutes(buildDate, normalizedBaseUrl)
      : []),
  ];

  const dedupedRoutes = Array.from(
    new Map(
      routes.map((route) => [
        normalizeSeoPath(new URL(route.loc).pathname),
        route,
      ]),
    ).values(),
  ).sort((a, b) => a.loc.localeCompare(b.loc));

  return generateSitemap({
    baseUrl: normalizedBaseUrl,
    routes: dedupedRoutes,
    prettyPrint: options?.prettyPrint ?? true,
  });
}

export function generateRobotsTxt(baseUrl: string): string {
  const normalizedBaseUrl = joinUrl(baseUrl, "/").replace(/\/+$/, "");

  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /uploads/",
    "",
    `Sitemap: ${joinUrl(normalizedBaseUrl, "/sitemap.xml")}`,
  ].join("\n");
}
