import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect } from "react";

import { Input } from "@/components/ui/input";
import {
  publicVacanciesQueryOptions,
  usePublicVacanciesQuery,
} from "@/lib/vacancies/vacancies-query";
import type { PublicVacancy } from "@/lib/vacancies/vacancies-schema";
import { Route as CareerRoute } from "@/routes/_landing/career";

function formatDate(value: string | null) {
  if (!value) return "Open until filled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Open until filled";
  return date.toLocaleDateString();
}

function vacancyTypeLabel(vacancy: PublicVacancy) {
  if (vacancy.employmentType) {
    return vacancy.employmentType.replaceAll("_", " ");
  }

  return vacancy.workplaceType?.replaceAll("_", " ") ?? "Open Role";
}

function VacancyCard({ vacancy }: { vacancy: PublicVacancy }) {
  return (
    <Link
      to="/career/$slug"
      params={{ slug: vacancy.slug }}
      className="relative border border-border/60 overflow-hidden group hover:border-primary/40 transition-colors no-underline block"
    >
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

      <div className="relative flex flex-col justify-end p-6 md:p-8 min-h-[200px]">
        <div className="flex flex-col gap-3.5 max-w-full">
          <div className="flex flex-col gap-1">
            <p className="font-sans font-medium text-foreground text-[18px] md:text-[20px]">
              {vacancy.title}
            </p>
            <p className="font-sans text-muted-foreground text-[14px] line-clamp-2">
              {vacancy.excerpt ?? vacancy.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-4 md:gap-6 font-sans text-muted-foreground text-[14px] uppercase">
            {vacancy.department ? <span>{vacancy.department}</span> : null}
            {vacancy.location ? <span>{vacancy.location}</span> : null}
            <span>{vacancyTypeLabel(vacancy)}</span>
          </div>
          <p className="font-sans text-foreground text-[12px]">
            Deadline: {formatDate(vacancy.deadlineAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function CareerSection() {
  const navigate = useNavigate();
  const search = CareerRoute.useSearch();
  const queryClient = useQueryClient();

  const page = search.page ?? 1;
  const limit = search.limit ?? 10;

  const vacanciesQuery = usePublicVacanciesQuery({
    page,
    limit,
    search: search.search,
    openOnly: search.openOnly,
    sortBy: search.sortBy,
    sortOrder: search.sortOrder,
  });

  useEffect(() => {
    const pagination = vacanciesQuery.data?.meta?.pagination;
    const totalPages = pagination?.totalPages ?? 1;
    if (!pagination || pagination.page >= totalPages) {
      return;
    }

    const nextPage = pagination.page + 1;
    void queryClient.prefetchQuery(
      publicVacanciesQueryOptions({
        page: nextPage,
        limit,
        search: search.search,
        openOnly: search.openOnly,
        sortBy: search.sortBy,
        sortOrder: search.sortOrder,
      }),
    );
  }, [
    limit,
    queryClient,
    search.openOnly,
    search.search,
    search.sortBy,
    search.sortOrder,
    vacanciesQuery.data?.meta?.pagination,
  ]);

  const vacancies = vacanciesQuery.data?.data ?? [];
  const pagination = vacanciesQuery.data?.meta?.pagination;
  const currentPage = pagination?.page ?? page;
  const totalPages = pagination?.totalPages ?? 1;

  const onSearchChange = (value: string) => {
    navigate({
      to: "/career",
      search: {
        ...search,
        page: 1,
        search: value.trim() ? value : undefined,
      },
    });
  };

  const onOpenOnlyChange = (openOnly: boolean | undefined) => {
    navigate({
      to: "/career",
      search: {
        ...search,
        page: 1,
        openOnly,
      },
    });
  };

  const onPageChange = (nextPage: number) => {
    navigate({
      to: "/career",
      search: {
        ...search,
        page: nextPage,
      },
    });
  };

  return (
    <section className="landing-container landing-section-compact">
      <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-16 mb-10 md:mb-14">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="font-sans text-muted-foreground text-[16px] uppercase">
              /Careers
            </p>
            <h1 className="font-sans font-semibold text-foreground text-[32px] md:text-[40px] capitalize leading-[1.15]">
              Explore open roles and learn how you can help us serve.
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenOnlyChange(undefined)}
              className={`px-3 py-1.5 text-sm border transition-colors ${
                search.openOnly
                  ? "border-border/60 text-muted-foreground"
                  : "border-primary text-primary"
              }`}
            >
              All Roles
            </button>
            <button
              type="button"
              onClick={() => onOpenOnlyChange(true)}
              className={`px-3 py-1.5 text-sm border transition-colors ${
                search.openOnly
                  ? "border-primary text-primary"
                  : "border-border/60 text-muted-foreground"
              }`}
            >
              Open Roles
            </button>
          </div>
        </div>

        <div className="w-full lg:w-[480px] xl:w-[606px] shrink-0">
          <div className="border border-border/60 flex items-center px-4 py-3 gap-3">
            <Search size={18} className="text-muted-foreground shrink-0" />
            <Input
              type="search"
              placeholder="Search for role"
              value={search.search ?? ""}
              onChange={(event) => onSearchChange(event.target.value)}
              className="border-0 bg-transparent font-sans text-[16px] text-foreground shadow-none outline-none placeholder:text-muted-foreground focus-visible:ring-0"
            />
          </div>
        </div>
      </div>

      {vacanciesQuery.isError ? (
        <div className="text-center py-20">
          <p className="font-sans text-muted-foreground text-[16px]">
            We could not load vacancies right now.
          </p>
        </div>
      ) : vacanciesQuery.isPending ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="min-h-[200px] border border-border/60 bg-muted/50 animate-pulse"
            />
          ))}
        </div>
      ) : vacancies.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vacancies.map((vacancy) => (
              <VacancyCard key={vacancy.id} vacancy={vacancy} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="h-9 px-3 border border-border/60 disabled:opacity-40"
            >
              Prev
            </button>
            <span className="font-sans text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage >= totalPages}
              className="h-9 px-3 border border-border/60 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
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
