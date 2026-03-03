import type { Context } from "hono";

import {
  generateHtmlShell,
  createDefaultMeta,
  createBlogMeta,
  createServiceMeta,
  createProjectMeta,
  createCareerMeta,
  createStaticPageMeta,
  createGenericPathMeta,
  createSectorMeta,
} from "./service";
import type { PageMeta, SsrConfig } from "./types";
import { getServerBrandSeoConfig } from "../../shared/branding/brand-seo-config";
import { logger } from "../../shared/logger";

type BlogData = {
  title: string;
  excerpt: string | null;
  author: string | null;
  publishDate: string | null;
  tags?: { name: string }[];
};

type ServiceData = {
  title: string;
  excerpt: string | null;
};

type ProjectData = {
  title: string;
  excerpt: string | null;
  tags?: { name: string }[];
};

type ProductData = {
  title: string;
  excerpt: string | null;
  tags?: { name: string }[];
};

type CareerData = {
  title: string;
  excerpt: string | null;
  department: string | null;
  location: string | null;
};

type SectorData = {
  title: string;
  excerpt: string | null;
  featuredImageUrl?: string | null;
};

export interface SsrControllerDeps {
  blogRepository: {
    findPublishedBySlug: (slug: string) => Promise<BlogData | null>;
  };
  serviceRepository: {
    findPublicBySlug: (slug: string) => Promise<ServiceData | null>;
  };
  caseStudyRepository: {
    findBySlug: (slug: string) => Promise<ProjectData | null>;
  };
  productRepository: {
    findBySlug: (slug: string) => Promise<ProductData | null>;
  };
  vacancyRepository: {
    findPublicBySlug: (slug: string) => Promise<CareerData | null>;
  };
  businessSectorRepository: {
    findPublishedBySlug: (slug: string) => Promise<SectorData | null>;
  };
}

export type SsrController = ReturnType<typeof createSsrController>;

const normalizeLookupPath = (path: string): string => {
  const [pathWithoutQuery] = path.split("?");
  if (!pathWithoutQuery || pathWithoutQuery === "/") return "/";
  if (pathWithoutQuery === "/demo") return "/";
  if (pathWithoutQuery.startsWith("/demo/")) {
    const normalized = pathWithoutQuery.replace(/^\/demo/, "");
    return normalized || "/";
  }
  return pathWithoutQuery;
};

const staticPageRegistry = new Map<
  string,
  { title: string; description: string }
>([
  [
    "/about",
    {
      title: "About Us",
      description:
        "Learn about our mission, values, and the team behind our digital products.",
    },
  ],
  [
    "/contact",
    {
      title: "Contact Us",
      description:
        "Connect with our team to discuss your next product or platform initiative.",
    },
  ],
  [
    "/schedule",
    {
      title: "Schedule a Meeting",
      description:
        "Book time with our team to discuss your requirements and goals.",
    },
  ],
  [
    "/blogs",
    {
      title: "Blog",
      description:
        "Insights, engineering stories, and practical guidance from our team.",
    },
  ],
  [
    "/services",
    {
      title: "Services",
      description:
        "Explore our engineering, product, and consulting capabilities.",
    },
  ],
  [
    "/projects",
    {
      title: "Projects",
      description:
        "Browse selected projects and case studies across industries.",
    },
  ],
  [
    "/careers",
    {
      title: "Careers",
      description:
        "Discover open roles and opportunities to build meaningful products.",
    },
  ],
  [
    "/gallery",
    {
      title: "Gallery",
      description: "Explore visuals, moments, and highlights from our work.",
    },
  ],
  [
    "/sectors",
    {
      title: "Business Sectors",
      description: "See the industries and domains where we deliver outcomes.",
    },
  ],
]);

type Resolver = (
  requestedPath: string,
  lookupPath: string,
  deps: SsrControllerDeps,
  config: SsrConfig,
) => Promise<PageMeta | null>;

const dynamicResolvers: Resolver[] = [
  async (requestedPath, lookupPath, deps, config) => {
    const match = lookupPath.match(/^\/blogs\/([^/]+)$/);
    if (!match) return null;
    const slug = match[1]!;
    const blog = await deps.blogRepository.findPublishedBySlug(slug);
    if (!blog) return null;
    return createBlogMeta(slug, requestedPath, blog, config);
  },
  async (requestedPath, lookupPath, deps, config) => {
    const match = lookupPath.match(/^\/services\/([^/]+)$/);
    if (!match) return null;
    const slug = match[1]!;
    const service = await deps.serviceRepository.findPublicBySlug(slug);
    if (!service) return null;
    return createServiceMeta(slug, requestedPath, service, config);
  },
  async (requestedPath, lookupPath, deps, config) => {
    const match = lookupPath.match(/^\/projects\/([^/]+)$/);
    if (!match) return null;
    const slug = match[1]!;
    const project =
      (await deps.caseStudyRepository.findBySlug(slug)) ||
      (await deps.productRepository.findBySlug(slug));
    if (!project) return null;
    return createProjectMeta(slug, requestedPath, project, config);
  },
  async (requestedPath, lookupPath, deps, config) => {
    const match = lookupPath.match(/^\/careers\/([^/]+)$/);
    if (!match) return null;
    const slug = match[1]!;
    const career = await deps.vacancyRepository.findPublicBySlug(slug);
    if (!career) return null;
    return createCareerMeta(slug, requestedPath, career, config);
  },
  async (requestedPath, lookupPath, deps, config) => {
    const match = lookupPath.match(/^\/sectors\/([^/]+)$/);
    if (!match) return null;
    const slug = match[1]!;
    const sector =
      await deps.businessSectorRepository.findPublishedBySlug(slug);
    if (!sector) return null;
    return createSectorMeta(requestedPath, sector, config);
  },
];

const resolveStaticMeta = (
  requestedPath: string,
  lookupPath: string,
  config: SsrConfig,
): PageMeta | null => {
  if (lookupPath === "/") {
    return createDefaultMeta(requestedPath, config);
  }

  const staticMeta = staticPageRegistry.get(lookupPath);
  if (!staticMeta) return null;
  return createStaticPageMeta(
    requestedPath,
    staticMeta.title,
    staticMeta.description,
    config,
  );
};

async function getMetaForPath(
  requestedPath: string,
  deps: SsrControllerDeps,
  config: SsrConfig,
): Promise<PageMeta> {
  const lookupPath = normalizeLookupPath(requestedPath);

  for (const resolver of dynamicResolvers) {
    const resolved = await resolver(requestedPath, lookupPath, deps, config);
    if (resolved) return resolved;
  }

  const staticMeta = resolveStaticMeta(requestedPath, lookupPath, config);
  if (staticMeta) return staticMeta;

  return createGenericPathMeta(requestedPath, config);
}

export const createSsrController = (deps: SsrControllerDeps) => {
  const brand = getServerBrandSeoConfig();

  async function servePrerenderedHtml(c: Context): Promise<Response> {
    const path = c.req.path.replace(/^\/_ssr/, "") || "/";

    try {
      const meta = await getMetaForPath(path, deps, brand);
      const html = generateHtmlShell(meta, brand);

      return c.html(html, 200, {
        "Cache-Control":
          "public, max-age=300, s-maxage=600, stale-while-revalidate=86400",
      });
    } catch (error) {
      logger.error("SSR error", error as Error, { path });
      const fallbackMeta = createDefaultMeta(path, brand);
      const html = generateHtmlShell(fallbackMeta, brand);
      return c.html(html, 200);
    }
  }

  return {
    servePrerenderedHtml,
  };
};
