import {
  LegalDocumentPage,
  type LegalDocumentSection,
} from "./legal-document-page";

const bodyClassName =
  "font-sans text-[16px] leading-[1.6] text-muted-foreground";

const sections: LegalDocumentSection[] = [
  {
    id: "acceptance",
    heading: "1. Acceptance of Terms",
    tocTitle: "Acceptance of Terms",
    content: (
      <p className={bodyClassName}>
        By accessing and using the website of DS General PLC ("we," "our," or
        "us"), you agree to comply with and be bound by these Terms of Service.
        If you do not agree with any part of these terms, please do not use our
        website.
      </p>
    ),
  },
  {
    id: "nature",
    heading: "2. Nature of Services and Website Use",
    tocTitle: "Nature of Services and Website Use",
    content: (
      <p className={bodyClassName}>
        This website provides information regarding our import, wholesale trade,
        and general construction services. The content on this site is for
        general informational purposes and to facilitate inquiries or quote
        requests. Submitting a contact form or requesting a quote does not
        constitute a binding commercial contract. All formal business
        transactions, imports, and construction projects will be governed by
        separate, legally binding agreements.
      </p>
    ),
  },
  {
    id: "intellectual",
    heading: "3. Intellectual Property",
    tocTitle: "Intellectual Property",
    content: (
      <p className={bodyClassName}>
        All content on this website, including text, graphics, logos, images,
        and service descriptions, is the property of DS General PLC and is
        protected by applicable intellectual property laws. You may not
        reproduce, distribute, or create derivative works from this content
        without our express written consent.
      </p>
    ),
  },
  {
    id: "product",
    heading: "4. Product and Material Information",
    tocTitle: "Product and Material Information",
    content: (
      <p className={bodyClassName}>
        While we strive for accuracy, descriptions of imported goods
        (electronics, IT equipment, sanitary gear) and construction materials
        are subject to change based on global supply chains and manufacturer
        updates. We reserve the right to modify service offerings or product
        availability without prior notice.
      </p>
    ),
  },
  {
    id: "limitation",
    heading: "5. Limitation of Liability",
    tocTitle: "Limitation of Liability",
    content: (
      <p className={bodyClassName}>
        To the fullest extent permitted by law, DS General PLC shall not be
        liable for any direct, indirect, incidental, or consequential damages
        resulting from your use of this website, or any reliance on the
        information provided herein.
      </p>
    ),
  },
  {
    id: "governing",
    heading: "6. Governing Law and Jurisdiction",
    tocTitle: "Governing Law and Jurisdiction",
    content: (
      <p className={bodyClassName}>
        These Terms of Service shall be governed by and construed in accordance
        with the laws of the Federal Democratic Republic of Ethiopia. Any
        disputes arising from the use of this website shall be subject to the
        exclusive jurisdiction of the courts in Addis Ababa, Ethiopia.
      </p>
    ),
  },
  {
    id: "changes",
    heading: "7. Changes to These Terms",
    tocTitle: "Changes to These Terms",
    content: (
      <p className={bodyClassName}>
        We reserve the right to update or modify these terms at any time.
        Changes will be effective immediately upon posting to this page.
      </p>
    ),
  },
];

export function TermsOfServicePage() {
  return (
    <LegalDocumentPage
      title="Terms of Service"
      lastUpdated="February 13, 2026"
      sections={sections}
    />
  );
}
