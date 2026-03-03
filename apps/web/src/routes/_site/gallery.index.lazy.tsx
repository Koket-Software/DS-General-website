import { createLazyFileRoute } from "@tanstack/react-router";

import { GalleryPage } from "@/features/gallery";

export const Route = createLazyFileRoute("/_site/gallery/")({
  component: GalleryRoute,
});

function GalleryRoute() {
  return <GalleryPage />;
}
