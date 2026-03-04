export function AboutHeroSection() {
  return (
    <section className="max-w-[1440px] mx-auto px-6 md:px-24 py-12 md:py-16">
      {/* Header with stats */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-sans font-normal text-muted-foreground text-[16px] uppercase">
            /About Us
          </p>
          <h1 className="capitalize font-sans font-semibold text-foreground text-[32px] md:text-[40px] max-w-[630px]">
            What DS General PLC Is All About
          </h1>
        </div>

        <div className="flex items-center gap-6 md:gap-10">
          <div className="flex flex-col items-center text-foreground">
            <p className="font-sans font-extrabold text-[24px]">24/7</p>
            <p className="font-sans font-medium text-[16px]">Front Desk</p>
          </div>
          <div className="w-px h-12 bg-primary/40" />
          <div className="flex flex-col items-center text-foreground">
            <p className="font-sans font-extrabold text-[24px]">[XX]</p>
            <p className="font-sans font-medium text-[16px]">Happy Clients</p>
          </div>
          <div className="w-px h-12 bg-primary/40" />
          <div className="flex flex-col items-center text-foreground">
            <p className="font-sans font-extrabold text-[24px]">[4.X/5]</p>
            <p className="font-sans font-medium text-[16px] text-center">
              Material Sourcing Quality Score
            </p>
          </div>
        </div>
      </div>

      {/* About description + Mission/Vision */}
      <div className="mt-10 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 p-6 border border-border/60">
          <p className="font-sans font-normal text-muted-foreground text-[16px] leading-[1.4]">
            In observing Ethiopia's rapid infrastructure growth, DS General PLC
            recognized a critical bottleneck holding projects back: fragmented
            supply chains that force businesses to juggle multiple vendors for
            technology, raw materials, and construction execution. We built our
            company as the definitive solution to this problem, bringing
            comprehensive global import capabilities, wholesale material supply,
            and licensed general contracting under one unified roof
          </p>
        </div>

        <div className="w-full lg:w-[294px] border border-border/60 flex flex-col">
          <div className="bg-background px-3 py-2 border-b border-border/60">
            <p className="font-sans font-semibold text-foreground text-[16px]">
              Our Mission
            </p>
          </div>
          <div className="p-6 flex-1 flex items-center">
            <p className="font-sans font-normal text-muted-foreground text-[16px] leading-normal">
              To empower Ethiopian growth by providing a single-source gateway
              for global sourcing, wholesale supply, and expert construction
              execution.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-[294px] border border-border/60 flex flex-col">
          <div className="bg-background px-3 py-2 border-b border-border/60">
            <p className="font-sans font-semibold text-foreground text-[16px]">
              Our Vision
            </p>
          </div>
          <div className="p-6 flex-1 flex items-center">
            <p className="font-sans font-normal text-muted-foreground text-[16px] leading-normal">
              To set a new benchmark for East African development, accelerating
              ambitious projects through seamless, integrated supply chains.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
