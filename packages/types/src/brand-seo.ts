export interface BrandSeoConfig {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  locale: string;
  twitterHandle: string;
  themeColor: string;
  ogDefaultPath: string;
  brandPrimary: string;
  brandSecondary: string;
  brandAccent: string;
  logoPath: string;
  keywords: string[];
}

export const DEFAULT_BRAND_LOGO_PATH = "/favicon.ico";
export const DEFAULT_BRAND_OG_IMAGE_PATH = "/og_image_ds.webp";

export const DEFAULT_BRAND_SEO_CONFIG: BrandSeoConfig = {
  siteName: "Your Company",
  siteUrl: "http://localhost:5173",
  defaultTitle: "Your Company | Software Engineering & Digital Innovation",
  defaultDescription:
    "We craft intelligent software platforms, resilient digital products, and innovation ecosystems for forward-looking teams.",
  locale: "en_US",
  twitterHandle: "@yourcompany",
  themeColor: "#0600ab",
  ogDefaultPath: DEFAULT_BRAND_OG_IMAGE_PATH,
  brandPrimary: "#0600ab",
  brandSecondary: "#0f172a",
  brandAccent: "#2dd4bf",
  logoPath: DEFAULT_BRAND_LOGO_PATH,
  keywords: [
    "software engineering",
    "digital innovation",
    "product development",
    "cloud platforms",
    "automation",
  ],
};

const ensureLeadingSlash = (value: string): string => {
  if (!value) return "/";
  return value.startsWith("/") ? value : `/${value}`;
};

const normalizeSiteUrl = (value: string): string => {
  const trimmed = value.trim();
  return trimmed.replace(/\/+$/, "");
};

const normalizeTwitterHandle = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) {
    return DEFAULT_BRAND_SEO_CONFIG.twitterHandle;
  }
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
};

export const buildBrandSeoConfig = (
  overrides: Partial<BrandSeoConfig> = {},
): BrandSeoConfig => {
  const sanitizedOverrides = Object.fromEntries(
    Object.entries(overrides).filter(([, value]) => value !== undefined),
  ) as Partial<BrandSeoConfig>;

  const merged: BrandSeoConfig = {
    ...DEFAULT_BRAND_SEO_CONFIG,
    ...sanitizedOverrides,
  };

  return {
    ...merged,
    siteUrl: normalizeSiteUrl(merged.siteUrl),
    ogDefaultPath: ensureLeadingSlash(merged.ogDefaultPath),
    logoPath: ensureLeadingSlash(merged.logoPath),
    twitterHandle: normalizeTwitterHandle(merged.twitterHandle),
    keywords: merged.keywords.filter(Boolean),
  };
};
