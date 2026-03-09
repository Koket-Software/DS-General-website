import { Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";

import { InstagramIcon, LinkedinIcon } from "./icons";
import svgPaths from "../../../../imports/svg-3j9pd5gois";

import { Button } from "@/components/ui/button";
import { usePublicBusinessSectorBySlug } from "@/lib/business-sectors/business-sectors-query";

function ArrowUpRight() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <path d={svgPaths.p12e71f00} fill="var(--primary)" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <path d={svgPaths.pcc49600} fill="var(--muted-foreground)" />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <path d={svgPaths.p43bc400} fill="var(--muted-foreground)" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <path d={svgPaths.p2605d880} fill="var(--muted-foreground)" />
    </svg>
  );
}

function XSocialIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 15.656 16">
      <path d={svgPaths.p2f6714f0} fill="var(--primary)" />
    </svg>
  );
}

function CaretLeft() {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path
        d={svgPaths.p204a5580}
        fill="oklch(from var(--foreground) l c h / 0.4)"
      />
    </svg>
  );
}

function CaretRight() {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path d={svgPaths.p2c0b8700} fill="var(--foreground)" />
    </svg>
  );
}

export function SourcingLogisticsSection() {
  const sectorQuery = usePublicBusinessSectorBySlug("sourcing-logistics");

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const sector = sectorQuery.data?.data;

  const stats = useMemo(
    () => (sector?.stats ?? []).toSorted((a, b) => a.position - b.position),
    [sector?.stats],
  );

  const gallery = useMemo(
    () => (sector?.gallery ?? []).toSorted((a, b) => a.position - b.position),
    [sector?.gallery],
  );

  const services = useMemo(
    () => (sector?.services ?? []).toSorted((a, b) => a.position - b.position),
    [sector?.services],
  );

  const updateScroll = () => {
    if (scrollRef.current) {
      setCanScrollLeft(scrollRef.current.scrollLeft > 0);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const amount = 332;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });

    setTimeout(updateScroll, 350);
  };

  if (sectorQuery.isError) {
    return (
      <section className="landing-container landing-section text-center">
        <p className="font-sans text-muted-foreground text-[16px]">
          Failed to load sector content.
        </p>
      </section>
    );
  }

  if (sectorQuery.isPending || !sector) {
    return (
      <section className="landing-container landing-section-compact">
        <div className="h-80 bg-muted/50 animate-pulse mb-8" />
        <div className="h-60 bg-muted/50 animate-pulse" />
      </section>
    );
  }

  return (
    <>
      <section className="landing-container pt-6 md:pt-8">
        <div className="flex flex-col md:flex-row w-full min-h-70 md:h-80.25">
          <div className="bg-primary flex flex-col gap-8 md:gap-10.25 justify-center p-8 md:p-10.25 md:flex-1">
            <div className="flex flex-col gap-3">
              <h1 className="font-sans font-medium text-primary-foreground text-[28px] md:text-[36px] leading-[1.2]">
                {sector.title}
              </h1>
              <p className="font-sans text-primary-foreground/70 text-[14px] leading-normal md:text-[16px] max-w-127.5">
                {sector.excerpt ?? "Sourcing and logistics services."}
              </p>
            </div>
            <Link
              to="/contact"
              className="flex items-center p-1 border border-border w-fit no-underline group"
            >
              <span className="font-sans font-medium text-primary-foreground text-[14px] md:text-[16px] px-4">
                Let's Talk
              </span>
              <div className="bg-background p-2 flex items-center justify-center">
                <ArrowUpRight />
              </div>
            </Link>
          </div>

          <div className="h-60 md:h-auto md:flex-1 relative overflow-hidden bg-muted/40">
            {sector.featuredImageUrl ? (
              <img
                src={sector.featuredImageUrl}
                alt={sector.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : null}
          </div>
        </div>
      </section>

      <section className="landing-container landing-section-compact">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <h2 className="font-sans font-medium text-foreground text-[28px] md:text-[36px] shrink-0">
            Sector Stats
          </h2>
          <div className="flex flex-wrap items-center gap-8 md:gap-0 md:justify-between flex-1 md:max-w-233.75">
            {stats.map((stat, index) => (
              <div key={stat.id} className="flex items-center gap-8 md:gap-0">
                <div className="flex flex-col items-center text-center">
                  <span className="font-sans font-extrabold text-foreground text-[24px]">
                    {stat.statValue}
                  </span>
                  <span className="font-sans font-medium text-foreground text-[14px] md:text-[16px]">
                    {stat.statKey}
                  </span>
                </div>
                {index < stats.length - 1 && (
                  <div className="hidden md:block w-px h-12.25 bg-foreground/40 mx-8 lg:mx-12" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-container pb-12">
        <div className="flex flex-col gap-6">
          <div
            ref={scrollRef}
            onScroll={updateScroll}
            className="flex gap-4 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {gallery.map((image, index) => (
              <div
                key={image.id}
                className="h-70 md:h-90.25 w-65 md:w-79 shrink-0 relative overflow-hidden bg-muted/40"
              >
                <img
                  src={image.imageUrl}
                  alt={`Sourcing gallery ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 bg-muted/80 rounded-[20px] px-4 py-2 w-fit">
            <Button
              variant="ghost"
              type="button"
              onClick={() => scroll("left")}
              className={`transition-opacity ${canScrollLeft ? "opacity-100" : "opacity-40"}`}
            >
              <CaretLeft />
            </Button>
            <Button
              variant="ghost"
              type="button"
              onClick={() => scroll("right")}
            >
              <CaretRight />
            </Button>
          </div>
        </div>
      </section>

      <section className="landing-container landing-section-compact">
        <div className="flex flex-col gap-7 max-w-244">
          <h2 className="font-sans font-medium text-foreground text-[28px] md:text-[36px]">
            Our History
          </h2>
          <p className="font-sans text-muted-foreground text-[16px] leading-[1.6] whitespace-pre-wrap">
            {sector.history}
          </p>
        </div>
      </section>

      <section className="landing-container landing-section-compact">
        <div className="flex flex-col gap-6">
          <h2 className="font-sans font-medium text-foreground text-[28px] md:text-[36px]">
            What We Do
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="border border-border/60 flex flex-col gap-4 justify-end p-6 md:p-8 min-h-60 md:min-h-69.5"
              >
                <h3 className="font-sans font-semibold text-foreground text-[18px] md:text-[20px]">
                  {service.title}
                </h3>
                <p className="font-sans text-foreground/70 text-[14px] md:text-[16px] leading-normal">
                  {service.description ?? "No description available."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-container landing-section-compact">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10">
          <div className="flex flex-col gap-10">
            <h2 className="font-sans font-medium text-foreground text-[28px] md:text-[36px]">
              Get in touch with us
            </h2>
            <div className="flex flex-wrap gap-6">
              <div className="flex flex-col gap-1 w-39">
                <p className="font-sans font-semibold text-foreground text-[14px]">
                  Phone Number
                </p>
                <div className="flex gap-2 items-start">
                  <PhoneIcon />
                  <div className="font-sans text-muted-foreground text-[14px]">
                    <p>{sector.phoneNumber ?? "+251 90 000 0000"}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1 w-57.5">
                <p className="font-sans font-semibold text-foreground text-[14px]">
                  Email Address
                </p>
                <div className="flex gap-2 items-center">
                  <EnvelopeIcon />
                  <span className="font-sans text-muted-foreground text-[14px]">
                    {sector.emailAddress ?? "contact@dsgeneralplc.com"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1 w-43.5">
                <p className="font-sans font-semibold text-foreground text-[14px]">
                  Address
                </p>
                <div className="flex gap-2 items-center">
                  <MapPinIcon />
                  <span className="font-sans text-muted-foreground text-[14px]">
                    {sector.address ?? "Addis Abeba, Ethiopia"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-sans font-medium text-foreground text-[16px]">
              Follow Us
            </p>
            <div className="flex gap-2 items-center flex-wrap">
              {sector.facebookUrl ? (
                <a
                  href={sector.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-muted/60 flex gap-2 items-center px-4 py-1.5 rounded-[17.5px] h-8.75 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <XSocialIcon />
                  <span className="font-sans text-muted-foreground text-[14px]">
                    Facebook
                  </span>
                </a>
              ) : null}
              {sector.instagramUrl ? (
                <a
                  href={sector.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-muted/60 flex gap-2 items-center px-4 py-1.5 rounded-[17.5px] h-8.75 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <InstagramIcon />
                  <span className="font-sans text-muted-foreground text-[14px]">
                    Instagram
                  </span>
                </a>
              ) : null}
              {sector.linkedinUrl ? (
                <a
                  href={sector.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-muted/60 flex gap-2 items-center px-4 py-1.5 rounded-[17.5px] h-8.75 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <LinkedinIcon />
                  <span className="font-sans text-muted-foreground text-[14px]">
                    Linkedin
                  </span>
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
