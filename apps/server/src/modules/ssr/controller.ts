import type { Context } from "hono";

import {
  createBlogMeta,
  createCareerMeta,
  createDefaultMeta,
  createGenericPathMeta,
  createHomeMeta,
  createProjectMeta,
  createSectorMeta,
  createServiceMeta,
  createStaticPageMeta,
  generateHtmlShell,
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
  {
    title: string;
    description: string;
    category: string;
    pageTheme:
      | "about"
      | "articles"
      | "gallery"
      | "contact"
      | "career"
      | "legal";
    highlights: string[];
    section: string;
  }
>([
  [
    "/about",
    {
      title: "About DS General PLC",
      description:
        "Learn how DS General PLC combines sourcing, construction, and operational delivery into one integrated execution model.",
      category: "About",
      pageTheme: "about",
      highlights: [
        "Mission-led growth",
        "Integrated execution",
        "Ethiopian market focus",
      ],
      section: "About",
    },
  ],
  [
    "/articles",
    {
      title: "Articles & Insights",
      description:
        "Read practical articles on supply chains, engineering operations, and project delivery from the DS General PLC team.",
      category: "Articles",
      pageTheme: "articles",
      highlights: [
        "Engineering stories",
        "Operational insights",
        "Field intelligence",
      ],
      section: "Articles",
    },
  ],
  [
    "/career",
    {
      title: "Careers",
      description:
        "Explore open roles at DS General PLC and join teams building dependable sourcing, supply, and construction operations.",
      category: "Careers",
      pageTheme: "career",
      highlights: ["Open roles", "Operational excellence", "Build with us"],
      section: "Careers",
    },
  ],
  [
    "/contact",
    {
      title: "Contact Us",
      description:
        "Talk with DS General PLC about procurement, project planning, sourcing partnerships, and construction delivery.",
      category: "Contact",
      pageTheme: "contact",
      highlights: ["Quotes", "Procurement", "Project planning"],
      section: "Contact",
    },
  ],
  [
    "/gallery",
    {
      title: "Gallery",
      description:
        "Browse visual highlights from DS General PLC projects, deliveries, and on-the-ground operational work.",
      category: "Gallery",
      pageTheme: "gallery",
      highlights: ["Field moments", "Delivery snapshots", "Project highlights"],
      section: "Gallery",
    },
  ],
  [
    "/privacy-policy",
    {
      title: "Privacy Policy",
      description:
        "Review how DS General PLC collects, uses, and safeguards information shared through the website.",
      category: "Privacy Policy",
      pageTheme: "legal",
      highlights: [
        "Responsible handling",
        "Clear disclosure",
        "Policy transparency",
      ],
      section: "Privacy Policy",
    },
  ],
  [
    "/terms-of-service",
    {
      title: "Terms of Service",
      description:
        "Read the website terms governing access to DS General PLC content, service information, and inquiries.",
      category: "Terms of Service",
      pageTheme: "legal",
      highlights: ["Usage terms", "Service clarity", "Commercial context"],
      section: "Terms of Service",
    },
  ],
]);

type Resolver = (
  canonicalPath: string,
  lookupPath: string,
  deps: SsrControllerDeps,
  config: SsrConfig,
) => Promise<PageMeta | null>;

const dynamicResolvers: Resolver[] = [
  async (canonicalPath, lookupPath, deps, config) => {
    const match = lookupPath.match(/^\/articles\/([^/]+)$/);
    if (!match) return null;
    const slug = match[1]!;
    const blog = await deps.blogRepository.findPublishedBySlug(slug);
    if (!blog) return null;
    return createBlogMeta(slug, canonicalPath, blog, config);
  },
  async (canonicalPath, lookupPath, deps, config) => {
    const match = lookupPath.match(/^\/services\/([^/]+)$/);
    if (!match) return null;
    const slug = match[1]!;
    const service = await deps.serviceRepository.findPublicBySlug(slug);
    if (!service) return null;
    return createServiceMeta(slug, canonicalPath, service, config);
  },
  async (canonicalPath, lookupPath, deps, config) => {
    const match = lookupPath.match(/^\/projects\/([^/]+)$/);
    if (!match) return null;
    const slug = match[1]!;
    const project =
      (await deps.caseStudyRepository.findBySlug(slug)) ||
      (await deps.productRepository.findBySlug(slug));
    if (!project) return null;
    return createProjectMeta(slug, canonicalPath, project, config);
  },
  async (canonicalPath, lookupPath, deps, config) => {
    const match = lookupPath.match(/^\/career\/([^/]+)$/);
    if (!match) return null;
    const slug = match[1]!;
    const career = await deps.vacancyRepository.findPublicBySlug(slug);
    if (!career) return null;
    return createCareerMeta(slug, canonicalPath, career, config);
  },
  async (canonicalPath, lookupPath, deps, config) => {
    const match = lookupPath.match(/^\/sectors\/([^/]+)$/);
    if (!match) return null;
    const slug = match[1]!;
    const sector =
      await deps.businessSectorRepository.findPublishedBySlug(slug);
    if (!sector) return null;
    return createSectorMeta(canonicalPath, sector, config);
  },
];

const resolveStaticMeta = (
  canonicalPath: string,
  lookupPath: string,
  config: SsrConfig,
): PageMeta | null => {
  if (lookupPath === "/") {
    return createHomeMeta(canonicalPath, config);
  }

  const staticMeta = staticPageRegistry.get(lookupPath);
  if (!staticMeta) return null;

  return createStaticPageMeta(canonicalPath, staticMeta, config);
};

async function getMetaForPath(
  requestedPath: string,
  deps: SsrControllerDeps,
  config: SsrConfig,
): Promise<PageMeta> {
  const lookupPath = normalizeLookupPath(requestedPath);
  const canonicalPath = lookupPath;

  for (const resolver of dynamicResolvers) {
    const resolved = await resolver(canonicalPath, lookupPath, deps, config);
    if (resolved) return resolved;
  }

  const staticMeta = resolveStaticMeta(canonicalPath, lookupPath, config);
  if (staticMeta) return staticMeta;

  return createGenericPathMeta(canonicalPath, config);
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
