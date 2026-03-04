import imgCta from "../../../../assets/914886b474a7d6467073615b01c520d6b9d6bb84.png";

export function CTASection() {
  return (
    <section className="max-w-360 mx-auto px-6 md:px-24 py-16 md:py-24">
      <div className="relative bg-primary overflow-hidden flex flex-col lg:flex-row">
        {/* Text content */}
        <div className="flex-1 px-8 md:px-16 py-8 md:py-20 flex flex-col gap-10 justify-center">
          <div className="flex flex-col gap-4 max-w-131.25">
            <h2 className="font-sans font-semibold text-primary-foreground text-[32px] md:text-[40px] leading-tight">
              Ready to Streamline Your Supply Chain?
            </h2>
            <p className="font-sans font-normal text-primary-foreground/70 text-[16px] leading-normal">
              Stop dealing with multiple vendors. Partner with DS General PLC
              for direct access to high-quality construction materials,
              electronics, and corporate supplies.
            </p>
          </div>
          <a
            href="#"
            className="bg-background inline-flex items-center justify-center px-6 py-3 w-fit text-primary font-sans font-medium text-[16px] hover:bg-muted transition-colors"
          >
            Contact Us
          </a>
        </div>

        {/* Image */}
        <div className="w-full lg:w-133.25 h-75 lg:h-auto relative shrink-0 mb-10">
          <img
            src={imgCta}
            alt="Shipping containers"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
