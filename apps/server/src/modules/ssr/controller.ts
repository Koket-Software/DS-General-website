import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import {
  buildRobotsContent,
  getStaticSeoRoute,
  isNoindexRoute,
  isPublicRenderableRoute,
  joinUrl,
  normalizeSeoPath,
} from "@suba-company-template/types";
import type { Context } from "hono";

import { getServerBrandSeoConfig } from "../../shared/branding/brand-seo-config";
import { logger } from "../../shared/logger";

type ClientAssetManifestEntry = {
  file: string;
  css?: string[];
  imports?: string[];
  isEntry?: boolean;
  src?: string;
};

type ClientAssetEntry = {
  entryScript: string;
  styles: string[];
  preloads: string[];
};

type WebRendererModule = {
  renderSsrPage: (input: {
    request: Request;
    assets: ClientAssetEntry;
  }) => Promise<Response>;
};

type CachedRenderer = {
  assets: ClientAssetEntry;
  renderer: WebRendererModule;
};

let cachedRendererPromise: Promise<CachedRenderer> | null = null;

export type SsrController = ReturnType<typeof createSsrController>;

const resolveWebBuildPath = (...segments: string[]) =>
  path.resolve(process.cwd(), "../web", ...segments);

async function loadClientAssets(): Promise<ClientAssetEntry> {
  const manifestPath = resolveWebBuildPath("dist/.vite/manifest.json");
  const rawManifest = await readFile(manifestPath, "utf8");
  const manifest = JSON.parse(rawManifest) as Record<
    string,
    ClientAssetManifestEntry
  >;

  const entry =
    manifest["index.html"] ||
    manifest["src/main.tsx"] ||
    Object.values(manifest).find((item) => item.isEntry);

  if (!entry) {
    throw new Error(`Unable to resolve Vite entry from ${manifestPath}`);
  }

  const styles = new Set<string>();
  const preloads = new Set<string>();

  const collectImports = (item?: ClientAssetManifestEntry) => {
    if (!item) return;

    item.css?.forEach((href) => styles.add(`/${href}`));

    item.imports?.forEach((importKey) => {
      const imported = manifest[importKey];
      if (!imported) return;
      preloads.add(`/${imported.file}`);
      collectImports(imported);
    });
  };

  collectImports(entry);

  return {
    entryScript: `/${entry.file}`,
    styles: [...styles],
    preloads: [...preloads],
  };
}

async function loadRenderer(): Promise<CachedRenderer> {
  if (cachedRendererPromise) {
    return cachedRendererPromise;
  }

  cachedRendererPromise = (async () => {
    const assets = await loadClientAssets();
    const rendererPath = resolveWebBuildPath("dist-ssr/server.js");
    const renderer = (await import(
      pathToFileURL(rendererPath).href
    )) as WebRendererModule;

    if (typeof renderer.renderSsrPage !== "function") {
      throw new Error(`renderSsrPage export missing from ${rendererPath}`);
    }

    return {
      assets,
      renderer,
    };
  })();

  return cachedRendererPromise;
}

function inferTitle(pathname: string, siteName: string) {
  const staticRoute = getStaticSeoRoute(pathname);
  if (staticRoute) {
    return staticRoute.title;
  }

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return `Dashboard | ${siteName}`;
  }

  if (pathname === "/login") {
    return `Admin Sign In | ${siteName}`;
  }

  if (pathname === "/register") {
    return `Admin Registration | ${siteName}`;
  }

  if (pathname === "/forbidden") {
    return `Forbidden | ${siteName}`;
  }

  if (pathname === "/rate-limit") {
    return `Rate Limit | ${siteName}`;
  }

  return `${siteName} | Application`;
}

function buildNoIndexShellHtml(input: {
  assets: ClientAssetEntry;
  path: string;
  title: string;
  description: string;
  siteName: string;
  siteUrl: string;
  themeColor: string;
}) {
  const canonicalUrl = joinUrl(input.siteUrl, input.path);
  const robots = buildRobotsContent({ index: false, follow: false });

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(input.title)}</title>
    <meta name="description" content="${escapeHtml(input.description)}" />
    <meta name="robots" content="${robots}" />
    <meta name="theme-color" content="${escapeHtml(input.themeColor)}" />
    <meta name="application-name" content="${escapeHtml(input.siteName)}" />
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
    <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="manifest" href="/site/site.webmanifest" />
    ${input.assets.styles
      .map((href) => `<link rel="stylesheet" href="${escapeHtml(href)}" />`)
      .join("\n    ")}
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="${escapeHtml(input.assets.entryScript)}"></script>
  </body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildPublicRequest(c: Context, publicPath: string) {
  const protocol =
    c.req.header("x-forwarded-proto") ??
    new URL(c.req.url).protocol.replace(":", "");
  const host = c.req.header("x-forwarded-host") ?? c.req.header("host");

  if (!host) {
    throw new Error("Unable to determine request host for SSR");
  }

  const url = `${protocol}://${host}${publicPath}`;

  return new Request(url, {
    method: "GET",
    headers: c.req.raw.headers,
  });
}

export const createSsrController = () => {
  const brand = getServerBrandSeoConfig();

  async function servePrerenderedHtml(c: Context): Promise<Response> {
    const requestedPath = c.req.path.replace(/^\/_ssr/, "") || "/";
    const normalizedPath = normalizeSeoPath(requestedPath);

    try {
      const { assets, renderer } = await loadRenderer();

      if (isNoindexRoute(normalizedPath)) {
        const html = buildNoIndexShellHtml({
          assets,
          path: normalizedPath,
          title: inferTitle(normalizedPath, brand.siteName),
          description: "Protected operational page for DS General PLC.",
          siteName: brand.siteName,
          siteUrl: brand.siteUrl,
          themeColor: brand.themeColor,
        });

        return c.html(html, 200, {
          "Cache-Control": "private, no-store",
          "X-Robots-Tag": "noindex, nofollow",
        });
      }

      if (!isPublicRenderableRoute(normalizedPath)) {
        const html = buildNoIndexShellHtml({
          assets,
          path: normalizedPath,
          title: inferTitle(normalizedPath, brand.siteName),
          description: brand.defaultDescription,
          siteName: brand.siteName,
          siteUrl: brand.siteUrl,
          themeColor: brand.themeColor,
        });

        return c.html(html, 404, {
          "Cache-Control": "public, max-age=60",
          "X-Robots-Tag": "noindex, nofollow",
        });
      }

      const request = buildPublicRequest(c, normalizedPath);
      const response = await renderer.renderSsrPage({
        request,
        assets,
      });

      const headers = new Headers(response.headers);
      headers.set(
        "Cache-Control",
        "public, max-age=300, s-maxage=600, stale-while-revalidate=86400",
      );

      return new Response(response.body, {
        status: response.status,
        headers,
      });
    } catch (error) {
      logger.error("SSR render error", error as Error, {
        path: normalizedPath,
      });

      return c.text("SSR renderer unavailable", 503);
    }
  }

  return {
    servePrerenderedHtml,
  };
};
