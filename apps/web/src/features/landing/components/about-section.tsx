import { SectionHeader } from "./section-header";

export function AboutSection() {
  return (
    <section className="landing-container landing-section">
      <SectionHeader
        label="/About Us"
        title="What DS General PLC Is All About"
      />

      <div className="mt-10 flex flex-col lg:flex-row gap-6">
        {/* Main description */}
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

        {/* Mission */}
        <div className="w-full lg:w-73.5 border border-border/60 flex flex-col">
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

        {/* Vision */}
        <div className="w-full lg:w-73.5 border border-border/60 flex flex-col">
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
