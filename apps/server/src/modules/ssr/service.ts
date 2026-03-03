import type { PageMeta, SsrConfig } from "./types";

const toAbsoluteUrl = (value: string, siteUrl: string): string => {
  if (/^https?:\/\//i.test(value)) return value;
  const normalized = value.startsWith("/") ? value : `/${value}`;
  return `${siteUrl}${normalized}`;
};

export function generateHtmlShell(meta: PageMeta, config: SsrConfig): string {
  const fullOgImage = toAbsoluteUrl(meta.ogImage, config.siteUrl);
  const fullCanonicalUrl = toAbsoluteUrl(meta.canonicalUrl, config.siteUrl);
  const keywords = meta.keywords || config.keywords.join(", ");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>${escapeHtml(meta.title)}</title>
    <meta name="title" content="${escapeHtml(meta.title)}" />
    <meta name="description" content="${escapeHtml(meta.description)}" />
    ${keywords ? `<meta name="keywords" content="${escapeHtml(keywords)}" />` : ""}
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${escapeHtml(fullCanonicalUrl)}" />

    <meta name="application-name" content="${escapeHtml(config.siteName)}" />
    <meta name="theme-color" content="${escapeHtml(config.themeColor)}" />

    <meta property="og:type" content="${escapeHtml(meta.ogType)}" />
    <meta property="og:url" content="${escapeHtml(fullCanonicalUrl)}" />
    <meta property="og:title" content="${escapeHtml(meta.title)}" />
    <meta property="og:description" content="${escapeHtml(meta.description)}" />
    <meta property="og:site_name" content="${escapeHtml(config.siteName)}" />
    <meta property="og:locale" content="${escapeHtml(config.locale)}" />
    <meta property="og:image" content="${escapeHtml(fullOgImage)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(meta.title)}" />
    ${meta.publishedTime ? `<meta property="article:published_time" content="${escapeHtml(meta.publishedTime)}" />` : ""}
    ${meta.modifiedTime ? `<meta property="article:modified_time" content="${escapeHtml(meta.modifiedTime)}" />` : ""}
    ${meta.author ? `<meta property="article:author" content="${escapeHtml(meta.author)}" />` : ""}
    ${meta.section ? `<meta property="article:section" content="${escapeHtml(meta.section)}" />` : ""}
    ${meta.tags?.map((tag) => `<meta property="article:tag" content="${escapeHtml(tag)}" />`).join("\n    ") || ""}

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${escapeHtml(fullCanonicalUrl)}" />
    <meta name="twitter:title" content="${escapeHtml(meta.title)}" />
    <meta name="twitter:description" content="${escapeHtml(meta.description)}" />
    <meta name="twitter:image" content="${escapeHtml(fullOgImage)}" />
    <meta name="twitter:site" content="${escapeHtml(config.twitterHandle)}" />
    <meta name="twitter:creator" content="${escapeHtml(config.twitterHandle)}" />
    <meta name="twitter:image:alt" content="${escapeHtml(meta.title)}" />

    <link rel="icon" href="${escapeHtml(config.logoPath)}" />
    <link rel="apple-touch-icon" href="${escapeHtml(config.logoPath)}" />

    <script type="application/ld+json">
      ${generateStructuredData(meta, config)}
    </script>
  </head>
  <body>
    <div id="app">
      <noscript>
        <h1>${escapeHtml(meta.title)}</h1>
        <p>${escapeHtml(meta.description)}</p>
        <p>Please enable JavaScript to view this website.</p>
      </noscript>
    </div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
}

function generateStructuredData(meta: PageMeta, config: SsrConfig): string {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": meta.ogType === "article" ? "BlogPosting" : "WebPage",
    name: meta.title,
    description: meta.description,
    url: toAbsoluteUrl(meta.canonicalUrl, config.siteUrl),
    publisher: {
      "@type": "Organization",
      name: config.siteName,
      url: config.siteUrl,
      logo: toAbsoluteUrl(config.logoPath, config.siteUrl),
    },
  };

  if (meta.ogType === "article") {
    if (meta.publishedTime) data.datePublished = meta.publishedTime;
    if (meta.modifiedTime) data.dateModified = meta.modifiedTime;
    if (meta.author) {
      data.author = {
        "@type": "Person",
        name: meta.author,
      };
    }
  }

  return JSON.stringify(data, null, 2);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const toTitleCase = (value: string): string =>
  value
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const humanizePathSegment = (value: string): string => {
  const decoded = decodeURIComponent(value);
  return toTitleCase(decoded.replace(/[-_]+/g, " "));
};

export function createDefaultMeta(path: string, config: SsrConfig): PageMeta {
  return {
    title: config.defaultTitle,
    description: config.defaultDescription,
    ogImage: config.ogDefaultPath,
    ogType: "website",
    canonicalUrl: path,
  };
}

export function createBlogMeta(
  slug: string,
  canonicalPath: string,
  blog: {
    title: string;
    excerpt: string | null;
    author: string | null;
    publishDate: string | null;
    tags?: { name: string }[];
  },
  config: SsrConfig,
): PageMeta {
  return {
    title: `${blog.title} | ${config.siteName}`,
    description: blog.excerpt || config.defaultDescription,
    ogImage: `/api/og/blog/${slug}`,
    ogType: "article",
    canonicalUrl: canonicalPath,
    author: blog.author || undefined,
    publishedTime: blog.publishDate || undefined,
    section: "Blog",
    tags: blog.tags?.map((t) => t.name),
  };
}

export function createServiceMeta(
  slug: string,
  canonicalPath: string,
  service: {
    title: string;
    excerpt: string | null;
  },
  config: SsrConfig,
): PageMeta {
  return {
    title: `${service.title} | ${config.siteName}`,
    description: service.excerpt || config.defaultDescription,
    ogImage: `/api/og/service/${slug}`,
    ogType: "website",
    canonicalUrl: canonicalPath,
    section: "Services",
  };
}

export function createProjectMeta(
  slug: string,
  canonicalPath: string,
  project: {
    title: string;
    excerpt: string | null;
    tags?: { name: string }[];
  },
  config: SsrConfig,
): PageMeta {
  return {
    title: `${project.title} | ${config.siteName}`,
    description: project.excerpt || config.defaultDescription,
    ogImage: `/api/og/project/${slug}`,
    ogType: "article",
    canonicalUrl: canonicalPath,
    section: "Projects",
    tags: project.tags?.map((t) => t.name),
  };
}

export function createCareerMeta(
  slug: string,
  canonicalPath: string,
  career: {
    title: string;
    excerpt: string | null;
    department: string | null;
    location: string | null;
  },
  config: SsrConfig,
): PageMeta {
  const description =
    career.excerpt ||
    `${career.title}${career.department ? ` in ${career.department}` : ""}${career.location ? ` - ${career.location}` : ""} at ${config.siteName}`;

  return {
    title: `${career.title} | Careers at ${config.siteName}`,
    description,
    ogImage: `/api/og/career/${slug}`,
    ogType: "website",
    canonicalUrl: canonicalPath,
    section: "Careers",
  };
}

export function createSectorMeta(
  canonicalPath: string,
  sector: {
    title: string;
    excerpt: string | null;
    featuredImageUrl?: string | null;
  },
  config: SsrConfig,
): PageMeta {
  const pageTitle = `${sector.title} | ${config.siteName}`;
  const description = sector.excerpt || config.defaultDescription;
  const searchParams = new URLSearchParams({
    title: sector.title,
    description,
    category: "Business Sectors",
  });
  if (sector.featuredImageUrl) {
    searchParams.set("image", sector.featuredImageUrl);
  }

  return {
    title: pageTitle,
    description,
    ogImage: `/api/og/page?${searchParams.toString()}`,
    ogType: "website",
    canonicalUrl: canonicalPath,
    section: "Business Sectors",
  };
}

export function createStaticPageMeta(
  path: string,
  title: string,
  description: string,
  config: SsrConfig,
): PageMeta {
  return {
    title: `${title} | ${config.siteName}`,
    description,
    ogImage: `/api/og/page?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
    ogType: "website",
    canonicalUrl: path,
  };
}

export function createGenericPathMeta(
  path: string,
  config: SsrConfig,
): PageMeta {
  const normalized = path.split("?")[0] || "/";
  const withoutDemoPrefix = normalized.startsWith("/demo/")
    ? normalized.replace(/^\/demo/, "")
    : normalized;
  const segments = withoutDemoPrefix.split("/").filter(Boolean);

  if (segments.length === 0) {
    return createDefaultMeta(path, config);
  }

  const lastSegment = humanizePathSegment(segments[segments.length - 1]!);
  const title = `${lastSegment} | ${config.siteName}`;
  const description = `Explore ${lastSegment.toLowerCase()} at ${config.siteName}.`;

  return {
    title,
    description,
    ogImage: `/api/og/page?title=${encodeURIComponent(lastSegment)}&description=${encodeURIComponent(description)}`,
    ogType: "website",
    canonicalUrl: path,
    section:
      segments.length > 1 ? humanizePathSegment(segments[0]!) : undefined,
  };
}
