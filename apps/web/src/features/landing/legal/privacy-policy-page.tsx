import { useState, useEffect, type ReactNode } from "react";

import { Button } from "@/components/ui/button";

const sections = [
  { id: "introduction", title: "Acceptance of Terms" },
  { id: "information-collect", title: "Nature of Services and Website Use" },
  { id: "how-we-use", title: "Intellectual Property" },
  { id: "information-sharing", title: "Product and Material Information" },
  { id: "data-security", title: "Limitation of Liability" },
  { id: "cookies", title: "Governing Law and Jurisdiction" },
  { id: "contact-us", title: "Changes to These Terms" },
];

interface PolicySection {
  id: string;
  heading: string;
  content: ReactNode;
}

const policyContent: PolicySection[] = [
  {
    id: "introduction",
    heading: "1. Introduction",
    content: (
      <p className="font-sans text-muted-foreground text-[16px] leading-[1.6]">
        DS General PLC respects your privacy and is committed to protecting the
        personal information you share with us. This Privacy Policy explains how
        we collect, use, and safeguard your data when you visit our website or
        interact with our business online.
      </p>
    ),
  },
  {
    id: "information-collect",
    heading: "2. Information We Collect",
    content: (
      <div className="font-sans text-muted-foreground text-[16px] leading-[1.6]">
        <p className="mb-3">
          We may collect the following types of information:
        </p>
        <ul className="list-disc pl-6 flex flex-col gap-2">
          <li>
            <span>
              Personal Information: When you request a quote, fill out a contact
              form, or subscribe to our updates, we may collect your name, email
              address, phone number, company name, and project details.
            </span>
          </li>
          <li>
            <span>
              Non-Personal Information: We automatically collect standard
              internet log information, such as your IP address, browser type,
              and pages visited, to help us understand how our website is used
              and improve the user experience.
            </span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "how-we-use",
    heading: "3. How We Use Your Information",
    content: (
      <div className="font-sans text-muted-foreground text-[16px] leading-[1.6]">
        <p className="mb-3">
          The information we collect is used strictly for legitimate business
          purposes, including:
        </p>
        <ul className="list-disc pl-6 flex flex-col gap-2">
          <li>
            Responding to your inquiries and providing accurate quotes for
            import orders or construction projects.
          </li>
          <li>
            Communicating with you regarding our services, updates, or changes
            to policies.
          </li>
          <li>Improving our website functionality and customer service.</li>
        </ul>
      </div>
    ),
  },
  {
    id: "information-sharing",
    heading: "4. Information Sharing and Disclosure",
    content: (
      <div className="font-sans text-muted-foreground text-[16px] leading-[1.6]">
        <p className="mb-3">
          We do not sell, trade, or rent your personal information to third
          parties. We may share your information only under the following
          circumstances:
        </p>
        <ul className="list-disc pl-6 flex flex-col gap-2">
          <li>
            With trusted third-party service providers who assist us in
            operating our website or conducting our business (e.g., website
            hosting), provided they agree to keep this information confidential.
          </li>
          <li>
            When required by Ethiopian law, regulations, or legal processes.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "data-security",
    heading: "5. Data Security",
    content: (
      <p className="font-sans text-muted-foreground text-[16px] leading-[1.6]">
        We implement industry-standard security measures to protect your
        personal information from unauthorized access, alteration, disclosure,
        or destruction. However, no method of transmission over the internet is
        100% secure, and we cannot guarantee absolute security.
      </p>
    ),
  },
  {
    id: "cookies",
    heading: "6. Cookies",
    content: (
      <p className="font-sans text-muted-foreground text-[16px] leading-[1.6]">
        Our website may use "cookies" to enhance your user experience. You can
        choose to set your web browser to refuse cookies or to alert you when
        cookies are being sent. If you do so, note that some parts of the site
        may not function properly.
      </p>
    ),
  },
  {
    id: "contact-us",
    heading: "7. Contact Us",
    content: (
      <div className="font-sans text-muted-foreground text-[16px] leading-[1.6]">
        <p className="mb-3">
          If you have any questions or concerns about this Privacy Policy or how
          we handle your data, please contact us at:
        </p>
        <ul className="list-disc pl-6 flex flex-col gap-2">
          <li>Email: contact@dsgeneralplc.com</li>
          <li>Phone: +251 90 000 0000</li>
          <li>Address: [Insert Office Location, Addis Ababa, Ethiopia]</li>
        </ul>
      </div>
    ),
  },
];

export function PrivacyPolicyPage() {
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
              Privacy Policy
            </h1>
            <p className="font-sans text-muted-foreground text-[16px] mt-1">
              Last Updated: February 13, 2026
            </p>
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-8">
            {policyContent.map((section) => (
              <div key={section.id} id={section.id}>
                <h2 className="font-sans font-semibold text-foreground text-[16px] mb-4">
                  {section.heading}
                </h2>
                {section.content}
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
