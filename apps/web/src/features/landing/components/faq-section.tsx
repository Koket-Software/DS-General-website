import { Link } from "@tanstack/react-router";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useFaqListQuery } from "@/lib/faq/faq-query";

export function FAQSection() {
  const faqQuery = useFaqListQuery({
    page: 1,
    limit: 8,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const faqs = faqQuery.data?.data ?? [];

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
    <section className="landing-container landing-section">
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

          {faqQuery.isError ? (
            <p className="text-sm text-muted-foreground">
              Unable to load FAQs right now.
            </p>
          ) : faqQuery.isPending ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-12 bg-muted/50 animate-pulse" />
              ))}
            </div>
          ) : (
            <Accordion
              type="single"
              collapsible
              defaultValue={faqs[0]?.question}
            >
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.question}>
                  <AccordionTrigger className="font-sans text-left text-[16px] font-semibold text-foreground md:text-[17px]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="font-sans text-[14px] leading-relaxed text-muted-foreground md:text-[15px]">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          <div className="mt-10 lg:hidden">{contactBox}</div>
        </div>
      </div>
    </section>
  );
}
