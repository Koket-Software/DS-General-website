import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { AppImage } from "@/components/common/AppImage";
import {
  publicCaseStudyDetailQueryOptions,
  usePublicCaseStudiesQuery,
} from "@/lib/case-study/case-study-query";
import { formatPublicDate } from "@/lib/public-date";

const FALLBACK_EXCERPT =
  "Practical project execution delivered with measurable outcomes.";

function ProjectsPageSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 md:gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={`project-page-skeleton-${index}`}
          className="overflow-hidden border border-border/60 bg-muted/40"
        >
          <div className="aspect-[4/3] animate-pulse bg-muted/70" />
          <div className="space-y-3 p-5 md:p-6">
            <div className="h-5 w-3/4 animate-pulse bg-muted/70" />
            <div className="h-4 w-full animate-pulse bg-muted/70" />
            <div className="h-4 w-4/5 animate-pulse bg-muted/70" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProjectsPageSection() {
  const queryClient = useQueryClient();
  const projectsQuery = usePublicCaseStudiesQuery({ page: 1, limit: 12 });
  const projects = projectsQuery.data?.data ?? [];

  const prefetchProjectDetail = (slug: string) => {
    void queryClient.prefetchQuery(publicCaseStudyDetailQueryOptions(slug));
  };

  return (
    <section className="landing-container landing-section-compact">
      <div className="mb-10 grid gap-6 border-b border-primary/20 pb-8 md:mb-14 md:grid-cols-[minmax(0,1fr)_15rem] md:items-end md:pb-10">
        <div className="space-y-3">
          <p className="font-sans text-[14px] uppercase tracking-[0.16em] text-muted-foreground md:text-[15px]">
            /Client projects
          </p>
          <h1 className="max-w-[18ch] font-sans text-[32px] font-semibold leading-[1.1] text-foreground md:text-[44px]">
            Proven Project Delivery Across Our Client Portfolio
          </h1>
          <p className="max-w-[58ch] font-sans text-[15px] leading-[1.7] text-muted-foreground md:text-[16px]">
            Explore selected engagements with real-world constraints, practical
            execution, and measurable outcomes for our partners.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 border border-border/60 bg-primary/5 p-4 md:p-5">
          <p className="font-sans text-[12px] uppercase tracking-[0.15em] text-muted-foreground">
            Project Catalog
          </p>
          <p className="font-sans text-[34px] font-semibold leading-none text-foreground">
            {projects.length}
          </p>
          <p className="font-sans text-[13px] leading-[1.5] text-muted-foreground">
            Published case studies currently available.
          </p>
        </div>
      </div>

      {projectsQuery.isError ? (
        <div className="border border-border/60 bg-muted/30 p-8 text-center md:p-10">
          <p className="font-sans text-[16px] text-muted-foreground">
            Unable to load client projects right now. Please refresh and try
            again.
          </p>
        </div>
      ) : projectsQuery.isPending ? (
        <ProjectsPageSkeleton />
      ) : projects.length === 0 ? (
        <div className="border border-border/60 bg-muted/30 p-8 text-center md:p-10">
          <p className="font-sans text-[16px] text-muted-foreground">
            No client projects are published yet. Please check back soon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 md:gap-6">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              to="/projects/$slug"
              params={{ slug: project.slug }}
              onMouseEnter={() => prefetchProjectDetail(project.slug)}
              onFocus={() => prefetchProjectDetail(project.slug)}
              className="group relative block overflow-hidden border border-border/60 bg-background no-underline transition-colors hover:border-primary/45"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted/40">
                {project.featuredImage ? (
                  <AppImage
                    src={project.featuredImage}
                    alt={project.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    width={1200}
                    height={900}
                    sizes="(min-width: 1280px) 22vw, (min-width: 640px) 44vw, 100vw"
                    priority={index === 0}
                  />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-primary/8 to-transparent" />
                )}

                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-black/5 to-transparent opacity-75 transition-opacity duration-300 group-hover:opacity-90" />

                <div className="absolute left-3 top-3 border border-white/35 bg-black/25 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-white backdrop-blur-sm">
                  Project
                </div>
                <div className="absolute right-3 top-3 border border-white/35 bg-black/25 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>

              <div className="relative flex min-h-[13rem] flex-col gap-4 p-5 md:min-h-[14rem] md:p-6">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-[12px] text-muted-foreground">
                  <span>{formatPublicDate(project.createdAt)}</span>
                  {project.clientName ? (
                    <>
                      <span aria-hidden>&bull;</span>
                      <span>{project.clientName}</span>
                    </>
                  ) : null}
                </div>

                <h2 className="font-sans text-[20px] font-semibold leading-[1.25] text-foreground md:text-[22px]">
                  {project.title}
                </h2>

                <p className="line-clamp-3 font-sans text-[14px] leading-[1.7] text-muted-foreground md:text-[15px]">
                  {project.excerpt ?? FALLBACK_EXCERPT}
                </p>

                <div className="mt-auto inline-flex items-center gap-2 font-sans text-[14px] font-semibold text-primary">
                  <span>View Details</span>
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>

                <div className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-primary/60 transition-all duration-300 group-hover:w-full" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
