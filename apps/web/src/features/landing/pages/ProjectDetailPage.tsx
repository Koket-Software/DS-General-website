import { ProjectDetailSection } from "../components/project-detail-section";

interface ProjectDetailPageProps {
  slug: string;
}

export function ProjectDetailPage({ slug }: ProjectDetailPageProps) {
  return <ProjectDetailSection slug={slug} />;
}
