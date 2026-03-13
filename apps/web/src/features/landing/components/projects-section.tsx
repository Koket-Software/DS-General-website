import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { SectionHeader } from "./section-header";

import {
  publicCaseStudyDetailQueryOptions,
  usePublicCaseStudiesQuery,
} from "@/lib/case-study/case-study-query";
import { formatPublicDate } from "@/lib/public-date";

interface ProjectCardProps {
  slug: string;
  image: string | null;
  date: string;
  title: string;
  onPrefetch: (slug: string) => void;
  wide?: boolean;
}

function ProjectCard({
  slug,
  image,
  date,
  title,
  onPrefetch,
  wide,
}: ProjectCardProps) {
  return (
    <Link
      to="/projects/$slug"
      params={{ slug }}
      onMouseEnter={() => onPrefetch(slug)}
      onFocus={() => onPrefetch(slug)}
      className={`border border-border/60 flex flex-col overflow-hidden no-underline ${wide ? "flex-[1.4]" : "flex-1"}`}
    >
      <div className="h-50 relative bg-muted/40">
        {image ? (
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : null}
      </div>
      <div className="p-4 flex flex-col gap-2">
        <p className="font-sans font-normal text-muted-foreground text-[14px]">
          {date}
        </p>
        <p className="font-sans font-semibold text-foreground text-[16px]">
          {title}
        </p>
      </div>
    </Link>
  );
}

export function ProjectsSection() {
  const queryClient = useQueryClient();
  const projectsQuery = usePublicCaseStudiesQuery({ page: 1, limit: 6 });
  const projects = projectsQuery.data?.data ?? [];

  const firstRow = projects.slice(0, 3);
  const secondRow = projects.slice(3, 6);

  const prefetchProjectDetail = (slug: string) => {
    void queryClient.prefetchQuery(publicCaseStudyDetailQueryOptions(slug));
  };

  return (
    <section className="landing-container landing-section">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionHeader
          label="/Featured Project"
          title="Explore the works we have done with our trusted partners"
        />
        <Link
          to="/projects"
          className="inline-flex w-fit items-center border border-border/60 px-4 py-2 font-sans text-[14px] font-medium text-foreground no-underline transition-colors hover:border-primary/50 hover:text-primary"
        >
          View All
        </Link>
      </div>

      {projectsQuery.isError ? (
        <div className="mt-10 text-sm text-muted-foreground">
          Unable to load featured projects right now.
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-6">
          {projectsQuery.isPending ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-64 border border-border/60 bg-muted/50 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row gap-6">
                {firstRow.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    slug={project.slug}
                    image={project.featuredImage}
                    date={formatPublicDate(project.createdAt)}
                    title={project.title}
                    onPrefetch={prefetchProjectDetail}
                    wide={index === 0}
                  />
                ))}
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                {secondRow.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    slug={project.slug}
                    image={project.featuredImage}
                    date={formatPublicDate(project.createdAt)}
                    title={project.title}
                    onPrefetch={prefetchProjectDetail}
                    wide={index === 2}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
