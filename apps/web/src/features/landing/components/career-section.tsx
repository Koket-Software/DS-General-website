import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";

import { vacancies, type Vacancy } from "../data/careers-data";

import { Input } from "@/components/ui/input";

function VacancyCard({ vacancy }: { vacancy: Vacancy }) {
  return (
    <Link
      to="/career/$id"
      params={{ id: vacancy.id }}
      className="relative border border-border/60 overflow-hidden group hover:border-primary/40 transition-colors no-underline block"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 608 221"
        >
          <mask
            height="221"
            id={`mask-${vacancy.id}`}
            maskUnits="userSpaceOnUse"
            style={{ maskType: "alpha" }}
            width="608"
            x="0"
            y="0"
          >
            <rect fill="var(--muted)" height="221" width="608" />
          </mask>
          <g mask={`url(#mask-${vacancy.id})`}>
            <g filter={`url(#glow-${vacancy.id})`} opacity="0.1">
              <ellipse
                cx="66.88"
                cy="236"
                fill="var(--primary)"
                rx="217.222"
                ry="175"
              />
            </g>
          </g>
          <defs>
            <filter
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
              height="750"
              id={`glow-${vacancy.id}`}
              width="834.444"
              x="-350.342"
              y="-139"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                in="SourceGraphic"
                in2="BackgroundImageFix"
                mode="normal"
                result="shape"
              />
              <feGaussianBlur
                result="effect1_foregroundBlur"
                stdDeviation="100"
              />
            </filter>
          </defs>
        </svg>
      </div>

      {/* Content */}
      <div className="relative flex flex-col justify-end p-6 md:p-8 min-h-[200px]">
        <div className="flex flex-col gap-3.5 max-w-full">
          <div className="flex flex-col gap-1">
            <p className="font-sans font-medium text-foreground text-[18px] md:text-[20px]">
              {vacancy.title}
            </p>
            <p className="font-sans text-muted-foreground text-[14px] line-clamp-2">
              {vacancy.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-4 md:gap-6 font-sans text-muted-foreground text-[14px]">
            <span>{vacancy.department}</span>
            <span>{vacancy.location}</span>
            <span>{vacancy.type}</span>
          </div>
          <p className="font-sans text-foreground text-[12px]">
            Deadline: {vacancy.deadline}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function CareerSection() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVacancies = useMemo(() => {
    if (!searchQuery.trim()) return vacancies;
    const q = searchQuery.toLowerCase();
    return vacancies.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.department.toLowerCase().includes(q) ||
        v.type.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  return (
    <section className="max-w-[1440px] mx-auto px-6 md:px-24 py-10 md:py-16">
      {/* Hero */}
      <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-16 mb-10 md:mb-14">
        <div className="flex-1 flex flex-col gap-2">
          <p className="font-sans text-muted-foreground text-[16px] uppercase">
            /Careers
          </p>
          <h1 className="font-sans font-semibold text-foreground text-[32px] md:text-[40px] capitalize leading-[1.15]">
            Explore open roles and learn how you can help us serve.
          </h1>
        </div>

        {/* Search */}
        <div className="w-full lg:w-[480px] xl:w-[606px] shrink-0">
          <div className="border border-border/60 flex items-center px-4 py-3 gap-3">
            <Search size={18} className="text-muted-foreground shrink-0" />
            <Input
              type="text"
              placeholder="Search for role"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 bg-transparent font-sans text-[16px] text-foreground shadow-none outline-none placeholder:text-muted-foreground focus-visible:ring-0"
            />
          </div>
        </div>
      </div>

      {/* Vacancy grid */}
      {filteredVacancies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredVacancies.map((vacancy) => (
            <VacancyCard key={vacancy.id} vacancy={vacancy} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="font-sans text-muted-foreground text-[16px]">
            No open roles match your search. Try a different keyword.
          </p>
        </div>
      )}
    </section>
  );
}
