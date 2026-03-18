import type { BrandSeoConfig } from "@suba-company-template/types";

export interface PageMeta {
  title: string;
  description: string;
  ogImage: string;
  ogType: "website" | "article";
  canonicalUrl: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  schemaType?: "WebPage" | "BlogPosting";
  keywords?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export type SsrConfig = Pick<
  BrandSeoConfig,
  | "siteName"
  | "siteUrl"
  | "defaultTitle"
  | "defaultDescription"
  | "twitterHandle"
  | "locale"
  | "themeColor"
  | "ogDefaultPath"
  | "logoPath"
  | "keywords"
>;
