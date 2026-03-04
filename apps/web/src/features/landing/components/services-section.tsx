import { Link } from "@tanstack/react-router";

import { CraneIcon, DesktopIcon, OfficeChairIcon, ArrowRight } from "./icons";
import { SectionHeader } from "./section-header";

const services = [
  {
    icon: <CraneIcon />,
    title: "Construction & Building Materials",
    description:
      "As a licensed General Contractor, we execute major building projects while directly wholesaling essential construction materials\u2014like sand, gravel, and stone\u2014to guarantee quality and a steady supply for our sites and partners.",
  },
  {
    icon: <DesktopIcon />,
    title: "Technology & Electrical Infrastructure",
    description:
      "We power modern businesses by importing high-standard electrical goods and supplying essential IT infrastructure, including computers, software, and peripheral equipment to keep your operations running smoothly.",
  },
  {
    icon: <OfficeChairIcon />,
    title: "Corporate Supplies & Facility Management",
    description:
      "We equip your daily operations with wholesale office stationery, sanitary equipment, and protective safety gear, while also producing custom advertising materials to boost your local brand visibility.",
  },
];

export function ServicesSection() {
  return (
    <section className="max-w-360 mx-auto px-6 md:px-24 py-16 md:py-24">
      <SectionHeader
        label="/Our services"
        title="We specialize in providing reliable and efficient solutions"
      />

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-3">
        {services.map((service) => (
          <div
            key={service.title}
            className="border border-border/60 p-6 flex flex-col gap-6"
          >
            <div className="shrink-0">{service.icon}</div>
            <div className="flex flex-col gap-4">
              <h3 className="font-sans font-semibold text-foreground text-[16px]">
                {service.title}
              </h3>
              <p className="font-sans font-normal text-muted-foreground text-[16px] leading-normal">
                {service.description}
              </p>
              <Link
                to="/terms-of-service"
                className="flex gap-3 items-center group"
              >
                <span className="font-sans font-semibold text-primary text-[16px]">
                  Learn More
                </span>
                <ArrowRight />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
