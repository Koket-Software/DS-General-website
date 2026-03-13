export type SitemapChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export interface SitemapRouteConfig {
  changefreq: SitemapChangeFrequency;
  priority: number;
}

export interface PublicStaticSeoRoute {
  path: string;
  title: string;
  description: string;
  section: string;
  category: string;
  pageTheme:
    | "home"
    | "about"
    | "articles"
    | "gallery"
    | "contact"
    | "career"
    | "legal"
    | "sector"
    | "generic";
  highlights: string[];
  sitemap: SitemapRouteConfig;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface OrganizationJsonLdInput {
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[];
}

export interface WebSiteJsonLdInput {
  name: string;
  url: string;
}

export interface WebPageJsonLdInput {
  title: string;
  description: string;
  url: string;
}

export interface ArticleJsonLdInput extends WebPageJsonLdInput {
  image?: string;
  authorName?: string;
  datePublished?: string;
  dateModified?: string;
}

export interface JobPostingJsonLdInput {
  title: string;
  description: string;
  url: string;
  datePosted?: string;
  employmentType?: string;
  hiringOrganization: {
    name: string;
    sameAs?: string;
    logo?: string;
  };
  jobLocation?: {
    addressLocality?: string;
    addressCountry?: string;
  };
}

export interface ServiceJsonLdInput extends WebPageJsonLdInput {
  providerName: string;
  image?: string;
}

const trimTrailingSlashes = (value: string) => value.replace(/\/+$/, "") || "/";

export function normalizeSeoPath(path: string): string {
  const safePath = path || "/";
  const [withoutHash = ""] = safePath.split("#");
  const [withoutQuery = ""] = withoutHash.split("?");

  if (!withoutQuery || withoutQuery === "/") {
    return "/";
  }

  return `/${trimTrailingSlashes(withoutQuery).replace(/^\/+/, "")}`;
}

export function joinUrl(baseUrl: string, path: string): string {
  const normalizedBase = trimTrailingSlashes(baseUrl);
  const normalizedPath = normalizeSeoPath(path);

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return normalizedPath === "/"
    ? `${normalizedBase}/`
    : `${normalizedBase}${normalizedPath}`;
}

export function buildRobotsContent(options?: {
  index?: boolean;
  follow?: boolean;
}): string {
  const index = options?.index ?? true;
  const follow = options?.follow ?? true;

  return `${index ? "index" : "noindex"}, ${follow ? "follow" : "nofollow"}`;
}

export const PUBLIC_ROUTE_PATHS = {
  home: () => "/",
  about: () => "/about",
  articles: () => "/articles",
  article: (slug: string) => `/articles/${slug}`,
  career: () => "/career",
  careerDetail: (slug: string) => `/career/${slug}`,
  services: () => "/services",
  service: (slug: string) => `/services/${slug}`,
  projects: () => "/projects",
  project: (slug: string) => `/projects/${slug}`,
  sector: (slug: string) => `/sectors/${slug}`,
  contact: () => "/contact",
  gallery: () => "/gallery",
  privacyPolicy: () => "/privacy-policy",
  termsOfService: () => "/terms-of-service",
} as const;

export const PUBLIC_STATIC_SEO_ROUTES: PublicStaticSeoRoute[] = [
  {
    path: PUBLIC_ROUTE_PATHS.home(),
    title: "DS General PLC | We're Building the Future",
    description:
      "DS General PLC delivers reliable engineering, trading, and operational solutions for high-impact business sectors in Ethiopia.",
    section: "Home",
    category: "DS General PLC",
    pageTheme: "home",
    highlights: ["General Contracting", "Material Supply", "Global Sourcing"],
    sitemap: { changefreq: "daily", priority: 1 },
  },
  {
    path: PUBLIC_ROUTE_PATHS.about(),
    title: "About DS General PLC",
    description:
      "Learn how DS General PLC combines sourcing, construction, and operational delivery into one integrated execution model.",
    section: "About",
    category: "About",
    pageTheme: "about",
    highlights: [
      "Mission-led growth",
      "Integrated execution",
      "Ethiopian market focus",
    ],
    sitemap: { changefreq: "weekly", priority: 0.9 },
  },
  {
    path: PUBLIC_ROUTE_PATHS.articles(),
    title: "Articles & Insights",
    description:
      "Read practical articles on supply chains, engineering operations, and project delivery from the DS General PLC team.",
    section: "Articles",
    category: "Articles",
    pageTheme: "articles",
    highlights: [
      "Engineering stories",
      "Operational insights",
      "Field intelligence",
    ],
    sitemap: { changefreq: "weekly", priority: 0.8 },
  },
  {
    path: PUBLIC_ROUTE_PATHS.career(),
    title: "Careers",
    description:
      "Explore open roles at DS General PLC and join teams building dependable sourcing, supply, and construction operations.",
    section: "Careers",
    category: "Careers",
    pageTheme: "career",
    highlights: ["Open roles", "Operational excellence", "Build with us"],
    sitemap: { changefreq: "weekly", priority: 0.8 },
  },
  {
    path: PUBLIC_ROUTE_PATHS.contact(),
    title: "Contact Us",
    description:
      "Talk with DS General PLC about procurement, project planning, sourcing partnerships, and construction delivery.",
    section: "Contact",
    category: "Contact",
    pageTheme: "contact",
    highlights: ["Quotes", "Procurement", "Project planning"],
    sitemap: { changefreq: "weekly", priority: 0.8 },
  },
  {
    path: PUBLIC_ROUTE_PATHS.gallery(),
    title: "Gallery",
    description:
      "Browse visual highlights from DS General PLC projects, deliveries, and on-the-ground operational work.",
    section: "Gallery",
    category: "Gallery",
    pageTheme: "gallery",
    highlights: ["Field moments", "Delivery snapshots", "Project highlights"],
    sitemap: { changefreq: "weekly", priority: 0.8 },
  },
  {
    path: PUBLIC_ROUTE_PATHS.services(),
    title: "Services",
    description:
      "Explore DS General PLC services across engineering execution, supply operations, and integrated project delivery.",
    section: "Services",
    category: "Services",
    pageTheme: "generic",
    highlights: ["Engineering delivery", "Supply operations", "Execution"],
    sitemap: { changefreq: "weekly", priority: 0.85 },
  },
  {
    path: PUBLIC_ROUTE_PATHS.projects(),
    title: "Client Projects",
    description:
      "Explore DS General PLC client projects, delivery outcomes, and implementation stories across sectors.",
    section: "Client Projects",
    category: "Projects",
    pageTheme: "generic",
    highlights: ["Case studies", "Delivery outcomes", "Execution stories"],
    sitemap: { changefreq: "weekly", priority: 0.85 },
  },
  {
    path: PUBLIC_ROUTE_PATHS.privacyPolicy(),
    title: "Privacy Policy",
    description:
      "Review how DS General PLC collects, uses, and safeguards information shared through the website.",
    section: "Privacy Policy",
    category: "Privacy Policy",
    pageTheme: "legal",
    highlights: [
      "Responsible handling",
      "Clear disclosure",
      "Policy transparency",
    ],
    sitemap: { changefreq: "yearly", priority: 0.3 },
  },
  {
    path: PUBLIC_ROUTE_PATHS.termsOfService(),
    title: "Terms of Service",
    description:
      "Read the website terms governing access to DS General PLC content, service information, and inquiries.",
    section: "Terms of Service",
    category: "Terms of Service",
    pageTheme: "legal",
    highlights: ["Usage terms", "Service clarity", "Commercial context"],
    sitemap: { changefreq: "yearly", priority: 0.3 },
  },
];

export const NOINDEX_ROUTE_PREFIXES = [
  "/dashboard",
  "/login",
  "/register",
  "/forbidden",
  "/rate-limit",
];

export const PUBLIC_DYNAMIC_ROUTE_PREFIXES = [
  "/articles/",
  "/career/",
  "/services/",
  "/projects/",
  "/sectors/",
];

export function getStaticSeoRoute(path: string) {
  const normalizedPath = normalizeSeoPath(path);

  return PUBLIC_STATIC_SEO_ROUTES.find(
    (route) => route.path === normalizedPath,
  );
}

export function isNoindexRoute(path: string): boolean {
  const normalizedPath = normalizeSeoPath(path);

  return NOINDEX_ROUTE_PREFIXES.some(
    (prefix) =>
      normalizedPath === prefix ||
      normalizedPath.startsWith(`${prefix}/`) ||
      normalizedPath.startsWith(`${prefix}?`),
  );
}

export function isPublicRenderableRoute(path: string): boolean {
  const normalizedPath = normalizeSeoPath(path);

  if (getStaticSeoRoute(normalizedPath)) {
    return true;
  }

  return PUBLIC_DYNAMIC_ROUTE_PREFIXES.some((prefix) =>
    normalizedPath.startsWith(prefix),
  );
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildOrganizationJsonLd(input: OrganizationJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: input.name,
    url: input.url,
    logo: input.logo,
    description: input.description,
    sameAs: input.sameAs,
  };
}

export function buildWebSiteJsonLd(input: WebSiteJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: input.name,
    url: input.url,
  };
}

export function buildWebPageJsonLd(input: WebPageJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.title,
    description: input.description,
    url: input.url,
  };
}

export function buildArticleJsonLd(input: ArticleJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    url: input.url,
    image: input.image,
    author: input.authorName
      ? {
          "@type": "Person",
          name: input.authorName,
        }
      : undefined,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
  };
}

export function buildJobPostingJsonLd(input: JobPostingJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: input.title,
    description: input.description,
    datePosted: input.datePosted,
    employmentType: input.employmentType,
    hiringOrganization: {
      "@type": "Organization",
      ...input.hiringOrganization,
    },
    jobLocation: input.jobLocation
      ? {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: input.jobLocation.addressLocality,
            addressCountry: input.jobLocation.addressCountry,
          },
        }
      : undefined,
    url: input.url,
  };
}

export function buildServiceJsonLd(input: ServiceJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.title,
    description: input.description,
    url: input.url,
    image: input.image,
    provider: {
      "@type": "Organization",
      name: input.providerName,
    },
  };
}
