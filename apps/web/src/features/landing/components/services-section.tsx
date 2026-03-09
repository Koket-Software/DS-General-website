import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { ArrowRight, CraneIcon, DesktopIcon, OfficeChairIcon } from "./icons";
import { SectionHeader } from "./section-header";

import {
  publicServiceBySlugQueryOptions,
  usePublicServices,
} from "@/lib/services/services-query";

const fallbackIcons = [
  <CraneIcon key="crane" />,
  <DesktopIcon key="desktop" />,
  <OfficeChairIcon key="office" />,
];

export function ServicesSection() {
  const queryClient = useQueryClient();
  const servicesQuery = usePublicServices({
    page: 1,
    limit: 6,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const services = servicesQuery.data?.data ?? [];
  const prefetchServiceDetail = (slug: string) => {
    void queryClient.prefetchQuery(publicServiceBySlugQueryOptions(slug));
  };

  return (
    <section className="landing-container landing-section">
      <SectionHeader
        label="/Our services"
        title="We specialize in providing reliable and efficient solutions"
      />

      {servicesQuery.isError ? (
        <div className="mt-10 text-sm text-muted-foreground">
          Unable to load services right now.
        </div>
      ) : (
        <div
          className="mt-10 overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex w-max flex-nowrap gap-3">
            {servicesQuery.isPending
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`service-skeleton-${index}`}
                    className="h-64 w-[min(20rem,85vw)] shrink-0 border border-border/60 bg-muted/50 animate-pulse md:w-[22rem]"
                  />
                ))
              : services.map((service, index) => (
                  <div
                    key={service.id}
                    className="flex w-[min(20rem,85vw)] shrink-0 flex-col gap-6 border border-border/60 p-6 md:w-[22rem]"
                  >
                    <div className="shrink-0">
                      {fallbackIcons[index % fallbackIcons.length]}
                    </div>
                    <div className="flex flex-col gap-4">
                      <h3 className="font-sans font-semibold text-foreground text-[16px]">
                        {service.title}
                      </h3>
                      <p className="font-sans font-normal text-muted-foreground text-[16px] leading-normal">
                        {service.excerpt ||
                          "Explore how our team delivers practical outcomes for complex business needs."}
                      </p>
                      <Link
                        to="/services/$slug"
                        params={{ slug: service.slug }}
                        onMouseEnter={() => prefetchServiceDetail(service.slug)}
                        onFocus={() => prefetchServiceDetail(service.slug)}
                        className="flex gap-3 items-center group"
                      >
                        <span className="font-sans font-semibold text-primary text-[16px]">
                          Learn More
                        </span>
                        <ArrowRight />
                      </Link>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}
    </section>
  );
}
