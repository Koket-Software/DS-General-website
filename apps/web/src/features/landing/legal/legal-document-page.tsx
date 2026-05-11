import { useEffect, useMemo, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";

export type LegalDocumentSection = {
  id: string;
  heading: string;
  tocTitle: string;
  content: ReactNode;
};

type LegalDocumentPageProps = {
  title: string;
  lastUpdated: string;
  sections: LegalDocumentSection[];
};

const HEADER_OFFSET = 100;
const ACTIVE_SECTION_THRESHOLD = 300;

export function LegalDocumentPage({
  title,
  lastUpdated,
  sections,
}: LegalDocumentPageProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? "");

  const sectionIds = useMemo(
    () => sections.map((section) => section.id),
    [sections],
  );

  useEffect(() => {
    const handleScroll = () => {
      const offsets = sectionIds.map((id) => {
        const element = document.getElementById(id);
        return {
          id,
          top: element ? element.getBoundingClientRect().top : 9999,
        };
      });

      const currentSection =
        offsets.find(
          (offset) => offset.top > 0 && offset.top < ACTIVE_SECTION_THRESHOLD,
        ) ??
        offsets.filter((offset) => offset.top <= 0).pop() ??
        offsets[0];

      if (currentSection?.id) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sectionIds]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) {
      return;
    }

    const top =
      element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section className="landing-container landing-section-compact">
      <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-20">
        <div className="min-w-0 max-w-205.25 flex-1">
          <div className="mb-10">
            <h1 className="font-sans text-[28px] font-semibold text-foreground md:text-[32px]">
              {title}
            </h1>
            <p className="mt-1 font-sans text-[16px] text-muted-foreground">
              Last Updated: {lastUpdated}
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {sections.map((section) => (
              <section key={section.id} id={section.id}>
                <h2 className="mb-4 font-sans text-[16px] font-semibold text-foreground">
                  {section.heading}
                </h2>
                {section.content}
              </section>
            ))}
          </div>
        </div>

        <div className="sticky top-25 hidden w-79 shrink-0 lg:block">
          <p className="mb-6 font-sans text-[16px] text-muted-foreground">
            Content Sections
          </p>
          <div className="flex flex-col gap-3">
            {sections.map((section) => (
              <Button
                key={section.id}
                type="button"
                variant="ghost"
                onClick={() => scrollToSection(section.id)}
                className={`cursor-pointer text-left font-sans text-[16px] transition-colors ${
                  activeSection === section.id
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                } justify-start px-0`}
              >
                {section.tocTitle}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
