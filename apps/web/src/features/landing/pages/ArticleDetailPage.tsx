import { ArticleDetailSection } from "../components/article-detail-section";

interface ArticleDetailPageProps {
  id: string;
}

export function ArticleDetailPage({ id }: ArticleDetailPageProps) {
  return <ArticleDetailSection id={id} />;
}
