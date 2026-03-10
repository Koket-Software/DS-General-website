import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { AppImage } from "@/components/common/AppImage";
import {
  publicServiceBySlugQueryOptions,
  usePublicServices,
} from "@/lib/services/services-query";

const FALLBACK_EXCERPT =
  "Practical, end-to-end delivery tailored to complex business needs.";

function ServicesPageSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 md:gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={`service-page-skeleton-${index}`}
          className="overflow-hidden border border-border/60 bg-muted/40"
        >
          <div className="aspect-[4/3] animate-pulse bg-muted/70" />
          <div className="space-y-3 p-5 md:p-6">
            <div className="h-5 w-3/4 animate-pulse bg-muted/70" />
            <div className="h-4 w-full animate-pulse bg-muted/70" />
            <div className="h-4 w-4/5 animate-pulse bg-muted/70" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ServicesPageSection() {
  const queryClient = useQueryClient();
  const servicesQuery = usePublicServices({
    page: 1,
    limit: 12,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const services = servicesQuery.data?.data ?? [];

  const prefetchServiceDetail = (slug: string) => {
    void queryClient.prefetchQuery(publicServiceBySlugQueryOptions(slug));
  };

  return (
    <section className="landing-container landing-section-compact">
      <div className="mb-10 grid gap-6 border-b border-primary/20 pb-8 md:mb-14 md:grid-cols-[minmax(0,1fr)_15rem] md:items-end md:pb-10">
        <div className="space-y-3">
          <p className="font-sans text-[14px] uppercase tracking-[0.16em] text-muted-foreground md:text-[15px]">
            /Our services
          </p>
          <h1 className="max-w-[18ch] font-sans text-[32px] font-semibold leading-[1.1] text-foreground md:text-[44px]">
            Services Designed for Measurable Business Impact
          </h1>
          <p className="max-w-[58ch] font-sans text-[15px] leading-[1.7] text-muted-foreground md:text-[16px]">
            Explore our full capabilities from strategy to execution. Each
            service is structured to move from clear scope to dependable
            outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 border border-border/60 bg-primary/5 p-4 md:p-5">
          <p className="font-sans text-[12px] uppercase tracking-[0.15em] text-muted-foreground">
            Service Catalog
          </p>
          <p className="font-sans text-[34px] font-semibold leading-none text-foreground">
            {services.length}
          </p>
          <p className="font-sans text-[13px] leading-[1.5] text-muted-foreground">
            Active offerings currently available.
          </p>
        </div>
      </div>

      {servicesQuery.isError ? (
        <div className="border border-border/60 bg-muted/30 p-8 text-center md:p-10">
          <p className="font-sans text-[16px] text-muted-foreground">
            Unable to load services right now. Please refresh and try again.
          </p>
        </div>
      ) : servicesQuery.isPending ? (
        <ServicesPageSkeleton />
      ) : services.length === 0 ? (
        <div className="border border-border/60 bg-muted/30 p-8 text-center md:p-10">
          <p className="font-sans text-[16px] text-muted-foreground">
            No services are published yet. Please check back soon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 md:gap-6">
          {services.map((service, index) => (
            <Link
              key={service.id}
              to="/services/$slug"
              params={{ slug: service.slug }}
              onMouseEnter={() => prefetchServiceDetail(service.slug)}
              onFocus={() => prefetchServiceDetail(service.slug)}
              className="group relative block overflow-hidden border border-border/60 bg-background no-underline transition-colors hover:border-primary/45"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted/40">
                {service.featuredImage ? (
                  <AppImage
                    src={service.featuredImage}
                    alt={service.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-primary/8 to-transparent" />
                )}

                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-black/5 to-transparent opacity-75 transition-opacity duration-300 group-hover:opacity-90" />

                <div className="absolute left-3 top-3 border border-white/35 bg-black/25 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-white backdrop-blur-sm">
                  Service
                </div>
                <div className="absolute right-3 top-3 border border-white/35 bg-black/25 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>

              <div className="relative flex min-h-[13rem] flex-col gap-4 p-5 md:min-h-[14rem] md:p-6">
                <h2 className="font-sans text-[20px] font-semibold leading-[1.25] text-foreground md:text-[22px]">
                  {service.title}
                </h2>
                <p className="line-clamp-3 font-sans text-[14px] leading-[1.7] text-muted-foreground md:text-[15px]">
                  {service.excerpt ?? FALLBACK_EXCERPT}
                </p>

                <div className="mt-auto inline-flex items-center gap-2 font-sans text-[14px] font-semibold text-primary">
                  <span>View Details</span>
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>

                <div className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-primary/60 transition-all duration-300 group-hover:w-full" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
