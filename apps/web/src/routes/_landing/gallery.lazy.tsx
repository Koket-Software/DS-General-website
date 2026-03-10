import { createLazyFileRoute } from "@tanstack/react-router";

import { GalleryPage } from "@/features/landing/pages/GalleryPage";

export const Route = createLazyFileRoute("/_landing/gallery")({
  component: GalleryPage,
});
