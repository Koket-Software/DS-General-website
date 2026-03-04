import { Link } from "@tanstack/react-router";
import { useState, useRef } from "react";

import { InstagramIcon, LinkedinIcon } from "./icons";
import imgRectangle111 from "../../../../assets/14de50ea710950ebfb7c26acc44f81f664538324.png";
import imgRectangle110 from "../../../../assets/1eb41d22fa3dfc8470d9faebeda901bcb4bf03fc.png";
import imgRectangle108 from "../../../../assets/2898fe657b982ad0de49abc3a45563608339f9ad.png";
import imgRectangle103 from "../../../../assets/4697d8cac32535efe2332b349b50a554f91074c6.png";
import imgRectangle104 from "../../../../assets/4d25ea230f779e5202f313f385a72c2984b7ec07.png";
import imgRectangle106 from "../../../../assets/4d6c2a0c01d813dbdfbea64c35749369f4b59928.png";
import imgRectangle107 from "../../../../assets/5e3eb91a81fc7fd11a67d6dda3edb73c3d49edfb.png";
import imgRectangle102 from "../../../../assets/617f8aae681142bb97435c1b17c1f535daa981fe.png";
import imgRectangle101 from "../../../../assets/62d0147079907f197c1237f5a3e487de3f27ef6e.png";
import imgRectangle109 from "../../../../assets/8b7fe1999c9d48fcf58d76049d68e0b22d94ceff.png";
import imgRectangle114 from "../../../../assets/8dc6cbda218aff1a8f14e66bc682ab9af3d465d6.png";
import imgRectangle105 from "../../../../assets/d061cc03166ae1c8e123126f9925002f3a2d6326.png";
import svgPaths from "../../../../imports/svg-3j9pd5gois";

import { Button } from "@/components/ui/button";

const carouselImages = [
  imgRectangle101,
  imgRectangle102,
  imgRectangle103,
  imgRectangle104,
  imgRectangle105,
  imgRectangle106,
  imgRectangle107,
  imgRectangle108,
  imgRectangle109,
  imgRectangle110,
  imgRectangle111,
];

const stats = [
  { value: "15+", label: "Global supply partners" },
  { value: "500+", label: "Shipments cleared" },
  { value: "50+", label: "Major projects supplied" },
  { value: "10+", label: "Years of trade expertise" },
];

const whatWeDo = [
  {
    title: "Direct Sourcing & Procurement",
    description:
      "We negotiate directly with international manufacturers to source high-grade construction machinery, metal products, and electrical materials.",
  },
  {
    title: "Customs Clearance & Transit",
    description:
      "Seamless management of all border documentation, tariffs, and dry-port clearance (e.g., at Modjo) to prevent costly delays.",
  },
  {
    title: "Technology & IT Import",
    description:
      "Specialized logistics for importing commercial-grade computers, server racks, and enterprise software for corporate clients.",
  },
  {
    title: "Commodity Export",
    description:
      "Facilitating the outbound trade of Ethiopia's premium agricultural products, tapping into major export categories like coffee and oilseeds.",
  },
];

/* ─── Sub-components ─── */

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

/* ─── Hero Section ─── */
function HeroSection() {
  return (
    <section className="max-w-360 mx-auto px-6 md:px-24 pt-6 md:pt-8">
      <div className="flex flex-col md:flex-row w-full min-h-70 md:h-80.25">
        {/* Blue content area */}
        <div className="bg-primary flex flex-col gap-8 md:gap-10.25 justify-center p-8 md:p-10.25 md:flex-1">
          <div className="flex flex-col gap-3">
            <h1 className="font-sans font-medium text-primary-foreground text-[28px] md:text-[36px] leading-[1.2]">
              Sourcing &amp; Logistics
            </h1>
            <p className="font-sans text-primary-foreground/70 text-[14px] md:text-[16px]leading-normal max-w-127.5">
              Bridging the gap between global manufacturers and Ethiopian
              enterprises, our import and export division removes the friction
              of international trade to deliver critical materials on time and
              on budget.
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
        {/* Hero image */}
        <div className="h-60 md:h-auto md:flex-1 relative overflow-hidden">
          <img
            src={imgRectangle114}
            alt="Sourcing and Logistics"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

/* ─── Sector Stats ─── */
function SectorStats() {
  return (
    <section className="max-w-360 mx-auto px-6 md:px-24 py-12 md:py-16">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <h2 className="font-sans font-medium text-foreground text-[28px] md:text-[36px] shrink-0">
          Sector Stats
        </h2>
        <div className="flex flex-wrap items-center gap-8 md:gap-0 md:justify-between flex-1 md:max-w-233.75">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-8 md:gap-0">
              <div className="flex flex-col items-center text-center">
                <span className="font-sans font-extrabold text-foreground text-[24px]">
                  {stat.value}
                </span>
                <span className="font-sans font-medium text-foreground text-[14px] md:text-[16px]">
                  {stat.label}
                </span>
              </div>
              {i < stats.length - 1 && (
                <div className="hidden md:block w-px h-12.25 bg-foreground/40 mx-8 lg:mx-12" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Image Carousel ─── */
function ImageCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const updateScroll = () => {
    if (scrollRef.current) {
      setCanScrollLeft(scrollRef.current.scrollLeft > 0);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 332; // card width + gap
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
      setTimeout(updateScroll, 350);
    }
  };

  return (
    <section className="max-w-360 mx-auto px-6 md:px-24 pb-12">
      <div className="flex flex-col gap-6">
        <div
          ref={scrollRef}
          onScroll={updateScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {carouselImages.map((img, i) => (
            <div
              key={i}
              className="h-70 md:h-90.25 w-65 md:w-79 shrink-0 relative overflow-hidden"
            >
              <img
                src={img}
                alt={`Logistics gallery ${i + 1}`}
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
          <Button variant="ghost" type="button" onClick={() => scroll("right")}>
            <CaretRight />
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ─── Our History ─── */
function OurHistory() {
  return (
    <section className="max-w-360 mx-auto px-6 md:px-24 py-12 md:py-16">
      <div className="flex flex-col gap-7 max-w-244">
        <h2 className="font-sans font-medium text-foreground text-[28px] md:text-[36px]">
          Our History
        </h2>
        <div className="font-sans text-muted-foreground text-[16px] leading-[1.6] flex flex-col gap-4">
          <p>
            {`For decades, Ethiopia's rapid economic and infrastructural growth has been hindered by complex and fragmented supply chains. Historically, logistics costs in Ethiopia have comprised 22-27% of the final costs for many products. Furthermore, shipping and freight costs can be approximately 60% higher than in neighboring countries. Recognizing that heavy reliance on third-party vendors was causing massive delays for local developers, DS General PLC entered the Import/Export sector to take direct control of the supply chain.`}
          </p>
          <p>
            {`By securing comprehensive import licenses for technology and construction materials, we transitioned from relying on local procurement to becoming a direct, single-source gateway. Today, we navigate the complexities of international freight, customs clearance, and inland transport so our clients don't have to.`}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── What We Do ─── */
function WhatWeDoSection() {
  return (
    <section className="max-w-360 mx-auto px-6 md:px-24 py-12 md:py-16">
      <div className="flex flex-col gap-6">
        <h2 className="font-sans font-medium text-foreground text-[28px] md:text-[36px]">
          What We Do
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {whatWeDo.map((item) => (
            <div
              key={item.title}
              className="border border-border/60 flex flex-col gap-4 justify-end p-6 md:p-8 min-h-60 md:min-h-69.5"
            >
              <h3 className="font-sans font-semibold text-foreground text-[18px] md:text-[20px]">
                {item.title}
              </h3>
              <p className="font-sans text-foreground/70 text-[14px] md:text-[16px] leading-normal">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Get In Touch ─── */
function GetInTouchSection() {
  return (
    <section className="max-w-360 mx-auto px-6 md:px-24 py-12 md:py-16">
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10">
        {/* Contact Info */}
        <div className="flex flex-col gap-10">
          <h2 className="font-sans font-medium text-foreground text-[28px] md:text-[36px]">
            Get in touch with us
          </h2>
          <div className="flex flex-wrap gap-6">
            {/* Phone */}
            <div className="flex flex-col gap-1 w-39">
              <p className="font-sans font-semibold text-foreground text-[14px]">
                Phone Number
              </p>
              <div className="flex gap-2 items-start">
                <PhoneIcon />
                <div className="font-sans text-muted-foreground text-[14px]">
                  <p>+ 251 90 000 0000</p>
                  <p>+ 251 90 000 0000</p>
                </div>
              </div>
            </div>
            {/* Email */}
            <div className="flex flex-col gap-1 w-57.5">
              <p className="font-sans font-semibold text-foreground text-[14px]">
                Email Address
              </p>
              <div className="flex gap-2 items-center">
                <EnvelopeIcon />
                <span className="font-sans text-muted-foreground text-[14px]">
                  contact@dsgeneralplc.com
                </span>
              </div>
            </div>
            {/* Address */}
            <div className="flex flex-col gap-1 w-43.5">
              <p className="font-sans font-semibold text-foreground text-[14px]">
                Address
              </p>
              <div className="flex gap-2 items-center">
                <MapPinIcon />
                <span className="font-sans text-muted-foreground text-[14px]">
                  Addis Abeba, Ethiopia
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Follow Us */}
        <div className="flex flex-col gap-3">
          <p className="font-sans font-medium text-foreground text-[16px]">
            Follow Us
          </p>
          <div className="flex gap-2 items-center flex-wrap">
            <div className="bg-muted/60 flex gap-2 items-center px-4 py-1.5 rounded-[17.5px] h-8.75">
              <XSocialIcon />
              <span className="font-sans text-muted-foreground text-[14px]">
                X (formerly tweeter)
              </span>
            </div>
            <div className="bg-muted/60 flex gap-2 items-center px-4 py-1.5 rounded-[17.5px] h-8.75">
              <InstagramIcon />
              <span className="font-sans text-muted-foreground text-[14px]">
                Instagram
              </span>
            </div>
            <div className="bg-muted/60 flex gap-2 items-center px-4 py-1.5 rounded-[17.5px] h-8.75">
              <LinkedinIcon />
              <span className="font-sans text-muted-foreground text-[14px]">
                X (formerly tweeter)
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Main Export ─── */
export function SourcingLogisticsSection() {
  return (
    <>
      <HeroSection />
      <SectorStats />
      <ImageCarousel />
      <OurHistory />
      <WhatWeDoSection />
      <GetInTouchSection />
    </>
  );
}
