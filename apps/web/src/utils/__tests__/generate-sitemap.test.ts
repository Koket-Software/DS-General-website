import { afterEach, describe, expect, it, vi } from "vitest";

import {
  generateFullSitemap,
  generateRobotsTxt,
  generateSitemap,
} from "../generate-sitemap";

import type { PublicBlogsResponse } from "@/lib/blogs/blogs-api";
import type { PublicBusinessSectorsListResponse } from "@/lib/business-sectors/business-sectors-api";
import type { PublicCaseStudiesListResponse } from "@/lib/case-study/case-study-api";
import type { PublicServicesListResponse } from "@/lib/services/services-api";
import type { PublicVacanciesResponse } from "@/lib/vacancies/vacancies-api";

const {
  fetchPublicBlogs,
  fetchPublicVacancies,
  fetchPublicServices,
  fetchPublicBusinessSectors,
  fetchPublicCaseStudies,
} = vi.hoisted(() => ({
  fetchPublicBlogs: vi.fn<() => Promise<PublicBlogsResponse>>(),
  fetchPublicVacancies: vi.fn<() => Promise<PublicVacanciesResponse>>(),
  fetchPublicServices: vi.fn<() => Promise<PublicServicesListResponse>>(),
  fetchPublicBusinessSectors:
    vi.fn<() => Promise<PublicBusinessSectorsListResponse>>(),
  fetchPublicCaseStudies: vi.fn<() => Promise<PublicCaseStudiesListResponse>>(),
}));

vi.mock("@/lib/blogs/blogs-api", () => ({
  fetchPublicBlogs,
}));

vi.mock("@/lib/vacancies/vacancies-api", () => ({
  fetchPublicVacancies,
}));

vi.mock("@/lib/services/services-api", () => ({
  fetchPublicServices,
}));

vi.mock("@/lib/business-sectors/business-sectors-api", () => ({
  fetchPublicBusinessSectors,
}));

vi.mock("@/lib/case-study/case-study-api", () => ({
  fetchPublicCaseStudies,
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("generate-sitemap", () => {
  it("renders sitemap XML entries with escaped values", () => {
    const xml = generateSitemap({
      baseUrl: "https://dsgeneralplc.com",
      prettyPrint: false,
      routes: [
        {
          loc: "https://dsgeneralplc.com/articles/logistics?ref=1&lang=en",
          lastmod: "2026-03-10",
          changefreq: "weekly",
          priority: 0.7,
        },
      ],
    });

    expect(xml).toContain(
      "https://dsgeneralplc.com/articles/logistics?ref=1&amp;lang=en",
    );
    expect(xml).toContain("<changefreq>weekly</changefreq>");
    expect(xml).toContain("<priority>0.7</priority>");
  });

  it("generates robots.txt with the canonical sitemap URL", () => {
    expect(generateRobotsTxt("https://dsgeneralplc.com/")).toBe(
      [
        "User-agent: *",
        "Allow: /",
        "Disallow: /uploads/",
        "",
        "Sitemap: https://dsgeneralplc.com/sitemap.xml",
      ].join("\n"),
    );
  });

  it("builds the full sitemap from current public route shapes", async () => {
    fetchPublicBlogs.mockResolvedValue({
      success: true,
      data: [
        {
          slug: "freight-resilience",
          publishDate: "2026-03-01T00:00:00.000Z",
          updatedAt: "2026-03-05T00:00:00.000Z",
        },
      ],
    } as PublicBlogsResponse);
    fetchPublicVacancies.mockResolvedValue({
      success: true,
      data: [
        {
          slug: "site-engineer",
          publishedAt: "2026-03-03T00:00:00.000Z",
          updatedAt: "2026-03-06T00:00:00.000Z",
        },
      ],
    } as PublicVacanciesResponse);
    fetchPublicServices.mockResolvedValue({
      success: true,
      data: [{ slug: "procurement" }],
    } as PublicServicesListResponse);
    fetchPublicBusinessSectors.mockResolvedValue({
      success: true,
      data: [
        {
          slug: "construction",
          publishDate: "2026-02-20T00:00:00.000Z",
        },
      ],
    } as PublicBusinessSectorsListResponse);
    fetchPublicCaseStudies.mockResolvedValue({
      success: true,
      data: [
        {
          slug: "axum-supply-modernization",
          createdAt: "2026-03-02T00:00:00.000Z",
        },
      ],
    } as PublicCaseStudiesListResponse);

    const xml = await generateFullSitemap("https://dsgeneralplc.com/", {
      prettyPrint: false,
      buildDate: "2026-03-10",
    });

    expect(xml).toContain(
      "https://dsgeneralplc.com/articles/freight-resilience",
    );
    expect(xml).toContain("https://dsgeneralplc.com/career/site-engineer");
    expect(xml).toContain("https://dsgeneralplc.com/services/procurement");
    expect(xml).toContain("https://dsgeneralplc.com/sectors/construction");
    expect(xml).toContain(
      "https://dsgeneralplc.com/projects/axum-supply-modernization",
    );
    expect(xml).not.toContain("/blogs/");
  });

  it("throws when strict dynamic route generation cannot fetch a source", async () => {
    fetchPublicBlogs.mockRejectedValue(new Error("blogs unavailable"));
    fetchPublicVacancies.mockResolvedValue({
      success: true,
      data: [],
    } as PublicVacanciesResponse);
    fetchPublicServices.mockResolvedValue({
      success: true,
      data: [],
    } as PublicServicesListResponse);
    fetchPublicBusinessSectors.mockResolvedValue({
      success: true,
      data: [],
    } as PublicBusinessSectorsListResponse);
    fetchPublicCaseStudies.mockResolvedValue({
      success: true,
      data: [],
    } as PublicCaseStudiesListResponse);

    await expect(
      generateFullSitemap("https://dsgeneralplc.com/", {
        strictDynamicRoutes: true,
      }),
    ).rejects.toThrow("Failed to fetch dynamic sitemap routes for: blogs");
  });
});
