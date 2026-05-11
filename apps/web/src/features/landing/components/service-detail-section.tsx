import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

import { AppImage } from "@/components/common/AppImage";
import {
  MediaPreviewDialog,
  type PreviewMediaItem,
} from "@/components/common/MediaPreviewDialog";
import { LexicalViewer } from "@/components/common/rich-text/LexicalViewer";
import {
  publicServiceBySlugQueryOptions,
  usePublicServiceBySlug,
  usePublicServices,
} from "@/lib/services/services-query";

interface ServiceDetailSectionProps {
  slug?: string;
}

const containsHtml = (value: string) => /<[^>]+>/.test(value);

export function ServiceDetailSection({ slug }: ServiceDetailSectionProps) {
  const queryClient = useQueryClient();
  const [activePreviewId, setActivePreviewId] = useState<string | null>(null);
  const serviceQuery = usePublicServiceBySlug(slug ?? "");
  const relatedServicesQuery = usePublicServices({
    page: 1,
    limit: 8,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const prefetchServiceDetail = (serviceSlug: string) => {
    void queryClient.prefetchQuery(
      publicServiceBySlugQueryOptions(serviceSlug),
    );
  };

  if (serviceQuery.isPending) {
    return (
      <section className="landing-container landing-section-compact">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="aspect-square bg-muted/50 animate-pulse" />
          <div className="aspect-square bg-muted/50 animate-pulse" />
        </div>
        <div className="mt-8 h-48 bg-muted/50 animate-pulse" />
      </section>
    );
  }

  if (serviceQuery.isError || !serviceQuery.data?.data) {
    return (
      <section className="landing-container landing-section text-center">
        <p className="mb-6 font-sans text-[18px] text-muted-foreground">
          This service was not found.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-sans text-[16px] font-medium text-primary no-underline hover:opacity-80"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </section>
    );
  }

  const service = serviceQuery.data.data;
  const orderedImages = (service.images ?? []).toSorted(
    (a, b) => a.position - b.position,
  );
  const previewItems: PreviewMediaItem[] = orderedImages
    .map((image, index) => ({
      id: `${service.id}-${image.position}-${index}`,
      type: "image" as const,
      src: image.imageUrl,
      alt: `${service.title} image ${index + 1}`,
      title: service.title,
      description: service.excerpt ?? undefined,
    }))
    .filter((item) => item.src);
  const activePreviewIndex =
    activePreviewId === null
      ? 0
      : Math.max(
          previewItems.findIndex((item) => item.id === activePreviewId),
          0,
        );
  const primaryImage = orderedImages[0]?.imageUrl ?? null;
  const related = (relatedServicesQuery.data?.data ?? [])
    .filter((item) => item.slug !== service.slug)
    .toSorted((a, b) => a.title.localeCompare(b.title));

  return (
    <section className="landing-container landing-section-compact">
      <div className="flex items-center gap-4 pb-6 md:pb-8">
        <Link
          to="/services"
          className="inline-flex min-h-6 items-center gap-2 font-sans text-[15px] text-primary no-underline hover:opacity-80"
        >
          <ArrowLeft size={16} />
          <span>Our services</span>
        </Link>
        <div className="h-px flex-1 bg-primary/20" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        {primaryImage && previewItems.length > 0 ? (
          <button
            type="button"
            onClick={() =>
              setActivePreviewId(String(previewItems[0]?.id ?? ""))
            }
            className="group relative aspect-square overflow-hidden border border-border/60 bg-muted/40 text-left touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
            aria-label={`Open media preview for ${service.title}`}
          >
            <AppImage
              src={primaryImage}
              alt={service.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 motion-reduce:transition-none motion-reduce:group-hover:scale-100 group-hover:scale-[1.02]"
              priority
            />
          </button>
        ) : (
          <div className="relative aspect-square overflow-hidden border border-border/60 bg-muted/40">
            {primaryImage ? (
              <AppImage
                src={primaryImage}
                alt={service.title}
                className="absolute inset-0 h-full w-full object-cover"
                priority
              />
            ) : null}
          </div>
        )}

        <div className="flex aspect-square flex-col justify-between border border-border/60 p-6 md:p-8">
          <div className="space-y-4">
            <p className="font-sans text-[14px] uppercase tracking-wide text-muted-foreground">
              /Our services
            </p>
            <h1 className="font-sans text-[28px] font-semibold leading-[1.2] text-foreground md:text-[40px]">
              {service.title}
            </h1>
            <p className="font-sans text-[15px] leading-[1.7] text-muted-foreground md:text-[16px]">
              {service.excerpt ??
                "Explore how this service supports complex business requirements."}
            </p>
          </div>
          <p className="pt-4 font-sans text-[13px] uppercase tracking-wide text-muted-foreground">
            Updated service details
          </p>
        </div>
      </div>

      <div className="mt-10 border border-border/60 p-6 md:p-10">
        <h2 className="mb-5 font-sans text-[22px] font-semibold text-foreground md:text-[30px]">
          Service Overview
        </h2>

        {service.description ? (
          containsHtml(service.description) ? (
            <LexicalViewer content={service.description} />
          ) : (
            <p className="whitespace-pre-wrap font-sans text-[15px] leading-[1.8] text-muted-foreground md:text-[16px]">
              {service.description}
            </p>
          )
        ) : (
          <p className="font-sans text-[15px] text-muted-foreground">
            No description available for this service yet.
          </p>
        )}
      </div>

      {orderedImages.length > 0 ? (
        <div className="mt-10">
          <div className="mb-5 flex items-center gap-4">
            <h2 className="shrink-0 font-sans text-[22px] font-semibold text-foreground md:text-[30px]">
              Service Gallery
            </h2>
            <div className="h-px flex-1 bg-primary/20" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {orderedImages.map((image, index) => (
              <button
                key={`${image.imageUrl}-${image.position}`}
                type="button"
                onClick={() =>
                  setActivePreviewId(`${service.id}-${image.position}-${index}`)
                }
                className="group relative aspect-square overflow-hidden border border-border/60 bg-muted/40 text-left touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
                aria-label={`Open media ${index + 1} for ${service.title}`}
              >
                <AppImage
                  src={image.imageUrl}
                  alt={`${service.title} image ${index + 1}`}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 motion-reduce:transition-none motion-reduce:group-hover:scale-100 group-hover:scale-[1.02]"
                />
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-12">
        <div className="mb-5 flex items-center gap-4">
          <h2 className="shrink-0 font-sans text-[22px] font-semibold text-foreground md:text-[30px]">
            Related Services
          </h2>
          <div className="h-px flex-1 bg-primary/20" />
        </div>

        {relatedServicesQuery.isError ? (
          <p className="font-sans text-[15px] text-muted-foreground">
            Related services are unavailable right now.
          </p>
        ) : relatedServicesQuery.isPending ? (
          <div
            className="overflow-x-auto pb-2 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex w-max flex-nowrap gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`related-service-skeleton-${index}`}
                  className="h-[18rem] w-[min(20rem,85vw)] shrink-0 border border-border/60 bg-muted/50 animate-pulse md:w-[22rem]"
                />
              ))}
            </div>
          </div>
        ) : !related.length ? (
          <p className="font-sans text-[15px] text-muted-foreground">
            No related services found.
          </p>
        ) : (
          <div
            className="overflow-x-auto pb-2 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex w-max flex-nowrap gap-4">
              {related.map((item) => (
                <article
                  key={item.id}
                  className="group flex h-[18rem] w-[min(20rem,85vw)] shrink-0 flex-col justify-between border border-border/60 p-5 md:w-[22rem]"
                >
                  <div className="space-y-3">
                    <h3 className="font-sans text-[18px] font-semibold text-foreground md:text-[20px]">
                      {item.title}
                    </h3>
                    <p className="line-clamp-4 font-sans text-[14px] leading-[1.6] text-muted-foreground md:text-[15px]">
                      {item.excerpt ??
                        "Explore how this service supports complex business needs."}
                    </p>
                  </div>

                  <Link
                    to="/services/$slug"
                    params={{ slug: item.slug }}
                    onMouseEnter={() => prefetchServiceDetail(item.slug)}
                    onFocus={() => prefetchServiceDetail(item.slug)}
                    className="mt-4 inline-flex min-h-6 items-center gap-2 font-sans text-[14px] font-medium text-primary no-underline group-hover:opacity-80"
                  >
                    <span>Learn More</span>
                    <ArrowRight size={16} />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>

      <MediaPreviewDialog
        open={activePreviewId !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setActivePreviewId(null);
          }
        }}
        items={previewItems}
        initialIndex={activePreviewIndex}
        title={`${service.title} Media`}
        description={service.excerpt ?? undefined}
      />
    </section>
  );
}
