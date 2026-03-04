import { createFileRoute } from "@tanstack/react-router";

import { GalleryPage } from "@/features/landing/pages/GalleryPage";

export const Route = createFileRoute("/_landing/gallery")({
  component: GalleryPage,
});
