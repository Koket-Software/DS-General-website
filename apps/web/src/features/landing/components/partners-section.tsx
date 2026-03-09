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
        <div className="mt-10 flex gap-6 overflow-x-auto no-scrollbar">
          {partnersQuery.isPending
            ? Array.from({ length: 7 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-muted flex items-center justify-center p-10 h-27 w-45 md:w-51 animate-pulse"
                />
              ))
            : partners.slice(0, 12).map((partner) => (
                <div
                  key={partner.id}
                  className="bg-muted flex items-center justify-center p-10 h-27 w-45 md:w-51"
                >
                  {partner.logoUrl ? (
                    <img
                      src={partner.logoUrl}
                      alt={partner.title}
                      className="max-h-10 max-w-31 object-contain opacity-80"
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground text-center">
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
