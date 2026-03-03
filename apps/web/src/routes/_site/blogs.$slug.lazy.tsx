import { createLazyFileRoute, getRouteApi } from "@tanstack/react-router";

import { BlogDetailPage } from "@/features/blog";

const routeApi = getRouteApi("/_site/blogs/$slug");

export const Route = createLazyFileRoute("/_site/blogs/$slug")({
  component: BlogDetailRoute,
});

function BlogDetailRoute() {
  const { blog } = routeApi.useLoaderData();
  return <BlogDetailPage blog={blog} />;
}
