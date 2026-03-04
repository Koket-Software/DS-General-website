import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { YoutubeIcon, XIcon, InstagramIcon, LinkedinIcon } from "./icons";
import svgPaths from "../../../../imports/svg-yczk9mkqx7";
import { articles, featuredArticle, type Article } from "../data/articles-data";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function CaretLeft() {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path d={svgPaths.p204a5580} fill="var(--primary)" />
    </svg>
  );
}

function CaretRight() {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path d={svgPaths.p2c0b8700} fill="var(--primary)" />
    </svg>
  );
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      to="/articles/$id"
      params={{ id: String(article.id) }}
      className="flex flex-col border border-border/60 group cursor-pointer no-underline"
    >
      <div className="h-40 relative overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <p className="font-sans text-[14px] text-muted-foreground">
          {article.date}
        </p>
        <p className="font-sans font-semibold text-[14px] text-foreground">
          {article.title}
        </p>
      </div>
    </Link>
  );
}

export function ArticlesSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  const filteredArticles = searchQuery
    ? articles.filter((a) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : articles;

  return (
    <section className="max-w-360 mx-auto px-6 md:px-24">
      {/* Search header + Follow Us */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start lg:items-end pt-8 pb-10 ">
        <div className="flex flex-col  flex-1">
          <div className="flex flex-col gap-2">
            <p className="font-sans font-normal text-muted-foreground text-[16px] uppercase">
              /articles
            </p>

            <h1 className="font-sans font-semibold text-foreground text-[40px] capitalize">
              Search for article posts
            </h1>
          </div>
          <div className="flex h-10.5 items-center w-full max-w-205.5">
            <div className="flex-1 h-full border border-border/60">
              <Input
                type="text"
                placeholder="Search for Articles"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-full w-full border-0 bg-transparent px-4 font-sans text-[16px] text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
              />
            </div>
            <Button
              variant="ghost"
              type="button"
              className="h-full shrink-0 bg-primary px-6 font-sans text-[16px] text-primary-foreground capitalize transition-colors hover:bg-primary/90"
            >
              Search
            </Button>
          </div>
        </div>

        <div className="flex lg:mr-16 flex-col gap-4 items-start shrink-0 ">
          <p className="font-sans font-semibold text-[24px] text-foreground capitalize">
            Follow Us
          </p>
          <div className="flex gap-2 items-center  lg:mr-24">
            <div className="bg-primary/5 flex items-center justify-center p-1.5 w-10.5 h-10.5">
              <YoutubeIcon />
            </div>
            <div className="w-10.5 h-10.5 shrink-0">
              <XIcon />
            </div>
            <div className="bg-primary/5 flex items-center justify-center p-1.5 w-10.5 h-10.5">
              <InstagramIcon />
            </div>
            <div className="bg-primary/5 flex items-center justify-center p-1.5 w-10.5 h-10.5">
              <LinkedinIcon />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Article */}
      <Link
        to="/articles/$id"
        params={{ id: String(featuredArticle.id) }}
        className="bg-muted/50 flex flex-col md:flex-row h-auto md:h-90.25 mb-10 cursor-pointer group no-underline"
      >
        <div className="h-60 md:h-full md:flex-1 relative overflow-hidden">
          <img
            src={featuredArticle.image}
            alt="Featured article"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex-1 flex flex-col items-start justify-between px-8 md:px-16 py-8">
          <div className="flex flex-col gap-4">
            <h2 className="font-sans font-bold text-foreground text-[28px] md:text-[36px]">
              {featuredArticle.title}
            </h2>
            <p className="font-sans text-[16px] text-muted-foreground">
              {featuredArticle.description}
            </p>
          </div>
          <p className="font-sans text-[14px] text-muted-foreground mt-4">
            {featuredArticle.date}
          </p>
        </div>
      </Link>

      {/* Article Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
        {filteredArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-primary/10 mb-8" />

      {/* Pagination */}
      <div className="flex items-center justify-end gap-3 pb-12">
        <Button
          variant="ghost"
          type="button"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="bg-primary/5 flex items-center justify-center w-8 h-8 disabled:opacity-40 hover:bg-primary/10 transition-colors"
        >
          <CaretLeft />
        </Button>
        {[1, 2, 3].map((page) => (
          <Button
            variant="ghost"
            type="button"
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`flex items-center justify-center w-8 h-8 font-sans font-medium text-[16px] transition-colors ${
              currentPage === page
                ? "bg-primary/5 text-primary"
                : "text-foreground hover:bg-primary/5"
            }`}
          >
            {page}
          </Button>
        ))}
        <Button
          variant="ghost"
          type="button"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="bg-primary/5 flex items-center justify-center w-8 h-8 disabled:opacity-40 hover:bg-primary/10 transition-colors"
        >
          <CaretRight />
        </Button>
      </div>
    </section>
  );
}
