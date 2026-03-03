import { createFileRoute } from "@tanstack/react-router";

import { SITE } from "@/config/template";
import { buildSeoMeta, getDefaultOgImageUrl } from "@/lib/og-utils";

export const Route = createFileRoute("/")({
  head: () =>
    buildSeoMeta({
      path: "/",
      title: `${SITE.name} - Open Source Company Website Template`,
      description:
        "A production-ready, full-stack company website template with React, Hono, and PostgreSQL. Includes CMS dashboard, blog, careers, projects, and more.",
      ogImage: getDefaultOgImageUrl(),
      type: "website",
    }),
});
