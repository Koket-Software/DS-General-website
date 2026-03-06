import { createLazyFileRoute, redirect } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/dashboard/")({
  beforeLoad: () => {
    throw redirect({
      to: "/dashboard/blogs",
      search: {
        page: 1,
        limit: 10,
        sortBy: "publishDate",
        sortOrder: "desc",
      },
    });
  },
  component: () => null,
});
