import { AboutSection } from "../components/about-section";
import { CTASection } from "../components/cta-section";
import { FAQSection } from "../components/faq-section";
import { HeroSection } from "../components/hero-section";
import { HomeArticleSection } from "../components/home-article-section";
import { ProjectsSection } from "../components/projects-section";
import { ServicesSection } from "../components/services-section";
import { TestimonialsSection } from "../components/testimonials-section";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <TestimonialsSection />
      <HomeArticleSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
