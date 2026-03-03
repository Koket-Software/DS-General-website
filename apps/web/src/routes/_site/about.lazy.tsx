import { createLazyFileRoute } from "@tanstack/react-router";

import { About } from "@/features/about";

export const Route = createLazyFileRoute("/_site/about")({
  component: AboutPage,
});

function AboutPage() {
  return <About />;
}
