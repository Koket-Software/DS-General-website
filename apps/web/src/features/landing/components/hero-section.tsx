import { Link } from "@tanstack/react-router";

import { ArrowUpRight } from "./icons";
import imgHero from "../../../assets/ds/home/DS_Hero.webp";

import { AppImage } from "@/components/common/AppImage";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden md:h-[calc(100svh-4.5rem)]">
      <div className="absolute inset-0 z-0 bg-muted/15" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-white/8 via-white/4 to-transparent"
        aria-hidden
      />

      {/* Content area */}
      <div className="landing-container relative z-20 flex items-start pt-8 md:h-full md:pt-12 lg:pt-16">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 w-full">
          <h1 className="font-semibold text-foreground text-[32px] md:text-[48px] leading-tight max-w-175.25">
            Integrated Construction &amp; Global Supply Chain Solutions
          </h1>
          <div className="flex flex-col gap-6 max-w-106.75">
            <p className=" font-normal text-muted-foreground text-[16px] leading-normal">
              We deliver high-quality General Contracting and Material Supply
              services by combining expert engineering with direct global
              sourcing for Ethiopian developers and businesses seeking
              reliability
            </p>
            <div className="flex flex-wrap gap-8 items-center">
              <Link
                to="/sectors/$slug"
                params={{ slug: "sourcing-logistics" }}
                className="bg-primary flex items-center justify-center px-6 py-3 font-medium text-[16px] hover:bg-primary/90 text-primary-foreground "
              >
                View Our Services
              </Link>
              <div className="hidden sm:flex sm:gap-3 sm:items-center sm:group">
                <Link to="/contact" className="flex gap-3 items-center group ">
                  <span className="font-sans font-medium text-primary text-[16px] ">
                    Contact Us
                  </span>
                  <div className="bg-primary  p-2 rounded-full group-hover:bg-primary/90 transition-colors">
                    <ArrowUpRight />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-0 mt-6 select-none md:pointer-events-none md:absolute md:inset-x-0 md:bottom-0 md:mt-0">
        <AppImage
          src={imgHero}
          alt="DS General PLC construction containers"
          className="block h-auto w-full object-contain object-bottom"
          priority
          width={1920}
          height={1080}
          sizes="100vw"
        />
      </div>
    </section>
  );
}
