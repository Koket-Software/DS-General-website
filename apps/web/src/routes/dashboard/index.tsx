import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
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
});
