import { BRAND_SEO_CONFIG } from "./brand-seo-config";

const normalizeBaseUrl = (value: string): string => value.replace(/\/+$/, "");

const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_URL || "");
const OG_BASE_URL = API_BASE_URL || BRAND_SEO_CONFIG.siteUrl;

export const OG_ENDPOINTS = {
  BLOG: "/api/og/blog",
  SERVICE: "/api/og/service",
  PROJECT: "/api/og/project",
  CAREER: "/api/og/career",
  PAGE: "/api/og/page",
  DEFAULT: BRAND_SEO_CONFIG.ogDefaultPath,
} as const;

export type OgImageType = "blog" | "service" | "project" | "career" | "page";
export type OgPageTheme =
  | "home"
  | "about"
  | "articles"
  | "gallery"
  | "contact"
  | "career"
  | "legal"
  | "sector"
  | "generic";

export interface PageOgImageParams {
  title: string;
  description?: string;
  category?: string;
  image?: string;
  theme?: OgPageTheme;
  highlights?: string[];
}

type SeoOgType = "website" | "article";

export interface SeoMetaInput {
  path: string;
  title?: string;
  description?: string;
  ogImage?: string;
  type?: SeoOgType;
}

const toAbsoluteUrl = (value: string, base: string): string => {
  if (/^https?:\/\//i.test(value)) return value;
  const normalizedPath = value.startsWith("/") ? value : `/${value}`;
  return `${base}${normalizedPath}`;
};

const normalizePath = (path: string): string => {
  if (!path) return "/";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return path.startsWith("/") ? path : `/${path}`;
};

export function getBlogOgImageUrl(slug: string): string {
  return `${OG_BASE_URL}${OG_ENDPOINTS.BLOG}/${encodeURIComponent(slug)}`;
}

export function getServiceOgImageUrl(slug: string): string {
  return `${OG_BASE_URL}${OG_ENDPOINTS.SERVICE}/${encodeURIComponent(slug)}`;
}

export function getProjectOgImageUrl(slug: string): string {
  return `${OG_BASE_URL}${OG_ENDPOINTS.PROJECT}/${encodeURIComponent(slug)}`;
}

export function getCareerOgImageUrl(slug: string): string {
  return `${OG_BASE_URL}${OG_ENDPOINTS.CAREER}/${encodeURIComponent(slug)}`;
}

export function getPageOgImageUrl(params: PageOgImageParams): string {
  const searchParams = new URLSearchParams({
    title: params.title,
  });

  if (params.description) searchParams.set("description", params.description);
  if (params.category) searchParams.set("category", params.category);
  if (params.image) searchParams.set("image", params.image);
  if (params.theme) searchParams.set("theme", params.theme);
  params.highlights
    ?.filter(Boolean)
    .slice(0, 4)
    .forEach((highlight) => {
      searchParams.append("highlight", highlight);
    });

  return `${OG_BASE_URL}${OG_ENDPOINTS.PAGE}?${searchParams.toString()}`;
}

export function getDefaultOgImageUrl(): string {
  return `${OG_BASE_URL}${OG_ENDPOINTS.DEFAULT}`;
}

export function getOgImageUrl(
  type: OgImageType,
  slugOrParams: string | PageOgImageParams,
): string {
  switch (type) {
    case "blog":
      return getBlogOgImageUrl(slugOrParams as string);
    case "service":
      return getServiceOgImageUrl(slugOrParams as string);
    case "project":
      return getProjectOgImageUrl(slugOrParams as string);
    case "career":
      return getCareerOgImageUrl(slugOrParams as string);
    case "page":
      return getPageOgImageUrl(slugOrParams as PageOgImageParams);
    default:
      return getDefaultOgImageUrl();
  }
}

export const SITE_METADATA = {
  siteName: BRAND_SEO_CONFIG.siteName,
  siteUrl: BRAND_SEO_CONFIG.siteUrl,
  defaultTitle: BRAND_SEO_CONFIG.defaultTitle,
  defaultDescription: BRAND_SEO_CONFIG.defaultDescription,
  twitterHandle: BRAND_SEO_CONFIG.twitterHandle,
  locale: BRAND_SEO_CONFIG.locale,
  themeColor: BRAND_SEO_CONFIG.themeColor,
  keywords: BRAND_SEO_CONFIG.keywords,
} as const;

export interface OgMetaTags {
  title: string;
  description: string;
  ogImage: string;
  ogType?: SeoOgType;
  ogUrl?: string;
  twitterCard?: "summary" | "summary_large_image";
}

export function generateOgMeta(
  options: Partial<OgMetaTags> & { ogImage?: string },
): OgMetaTags {
  return {
    title: options.title || SITE_METADATA.defaultTitle,
    description: options.description || SITE_METADATA.defaultDescription,
    ogImage: options.ogImage || getDefaultOgImageUrl(),
    ogType: options.ogType || "website",
    ogUrl: options.ogUrl,
    twitterCard: options.twitterCard || "summary_large_image",
  };
}

export function buildSeoMeta(input: SeoMetaInput) {
  const title = input.title || SITE_METADATA.defaultTitle;
  const description = input.description || SITE_METADATA.defaultDescription;
  const canonicalPath = normalizePath(input.path);
  const canonicalUrl = toAbsoluteUrl(canonicalPath, SITE_METADATA.siteUrl);
  const ogImage = input.ogImage || getDefaultOgImageUrl();
  const ogType = input.type || "website";

  return {
    title,
    description,
    canonicalUrl,
    ogImage,
    meta: [
      { title },
      { name: "description", content: description },
      { name: "keywords", content: SITE_METADATA.keywords.join(", ") },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: ogImage },
      { property: "og:type", content: ogType },
      { property: "og:site_name", content: SITE_METADATA.siteName },
      { property: "og:url", content: canonicalUrl },
      { property: "og:locale", content: SITE_METADATA.locale },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
      { name: "twitter:site", content: SITE_METADATA.twitterHandle },
      { name: "twitter:creator", content: SITE_METADATA.twitterHandle },
    ],
    links: [{ rel: "canonical", href: canonicalUrl }],
  };
}
