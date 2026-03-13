/** @jsxImportSource react */
import {
  DEFAULT_BRAND_SEO_CONFIG,
  type BrandSeoConfig,
} from "@suba-company-template/types";
import { ImageResponse } from "@vercel/og";
import type React from "react";

import {
  BlogTemplate,
  CareerTemplate,
  DefaultTemplate,
  HomeTemplate,
  PageTemplate,
  ProjectTemplate,
  ServiceTemplate,
} from "./templates";
import type { OgImageData, OgImageOptions } from "./types";
import { DEFAULT_OG_OPTIONS } from "./types";
import { logger } from "../../shared/logger";

const PLAYFAIR_FONT_URL =
  "https://cdn.jsdelivr.net/npm/@fontsource/playfair-display/files/playfair-display-latin-700-normal.woff";
const MANROPE_FONT_URL =
  "https://cdn.jsdelivr.net/npm/@fontsource/manrope/files/manrope-latin-500-normal.woff";

let playfairFontCache: ArrayBuffer | null = null;
let manropeFontCache: ArrayBuffer | null = null;

const decodeSignature = (bytes: Uint8Array): string =>
  String.fromCharCode(
    bytes[0] ?? 0,
    bytes[1] ?? 0,
    bytes[2] ?? 0,
    bytes[3] ?? 0,
  );

const getFontSignature = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer, 0, 4);
  const ascii = decodeSignature(bytes);

  if (ascii === "OTTO" || ascii === "wOFF" || ascii === "wOF2") {
    return ascii;
  }

  if (
    bytes[0] === 0x00 &&
    bytes[1] === 0x01 &&
    bytes[2] === 0x00 &&
    bytes[3] === 0x00
  ) {
    return "ttf";
  }

  if (ascii === "true") {
    return "ttf";
  }

  return "unknown";
};

const isSupportedFontSignature = (signature: string): boolean =>
  signature === "ttf" || signature === "OTTO" || signature === "wOFF";

async function fetchFont(
  label: string,
  url: string,
  cache: ArrayBuffer | null,
): Promise<ArrayBuffer | null> {
  if (cache) {
    return cache;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch font: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const signature = getFontSignature(buffer);

    if (!isSupportedFontSignature(signature)) {
      logger.warn("OG font skipped: unsupported format for @vercel/og", {
        label,
        signature,
        url,
      });
      return null;
    }

    return buffer;
  } catch (error) {
    logger.warn("OG font fetch failed; rendering with fallback fonts", {
      label,
      url,
      message: (error as Error).message,
    });
    return null;
  }
}

async function getFonts() {
  const [playfair, manrope] = await Promise.all([
    fetchFont("Playfair Display", PLAYFAIR_FONT_URL, playfairFontCache),
    fetchFont("Manrope", MANROPE_FONT_URL, manropeFontCache),
  ]);

  if (playfair && !playfairFontCache) {
    playfairFontCache = playfair;
  }
  if (manrope && !manropeFontCache) {
    manropeFontCache = manrope;
  }

  const fonts: Array<{
    name: string;
    data: ArrayBuffer;
    style: "normal";
    weight: 500 | 700;
  }> = [];
  if (playfairFontCache) {
    fonts.push({
      name: "Playfair Display",
      data: playfairFontCache,
      style: "normal",
      weight: 700,
    });
  }
  if (manropeFontCache) {
    fonts.push({
      name: "Manrope",
      data: manropeFontCache,
      style: "normal",
      weight: 500,
    });
  }

  return fonts;
}

function getTemplate(
  data: OgImageData,
  brand: BrandSeoConfig,
): React.ReactElement {
  switch (data.type) {
    case "blog":
      return <BlogTemplate data={data} brand={brand} />;
    case "service":
      return <ServiceTemplate data={data} brand={brand} />;
    case "project":
      return <ProjectTemplate data={data} brand={brand} />;
    case "career":
      return <CareerTemplate data={data} brand={brand} />;
    case "page":
      if (data.pageTheme === "home") {
        return <HomeTemplate data={data} brand={brand} />;
      }
      return <PageTemplate data={data} brand={brand} />;
    case "default":
    default:
      return <DefaultTemplate brand={brand} />;
  }
}

export async function generateOgImage(
  data: OgImageData,
  options: OgImageOptions = {},
): Promise<ImageResponse> {
  const { width, height, debug, brand } = { ...DEFAULT_OG_OPTIONS, ...options };
  const resolvedBrand = brand || DEFAULT_BRAND_SEO_CONFIG;
  const template = getTemplate(data, resolvedBrand);
  const fonts = await getFonts();

  return new ImageResponse(template, {
    width,
    height,
    debug,
    ...(fonts.length > 0 ? { fonts } : {}),
    headers: {
      "Cache-Control":
        "public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400",
    },
  });
}

export async function generateDefaultOgImage(
  options: OgImageOptions = {},
): Promise<ImageResponse> {
  return generateOgImage({ title: "", type: "default" }, options);
}

export type { OgImageData, OgImageOptions };
