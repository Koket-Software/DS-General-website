import { Link } from "@tanstack/react-router";

import svgPaths from "../../../../imports/svg-x78xrehz02";

import { AppImage } from "@/components/common/AppImage";
import { LexicalViewer } from "@/components/common/rich-text/LexicalViewer";
import {
  usePublicBlogBySlugQuery,
  usePublicBlogsQuery,
} from "@/lib/blogs/blogs-query";

function ArrowLeft() {
  return (
    <svg width="18" height="16" fill="none" viewBox="0 0 18.0014 16.0009">
      <path d={svgPaths.p90fbd00} fill="var(--primary)" />
    </svg>
  );
}

function XLogo() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
      <path d={svgPaths.pf203100} fill="var(--primary)" />
    </svg>
  );
}

interface ArticleDetailSectionProps {
  slug?: string;
}

export function ArticleDetailSection({ slug }: ArticleDetailSectionProps) {
  const blogQuery = usePublicBlogBySlugQuery(slug ?? "");
  const relatedQuery = usePublicBlogsQuery({
    page: 1,
    limit: 4,
    sortBy: "publishDate",
    sortOrder: "desc",
  });

  if (blogQuery.isPending) {
    return (
      <section className="landing-container landing-section-compact">
        <div className="h-96 animate-pulse bg-muted/50" />
      </section>
    );
  }

  if (blogQuery.isError || !blogQuery.data?.data) {
    return (
      <section className="landing-container landing-section text-center">
        <p className="mb-6 font-sans text-[18px] text-muted-foreground">
          This article was not found.
        </p>
        <Link
          to="/articles"
          className="font-sans text-[16px] font-medium text-primary no-underline hover:opacity-80"
        >
          &larr; Back to Articles
        </Link>
      </section>
    );
  }

  const article = blogQuery.data.data;
  const related = (relatedQuery.data?.data ?? [])
    .filter((item) => item.slug !== article.slug)
    .slice(0, 3);

  return (
    <section className="landing-container">
      <div className="flex flex-col items-start gap-4 pb-6 pt-6 lg:flex-row lg:items-center lg:gap-0">
        <div className="flex items-center gap-4 lg:w-[60%]">
          <Link
            to="/articles"
            className="flex items-center gap-4 font-sans text-[16px] text-primary no-underline transition-opacity hover:opacity-80"
          >
            <ArrowLeft />
            <span>Articles</span>
          </Link>
          <div className="h-px flex-1 bg-primary" />
        </div>

        <div className="hidden items-center gap-4 lg:flex lg:w-[40%] lg:pl-6">
          <span className="shrink-0 font-sans text-[16px] text-primary">
            More Like This
          </span>
          <div className="h-px flex-1 bg-primary" />
        </div>
      </div>

      <div className="flex flex-col gap-8 pb-16 lg:flex-row">
        <div className="flex flex-col gap-6 lg:w-[60%]">
          <div className="relative h-70 w-full overflow-hidden bg-muted/40 md:h-90.25">
            {article.featuredImageUrl ? (
              <AppImage
                src={article.featuredImageUrl}
                alt={article.title}
                className="absolute inset-0 h-full w-full object-cover"
                width={1600}
                height={900}
                sizes="(min-width: 1024px) 60vw, 100vw"
                priority
              />
            ) : null}
          </div>

          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-0 font-sans text-muted-foreground">
              <span className="text-[16px]">
                {article.publishDate
                  ? new Date(article.publishDate).toLocaleDateString()
                  : new Date(article.createdAt).toLocaleDateString()}
              </span>
              <span className="mx-2 text-[14px]">&bull;</span>
              <span className="text-[16px]">
                {article.readTimeMinutes
                  ? `${article.readTimeMinutes} min read`
                  : "5 min read"}
              </span>
            </div>
            <div className="rounded-xl bg-muted px-3 py-2">
              <span className="font-sans text-[16px] text-muted-foreground">
                {article.tags[0]?.name ?? "Article"}
              </span>
            </div>
          </div>

          <h1 className="font-sans text-[28px] font-bold leading-[1.2] text-foreground md:text-[36px]">
            {article.title}
          </h1>

          <LexicalViewer content={article.content} />

          <div className="h-px w-full bg-primary/15" />

          <div className="flex items-center gap-4">
            <div className="h-10.5 w-10.5 overflow-hidden rounded-full bg-muted/60">
              {article.author?.image ? (
                <AppImage
                  src={article.author.image}
                  alt={article.author.name}
                  className="h-full w-full object-cover"
                  width={96}
                  height={96}
                  sizes="42px"
                  loading="lazy"
                />
              ) : null}
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-sans text-[16px] font-bold capitalize text-foreground">
                {article.author?.name ?? "DS General PLC Insights Team"}
              </p>
              {article.author?.socials?.[0]?.fullUrl ? (
                <a
                  href={article.author.socials[0].fullUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 no-underline"
                >
                  <XLogo />
                  <span className="font-sans text-[14px] lowercase text-primary underline">
                    {article.author.socials[0].handle || "Author Social"}
                  </span>
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="lg:w-[40%] lg:pl-6">
          <div className="mb-6 flex items-center gap-4 lg:hidden">
            <span className="shrink-0 font-sans text-[16px] text-primary">
              More Like This
            </span>
            <div className="h-px flex-1 bg-primary" />
          </div>

          <div className="flex flex-col gap-5">
            {related.map((item) => (
              <Link
                key={item.id}
                to="/articles/$slug"
                params={{ slug: item.slug }}
                className="group flex w-full cursor-pointer items-start border border-border/60 no-underline transition-shadow hover:shadow-sm"
              >
                <div className="relative h-40 w-35 shrink-0 overflow-hidden bg-muted/40">
                  {item.featuredImageUrl ? (
                    <AppImage
                      src={item.featuredImageUrl}
                      alt={item.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      width={560}
                      height={640}
                      sizes="140px"
                      loading="lazy"
                    />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <p className="font-sans text-[14px] text-muted-foreground">
                    {item.publishDate
                      ? new Date(item.publishDate).toLocaleDateString()
                      : new Date(item.createdAt).toLocaleDateString()}
                  </p>
                  <p className="line-clamp-2 font-sans text-[16px] font-semibold text-foreground">
                    {item.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
