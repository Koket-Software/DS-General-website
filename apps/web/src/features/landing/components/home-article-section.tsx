import { ArticleCard } from "./articles-section";

import { usePublicBlogsQuery } from "@/lib/blogs/blogs-query";

export function HomeArticleSection() {
  const blogsQuery = usePublicBlogsQuery({
    page: 1,
    limit: 4,
    sortBy: "publishDate",
    sortOrder: "desc",
  });

  const articles = blogsQuery.data?.data ?? [];

  if (blogsQuery.isError) {
    return (
      <p className="text-center text-muted-foreground/90 py-10">
        No articles available at the moment.
      </p>
    );
  }

  if (blogsQuery.isPending) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-64 border border-border/60 bg-muted/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!articles.length) {
    return (
      <p className="text-center text-muted-foreground/90 py-10">
        No articles available at the moment.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {articles.slice(0, 3).map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
