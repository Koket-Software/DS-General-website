import {
  PUBLIC_ROUTE_PATHS,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildJobPostingJsonLd,
  buildOrganizationJsonLd,
  buildRobotsContent,
  buildServiceJsonLd,
  buildWebPageJsonLd,
  buildWebSiteJsonLd,
  getStaticSeoRoute,
  joinUrl,
} from "@suba-company-template/types";

import homeHeroImage from "@/assets/ds/home/DS_Hero.webp";
import {
  buildSeoMeta,
  getCareerOgImageUrl,
  getDefaultOgImageUrl,
  getPageOgImageUrl,
  getServiceOgImageUrl,
  SITE_METADATA,
} from "@/lib/og-utils";

type HeadResult = {
  meta: Array<Record<string, unknown>>;
  links: Array<Record<string, unknown>>;
  scripts?: Array<Record<string, unknown>>;
};

interface CommonHeadInput {
  path: string;
  title: string;
  description: string;
  ogImage?: string;
  type?: "website" | "article";
  robots?: string;
  jsonLd?: unknown[];
  preloadImage?: string;
}

const COMPANY_SAME_AS = [
  "https://www.linkedin.com/company/dsgeneralplc/",
  "https://x.com/dsgeneralplc",
];

function normalizeJsonLdArray(jsonLd?: unknown[]) {
  return (jsonLd ?? []).filter(Boolean);
}

export function buildHead({
  path,
  title,
  description,
  ogImage,
  type = "website",
  robots = buildRobotsContent(),
  jsonLd,
  preloadImage,
}: CommonHeadInput): HeadResult {
  const seo = buildSeoMeta({
    path,
    title,
    description,
    ogImage,
    type,
  });

  return {
    meta: [
      ...(seo.meta as Array<Record<string, unknown>>),
      { name: "robots", content: robots },
    ],
    links: [
      ...(seo.links as Array<Record<string, unknown>>),
      ...(preloadImage
        ? [
            {
              rel: "preload",
              as: "image",
              href: preloadImage,
              fetchPriority: "high",
            },
          ]
        : []),
    ],
    scripts: normalizeJsonLdArray(jsonLd).map((item) => ({
      type: "application/ld+json",
      children: JSON.stringify(item),
    })),
  };
}

export function buildNoIndexHead(input: {
  path: string;
  title: string;
  description?: string;
}): HeadResult {
  return buildHead({
    path: input.path,
    title: input.title,
    description:
      input.description ??
      `Restricted operational page on ${SITE_METADATA.siteName}.`,
    robots: buildRobotsContent({ index: false, follow: false }),
  });
}

export function buildStaticPageHead(path: string) {
  const route = getStaticSeoRoute(path);

  if (!route) {
    return buildHead({
      path,
      title: SITE_METADATA.defaultTitle,
      description: SITE_METADATA.defaultDescription,
    });
  }

  const canonicalUrl = joinUrl(SITE_METADATA.siteUrl, route.path);
  const baseJsonLd: unknown[] = [
    buildWebPageJsonLd({
      title: route.title,
      description: route.description,
      url: canonicalUrl,
    }),
    buildBreadcrumbJsonLd([
      {
        name: "Home",
        url: joinUrl(SITE_METADATA.siteUrl, PUBLIC_ROUTE_PATHS.home()),
      },
      {
        name: route.section,
        url: canonicalUrl,
      },
    ]),
  ];

  if (route.path === PUBLIC_ROUTE_PATHS.home()) {
    baseJsonLd.unshift(
      buildOrganizationJsonLd({
        name: SITE_METADATA.siteName,
        url: joinUrl(SITE_METADATA.siteUrl, PUBLIC_ROUTE_PATHS.home()),
        logo: joinUrl(
          SITE_METADATA.siteUrl,
          "/site/android-chrome-512x512.png",
        ),
        description: SITE_METADATA.defaultDescription,
        sameAs: COMPANY_SAME_AS,
      }),
      buildWebSiteJsonLd({
        name: SITE_METADATA.siteName,
        url: joinUrl(SITE_METADATA.siteUrl, PUBLIC_ROUTE_PATHS.home()),
      }),
    );
  }

  return buildHead({
    path: route.path,
    title: route.title,
    description: route.description,
    ogImage:
      route.path === PUBLIC_ROUTE_PATHS.home()
        ? getDefaultOgImageUrl()
        : getPageOgImageUrl({
            title: route.title,
            description: route.description,
            category: route.category,
            theme: route.pageTheme,
            highlights: route.highlights,
          }),
    jsonLd: baseJsonLd,
    preloadImage:
      route.path === PUBLIC_ROUTE_PATHS.home() ? homeHeroImage : undefined,
  });
}

export function buildArticleDetailHead(input: {
  slug: string;
  title: string;
  excerpt?: string | null;
  featuredImageUrl?: string | null;
  authorName?: string | null;
  publishDate?: string | null;
  updatedAt?: string | null;
}) {
  const path = PUBLIC_ROUTE_PATHS.article(input.slug);
  const canonicalUrl = joinUrl(SITE_METADATA.siteUrl, path);
  const description = input.excerpt || SITE_METADATA.defaultDescription;

  return buildHead({
    path,
    title: `${input.title} | ${SITE_METADATA.siteName}`,
    description,
    ogImage: input.featuredImageUrl || undefined,
    type: "article",
    jsonLd: [
      buildArticleJsonLd({
        title: input.title,
        description,
        url: canonicalUrl,
        image: input.featuredImageUrl || undefined,
        authorName: input.authorName || undefined,
        datePublished: input.publishDate || undefined,
        dateModified: input.updatedAt || input.publishDate || undefined,
      }),
      buildBreadcrumbJsonLd([
        {
          name: "Home",
          url: joinUrl(SITE_METADATA.siteUrl, PUBLIC_ROUTE_PATHS.home()),
        },
        {
          name: "Articles",
          url: joinUrl(SITE_METADATA.siteUrl, PUBLIC_ROUTE_PATHS.articles()),
        },
        {
          name: input.title,
          url: canonicalUrl,
        },
      ]),
    ],
    preloadImage: input.featuredImageUrl || undefined,
  });
}

export function buildCareerDetailHead(input: {
  slug: string;
  title: string;
  excerpt?: string | null;
  featuredImageUrl?: string | null;
  department?: string | null;
  location?: string | null;
  publishedAt?: string | null;
  employmentType?: string | null;
}) {
  const path = PUBLIC_ROUTE_PATHS.careerDetail(input.slug);
  const canonicalUrl = joinUrl(SITE_METADATA.siteUrl, path);
  const description =
    input.excerpt ||
    `${input.title}${input.department ? ` in ${input.department}` : ""}${input.location ? ` - ${input.location}` : ""} at ${SITE_METADATA.siteName}`;

  return buildHead({
    path,
    title: `${input.title} | Careers at ${SITE_METADATA.siteName}`,
    description,
    ogImage: input.featuredImageUrl || getCareerOgImageUrl(input.slug),
    jsonLd: [
      buildJobPostingJsonLd({
        title: input.title,
        description,
        url: canonicalUrl,
        datePosted: input.publishedAt || undefined,
        employmentType: input.employmentType || undefined,
        hiringOrganization: {
          name: SITE_METADATA.siteName,
          sameAs: joinUrl(SITE_METADATA.siteUrl, PUBLIC_ROUTE_PATHS.home()),
          logo: joinUrl(
            SITE_METADATA.siteUrl,
            "/site/android-chrome-512x512.png",
          ),
        },
        jobLocation: input.location
          ? {
              addressLocality: input.location,
              addressCountry: "ET",
            }
          : undefined,
      }),
      buildBreadcrumbJsonLd([
        {
          name: "Home",
          url: joinUrl(SITE_METADATA.siteUrl, PUBLIC_ROUTE_PATHS.home()),
        },
        {
          name: "Careers",
          url: joinUrl(SITE_METADATA.siteUrl, PUBLIC_ROUTE_PATHS.career()),
        },
        {
          name: input.title,
          url: canonicalUrl,
        },
      ]),
    ],
    preloadImage: input.featuredImageUrl || undefined,
  });
}

export function buildServiceDetailHead(input: {
  slug: string;
  title: string;
  excerpt?: string | null;
  featuredImageUrl?: string | null;
}) {
  const path = PUBLIC_ROUTE_PATHS.service(input.slug);
  const canonicalUrl = joinUrl(SITE_METADATA.siteUrl, path);
  const description = input.excerpt || SITE_METADATA.defaultDescription;

  return buildHead({
    path,
    title: `${input.title} | ${SITE_METADATA.siteName} Services`,
    description,
    ogImage: input.featuredImageUrl || getServiceOgImageUrl(input.slug),
    jsonLd: [
      buildServiceJsonLd({
        title: input.title,
        description,
        url: canonicalUrl,
        image: input.featuredImageUrl || undefined,
        providerName: SITE_METADATA.siteName,
      }),
      buildBreadcrumbJsonLd([
        {
          name: "Home",
          url: joinUrl(SITE_METADATA.siteUrl, PUBLIC_ROUTE_PATHS.home()),
        },
        {
          name: "Services",
          url: joinUrl(SITE_METADATA.siteUrl, PUBLIC_ROUTE_PATHS.services()),
        },
        {
          name: input.title,
          url: canonicalUrl,
        },
      ]),
    ],
    preloadImage: input.featuredImageUrl || undefined,
  });
}

export function buildSectorDetailHead(input: {
  slug: string;
  title: string;
  description?: string | null;
  featuredImageUrl?: string | null;
}) {
  const path = PUBLIC_ROUTE_PATHS.sector(input.slug);
  const canonicalUrl = joinUrl(SITE_METADATA.siteUrl, path);
  const description = input.description || SITE_METADATA.defaultDescription;

  return buildHead({
    path,
    title: `${input.title} Sector | ${SITE_METADATA.siteName}`,
    description,
    ogImage:
      input.featuredImageUrl ||
      getPageOgImageUrl({
        title: input.title,
        description,
        category: "Sector",
        theme: "sector",
        highlights: ["Industry focus", "Execution", "Delivery"],
      }),
    jsonLd: [
      buildWebPageJsonLd({
        title: input.title,
        description,
        url: canonicalUrl,
      }),
      buildBreadcrumbJsonLd([
        {
          name: "Home",
          url: joinUrl(SITE_METADATA.siteUrl, PUBLIC_ROUTE_PATHS.home()),
        },
        {
          name: input.title,
          url: canonicalUrl,
        },
      ]),
    ],
    preloadImage: input.featuredImageUrl || undefined,
  });
}
