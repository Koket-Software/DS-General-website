import {
  buildBrandSeoConfig,
  type BrandSeoConfig,
} from "@suba-company-template/types";

const getEnvValue = (...keys: string[]): string => {
  for (const key of keys) {
    const value = process.env[key];
    if (value) return value;
  }
  return "";
};

const parseKeywords = (value?: string): string[] | undefined => {
  if (!value) return undefined;
  const keywords = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return keywords.length > 0 ? keywords : undefined;
};

let cachedConfig: BrandSeoConfig | null = null;

export const getServerBrandSeoConfig = (): BrandSeoConfig => {
  if (cachedConfig) return cachedConfig;

  cachedConfig = buildBrandSeoConfig({
    siteName: getEnvValue("SITE_NAME", "VITE_SITE_NAME"),
    siteUrl: getEnvValue("SITE_URL", "VITE_SITE_URL", "VITE_FRONTEND_URL"),
    defaultTitle: getEnvValue("SITE_TITLE", "VITE_SITE_TITLE"),
    defaultDescription: getEnvValue(
      "SITE_DESCRIPTION",
      "VITE_SITE_DESCRIPTION",
    ),
    locale: getEnvValue("SITE_LOCALE", "VITE_SITE_LOCALE"),
    twitterHandle: getEnvValue("TWITTER_HANDLE", "VITE_TWITTER_HANDLE"),
    themeColor: getEnvValue("THEME_COLOR", "VITE_THEME_COLOR"),
    ogDefaultPath: getEnvValue("OG_DEFAULT_PATH", "VITE_OG_DEFAULT_PATH"),
    brandPrimary: getEnvValue("BRAND_PRIMARY", "VITE_BRAND_PRIMARY"),
    brandSecondary: getEnvValue("BRAND_SECONDARY", "VITE_BRAND_SECONDARY"),
    brandAccent: getEnvValue("BRAND_ACCENT", "VITE_BRAND_ACCENT"),
    logoPath: getEnvValue("SITE_LOGO_PATH", "VITE_SITE_LOGO_PATH"),
    keywords: parseKeywords(getEnvValue("SITE_KEYWORDS", "VITE_SITE_KEYWORDS")),
  });

  return cachedConfig;
};
