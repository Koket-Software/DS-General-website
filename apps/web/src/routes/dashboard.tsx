import { createFileRoute, redirect } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";
import { buildNoIndexHead } from "@/lib/seo";

export const Route = createFileRoute("/dashboard")({
  head: () =>
    buildNoIndexHead({
      path: "/dashboard",
      title: "Dashboard | DS General PLC",
      description: "Protected operational workspace for DS General PLC.",
    }),
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      throw redirect({
        to: "/login",
      });
    }

    const role = (session.data.user.role as string) || "user";
    const allowed = role === "admin" || role === "blogger";
    if (!allowed) {
      throw redirect({
        to: "/forbidden",
      });
    }

    return { session, role };
  },
});
