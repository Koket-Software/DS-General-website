import imgRectangle9 from "../../../../assets/2048f9bb03a917022bd566bc700b252cecf07662.png";
import imgSidebar3 from "../../../../assets/4ffdcc160940efc529a0c5306a30b806d6960be1.png";
import imgRectangle2 from "../../../../assets/54c8b1e432249ab1705c71a6c350ff773383b4b1.png";
import imgRectangle4 from "../../../../assets/55e9cabb60a699d6120f5c8d2c3a8d0f8418268c.png";
import imgRectangle10 from "../../../../assets/99852afdc1206384211265c3c3ce34d510bd2e6f.png";
import imgRectangle7 from "../../../../assets/a0e02396f2533128c74833fe23a9ad6b7ddde863.png";
import imgSidebar2 from "../../../../assets/a95c57b89e189ea8a186b66d08642231f642c7de.png";
import imgSidebar1 from "../../../../assets/c6f7bb8477e0df4f815e887ee96975f22b32ca48.png";
import imgRectangle8 from "../../../../assets/c986b41fc7017365239cae93a9a140a7cb02fe26.png";
import imgRectangle3 from "../../../../assets/cad68ef1cbcc47a5a7817d82222a0e8a01def4fa.png";
import imgRectangle5 from "../../../../assets/e90ebab9301873b5625945dc3a4310fbaf95dd1c.png";
import imgDetailHero from "../../../../assets/ed795cd1cf7e0a2e0ad8ef5875f5069d7934c5a1.png";
import imgRectangle6 from "../../../../assets/f89b012929a98196225716b2a00bb4567c9619e5.png";

export interface Article {
  id: number;
  image: string;
  date: string;
  title: string;
  description?: string;
  category?: string;
  readTime?: string;
}

export const featuredArticle: Article = {
  id: 0,
  image: imgRectangle10,
  date: "Aug 24, 2025",
  title:
    "The Gateway Effect: How Unified Supply Chains Prevent Construction Delays",
  description:
    "Discover how eliminating third-party vendors and sourcing materials directly from global manufacturers can shave weeks off your civil project timelines in Ethiopia.",
  category: "Construction Logistics & Supply Chain",
  readTime: "15 min read",
};

export const articles: Article[] = [
  {
    id: 1,
    image: imgRectangle2,
    date: "Oct 01, 2025",
    title:
      "Smart Buildings in Addis Ababa: Sourcing the Right IT Infrastructure",
    category: "Technology & Infrastructure",
    readTime: "10 min read",
  },
  {
    id: 2,
    image: imgRectangle3,
    date: "Oct 15, 2025",
    title:
      "Beyond the Blueprint: Why Material Quality Dictates Structural Longevity",
    category: "Material Science",
    readTime: "12 min read",
  },
  {
    id: 3,
    image: imgRectangle4,
    date: "Nov 15, 2025",
    title: "Ethiopia's Infrastructure Outlook: 2026 Trends and Demands",
    category: "Industry Trends",
    readTime: "8 min read",
  },
  {
    id: 4,
    image: imgRectangle5,
    date: "Oct 15, 2025",
    title:
      "Equipping the Modern Workforce: The Hidden ROI of Quality Corporate Supplies",
    category: "Corporate Supplies",
    readTime: "11 min read",
  },
  {
    id: 5,
    image: imgRectangle6,
    date: "Dec 01, 2025",
    title:
      "Prioritizing People: Navigating Wholesale Safety Gear for Mega-Projects",
    category: "Safety & Compliance",
    readTime: "9 min read",
  },
  {
    id: 6,
    image: imgRectangle7,
    date: "Dec 15, 2025",
    title: "Demystifying Customs: A Guide to Streamlined Freight Clearance",
    category: "Logistics & Customs",
    readTime: "14 min read",
  },
  {
    id: 7,
    image: imgRectangle8,
    date: "Jan 15, 2026",
    title:
      "The Single-Source Advantage: Why Developers are Moving Away from Fragmented Bidding",
    category: "Construction Logistics & Supply Chain",
    readTime: "13 min read",
  },
  {
    id: 8,
    image: imgRectangle9,
    date: "Jan 15, 2026",
    title:
      "The Finishing Touch: Importing Premium Sanitary Fixtures for Commercial Developments",
    category: "Material Supply",
    readTime: "10 min read",
  },
];

export const allArticles = [featuredArticle, ...articles];

// Detail page hero image
export const detailHeroImage = imgDetailHero;

// Sidebar related articles images
export const sidebarImages = [imgSidebar1, imgSidebar2, imgSidebar3];

export const relatedArticles: Article[] = [
  {
    id: 1,
    image: imgSidebar1,
    date: "Oct 01, 2025",
    title:
      "Smart Buildings in Addis Ababa: Sourcing the Right IT Infrastructure",
  },
  {
    id: 2,
    image: imgSidebar2,
    date: "Oct 20, 2025",
    title:
      "Beyond the Blueprint: Why Material Quality Dictates Structural Longevity",
  },
  {
    id: 3,
    image: imgSidebar3,
    date: "Oct 20, 2025",
    title: "Ethiopia's Infrastructure Outlook: 2026 Trends and Demands",
  },
];
