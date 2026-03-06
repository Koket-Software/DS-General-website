import { Link } from "@tanstack/react-router";

import { ArrowUpRight } from "./icons";
import imgHero from "../../../assets/ds/home/DS_Hero.webp";

export function HeroSection() {
  return (
    <section>
      {/* Content area */}
      <div className="max-w-360 mx-auto px-6 md:px-24 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
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
                to="/"
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

      {/* Hero image */}
      <div className="w-full h-75 md:h-125 lg:h-159.5 relative overflow-hidden">
        <img
          src={imgHero}
          alt="DS General PLC construction containers"
          className="absolute inset-0 w-full h-full object-fit"
        />
      </div>
    </section>
  );
}
