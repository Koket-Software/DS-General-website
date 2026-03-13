import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

import { AppImage } from "@/components/common/AppImage";
import {
  MediaPreviewDialog,
  type PreviewMediaItem,
} from "@/components/common/MediaPreviewDialog";
import { LexicalViewer } from "@/components/common/rich-text/LexicalViewer";
import {
  publicCaseStudyDetailQueryOptions,
  usePublicCaseStudiesQuery,
  usePublicCaseStudyDetailQuery,
} from "@/lib/case-study/case-study-query";
import { formatPublicDate } from "@/lib/public-date";

interface ProjectDetailSectionProps {
  slug?: string;
}

const containsHtml = (value: string) => /<[^>]+>/.test(value);

function TextBlock({
  title,
  content,
}: {
  title: string;
  content: string | null;
}) {
  if (!content) {
    return null;
  }

  return (
    <article className="space-y-3 border border-border/60 p-5 md:p-6">
      <h3 className="font-sans text-[18px] font-semibold text-foreground md:text-[20px]">
        {title}
      </h3>
      <p className="whitespace-pre-wrap font-sans text-[15px] leading-[1.8] text-muted-foreground md:text-[16px]">
        {content}
      </p>
    </article>
  );
}

export function ProjectDetailSection({ slug }: ProjectDetailSectionProps) {
  const queryClient = useQueryClient();
  const [activePreviewId, setActivePreviewId] = useState<string | null>(null);
  const projectQuery = usePublicCaseStudyDetailQuery(slug ?? "");
  const otherProjectsQuery = usePublicCaseStudiesQuery({ page: 1, limit: 8 });

  const prefetchProjectDetail = (projectSlug: string) => {
    void queryClient.prefetchQuery(
      publicCaseStudyDetailQueryOptions(projectSlug),
    );
  };

  if (projectQuery.isPending) {
    return (
      <section className="landing-container landing-section-compact">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="aspect-square bg-muted/50 animate-pulse" />
          <div className="aspect-square bg-muted/50 animate-pulse" />
        </div>
        <div className="mt-8 h-56 bg-muted/50 animate-pulse" />
      </section>
    );
  }

  if (projectQuery.isError || !projectQuery.data?.data) {
    return (
      <section className="landing-container landing-section text-center">
        <p className="mb-6 font-sans text-[18px] text-muted-foreground">
          This client project was not found.
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 font-sans text-[16px] font-medium text-primary no-underline hover:opacity-80"
        >
          <ArrowLeft size={16} />
          <span>Back to Client Projects</span>
        </Link>
      </section>
    );
  }

  const project = projectQuery.data.data;
  const orderedImages = (project.images ?? []).toSorted(
    (a, b) => a.position - b.position,
  );

  const previewItems: PreviewMediaItem[] = orderedImages
    .map((image, index) => ({
      id: `${project.id}-${image.position}-${index}`,
      type: "image" as const,
      src: image.imageUrl,
      alt: image.caption || `${project.title} image ${index + 1}`,
      title: project.title,
      description: project.excerpt ?? undefined,
    }))
    .filter((item) => item.src);

  const activePreviewIndex =
    activePreviewId === null
      ? 0
      : Math.max(
          previewItems.findIndex((item) => item.id === activePreviewId),
          0,
        );

  const primaryImage = orderedImages[0]?.imageUrl ?? null;
  const otherProjects = (otherProjectsQuery.data?.data ?? [])
    .filter((item) => item.slug !== project.slug)
    .toSorted(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return (
    <section className="landing-container landing-section-compact">
      <div className="flex items-center gap-4 pb-6 md:pb-8">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 font-sans text-[15px] text-primary no-underline hover:opacity-80"
        >
          <ArrowLeft size={16} />
          <span>Client projects</span>
        </Link>
        <div className="h-px flex-1 bg-primary/20" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        {primaryImage && previewItems.length > 0 ? (
          <button
            type="button"
            onClick={() =>
              setActivePreviewId(String(previewItems[0]?.id ?? ""))
            }
            className="group relative aspect-square overflow-hidden border border-border/60 bg-muted/40 text-left touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
            aria-label={`Open media preview for ${project.title}`}
          >
            <AppImage
              src={primaryImage}
              alt={project.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 motion-reduce:transition-none motion-reduce:group-hover:scale-100 group-hover:scale-[1.02]"
              priority
            />
          </button>
        ) : (
          <div className="relative aspect-square overflow-hidden border border-border/60 bg-muted/40">
            {primaryImage ? (
              <AppImage
                src={primaryImage}
                alt={project.title}
                className="absolute inset-0 h-full w-full object-cover"
                priority
              />
            ) : null}
          </div>
        )}

        <div className="flex aspect-square flex-col justify-between border border-border/60 p-6 md:p-8">
          <div className="space-y-4">
            <p className="font-sans text-[14px] uppercase tracking-wide text-muted-foreground">
              /Client projects
            </p>
            <h1 className="font-sans text-[28px] font-semibold leading-[1.2] text-foreground md:text-[40px]">
              {project.title}
            </h1>
            <p className="font-sans text-[15px] leading-[1.7] text-muted-foreground md:text-[16px]">
              {project.excerpt ??
                "Explore this project delivery from challenge to measurable outcomes."}
            </p>
          </div>

          <div className="space-y-1 pt-4 font-sans text-[13px] uppercase tracking-wide text-muted-foreground">
            <p>Published: {formatPublicDate(project.createdAt, "N/A")}</p>
            <p>Updated: {formatPublicDate(project.updatedAt, "N/A")}</p>
          </div>
        </div>
      </div>

      <div className="mt-10 border border-border/60 p-6 md:p-10">
        <h2 className="mb-5 font-sans text-[22px] font-semibold text-foreground md:text-[30px]">
          Project Overview
        </h2>

        {project.overview ? (
          containsHtml(project.overview) ? (
            <LexicalViewer content={project.overview} />
          ) : (
            <p className="whitespace-pre-wrap font-sans text-[15px] leading-[1.8] text-muted-foreground md:text-[16px]">
              {project.overview}
            </p>
          )
        ) : (
          <p className="font-sans text-[15px] text-muted-foreground">
            No overview is available for this project yet.
          </p>
        )}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextBlock title="Project Scope" content={project.projectScope} />
        <TextBlock title="Problem" content={project.problem} />

        <article className="space-y-3 border border-border/60 p-5 md:p-6">
          <h3 className="font-sans text-[18px] font-semibold text-foreground md:text-[20px]">
            Process
          </h3>
          {project.process ? (
            containsHtml(project.process) ? (
              <LexicalViewer content={project.process} />
            ) : (
              <p className="whitespace-pre-wrap font-sans text-[15px] leading-[1.8] text-muted-foreground md:text-[16px]">
                {project.process}
              </p>
            )
          ) : (
            <p className="font-sans text-[15px] text-muted-foreground">
              No process details provided yet.
            </p>
          )}
        </article>

        <TextBlock title="Impact" content={project.impact} />
        <TextBlock title="Deliverables" content={project.deliverable} />
      </div>

      <div className="mt-10 border border-border/60 p-6 md:p-8">
        <h2 className="mb-5 font-sans text-[22px] font-semibold text-foreground md:text-[30px]">
          Project Metadata
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="border border-border/60 p-4">
            <p className="font-sans text-[12px] uppercase tracking-wide text-muted-foreground">
              Client
            </p>
            <p className="mt-2 font-sans text-[16px] font-medium text-foreground">
              {project.client?.title ?? "Unspecified"}
            </p>
          </div>

          <div className="border border-border/60 p-4">
            <p className="font-sans text-[12px] uppercase tracking-wide text-muted-foreground">
              Service
            </p>
            <p className="mt-2 font-sans text-[16px] font-medium text-foreground">
              {project.service?.title ?? "Unspecified"}
            </p>
          </div>

          <div className="border border-border/60 p-4">
            <p className="font-sans text-[12px] uppercase tracking-wide text-muted-foreground">
              Tags
            </p>
            {project.tags.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center border border-primary/20 bg-primary/5 px-2 py-1 font-sans text-[12px] text-primary"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 font-sans text-[16px] text-muted-foreground">
                No tags
              </p>
            )}
          </div>
        </div>
      </div>

      {orderedImages.length > 0 ? (
        <div className="mt-10">
          <div className="mb-5 flex items-center gap-4">
            <h2 className="shrink-0 font-sans text-[22px] font-semibold text-foreground md:text-[30px]">
              Project Gallery
            </h2>
            <div className="h-px flex-1 bg-primary/20" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {orderedImages.map((image, index) => (
              <button
                key={`${image.imageUrl}-${image.position}`}
                type="button"
                onClick={() =>
                  setActivePreviewId(`${project.id}-${image.position}-${index}`)
                }
                className="group relative aspect-square overflow-hidden border border-border/60 bg-muted/40 text-left touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
                aria-label={`Open media ${index + 1} for ${project.title}`}
              >
                <AppImage
                  src={image.imageUrl}
                  alt={image.caption || `${project.title} image ${index + 1}`}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 motion-reduce:transition-none motion-reduce:group-hover:scale-100 group-hover:scale-[1.02]"
                />
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-12">
        <div className="mb-5 flex items-center gap-4">
          <h2 className="shrink-0 font-sans text-[22px] font-semibold text-foreground md:text-[30px]">
            Other Client Projects
          </h2>
          <div className="h-px flex-1 bg-primary/20" />
        </div>

        {otherProjectsQuery.isError ? (
          <p className="font-sans text-[15px] text-muted-foreground">
            Other projects are unavailable right now.
          </p>
        ) : otherProjectsQuery.isPending ? (
          <div
            className="overflow-x-auto pb-2 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex w-max flex-nowrap gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`other-project-skeleton-${index}`}
                  className="h-[18rem] w-[min(20rem,85vw)] shrink-0 border border-border/60 bg-muted/50 animate-pulse md:w-[22rem]"
                />
              ))}
            </div>
          </div>
        ) : !otherProjects.length ? (
          <p className="font-sans text-[15px] text-muted-foreground">
            No other projects found.
          </p>
        ) : (
          <div
            className="overflow-x-auto pb-2 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex w-max flex-nowrap gap-4">
              {otherProjects.map((item) => (
                <article
                  key={item.id}
                  className="group flex h-[18rem] w-[min(20rem,85vw)] shrink-0 flex-col justify-between border border-border/60 p-5 md:w-[22rem]"
                >
                  <div className="space-y-3">
                    <p className="font-sans text-[13px] text-muted-foreground">
                      {formatPublicDate(item.createdAt)}
                    </p>

                    <h3 className="font-sans text-[18px] font-semibold text-foreground md:text-[20px]">
                      {item.title}
                    </h3>
                    <p className="line-clamp-4 font-sans text-[14px] leading-[1.6] text-muted-foreground md:text-[15px]">
                      {item.excerpt ??
                        "Explore how this project was delivered with measurable impact."}
                    </p>
                  </div>

                  <Link
                    to="/projects/$slug"
                    params={{ slug: item.slug }}
                    onMouseEnter={() => prefetchProjectDetail(item.slug)}
                    onFocus={() => prefetchProjectDetail(item.slug)}
                    className="mt-4 inline-flex items-center gap-2 font-sans text-[14px] font-medium text-primary no-underline group-hover:opacity-80"
                  >
                    <span>Learn More</span>
                    <ArrowRight size={16} />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>

      <MediaPreviewDialog
        open={activePreviewId !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setActivePreviewId(null);
          }
        }}
        items={previewItems}
        initialIndex={activePreviewIndex}
        title={`${project.title} Media`}
        description={project.excerpt ?? undefined}
      />
    </section>
  );
}
