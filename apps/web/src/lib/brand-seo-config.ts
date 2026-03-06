import {
  buildBrandSeoConfig,
  type BrandSeoConfig,
} from "@suba-company-template/types";

import { SITE } from "@/config/template";

const DEFAULT_DYNAMIC_HOME_OG_PATH =
  "/api/og/page?title=Integrated%20Construction%20%26%20Global%20Supply%20Chain%20Solutions&description=DS%20General%20PLC%20delivers%20integrated%20construction%2C%20sourcing%2C%20and%20operational%20support%20for%20high-impact%20business%20sectors%20in%20Ethiopia.&category=DS%20General%20PLC&theme=home&highlight=General%20Contracting&highlight=Material%20Supply&highlight=Global%20Sourcing";

const parseKeywords = (value?: string): string[] | undefined => {
  if (!value) return undefined;
  const keywords = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return keywords.length > 0 ? keywords : undefined;
};

const getEnvValue = (primaryKey: string, legacyKey?: string): string => {
  const primary = import.meta.env[primaryKey];
  if (primary) return primary;
  if (legacyKey) {
    const legacy = import.meta.env[legacyKey];
    if (legacy) return legacy;
  }
  return "";
};

export const BRAND_SEO_CONFIG: BrandSeoConfig = buildBrandSeoConfig({
  siteName: getEnvValue("VITE_SITE_NAME") || SITE.name,
  siteUrl: getEnvValue("VITE_SITE_URL") || SITE.url,
  defaultTitle: getEnvValue("VITE_SITE_TITLE") || SITE.defaultTitle,
  defaultDescription:
    getEnvValue("VITE_SITE_DESCRIPTION") || SITE.defaultDescription,
  locale: getEnvValue("VITE_SITE_LOCALE") || SITE.locale,
  twitterHandle: getEnvValue("VITE_TWITTER_HANDLE") || SITE.twitterHandle,
  themeColor: getEnvValue("VITE_THEME_COLOR") || SITE.themeColor,
  ogDefaultPath:
    getEnvValue("VITE_OG_DEFAULT_PATH") || DEFAULT_DYNAMIC_HOME_OG_PATH,
  brandPrimary:
    getEnvValue("VITE_BRAND_PRIMARY") ||
    getEnvValue("VITE_THEME_COLOR") ||
    "#4962E1",
  brandSecondary: getEnvValue("VITE_BRAND_SECONDARY") || "#1D1D1D",
  brandAccent: getEnvValue("VITE_BRAND_ACCENT") || "#F6F7FD",
  logoPath: getEnvValue("VITE_SITE_LOGO_PATH") || "/favicon.ico",
  keywords: parseKeywords(getEnvValue("VITE_SITE_KEYWORDS")) || [
    ...SITE.keywords,
  ],
});
