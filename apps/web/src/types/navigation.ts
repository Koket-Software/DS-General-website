export type LandingPage =
  | "home"
  | "about"
  | "services"
  | "sectors"
  | "blogs"
  | "blogDetail"
  | "careers"
  | "booking"
  | "contact"
  | "projects"
  | "gallery";

export type Page = LandingPage;

export interface LandingNavItem {
  page: LandingPage;
  label: string;
  path: string;
  hasSubmenu?: boolean;
  description?: string;
}

export interface LandingCtaConfig {
  id: string;
  label: string;
  page: LandingPage;
  description?: string;
  variant?: "primary" | "secondary" | "outline";
}

export const landingPagePaths: Record<LandingPage, string> = {
  home: "/",
  about: "/about",
  services: "/services",
  sectors: "/sectors",
  blogs: "/blogs",
  blogDetail: "/blogs/$slug",
  careers: "/careers",
  booking: "/schedule",
  contact: "/contact",
  projects: "/projects",
  gallery: "/gallery",
};
