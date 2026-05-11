import { SectionHeader } from "./section-header";

import { useClientPartnersQuery } from "@/lib/partners/partners-query";

export function PartnersSection() {
  const partnersQuery = useClientPartnersQuery();
  const partners = partnersQuery.data?.data ?? [];

  return (
    <section className="landing-container landing-section">
      <SectionHeader label="/Partners" title="Partners That Trust Us" />

      {partnersQuery.isError ? (
        <div className="mt-10 text-sm text-muted-foreground">
          Unable to load partners right now.
        </div>
      ) : (
        <div
          className="mt-10 flex gap-8 overflow-x-auto no-scrollbar focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          tabIndex={0}
          role="region"
          aria-label="Partner logos"
        >
          {partnersQuery.isPending
            ? Array.from({ length: 7 }).map((_, index) => (
                <div
                  key={index}
                  className="border-border/40 flex h-36 w-60 shrink-0 animate-pulse items-center justify-center rounded-sm border border-dashed px-4 py-6 md:h-40 md:w-72"
                />
              ))
            : partners.slice(0, 12).map((partner) => (
                <div
                  key={partner.id}
                  className="flex h-36 w-60 shrink-0 items-center justify-center px-4 py-6 md:h-40 md:w-72"
                >
                  {partner.logoUrl ? (
                    <img
                      src={partner.logoUrl}
                      alt={partner.title}
                      className="max-h-20 max-w-48 object-contain md:max-h-24 md:max-w-56"
                    />
                  ) : (
                    <span className="text-muted-foreground text-center text-base md:text-lg">
                      {partner.title}
                    </span>
                  )}
                </div>
              ))}
        </div>
      )}
    </section>
  );
}
