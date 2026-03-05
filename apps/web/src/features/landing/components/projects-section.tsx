import { SectionHeader } from "./section-header";

import { usePublicCaseStudiesQuery } from "@/lib/case-study/case-study-query";

interface ProjectCardProps {
  image: string | null;
  date: string;
  title: string;
  wide?: boolean;
}

function ProjectCard({ image, date, title, wide }: ProjectCardProps) {
  return (
    <div
      className={`border border-border/60 flex flex-col overflow-hidden ${wide ? "flex-[1.4]" : "flex-1"}`}
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
    </div>
  );
}

export function ProjectsSection() {
  const projectsQuery = usePublicCaseStudiesQuery({ page: 1, limit: 6 });
  const projects = projectsQuery.data?.data ?? [];

  const firstRow = projects.slice(0, 3);
  const secondRow = projects.slice(3, 6);

  return (
    <section className="max-w-360 mx-auto px-6 md:px-24 py-16 md:py-24">
      <SectionHeader
        label="/Featured Project"
        title="Explore the works we have done with our trusted partners"
      />

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
                    image={project.featuredImage}
                    date={new Date(project.createdAt).toLocaleDateString()}
                    title={project.title}
                    wide={index === 0}
                  />
                ))}
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                {secondRow.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    image={project.featuredImage}
                    date={new Date(project.createdAt).toLocaleDateString()}
                    title={project.title}
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
