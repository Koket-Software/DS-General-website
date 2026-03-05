import { Link } from "@tanstack/react-router";

import svgPaths from "../../../../imports/svg-x78xrehz02";

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
      <section className="max-w-360 mx-auto px-6 md:px-24 py-10">
        <div className="h-96 bg-muted/50 animate-pulse" />
      </section>
    );
  }

  if (blogQuery.isError || !blogQuery.data?.data) {
    return (
      <section className="max-w-360 mx-auto px-6 md:px-24 py-16 text-center">
        <p className="font-sans text-muted-foreground text-[18px] mb-6">
          This article was not found.
        </p>
        <Link
          to="/articles"
          className="font-sans font-medium text-primary text-[16px] no-underline hover:opacity-80"
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
    <section className="max-w-360 mx-auto px-6 md:px-24">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 items-start lg:items-center pt-6 pb-6">
        <div className="flex items-center gap-4 lg:w-[60%]">
          <Link
            to="/articles"
            className="flex items-center gap-4 text-primary font-sans text-[16px] no-underline hover:opacity-80 transition-opacity"
          >
            <ArrowLeft />
            <span>Articles</span>
          </Link>
          <div className="flex-1 h-px bg-primary" />
        </div>

        <div className="hidden lg:flex items-center gap-4 lg:w-[40%] lg:pl-6">
          <span className="font-sans text-[16px] text-primary shrink-0">
            More Like This
          </span>
          <div className="flex-1 h-px bg-primary" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 pb-16">
        <div className="lg:w-[60%] flex flex-col gap-6">
          <div className="w-full h-70 md:h-90.25 relative overflow-hidden bg-muted/40">
            {article.featuredImageUrl ? (
              <img
                src={article.featuredImageUrl}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : null}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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
            <div className="bg-muted px-3 py-2 rounded-xl">
              <span className="font-sans text-[16px] text-muted-foreground">
                {article.tags[0]?.name ?? "Article"}
              </span>
            </div>
          </div>

          <h1 className="font-sans font-bold text-foreground text-[28px] md:text-[36px] leading-[1.2]">
            {article.title}
          </h1>

          <LexicalViewer content={article.content} />

          <div className="h-px bg-primary/15 w-full" />

          <div className="flex items-center gap-4">
            <div className="w-10.5 h-10.5 rounded-full bg-muted/60 overflow-hidden">
              {article.author?.image ? (
                <img
                  src={article.author.image}
                  alt={article.author.name}
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-sans font-bold text-foreground text-[16px] capitalize">
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
                  <span className="font-sans text-[14px] text-primary underline lowercase">
                    {article.author.socials[0].handle || "Author Social"}
                  </span>
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="lg:w-[40%] lg:pl-6">
          <div className="lg:hidden flex items-center gap-4 mb-6">
            <span className="font-sans text-[16px] text-primary shrink-0">
              More Like This
            </span>
            <div className="flex-1 h-px bg-primary" />
          </div>

          <div className="flex flex-col gap-5">
            {related.map((item) => (
              <Link
                key={item.id}
                to="/articles/$slug"
                params={{ slug: item.slug }}
                className="flex items-start border border-border/60 group cursor-pointer no-underline w-full hover:shadow-sm transition-shadow"
              >
                <div className="w-35 h-40 relative shrink-0 overflow-hidden bg-muted/40">
                  {item.featuredImageUrl ? (
                    <img
                      src={item.featuredImageUrl}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : null}
                </div>
                <div className="flex flex-col gap-2 p-4 flex-1">
                  <p className="font-sans text-[14px] text-muted-foreground">
                    {item.publishDate
                      ? new Date(item.publishDate).toLocaleDateString()
                      : new Date(item.createdAt).toLocaleDateString()}
                  </p>
                  <p className="font-sans font-semibold text-[16px] text-foreground line-clamp-2">
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
