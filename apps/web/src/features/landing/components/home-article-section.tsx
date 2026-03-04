import { ArticleCard } from "./articles-section";
import { articles } from "../data/articles-data";

export function HomeArticleSection() {
  if (!articles?.length) {
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
