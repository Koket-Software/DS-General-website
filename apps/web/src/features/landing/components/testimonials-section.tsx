import { SectionHeader } from "./section-header";

const testimonials = [
  {
    role: "Procurement Manager, Blue Horizon Tech",
    quote:
      "Finding genuine electronics in Addis can be a headache, but DS General PLC delivered 50+ laptops and office stations for our new headquarters without a single issue. Everything was original, sealed, and arrived a week ahead of schedule.",
    name: "Samuel T.",
    highlighted: true,
  },
  {
    role: "Project Lead, Capital Heights Real Estate",
    quote:
      "We used to deal with three different suppliers for rebar, cement, and electrical fittings. Switching to DS General PLC for our wholesale supply cut our material waiting time by half. Their price on imported finishing materials is unbeatable.",
    name: "Henok B.",
    highlighted: false,
  },
  {
    role: "Property Owner",
    quote:
      "What I loved most was the transparency. Because they import their own electrical and sanitary goods, I didn't have to worry about low-quality fakes being used in my building. They control the supply chain, and it shows in the quality.",
    name: "Almaz G.",
    highlighted: false,
  },
  {
    role: "General Trading PLC",
    quote:
      "A reliable partner for our hardware store. Their wholesale prices on sanitary equipment and tools allow us to stay competitive, and they always have stock when we need it.",
    name: "Mohammed Y.",
    highlighted: false,
  },
];

export function TestimonialsSection() {
  return (
    <section className="max-w-360 mx-auto px-6 md:px-24 py-16 md:py-24">
      <SectionHeader
        label="/Testimonials"
        title="Don't just take our word for it. Hear it from our clients"
      />

      <div className="mt-10 flex md:flex-row gap-2 overflow-x-auto no-scrollbar">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className={`max-w-md min-w-70 md:w-88.75 shrink-0 p-8 flex flex-col justify-between ${
              t.highlighted ? "bg-muted/60" : "border border-border/70"
            }`}
          >
            <div className="flex flex-col gap-6">
              <p className="font-sans font-normal text-muted-foreground text-[16px]">
                {t.role}
              </p>
              <p className="font-['Inter',sans-serif font-normal text-foreground text-[16px] leading-normal wrap-break-word">
                {t.quote}
              </p>
            </div>
            <div className="flex gap-4 items-center mt-8">
              <div className="w-15 h-15 rounded-full bg-muted/60 shrink-0" />
              <p className="font-sans font-normal text-foreground text-[16px]">
                {t.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
