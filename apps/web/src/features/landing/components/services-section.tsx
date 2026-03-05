import { Link } from "@tanstack/react-router";

import { ArrowRight, CraneIcon, DesktopIcon, OfficeChairIcon } from "./icons";
import { SectionHeader } from "./section-header";

import { usePublicServices } from "@/lib/services/services-query";

const fallbackIcons = [
  <CraneIcon key="crane" />,
  <DesktopIcon key="desktop" />,
  <OfficeChairIcon key="office" />,
];

export function ServicesSection() {
  const servicesQuery = usePublicServices({
    page: 1,
    limit: 6,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const services = servicesQuery.data?.data ?? [];

  return (
    <section className="max-w-360 mx-auto px-6 md:px-24 py-16 md:py-24">
      <SectionHeader
        label="/Our services"
        title="We specialize in providing reliable and efficient solutions"
      />

      {servicesQuery.isError ? (
        <div className="mt-10 text-sm text-muted-foreground">
          Unable to load services right now.
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-3">
          {servicesQuery.isPending
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`service-skeleton-${index}`}
                  className="border border-border/60 p-6 h-64 bg-muted/50 animate-pulse"
                />
              ))
            : services.slice(0, 3).map((service, index) => (
                <div
                  key={service.id}
                  className="border border-border/60 p-6 flex flex-col gap-6"
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
                      to="/sectors/sourcing-logistics"
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
      )}
    </section>
  );
}
