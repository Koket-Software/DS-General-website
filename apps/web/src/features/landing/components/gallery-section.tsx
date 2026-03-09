import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { AppImage } from "@/components/common/AppImage";
import {
  type PreviewMediaItem,
  MediaPreviewDialog,
} from "@/components/common/MediaPreviewDialog";
import { Button } from "@/components/ui/button";
import {
  publicGalleryQueryOptions,
  usePublicGalleryCategoriesQuery,
  usePublicGalleryQuery,
} from "@/lib/gallery";
import { Route as GalleryRoute } from "@/routes/_landing/gallery";

const ALL_TAB = "all";
const VIDEO_ASSET_EXTENSION_PATTERN = /\.(mp4|webm|ogg|mov|m4v)(?:$|\?)/i;

const inferMediaType = (src: string): PreviewMediaItem["type"] =>
  VIDEO_ASSET_EXTENSION_PATTERN.test(src) ? "video" : "image";

export function GallerySection() {
  const navigate = useNavigate();
  const search = GalleryRoute.useSearch();
  const queryClient = useQueryClient();
  const [activePreview, setActivePreview] = useState<{
    title: string;
    description?: string;
    items: PreviewMediaItem[];
  } | null>(null);

  const page = search.page ?? 1;
  const limit = search.limit ?? 60;
  const categorySlug = search.categorySlug;

  const galleryQuery = usePublicGalleryQuery({
    page,
    limit,
    search: search.search,
    sortBy: search.sortBy,
    sortOrder: search.sortOrder,
    categorySlug,
  });

  const categoriesQuery = usePublicGalleryCategoriesQuery({
    page: 1,
    limit: 100,
    sortBy: "name",
    sortOrder: "asc",
  });

  const tabs = useMemo(() => {
    const categoryTabs = (categoriesQuery.data?.data ?? []).map((category) => ({
      label: category.name,
      slug: category.slug,
    }));

    return [{ label: "All Projects", slug: ALL_TAB }, ...categoryTabs];
  }, [categoriesQuery.data?.data]);

  useEffect(() => {
    const pagination = galleryQuery.data?.meta?.pagination;
    const totalPages = pagination?.totalPages ?? 1;
    if (!pagination || pagination.page >= totalPages) {
      return;
    }

    const nextPage = pagination.page + 1;
    void queryClient.prefetchQuery(
      publicGalleryQueryOptions({
        page: nextPage,
        limit,
        search: search.search,
        sortBy: search.sortBy,
        sortOrder: search.sortOrder,
        categorySlug,
      }),
    );
  }, [
    categorySlug,
    galleryQuery.data?.meta?.pagination,
    limit,
    queryClient,
    search.search,
    search.sortBy,
    search.sortOrder,
  ]);

  const onTabChange = (slug: string) => {
    navigate({
      to: "/gallery",
      search: {
        ...search,
        page: 1,
        categorySlug: slug === ALL_TAB ? undefined : slug,
      },
    });
  };

  if (galleryQuery.isError || categoriesQuery.isError) {
    return (
      <section className="landing-container landing-section text-center">
        <p className="text-muted-foreground text-sm">
          Failed to load gallery data. Please refresh and try again.
        </p>
      </section>
    );
  }

  const items = galleryQuery.data?.data ?? [];
  const isLoading = galleryQuery.isPending || categoriesQuery.isPending;

  const closePreview = () => setActivePreview(null);

  const openPreview = (
    item: (typeof items)[number],
    selectedAssetIndex = 0,
  ) => {
    const previewItems = item.imageUrls.map((src, index) => ({
      id: `${item.id}-${index}`,
      type: inferMediaType(src),
      src,
      alt: `${item.title} media ${index + 1}`,
      title: item.title,
      description: item.description ?? undefined,
      thumbnailSrc: src,
    }));

    if (previewItems.length === 0) {
      return;
    }

    const sortedItems = [...previewItems];
    const safeSelectedIndex = Math.min(
      Math.max(selectedAssetIndex, 0),
      sortedItems.length - 1,
    );
    const [selectedItem] = sortedItems.splice(safeSelectedIndex, 1);

    setActivePreview({
      title: item.title,
      description: item.description ?? undefined,
      items: selectedItem ? [selectedItem, ...sortedItems] : previewItems,
    });
  };

  return (
    <section className="landing-container">
      <div className="border-b border-primary/10">
        <div className="flex items-center overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive =
              tab.slug === ALL_TAB ? !categorySlug : categorySlug === tab.slug;

            return (
              <Button
                key={tab.slug}
                variant="ghost"
                type="button"
                onClick={() => onTabChange(tab.slug)}
                className={`
                  shrink-0
                  px-5 sm:px-6 lg:px-8
                  py-3.5 sm:py-4
                  font-sans
                  text-[15px] sm:text-[16px]
                  whitespace-nowrap
                  transition-colors
                  relative
                  ${
                    isActive
                      ? "font-semibold text-primary border-b-2 border-primary"
                      : "font-normal text-foreground hover:text-primary"
                  }
                `}
              >
                {tab.label}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="landing-section-compact">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="relative h-50 md:h-78.5 overflow-hidden bg-muted/60 animate-pulse"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-sm">
            No gallery items found for this filter.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openPreview(item)}
                className="group relative h-50 overflow-hidden bg-muted/60 text-left touch-manipulation focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:outline-none md:h-78.5"
                aria-label={`Open preview for ${item.title}`}
              >
                <AppImage
                  alt={item.title}
                  width={960}
                  height={720}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  src={item.coverImageUrl ?? item.imageUrls[0]}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 translate-y-4 px-3 pb-3 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-white/80">Tap to preview</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <MediaPreviewDialog
        open={!!activePreview}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            closePreview();
          }
        }}
        items={activePreview?.items ?? []}
        title={activePreview?.title ?? "Gallery Media"}
        description={activePreview?.description}
      />
    </section>
  );
}
