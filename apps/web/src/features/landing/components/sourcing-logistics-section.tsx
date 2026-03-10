import { Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import type { ReactElement } from "react";

import svgPaths from "../../../../imports/svg-3j9pd5gois";

import { AppImage } from "@/components/common/AppImage";
import { Button } from "@/components/ui/button";
import {
  InstagramIcon,
  LinkedinIcon,
  ArrowUpRight,
  CaretLeft,
  CaretRight,
} from "@/features/landing/components/icons";
import { usePublicBusinessSectorBySlug } from "@/lib/business-sectors/business-sectors-query";

interface SourcingLogisticsSectionProps {
  slug: string;
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <path d={svgPaths.pcc49600} fill="var(--muted-foreground)" />
    </svg>
  );
}

function MailIcon() {
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

export function SourcingLogisticsSection({
  slug,
}: SourcingLogisticsSectionProps) {
  const sectorQuery = usePublicBusinessSectorBySlug(slug);

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

    window.setTimeout(updateScroll, 350);
  };

  if (sectorQuery.isError) {
    return (
      <section className="landing-container landing-section text-center">
        <p className="font-sans text-[16px] text-muted-foreground">
          Failed to load sector content.
        </p>
      </section>
    );
  }

  if (sectorQuery.isPending || !sector) {
    return (
      <section className="landing-container landing-section-compact">
        <div className="mb-8 h-80 animate-pulse bg-muted/50" />
        <div className="h-60 animate-pulse bg-muted/50" />
      </section>
    );
  }

  const socialLinks = [
    {
      label: "X",
      href: sector.facebookUrl ?? undefined,
      icon: <XSocialIcon />,
    },
    {
      label: "Instagram",
      href: sector.instagramUrl ?? undefined,
      icon: <InstagramIcon />,
    },
    {
      label: "LinkedIn",
      href: sector.linkedinUrl ?? undefined,
      icon: <LinkedinIcon />,
    },
  ].filter(
    (item): item is { label: string; href: string; icon: ReactElement } =>
      Boolean(item.href),
  );

  return (
    <>
      <section className="landing-container pt-6 md:pt-8">
        <div className="grid overflow-hidden md:grid-cols-2">
          <div className="bg-primary px-6 py-7 md:px-10 md:py-10">
            <div className="flex h-full flex-col justify-between gap-8">
              <div className="space-y-3">
                <h1 className="font-sans text-[32px] font-medium leading-[1.15] text-primary-foreground md:text-[42px]">
                  {sector.title}
                </h1>
                <p className="max-w-[38rem] font-sans text-[14px] leading-[1.55] text-primary-foreground/80 md:text-[16px]">
                  {sector.excerpt ?? "Sourcing and logistics services."}
                </p>
              </div>

              <Link
                to="/contact"
                className="group inline-flex w-fit items-center border border-primary-foreground/40 p-1 no-underline"
              >
                <span className="px-4 py-1.5 font-sans text-[14px] font-medium text-primary-foreground md:text-[15px]">
                  Let&apos;s Talk
                </span>
                <span className="flex items-center justify-center bg-background p-2">
                  <ArrowUpRight color="var(--primary)" />
                </span>
              </Link>
            </div>
          </div>

          <div className="relative h-52 overflow-hidden bg-muted/40 md:h-auto">
            {sector.featuredImageUrl ? (
              <AppImage
                src={sector.featuredImageUrl}
                alt={sector.title}
                className="absolute inset-0 h-full w-full object-cover"
                priority
                width={1200}
                height={900}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : null}
          </div>
        </div>
      </section>

      <section className="landing-container landing-section-compact">
        <div className="space-y-6 md:space-y-8">
          <h2 className="font-sans text-[36px] font-medium text-foreground">
            Sector Stats
          </h2>

          {stats.length === 0 ? (
            <p className="font-sans text-[15px] text-muted-foreground">
              No stats available yet.
            </p>
          ) : (
            <>
              <div className="divide-y divide-border/80 border-y border-border/80 md:hidden">
                {stats.map((stat) => (
                  <div key={stat.id} className="py-4 text-center">
                    <p className="font-sans text-[28px] font-extrabold leading-none text-foreground">
                      {stat.statValue}
                    </p>
                    <p className="mt-2 font-sans text-[13px] text-muted-foreground">
                      {stat.statKey}
                    </p>
                  </div>
                ))}
              </div>

              <div className="hidden md:flex md:items-stretch md:justify-between md:gap-0">
                {stats.map((stat, index) => (
                  <div
                    key={stat.id}
                    className="flex flex-1 items-center justify-center gap-10 px-4"
                  >
                    <div className="text-center">
                      <p className="font-sans text-[40px] font-extrabold leading-none text-foreground">
                        {stat.statValue}
                      </p>
                      <p className="mt-2 font-sans text-[16px] text-foreground">
                        {stat.statKey}
                      </p>
                    </div>
                    {index < stats.length - 1 ? (
                      <div className="h-14 w-px bg-border/90" />
                    ) : null}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="landing-container pb-12">
        <div className="space-y-5">
          <div
            ref={scrollRef}
            onScroll={updateScroll}
            className="flex gap-4 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {gallery.map((image, index) => (
              <div
                key={image.id}
                className="relative h-[14.5rem] w-[16.4rem] shrink-0 overflow-hidden bg-muted/40 md:h-[22.5rem] md:w-[19.75rem]"
              >
                <AppImage
                  src={image.imageUrl}
                  alt={`${sector.title} gallery ${index + 1}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  width={632}
                  height={720}
                  sizes="(max-width: 768px) 262px, 316px"
                />
              </div>
            ))}
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-muted/80 px-3 py-1.5">
            <Button
              variant="ghost"
              type="button"
              aria-label="Scroll gallery left"
              onClick={() => scroll("left")}
              className={`h-8 w-8 p-0 transition-opacity ${
                canScrollLeft ? "opacity-100" : "opacity-40"
              }`}
            >
              <CaretLeft />
            </Button>
            <Button
              variant="ghost"
              type="button"
              aria-label="Scroll gallery right"
              onClick={() => scroll("right")}
              className="h-8 w-8 p-0"
            >
              <CaretRight />
            </Button>
          </div>
        </div>
      </section>

      <section className="landing-container landing-section-compact">
        <div className="max-w-[64rem] space-y-6">
          <h2 className="font-sans text-[42px] font-medium text-foreground">
            Our History
          </h2>
          <p className="whitespace-pre-wrap font-sans text-[16px] leading-[1.6] text-muted-foreground">
            {sector.history}
          </p>
        </div>
      </section>

      <section className="landing-container landing-section-compact">
        <div className="space-y-6">
          <h2 className="font-sans text-[42px] font-medium text-foreground">
            What We Do
          </h2>

          {services.length === 0 ? (
            <p className="font-sans text-[15px] text-muted-foreground">
              No service cards available yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex min-h-56 flex-col justify-end border border-border/70 p-5 md:min-h-64 md:p-6"
                >
                  <h3 className="font-sans text-[32px] font-semibold leading-[1.1] text-foreground md:text-[34px]">
                    {service.title}
                  </h3>
                  <p className="mt-3 font-sans text-[14px] leading-[1.5] text-muted-foreground">
                    {service.description ?? "No description available."}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="landing-container landing-section-compact">
        <div className="space-y-8">
          <h2 className="font-sans text-[42px] font-medium text-foreground">
            Get in touch with us
          </h2>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1">
                <p className="font-sans text-[13px] font-semibold text-foreground">
                  Phone Number
                </p>
                <div className="flex items-start gap-2 text-[14px] text-muted-foreground">
                  <PhoneIcon />
                  <p>{sector.phoneNumber ?? "+251 90 000 0000"}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="font-sans text-[13px] font-semibold text-foreground">
                  Email Address
                </p>
                <div className="flex items-start gap-2 text-[14px] text-muted-foreground">
                  <MailIcon />
                  <p>{sector.emailAddress ?? "contact@dsgeneralplc.com"}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="font-sans text-[13px] font-semibold text-foreground">
                  Address
                </p>
                <div className="flex items-start gap-2 text-[14px] text-muted-foreground">
                  <MapPinIcon />
                  <p>{sector.address ?? "Addis Abeba, Ethiopia"}</p>
                </div>
              </div>
            </div>

            {socialLinks.length > 0 ? (
              <div className="space-y-2">
                <p className="font-sans text-[16px] font-medium text-foreground">
                  Follow Us
                </p>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center gap-2 rounded-full bg-muted/60 px-3.5 text-[13px] text-muted-foreground no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    >
                      {social.icon}
                      <span>{social.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
