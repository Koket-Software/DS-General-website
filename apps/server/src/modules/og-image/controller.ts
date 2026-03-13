import type { Context } from "hono";

import { generateDefaultOgImage, generateOgImage } from "./service";
import type { OgImageData } from "./types";
import { PAGE_THEMES, type OgPageTheme } from "./types";
import { getServerBrandSeoConfig } from "../../shared/branding/brand-seo-config";
import type { DbClient } from "../../shared/db";
import { logger } from "../../shared/logger";

type BlogData = {
  title: string;
  excerpt: string | null;
  featuredImageUrl: string | null;
  author: { name: string } | null;
  publishDate: string | null;
  readTimeMinutes: number | null;
  tags: Array<{ name: string }>;
};

type ServiceData = {
  title: string;
  excerpt: string | null;
  featuredImageUrl: string | null;
};

type CaseStudyData = {
  title: string;
  excerpt: string | null;
  featuredImageUrl: string | null;
  tags: Array<{ name: string }>;
};

type VacancyData = {
  title: string;
  excerpt: string | null;
  department: string | null;
  location: string | null;
  employmentType: string | null;
};

export interface OgImageControllerDeps {
  db: DbClient;
  blogRepository: {
    findPublishedBySlug: (slug: string) => Promise<BlogData | null>;
  };
  serviceRepository: {
    findPublishedBySlug: (slug: string) => Promise<ServiceData | null>;
  };
  caseStudyRepository: {
    findPublishedBySlug: (slug: string) => Promise<CaseStudyData | null>;
  };
  vacancyRepository: {
    findPublishedBySlug: (slug: string) => Promise<VacancyData | null>;
  };
}

const PAGE_THEME_SET = new Set<string>(PAGE_THEMES);

export const createOgImageController = (deps: OgImageControllerDeps) => {
  const brand = getServerBrandSeoConfig();
  const brandDefaultPath = brand.ogDefaultPath.trim();
  const brandDefaultPathname = (() => {
    if (/^https?:\/\//i.test(brandDefaultPath)) {
      return new URL(brandDefaultPath).pathname;
    }
    return brandDefaultPath.split("?")[0] || "/";
  })();
  const usesDynamicDefaultEndpoint = brandDefaultPathname === "/api/og/default";

  const formatDate = (dateStr: string | null): string | undefined => {
    if (!dateStr) return undefined;
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const returnImageResponse = async (
    imageResponse: Response,
  ): Promise<Response> => {
    const arrayBuffer = await imageResponse.arrayBuffer();

    const headers = new Headers();
    headers.set("Content-Type", "image/png");
    headers.set(
      "Cache-Control",
      imageResponse.headers.get("Cache-Control") ||
        "public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400",
    );

    return new Response(arrayBuffer, {
      status: 200,
      headers,
    });
  };

  const getDefaultResponse = async (c: Context): Promise<Response> => {
    if (usesDynamicDefaultEndpoint) {
      const defaultImage = await generateDefaultOgImage({ brand });
      return await returnImageResponse(defaultImage);
    }

    const fallbackUrl = /^https?:\/\//i.test(brandDefaultPath)
      ? brandDefaultPath
      : new URL(
          brandDefaultPath.startsWith("/")
            ? brandDefaultPath
            : `/${brandDefaultPath}`,
          c.req.url,
        ).toString();

    return c.redirect(fallbackUrl, 302);
  };

  const sanitizeText = (value: string | undefined, maxLength: number) => {
    if (!value) return undefined;
    return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
  };

  const sanitizeHighlights = (c: Context): string[] => {
    const url = new URL(c.req.url);
    return url.searchParams
      .getAll("highlight")
      .map((value) => sanitizeText(value, 32))
      .filter((value): value is string => Boolean(value))
      .slice(0, 4);
  };

  const sanitizePageTheme = (
    value: string | undefined,
  ): OgPageTheme | undefined => {
    if (!value) return undefined;
    return PAGE_THEME_SET.has(value) ? (value as OgPageTheme) : undefined;
  };

  return {
    async getBlogOgImage(c: Context): Promise<Response> {
      const { slug } = c.req.param();

      try {
        if (!slug) {
          return getDefaultResponse(c);
        }

        const blog = await deps.blogRepository.findPublishedBySlug(slug);

        if (!blog) {
          return getDefaultResponse(c);
        }

        const data: OgImageData = {
          title: blog.title,
          description: blog.excerpt || undefined,
          imageUrl: blog.featuredImageUrl,
          type: "blog",
          category: "Article",
          author: blog.author?.name,
          date: formatDate(blog.publishDate),
          readTime: blog.readTimeMinutes || undefined,
          tags: blog.tags?.map((tag) => tag.name) || [],
        };

        const imageResponse = await generateOgImage(data, { brand });
        return await returnImageResponse(imageResponse);
      } catch (error) {
        logger.error("Error generating blog OG image", error as Error);
        return getDefaultResponse(c);
      }
    },

    async getServiceOgImage(c: Context): Promise<Response> {
      const { slug } = c.req.param();

      try {
        if (!slug) {
          return getDefaultResponse(c);
        }

        const service = await deps.serviceRepository.findPublishedBySlug(slug);

        if (!service) {
          return getDefaultResponse(c);
        }

        const data: OgImageData = {
          title: service.title,
          description: service.excerpt || undefined,
          imageUrl: service.featuredImageUrl,
          type: "service",
          category: "Service",
        };

        const imageResponse = await generateOgImage(data, { brand });
        return await returnImageResponse(imageResponse);
      } catch (error) {
        logger.error("Error generating service OG image", error as Error);
        return getDefaultResponse(c);
      }
    },

    async getProjectOgImage(c: Context): Promise<Response> {
      const { slug } = c.req.param();

      try {
        if (!slug) {
          return getDefaultResponse(c);
        }

        const project =
          await deps.caseStudyRepository.findPublishedBySlug(slug);

        if (!project) {
          return getDefaultResponse(c);
        }

        const data: OgImageData = {
          title: project.title,
          description: project.excerpt || undefined,
          imageUrl: project.featuredImageUrl,
          type: "project",
          category: "Project",
          tags: project.tags?.map((tag) => tag.name) || [],
        };

        const imageResponse = await generateOgImage(data, { brand });
        return await returnImageResponse(imageResponse);
      } catch (error) {
        logger.error("Error generating project OG image", error as Error);
        return getDefaultResponse(c);
      }
    },

    async getCareerOgImage(c: Context): Promise<Response> {
      const { slug } = c.req.param();

      try {
        if (!slug) {
          return getDefaultResponse(c);
        }

        const vacancy = await deps.vacancyRepository.findPublishedBySlug(slug);

        if (!vacancy) {
          return getDefaultResponse(c);
        }

        const jobTags: string[] = [];
        if (vacancy.department) jobTags.push(vacancy.department);
        if (vacancy.location) jobTags.push(vacancy.location);
        if (vacancy.employmentType) jobTags.push(vacancy.employmentType);

        const data: OgImageData = {
          title: vacancy.title,
          description: vacancy.excerpt || undefined,
          type: "career",
          category: "Careers",
          tags: jobTags,
        };

        const imageResponse = await generateOgImage(data, { brand });
        return await returnImageResponse(imageResponse);
      } catch (error) {
        logger.error("Error generating career OG image", error as Error);
        return getDefaultResponse(c);
      }
    },

    async getPageOgImage(c: Context): Promise<Response> {
      const title = sanitizeText(c.req.query("title"), 120);
      const description = sanitizeText(c.req.query("description"), 220);
      const category = sanitizeText(c.req.query("category"), 50);
      const imageUrl = c.req.query("image");
      const pageTheme = sanitizePageTheme(c.req.query("theme"));
      const highlights = sanitizeHighlights(c);

      try {
        if (!title) {
          return getDefaultResponse(c);
        }

        const data: OgImageData = {
          title,
          description: description || undefined,
          imageUrl: imageUrl || null,
          type: "page",
          category: category || undefined,
          pageTheme,
          highlights,
        };

        const imageResponse = await generateOgImage(data, { brand });
        return await returnImageResponse(imageResponse);
      } catch (error) {
        logger.error("Error generating page OG image", error as Error);
        return getDefaultResponse(c);
      }
    },

    async getDefaultOgImage(c: Context): Promise<Response> {
      try {
        return getDefaultResponse(c);
      } catch (error) {
        logger.error("Error generating default OG image", error as Error);
        return c.text("Error generating image", 500);
      }
    },
  };
};

export type OgImageController = ReturnType<typeof createOgImageController>;
