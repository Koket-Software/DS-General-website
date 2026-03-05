import { ArticleDetailSection } from "../components/article-detail-section";

interface ArticleDetailPageProps {
  slug: string;
}

export function ArticleDetailPage({ slug }: ArticleDetailPageProps) {
  return <ArticleDetailSection slug={slug} />;
}
