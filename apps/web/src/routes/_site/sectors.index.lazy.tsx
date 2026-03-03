import { createLazyFileRoute } from "@tanstack/react-router";

import { SectorsPage } from "@/features/sectors";

export const Route = createLazyFileRoute("/_site/sectors/")({
  component: SectorsRoute,
});

function SectorsRoute() {
  return <SectorsPage />;
}
