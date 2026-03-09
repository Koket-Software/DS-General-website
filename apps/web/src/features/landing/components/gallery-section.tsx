import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  publicGalleryQueryOptions,
  usePublicGalleryCategoriesQuery,
  usePublicGalleryQuery,
} from "@/lib/gallery";
import { Route as GalleryRoute } from "@/routes/_landing/gallery";

const ALL_TAB = "all";

export function GallerySection() {
  const navigate = useNavigate();
  const search = GalleryRoute.useSearch();
  const queryClient = useQueryClient();

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
            {items.map((image) => (
              <div
                key={image.id}
                className="relative h-50 md:h-78.5 overflow-hidden bg-muted/60 group"
              >
                <img
                  alt={image.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  src={image.coverImageUrl ?? image.imageUrls[0]}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
