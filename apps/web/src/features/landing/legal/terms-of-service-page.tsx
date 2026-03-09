import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";

const sections = [
  { id: "acceptance", title: "Acceptance of Terms" },
  { id: "nature", title: "Nature of Services and Website Use" },
  { id: "intellectual", title: "Intellectual Property" },
  { id: "product", title: "Product and Material Information" },
  { id: "limitation", title: "Limitation of Liability" },
  { id: "governing", title: "Governing Law and Jurisdiction" },
  { id: "changes", title: "Changes to These Terms" },
];

const termsContent = [
  {
    id: "acceptance",
    heading: "1. Acceptance of Terms",
    body: 'By accessing and using the website of DS General PLC ("we," "our," or "us"), you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website.',
  },
  {
    id: "nature",
    heading: "2. Nature of Services and Website Use",
    body: "This website provides information regarding our import, wholesale trade, and general construction services. The content on this site is for general informational purposes and to facilitate inquiries or quote requests. Submitting a contact form or requesting a quote does not constitute a binding commercial contract. All formal business transactions, imports, and construction projects will be governed by separate, legally binding agreements.",
  },
  {
    id: "intellectual",
    heading: "3. Intellectual Property",
    body: "All content on this website, including text, graphics, logos, images, and service descriptions, is the property of DS General PLC and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from this content without our express written consent.",
  },
  {
    id: "product",
    heading: "4. Product and Material Information",
    body: "While we strive for accuracy, descriptions of imported goods (electronics, IT equipment, sanitary gear) and construction materials are subject to change based on global supply chains and manufacturer updates. We reserve the right to modify service offerings or product availability without prior notice.",
  },
  {
    id: "limitation",
    heading: "5. Limitation of Liability",
    body: "To the fullest extent permitted by law, DS General PLC shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of this website, or any reliance on the information provided herein.",
  },
  {
    id: "governing",
    heading: "6. Governing Law and Jurisdiction",
    body: "These Terms of Service shall be governed by and construed in accordance with the laws of the Federal Democratic Republic of Ethiopia. Any disputes arising from the use of this website shall be subject to the exclusive jurisdiction of the courts in Addis Ababa, Ethiopia.",
  },
  {
    id: "changes",
    heading: "7. Changes to These Terms",
    body: "We reserve the right to update or modify these terms at any time. Changes will be effective immediately upon posting to this page.",
  },
];

export function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const offsets = sections.map((s) => {
        const el = document.getElementById(s.id);
        return { id: s.id, top: el ? el.getBoundingClientRect().top : 9999 };
      });
      const current =
        offsets.find((o) => o.top > 0 && o.top < 300) ??
        offsets.filter((o) => o.top <= 0).pop();
      if (current) setActiveSection(current.id);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section className="landing-container landing-section-compact">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
        {/* Main Content */}
        <div className="flex-1 min-w-0 max-w-205.25">
          {/* Title */}
          <div className="mb-10">
            <h1 className="font-sans font-semibold text-foreground text-[28px] md:text-[32px]">
              Terms of Service
            </h1>
            <p className="font-sans text-muted-foreground text-[16px] mt-1">
              Last Updated: February 13, 2026
            </p>
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-8">
            {termsContent.map((section) => (
              <div key={section.id} id={section.id}>
                <h2 className="font-sans font-semibold text-foreground text-[16px] mb-4">
                  {section.heading}
                </h2>
                <p className="font-sans text-muted-foreground text-[16px] leading-[1.6]">
                  {section.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block w-79 shrink-0 sticky top-25">
          <p className="font-sans text-muted-foreground text-[16px] mb-6">
            Content Sections
          </p>
          <div className="flex flex-col gap-3">
            {sections.map((s) => (
              <Button
                variant="ghost"
                type="button"
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`text-left font-sans text-[16px] transition-colors cursor-pointer ${
                  activeSection === s.id
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s.title}
              </Button>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
