import { SectionHeader } from "./section-header";

import { useTestimonialListQuery } from "@/lib/testimonial/testimonial-query";

export function TestimonialsSection() {
  const testimonialsQuery = useTestimonialListQuery({ page: 1, limit: 8 });
  const testimonials = testimonialsQuery.data?.data ?? [];

  return (
    <section className="landing-container landing-section">
      <SectionHeader
        label="/Testimonials"
        title="Don't just take our word for it. Hear it from our clients"
      />

      {testimonialsQuery.isError ? (
        <div className="mt-10 text-sm text-muted-foreground">
          Unable to load testimonials right now.
        </div>
      ) : (
        <div
          className="mt-10 flex md:flex-row gap-2 overflow-x-auto no-scrollbar focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          tabIndex={0}
          role="region"
          aria-label="Client testimonials"
        >
          {testimonialsQuery.isPending
            ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="max-w-md min-w-70 md:w-88.75 shrink-0 p-8 h-64 bg-muted/50 animate-pulse"
                />
              ))
            : testimonials.slice(0, 8).map((item, index) => {
                const isHighlighted = index === 0;
                const role = [item.spokePersonTitle, item.companyName]
                  .filter(Boolean)
                  .join(", ");

                return (
                  <div
                    key={item.id}
                    className={`max-w-md min-w-70 md:w-88.75 shrink-0 p-8 flex flex-col justify-between ${
                      isHighlighted ? "bg-muted/60" : "border border-border/70"
                    }`}
                  >
                    <div className="flex flex-col gap-6">
                      <p className="font-sans font-normal text-muted-foreground text-[16px]">
                        {role || "Client"}
                      </p>
                      <p className="font-sans font-normal text-foreground text-[16px] leading-normal break-words">
                        {item.comment}
                      </p>
                    </div>
                    <div className="flex gap-4 items-center mt-8">
                      {item.spokePersonHeadshotUrl ? (
                        <img
                          src={item.spokePersonHeadshotUrl}
                          alt={item.spokePersonName ?? item.companyName}
                          className="w-15 h-15 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-15 h-15 rounded-full bg-muted/60 shrink-0" />
                      )}
                      <p className="font-sans font-normal text-foreground text-[16px]">
                        {item.spokePersonName || item.companyName}
                      </p>
                    </div>
                  </div>
                );
              })}
        </div>
      )}
    </section>
  );
}
