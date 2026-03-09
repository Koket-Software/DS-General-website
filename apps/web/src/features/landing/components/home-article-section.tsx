import { Link } from "@tanstack/react-router";

import { ArticleCard } from "./articles-section";
import { SectionHeader } from "./section-header";

import { usePublicBlogsQuery } from "@/lib/blogs/blogs-query";

export function HomeArticleSection() {
  const blogsQuery = usePublicBlogsQuery({
    page: 1,
    limit: 4,
    sortBy: "publishDate",
    sortOrder: "desc",
  });

  const articles = blogsQuery.data?.data ?? [];

  return (
    <section className="landing-container landing-section">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader
          label="/Latest articles"
          title="Stay on top of what's new in DS General PLC"
        />
        <Link
          to="/articles"
          className="font-sans text-[16px] font-medium text-primary no-underline hover:opacity-80"
        >
          View all
        </Link>
      </div>

      {blogsQuery.isError ? (
        <p className="py-10 text-center text-muted-foreground/90">
          No articles available at the moment.
        </p>
      ) : blogsQuery.isPending ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-64 border border-border/60 bg-muted/50 animate-pulse"
            />
          ))}
        </div>
      ) : !articles.length ? (
        <p className="py-10 text-center text-muted-foreground/90">
          No articles available at the moment.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {articles.slice(0, 4).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </section>
  );
}
