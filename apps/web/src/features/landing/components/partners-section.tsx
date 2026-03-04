import { SectionHeader } from "./section-header";
import imgPartnerLogo from "../../../../assets/d2b65ffdf274358163aa405269a609a5acf7ce0b.png";

export function PartnersSection() {
  return (
    <section className="max-w-360 mx-auto px-6 md:px-24 py-16 md:py-24">
      <SectionHeader label="/Partners" title="Partners That Trust Us" />

      <div className="mt-10 flex gap-6 overflow-x-auto no-scrollbar">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="bg-muted flex items-center justify-center p-10 h-27 w-45 md:w-51 "
          >
            <div
              className="h-6 w-31 bg-muted-foreground opacity-70"
              style={{
                maskImage: `url('${imgPartnerLogo}')`,
                maskSize: "120px 24px",
                maskRepeat: "no-repeat",
                maskPosition: "0 0",
                WebkitMaskImage: `url('${imgPartnerLogo}')`,
                WebkitMaskSize: "120px 24px",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskPosition: "0 0",
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
