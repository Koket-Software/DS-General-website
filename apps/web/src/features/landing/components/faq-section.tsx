import { Link } from "@tanstack/react-router";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "How long does it take to build a website?",
    answer:
      "It depends on the project's size and complexity. A typical business website takes 3–6 weeks, while more complex, custom-built platforms can take longer. We'll provide a clear timeline after the discovery phase.",
  },
  {
    question: "Do you provide custom or template-based websites?",
    answer:
      "We offer both custom and template-based solutions depending on your needs and budget. Our team works closely with you to determine the best approach for your project.",
  },
  {
    question: "Will my website be mobile-friendly and SEO-ready?",
    answer:
      "Absolutely. Every website we build is fully responsive and optimized for search engines from the ground up.",
  },
  {
    question: "Do you help with app store publishing?",
    answer:
      "Yes, we provide end-to-end support including app store submission, optimization, and ongoing maintenance.",
  },
  {
    question: "What's included in your branding service?",
    answer:
      "Our branding service includes logo design, brand guidelines, color palette, typography selection, and comprehensive brand strategy.",
  },
];

export function FAQSection() {
  const contactBox = (
    <div className="flex flex-col items-start gap-4 bg-primary/5 px-6 py-6 md:items-auto md:py-4">
      <p className="font-sans text-[16px] font-normal text-foreground">
        Still have question? Need more inquiries don't be shy to reach out to us
      </p>
      <Button asChild className="w-fit">
        <Link to="/contact">Contact Us</Link>
      </Button>
    </div>
  );

  return (
    <section className="mx-auto max-w-360 px-6 py-16 md:px-24 md:py-24">
      <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:gap-12">
        <div className="hidden shrink-0 flex-col gap-4 lg:flex lg:w-117.25">
          <p className="font-sans text-[16px] font-normal uppercase text-muted-foreground">
            /FAQ's
          </p>
          <h2 className="font-sans text-[28px] font-semibold capitalize text-foreground md:text-[40px]">
            Your question answered
          </h2>

          <div className="mt-8 lg:mt-10">{contactBox}</div>
        </div>

        <div className="w-full flex-1">
          <div className="mb-8 space-y-1 lg:hidden">
            <p className="font-sans text-[16px] font-normal uppercase text-muted-foreground">
              /FAQ's
            </p>
            <h2 className="font-sans text-[28px] leading-tight font-semibold capitalize text-foreground">
              Your question answered
            </h2>
          </div>

          <Accordion type="single" collapsible defaultValue={faqs[0]?.question}>
            {faqs.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger className="font-sans text-left text-[16px] font-semibold text-foreground md:text-[17px]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="font-sans text-[14px] leading-relaxed text-muted-foreground md:text-[15px]">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-10 lg:hidden">{contactBox}</div>
        </div>
      </div>
    </section>
  );
}
