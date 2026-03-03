/**
 * OG Image Module Types
 */
import {
  DEFAULT_BRAND_SEO_CONFIG,
  type BrandSeoConfig,
} from "@suba-company-template/types";

export type OgImageType =
  | "blog"
  | "service"
  | "project"
  | "career"
  | "page"
  | "default";

export interface OgImageData {
  title: string;
  description?: string;
  imageUrl?: string | null;
  type: OgImageType;
  category?: string;
  author?: string;
  date?: string;
  readTime?: number;
  tags?: string[];
}

export interface OgImageOptions {
  width?: number;
  height?: number;
  debug?: boolean;
  brand?: BrandSeoConfig;
}

export const DEFAULT_OG_OPTIONS: Required<OgImageOptions> = {
  width: 1200,
  height: 630,
  debug: false,
  brand: DEFAULT_BRAND_SEO_CONFIG,
};
