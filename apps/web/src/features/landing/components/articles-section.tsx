import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useDebounce } from "use-debounce";

import { resolveSocialIcon } from "./icons";
import {
  getLandingSocials,
  shouldUseResolvedLandingSocialIcon,
} from "./socials";
import svgPaths from "../../../../imports/svg-yczk9mkqx7";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  publicBlogBySlugQueryOptions,
  usePublicBlogsQuery,
} from "@/lib/blogs/blogs-query";
import type { PublicBlog } from "@/lib/blogs/blogs-schema";
import { formatPublicDate } from "@/lib/public-date";
import { usePublicSocialsQuery } from "@/lib/socials/socials-query";
import { usePublicTagsQuery } from "@/lib/tags/tags-query";
import { Route as ArticlesRoute } from "@/routes/_landing/articles";

function CaretLeft() {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path d={svgPaths.p204a5580} fill="var(--primary)" />
    </svg>
  );
}

function CaretRight() {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path d={svgPaths.p2c0b8700} fill="var(--primary)" />
    </svg>
  );
}

export function ArticleCard({ article }: { article: PublicBlog }) {
  const queryClient = useQueryClient();

  const prefetch = () => {
    void queryClient.prefetchQuery(publicBlogBySlugQueryOptions(article.slug));
  };

  return (
    <Link
      to="/articles/$slug"
      params={{ slug: article.slug }}
      className="flex flex-col border border-border/60 group cursor-pointer no-underline"
      onMouseEnter={prefetch}
      onFocus={prefetch}
    >
      <div className="h-40 relative overflow-hidden bg-muted/40">
        {article.featuredImageUrl ? (
          <img
            src={article.featuredImageUrl}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="flex flex-col gap-2 p-4">
        <p className="font-sans text-[14px] text-muted-foreground">
          {formatPublicDate(article.publishDate ?? article.createdAt)}
        </p>
        <p className="font-sans font-semibold text-[14px] text-foreground line-clamp-2">
          {article.title}
        </p>
      </div>
    </Link>
  );
}

export function ArticlesSection() {
  const navigate = useNavigate();
  const search = ArticlesRoute.useSearch();

  const [searchInput, setSearchInput] = useState(search.search ?? "");
  const [debouncedSearch] = useDebounce(searchInput, 300);

  const tagsQuery = usePublicTagsQuery({ page: 1, limit: 50 });
  const socialsQuery = usePublicSocialsQuery({ page: 1, limit: 6 });
  const articlesQuery = usePublicBlogsQuery({
    page: search.page,
    limit: search.limit,
    sortBy: search.sortBy,
    sortOrder: search.sortOrder,
    search: debouncedSearch || undefined,
    tagId: search.tagId,
  });

  const articles = articlesQuery.data?.data ?? [];
  const socials = getLandingSocials(socialsQuery.data?.data ?? []);
  const featuredArticle = articles[0];
  const otherArticles = articles.slice(1);

  const pagination = articlesQuery.data?.meta?.pagination;
  const currentPage = pagination?.page ?? search.page ?? 1;
  const totalPages = pagination?.totalPages ?? 1;

  const onPageChange = (page: number) => {
    navigate({
      to: "/articles",
      search: { ...search, page },
    });
  };

  const onTagToggle = (tagId?: number) => {
    navigate({
      to: "/articles",
      search: {
        ...search,
        page: 1,
        tagId,
      },
    });
  };

  return (
    <section className="landing-container">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start lg:items-end pt-8 pb-10">
        <div className="flex flex-col flex-1 gap-4">
          <div className="flex flex-col gap-2">
            <p className="font-sans font-normal text-muted-foreground text-[16px] uppercase">
              /articles
            </p>

            <h1 className="font-sans font-semibold text-foreground text-[40px] capitalize">
              Search for article posts
            </h1>
          </div>
          <div className="flex h-10.5 items-center w-full max-w-205.5">
            <div className="flex-1 h-full border border-border/60">
              <label htmlFor="article-search" className="sr-only">
                Search articles
              </label>
              <Input
                id="article-search"
                type="search"
                name="articleSearch"
                aria-label="Search articles"
                placeholder="Search for Articles"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="h-full w-full border-0 bg-transparent px-4 font-sans text-[16px] text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
              />
            </div>
            <Button
              variant="ghost"
              type="button"
              className="h-full shrink-0 bg-primary px-6 font-sans text-[16px] text-primary-foreground capitalize transition-colors hover:bg-primary/90"
              onClick={() => {
                navigate({
                  to: "/articles",
                  search: {
                    ...search,
                    page: 1,
                    search: searchInput.trim() || undefined,
                  },
                });
              }}
            >
              Search
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={search.tagId ? "outline" : "default"}
              type="button"
              size="sm"
              onClick={() => onTagToggle(undefined)}
            >
              All
            </Button>
            {(tagsQuery.data?.data ?? []).slice(0, 12).map((tag) => (
              <Button
                key={tag.id}
                variant={search.tagId === tag.id ? "default" : "outline"}
                type="button"
                size="sm"
                onClick={() => onTagToggle(tag.id)}
              >
                {tag.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex lg:mr-16 flex-col gap-4 items-start shrink-0">
          <p className="font-sans font-semibold text-[24px] text-foreground capitalize">
            Follow Us
          </p>
          <div className="flex gap-2 items-center lg:mr-24">
            {socialsQuery.isError ? (
              <p className="text-sm text-muted-foreground">
                Social links unavailable
              </p>
            ) : (
              socials.slice(0, 4).map((social) => (
                <a
                  key={social.id}
                  href={social.baseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.title}
                  className="bg-primary/5 flex h-10.5 w-10.5 items-center justify-center p-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  {social.iconUrl &&
                  !shouldUseResolvedLandingSocialIcon(social.title) ? (
                    <img
                      src={social.iconUrl}
                      alt={social.title}
                      className="h-5 w-5 object-contain"
                    />
                  ) : (
                    resolveSocialIcon(social.title)
                  )}
                </a>
              ))
            )}
          </div>
        </div>
      </div>

      {articlesQuery.isError ? (
        <div className="text-sm text-muted-foreground mb-10">
          Failed to load articles.
        </div>
      ) : articlesQuery.isPending ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-64 border border-border/60 bg-muted/50 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          {featuredArticle ? (
            <Link
              to="/articles/$slug"
              params={{ slug: featuredArticle.slug }}
              className="bg-muted/50 flex flex-col md:flex-row h-auto md:h-90.25 mb-10 cursor-pointer group no-underline"
            >
              <div className="h-60 md:h-full md:flex-1 relative overflow-hidden bg-muted/40">
                {featuredArticle.featuredImageUrl ? (
                  <img
                    src={featuredArticle.featuredImageUrl}
                    alt={featuredArticle.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : null}
              </div>
              <div className="flex-1 flex flex-col items-start justify-between px-8 md:px-16 py-8">
                <div className="flex flex-col gap-4">
                  <h2 className="font-sans font-bold text-foreground text-[28px] md:text-[36px]">
                    {featuredArticle.title}
                  </h2>
                  <p className="font-sans text-[16px] text-muted-foreground">
                    {featuredArticle.excerpt}
                  </p>
                </div>
                <p className="font-sans text-[14px] text-muted-foreground mt-4">
                  {formatPublicDate(
                    featuredArticle.publishDate ?? featuredArticle.createdAt,
                  )}
                </p>
              </div>
            </Link>
          ) : null}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
            {otherArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          <div className="border-t border-primary/10 mb-8" />

          <div className="flex items-center justify-end gap-3 pb-12">
            <Button
              variant="ghost"
              type="button"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              aria-label="Go to previous articles page"
              className="bg-primary/5 flex items-center justify-center w-8 h-8 disabled:opacity-40 hover:bg-primary/10 transition-colors"
            >
              <span aria-hidden="true">
                <CaretLeft />
              </span>
            </Button>
            {Array.from({ length: totalPages })
              .slice(0, 6)
              .map((_, index) => {
                const page = index + 1;
                return (
                  <Button
                    variant="ghost"
                    type="button"
                    key={page}
                    onClick={() => onPageChange(page)}
                    aria-label={`Go to articles page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                    className={`flex items-center justify-center w-8 h-8 font-sans font-medium text-[16px] transition-colors ${
                      currentPage === page
                        ? "bg-primary/5 text-primary"
                        : "text-foreground hover:bg-primary/5"
                    }`}
                  >
                    {page}
                  </Button>
                );
              })}
            <Button
              variant="ghost"
              type="button"
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              aria-label="Go to next articles page"
              className="bg-primary/5 flex items-center justify-center w-8 h-8 disabled:opacity-40 hover:bg-primary/10 transition-colors"
            >
              <span aria-hidden="true">
                <CaretRight />
              </span>
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
