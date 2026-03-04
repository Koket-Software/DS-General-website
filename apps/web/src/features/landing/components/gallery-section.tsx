import { useState } from "react";

import imgRectangle102 from "../../../../assets/19ed85147ca6cb029c73a2af61d31bfd43e14f40.png";
import imgRectangle109 from "../../../../assets/25af978ee963f4a417c22daef2f639aec0e39ee9.png";
import imgRectangle103 from "../../../../assets/3de0d12bd55569ea9125561565de24ffa212e752.png";
import imgRectangle111 from "../../../../assets/5598b873ff5cddb76f43b250bcc66b7d8eda2b0e.png";
import imgRectangle112 from "../../../../assets/5958b2361487a693fca536be76e3a52d63cc4e6a.png";
import imgRectangle105 from "../../../../assets/64957996f40225ab6342b9a204cc3f4c47c8c953.png";
import imgRectangle104 from "../../../../assets/7db0d184c1232702beb766cd2e3994783854fe63.png";
import imgRectangle101 from "../../../../assets/808f120efb1a0cf9fbe7e4ff02d7d20a0c33aee7.png";
import imgRectangle106 from "../../../../assets/9cf0203ab58ee55083b83f44a22225cdcd1adbe8.png";
import imgRectangle110 from "../../../../assets/a3296f8ef8e5747c93f81b2676ef2a295561a9cd.png";
import imgRectangle107 from "../../../../assets/c6339572864faaa07565913ef951f136797e9428.png";
import imgRectangle108 from "../../../../assets/c844aa40afdc9573f828f66cbb8d362800577897.png";

import { Button } from "@/components/ui/button";

const filterTabs = [
  "All Projects",
  "Global Sourcing & Logistics",
  "Structural & Civil Works",
  "Material Supply & Inventory",
];

const galleryImages = [
  {
    src: imgRectangle101,
    alt: "Warehouse interior with stacked pallets",
    category: "Global Sourcing & Logistics",
  },
  {
    src: imgRectangle102,
    alt: "Construction workers in safety gear",
    category: "Structural & Civil Works",
  },
  {
    src: imgRectangle103,
    alt: "Large warehouse logistics center",
    category: "Global Sourcing & Logistics",
  },
  {
    src: imgRectangle104,
    alt: "Office and cosmetic supplies",
    category: "Material Supply & Inventory",
  },
  {
    src: imgRectangle105,
    alt: "Industrial packaging materials",
    category: "Material Supply & Inventory",
  },
  {
    src: imgRectangle106,
    alt: "Construction safety equipment",
    category: "Structural & Civil Works",
  },
  {
    src: imgRectangle107,
    alt: "Warehouse storage facility",
    category: "Global Sourcing & Logistics",
  },
  {
    src: imgRectangle108,
    alt: "Cosmetic products display",
    category: "Material Supply & Inventory",
  },
  {
    src: imgRectangle109,
    alt: "Construction workers on site",
    category: "Structural & Civil Works",
  },
  {
    src: imgRectangle110,
    alt: "Steel reinforcement construction",
    category: "Structural & Civil Works",
  },
  {
    src: imgRectangle111,
    alt: "Building under construction",
    category: "Structural & Civil Works",
  },
  {
    src: imgRectangle112,
    alt: "Architectural blueprints",
    category: "Material Supply & Inventory",
  },
];

export function GallerySection() {
  const [activeTab, setActiveTab] = useState("All Projects");

  const filteredImages =
    activeTab === "All Projects"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeTab);

  return (
    <section className="max-w-360 mx-auto">
      {/* Filter tabs */}
      <div className="px-6 md:px-16 border-b border-primary/10">
        <div
          className="
      flex items-center 
      overflow-x-auto no-scrollbar 
      snap-x snap-mandatory   // optional: nicer snap on mobile
      -mx-1                   // optional: better edge padding feel
    "
        >
          {filterTabs.map((tab) => (
            <Button
              variant="ghost"
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
          shrink-0               // ← Crucial: prevents button from shrinking
          px-5 sm:px-6 lg:px-8        // smaller padding on mobile
          py-3.5 sm:py-4              // slightly more touch-friendly height
          font-sans 
          text-[15px] sm:text-[16px]  // slightly smaller text on mobile if needed
          whitespace-nowrap           // ← Main fix: NO WRAPPING
          transition-colors 
          relative
          ${
            activeTab === tab
              ? "font-semibold text-primary border-b-2 border-primary"
              : "font-normal text-foreground hover:text-primary"
          }
        `}
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>

      {/* Image grid */}
      <div className="px-6 md:px-24 py-10 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <div
              key={`${image.alt}-${index}`}
              className="relative h-50 md:h-78.5 overflow-hidden bg-muted/60 group"
            >
              <img
                alt={image.alt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                src={image.src}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
