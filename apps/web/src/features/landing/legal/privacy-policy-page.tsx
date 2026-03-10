import {
  LegalDocumentPage,
  type LegalDocumentSection,
} from "./legal-document-page";

import { COMPANY } from "@/config/template";

const bodyClassName =
  "font-sans text-[16px] leading-[1.6] text-muted-foreground";

const sections: LegalDocumentSection[] = [
  {
    id: "introduction",
    heading: "1. Introduction",
    tocTitle: "Introduction",
    content: (
      <p className={bodyClassName}>
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
    tocTitle: "Information We Collect",
    content: (
      <div className={bodyClassName}>
        <p className="mb-3">
          We may collect the following types of information:
        </p>
        <ul className="flex list-disc flex-col gap-2 pl-6">
          <li>
            Personal Information: When you request a quote, fill out a contact
            form, or subscribe to our updates, we may collect your name, email
            address, phone number, company name, and project details.
          </li>
          <li>
            Non-Personal Information: We automatically collect standard internet
            log information, such as your IP address, browser type, and pages
            visited, to help us understand how our website is used and improve
            the user experience.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "how-we-use",
    heading: "3. How We Use Your Information",
    tocTitle: "How We Use Your Information",
    content: (
      <div className={bodyClassName}>
        <p className="mb-3">
          The information we collect is used strictly for legitimate business
          purposes, including:
        </p>
        <ul className="flex list-disc flex-col gap-2 pl-6">
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
    tocTitle: "Information Sharing and Disclosure",
    content: (
      <div className={bodyClassName}>
        <p className="mb-3">
          We do not sell, trade, or rent your personal information to third
          parties. We may share your information only under the following
          circumstances:
        </p>
        <ul className="flex list-disc flex-col gap-2 pl-6">
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
    tocTitle: "Data Security",
    content: (
      <p className={bodyClassName}>
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
    tocTitle: "Cookies",
    content: (
      <p className={bodyClassName}>
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
    tocTitle: "Contact Us",
    content: (
      <div className={bodyClassName}>
        <p className="mb-3">
          If you have any questions or concerns about this Privacy Policy or how
          we handle your data, please contact us at:
        </p>
        <ul className="flex list-disc flex-col gap-2 pl-6">
          <li>Email: {COMPANY.email}</li>
          <li>Phone: {COMPANY.phone}</li>
          <li>Address: {COMPANY.address}</li>
        </ul>
      </div>
    ),
  },
];

export function PrivacyPolicyPage() {
  return (
    <LegalDocumentPage
      title="Privacy Policy"
      lastUpdated="February 13, 2026"
      sections={sections}
    />
  );
}
