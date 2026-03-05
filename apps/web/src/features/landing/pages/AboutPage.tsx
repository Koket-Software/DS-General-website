import { AboutHeroSection } from "../components/about-hero-section";
import { CEOMessageSection } from "../components/ceo-message-section";
import { OrgChartSection } from "../components/org-chart-section";
import { PartnersSection } from "../components/partners-section";
import { ProjectsSection } from "../components/projects-section";
import { ServicesSection } from "../components/services-section";

export function AboutPage() {
  return (
    <>
      <AboutHeroSection />
      <PartnersSection />
      <CEOMessageSection />
      <ServicesSection />
      <OrgChartSection />
      <ProjectsSection />
    </>
  );
}
