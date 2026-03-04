import { Link } from "@tanstack/react-router";

import svgPaths from "../../../../imports/svg-x78xrehz02";
import { allArticles, relatedArticles } from "../data/articles-data";

function ArrowLeft() {
  return (
    <svg width="18" height="16" fill="none" viewBox="0 0 18.0014 16.0009">
      <path d={svgPaths.p90fbd00} fill="var(--primary)" />
    </svg>
  );
}

function AuthorLogo() {
  return (
    <div className="h-10.5 relative shrink-0 w-10.5">
      <svg
        className="absolute block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 41.9803 42.0002"
      >
        <g>
          <path
            clipRule="evenodd"
            d={svgPaths.p30747400}
            fill="var(--primary)"
            fillRule="evenodd"
          />
          <path
            clipRule="evenodd"
            d={svgPaths.pdba6600}
            fill="var(--primary)"
            fillRule="evenodd"
          />
        </g>
      </svg>
    </div>
  );
}

function XLogo() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
      <path d={svgPaths.pf203100} fill="var(--primary)" />
    </svg>
  );
}

interface RelatedCardProps {
  image: string;
  date: string;
  title: string;
  id: number;
}

function RelatedArticleCard({ image, date, title, id }: RelatedCardProps) {
  return (
    <Link
      to="/articles/$id"
      params={{ id: String(id) }}
      className="flex items-start border border-border/60 group cursor-pointer no-underline w-full hover:shadow-sm transition-shadow"
    >
      <div className="w-35 h-40 relative shrink-0 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-2 p-4 flex-1">
        <p className="font-sans text-[14px] text-muted-foreground">{date}</p>
        <p className="font-sans font-semibold text-[16px] text-foreground">
          {title}
        </p>
      </div>
    </Link>
  );
}

// Article body content - reusable for the featured article or any article
function ArticleBody() {
  return (
    <div className="flex flex-col gap-6 text-[16px]">
      <p className="font-sans text-muted-foreground leading-[1.6]">
        {`In Ethiopia's rapidly expanding real estate and infrastructure sectors, time is quite literally money. Yet, despite the boom in development, completing a project on time remains a significant hurdle. Studies on the Ethiopian construction industry consistently show that the escalation of material prices, unavailability of construction materials, and ineffective resource management are among the most critical factors causing project delays. For developers in Addis Ababa and beyond, the root cause often boils down to a fragmented supply chain. "The Gateway Effect" is our methodology at DS General PLC for solving this exact bottleneck.`}
      </p>

      <h3 className="font-sans font-medium text-foreground">
        The True Cost of a Fragmented Supply Chain
      </h3>

      <div className="font-sans text-muted-foreground leading-[1.6]">
        <p className="mb-3">
          Traditionally, Ethiopian developers rely on a complex web of
          independent entities to get a project off the ground. You hire a
          contractor for the civil works, a separate importer for electrical
          goods, and another local wholesaler for structural materials. This
          fragmentation creates severe vulnerabilities:
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>
            <span>
              Import Dependency and Volatility: The Ethiopian construction
              sector is heavily reliant on foreign building materials, which
              leaves the industry exposed to instability in global commodity
              markets and price fluctuations. Relying on third-party importers
              magnifies this risk.
            </span>
          </li>
          <li>
            <span>{`The Blame Game: When a project stalls because essential equipment hasn't cleared customs, the contractor blames the supplier, and the supplier blames the transit agent. Meanwhile, the client absorbs the cost of the delay.`}</span>
          </li>
          <li>
            <span>
              Inconsistent Quality: Sourcing from multiple micro-vendors often
              leads to mismatched or substandard material quality, which can
              cause structural issues or require costly rework.
            </span>
          </li>
        </ul>
      </div>

      <h3 className="font-sans font-medium text-foreground">
        {`How the "Gateway" Approach Solves the Bottleneck`}
      </h3>

      <div className="font-sans text-muted-foreground leading-[1.6]">
        <p className="mb-3">
          A unified supply chain—what we call the Gateway Effect—consolidates
          sourcing, logistics, and construction under a single licensed entity.
          Here is how it fundamentally changes the project lifecycle:
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>
            <span>
              Direct Sourcing: By cutting out the local middlemen, a unified
              partner imports directly from global manufacturers. This ensures
              authentic materials and locks in pricing early, mitigating the
              effects of local market fluctuations.
            </span>
          </li>
          <li>
            <span>
              Synchronized Logistics: When the same company managing the
              construction site is also importing the materials, deliveries are
              perfectly timed with the construction phases. Equipment arrives
              precisely when the engineering team needs it.
            </span>
          </li>
          <li>
            <span>
              Single-Source Accountability: If there is a logistical hurdle,
              there is only one project manager handling it. This eliminates the
              communication breakdowns that plague multi-vendor projects.
            </span>
          </li>
        </ul>
      </div>

      <h3 className="font-sans font-medium text-foreground">
        The ROI of Integration
      </h3>

      <p className="font-sans text-muted-foreground leading-[1.6]">
        {`By integrating the supply chain, developers mitigate the most common causes of cost overruns and time extensions. A unified gateway ensures that when the site is ready for the next phase, the materials are already on hand. At DS General PLC, this approach doesn't just save weeks on the calendar; it protects your bottom line and guarantees the integrity of your investment.`}
      </p>
    </div>
  );
}

interface ArticleDetailSectionProps {
  id?: string;
}

export function ArticleDetailSection({ id }: ArticleDetailSectionProps) {
  const articleId = Number(id);
  const article = allArticles.find((a) => a.id === articleId) || allArticles[0];

  // Get related articles (excluding current)
  const related = relatedArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 3);
  // If we filtered out one, backfill
  const displayRelated =
    related.length < 3 ? relatedArticles.slice(0, 3) : related;

  return (
    <section className="max-w-360 mx-auto px-6 md:px-24">
      {/* Breadcrumb row */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 items-start lg:items-center pt-6 pb-6">
        {/* Back to Articles */}
        <div className="flex items-center gap-4 lg:w-[60%]">
          <Link
            to="/articles"
            className="flex items-center gap-4 text-primary font-sans text-[16px] no-underline hover:opacity-80 transition-opacity"
          >
            <ArrowLeft />
            <span>Articles</span>
          </Link>
          <div className="flex-1 h-px bg-primary" />
        </div>

        {/* More Like This */}
        <div className="hidden lg:flex items-center gap-4 lg:w-[40%] lg:pl-6">
          <span className="font-sans text-[16px] text-primary shrink-0">
            More Like This
          </span>
          <div className="flex-1 h-px bg-primary" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-8 pb-16">
        {/* Article content - left side */}
        <div className="lg:w-[60%] flex flex-col gap-6">
          {/* Hero Image */}
          <div className="w-full h-70 md:h-90.25 relative overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Meta row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-0 font-sans text-muted-foreground">
              <span className="text-[16px]">{article.date}</span>
              <span className="mx-2 text-[14px]">&bull;</span>
              <span className="text-[16px]">
                {article.readTime || "15 min read"}
              </span>
            </div>
            <div className="bg-muted px-3 py-2 rounded-xl">
              <span className="font-sans text-[16px] text-muted-foreground">
                {article.category || "Construction Logistics & Supply Chain"}
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-sans font-bold text-foreground text-[28px] md:text-[36px] leading-[1.2]">
            {article.title}
          </h1>

          {/* Article Body */}
          <ArticleBody />

          {/* Divider */}
          <div className="h-px bg-primary/15 w-full" />

          {/* Author */}
          <div className="flex items-center gap-4">
            <AuthorLogo />
            <div className="flex flex-col gap-1">
              <p className="font-sans font-bold text-foreground text-[16px] capitalize">
                DS General PLC Insights Team
              </p>
              <a
                href="https://x.com/dsgeneralplc"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 no-underline"
              >
                <XLogo />
                <span className="font-sans text-[14px] text-primary underline lowercase">
                  @dsgeneralplc
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Sidebar - right side */}
        <div className="lg:w-[40%] lg:pl-6">
          {/* Mobile: "More Like This" heading */}
          <div className="lg:hidden flex items-center gap-4 mb-6">
            <span className="font-sans text-[16px] text-primary shrink-0">
              More Like This
            </span>
            <div className="flex-1 h-px bg-primary" />
          </div>

          <div className="flex flex-col gap-5">
            {displayRelated.map((ra) => (
              <RelatedArticleCard
                key={ra.id}
                id={ra.id}
                image={ra.image}
                date={ra.date}
                title={ra.title}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
