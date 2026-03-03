import type { Context } from "hono";

import { generateOgImage, generateDefaultOgImage } from "./service";
import type { OgImageData } from "./types";
import { getServerBrandSeoConfig } from "../../shared/branding/brand-seo-config";
import type { DbClient } from "../../shared/db";
import { logger } from "../../shared/logger";

// Repository types
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

export const createOgImageController = (deps: OgImageControllerDeps) => {
  const brand = getServerBrandSeoConfig();

  /**
   * Helper to format date for display
   */
  const formatDate = (dateStr: string | null): string | undefined => {
    if (!dateStr) return undefined;
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  /**
   * Return image response
   */
  const returnImageResponse = async (
    imageResponse: Response,
  ): Promise<Response> => {
    // Get the image data from the ImageResponse
    const arrayBuffer = await imageResponse.arrayBuffer();

    // Create headers - preserve cache control from the original response
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

  const getDefaultResponse = async (): Promise<Response> => {
    const defaultImage = await generateDefaultOgImage({ brand });
    return returnImageResponse(defaultImage);
  };

  const sanitizeText = (value: string | undefined, maxLength: number) => {
    if (!value) return undefined;
    return value.trim().slice(0, maxLength);
  };

  return {
    /**
     * Generate OG image for a blog post
     */
    async getBlogOgImage(c: Context): Promise<Response> {
      const { slug } = c.req.param();

      try {
        if (!slug) {
          return getDefaultResponse();
        }

        const blog = await deps.blogRepository.findPublishedBySlug(slug);

        if (!blog) {
          return getDefaultResponse();
        }

        const data: OgImageData = {
          title: blog.title,
          description: blog.excerpt || undefined,
          imageUrl: blog.featuredImageUrl,
          type: "blog",
          category: "Blog",
          author: blog.author?.name,
          date: formatDate(blog.publishDate),
          readTime: blog.readTimeMinutes || undefined,
          tags: blog.tags?.map((t) => t.name) || [],
        };

        const imageResponse = await generateOgImage(data, { brand });
        return returnImageResponse(imageResponse);
      } catch (error) {
        logger.error("Error generating blog OG image", error as Error);
        return getDefaultResponse();
      }
    },

    /**
     * Generate OG image for a service page
     */
    async getServiceOgImage(c: Context): Promise<Response> {
      const { slug } = c.req.param();

      try {
        if (!slug) {
          return getDefaultResponse();
        }

        const service = await deps.serviceRepository.findPublishedBySlug(slug);

        if (!service) {
          return getDefaultResponse();
        }

        const data: OgImageData = {
          title: service.title,
          description: service.excerpt || undefined,
          imageUrl: service.featuredImageUrl,
          type: "service",
        };

        const imageResponse = await generateOgImage(data, { brand });
        return returnImageResponse(imageResponse);
      } catch (error) {
        logger.error("Error generating service OG image", error as Error);
        return getDefaultResponse();
      }
    },

    /**
     * Generate OG image for a case study/project
     */
    async getProjectOgImage(c: Context): Promise<Response> {
      const { slug } = c.req.param();

      try {
        if (!slug) {
          return getDefaultResponse();
        }

        const project =
          await deps.caseStudyRepository.findPublishedBySlug(slug);

        if (!project) {
          return getDefaultResponse();
        }

        const data: OgImageData = {
          title: project.title,
          description: project.excerpt || undefined,
          imageUrl: project.featuredImageUrl,
          type: "project",
          tags: project.tags?.map((t) => t.name) || [],
        };

        const imageResponse = await generateOgImage(data, { brand });
        return returnImageResponse(imageResponse);
      } catch (error) {
        logger.error("Error generating project OG image", error as Error);
        return getDefaultResponse();
      }
    },

    /**
     * Generate OG image for a career/vacancy
     */
    async getCareerOgImage(c: Context): Promise<Response> {
      const { slug } = c.req.param();

      try {
        if (!slug) {
          return getDefaultResponse();
        }

        const vacancy = await deps.vacancyRepository.findPublishedBySlug(slug);

        if (!vacancy) {
          return getDefaultResponse();
        }

        // Build tags from job details
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
        return returnImageResponse(imageResponse);
      } catch (error) {
        logger.error("Error generating career OG image", error as Error);
        return getDefaultResponse();
      }
    },

    /**
     * Generate OG image for a generic page
     */
    async getPageOgImage(c: Context): Promise<Response> {
      const title = sanitizeText(c.req.query("title"), 120);
      const description = sanitizeText(c.req.query("description"), 220);
      const category = sanitizeText(c.req.query("category"), 50);
      const imageUrl = c.req.query("image");

      try {
        if (!title) {
          return getDefaultResponse();
        }

        const data: OgImageData = {
          title,
          description: description || undefined,
          imageUrl: imageUrl || null,
          type: "page",
          category: category || undefined,
        };

        const imageResponse = await generateOgImage(data, { brand });
        return returnImageResponse(imageResponse);
      } catch (error) {
        logger.error("Error generating page OG image", error as Error);
        return getDefaultResponse();
      }
    },

    /**
     * Generate default OG image
     */
    async getDefaultOgImage(c: Context): Promise<Response> {
      try {
        return getDefaultResponse();
      } catch (error) {
        logger.error("Error generating default OG image", error as Error);
        // Return a basic error response
        return c.text("Error generating image", 500);
      }
    },
  };
};

export type OgImageController = ReturnType<typeof createOgImageController>;
