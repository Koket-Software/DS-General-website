import { SOCIAL_LINKS } from "@/config/template";
import type { LandingCtaConfig, LandingNavItem } from "@/types/navigation";
import { landingPagePaths } from "@/types/navigation";

export type SocialLink = {
  id: "x" | "linkedin" | "instagram";
  label: string;
  url: string;
};

export const landingNavItems: LandingNavItem[] = [
  {
    page: "about",
    label: "About Us",
    path: landingPagePaths.about,
    description: "Story, leadership, and values",
  },
  {
    page: "services",
    label: "Services",
    path: landingPagePaths.services,
    description: "Strategy, design, and build offers",
  },
  {
    page: "sectors",
    label: "Business Sectors",
    path: landingPagePaths.sectors,
    description: "Industry-specific service portfolios",
  },
  {
    page: "blogs",
    label: "Blogs",
    path: landingPagePaths.blogs,
    description: "Insights and engineering notes",
  },
  {
    page: "careers",
    label: "Careers",
    path: landingPagePaths.careers,
    description: "Open roles and applications",
  },
  {
    page: "projects",
    label: "Work Samples",
    path: landingPagePaths.projects,
    description: "Case studies & launches",
  },
  {
    page: "gallery",
    label: "Gallery",
    path: landingPagePaths.gallery,
    description: "Moments from events and team culture",
  },
  {
    page: "contact",
    label: "Contact Us",
    path: landingPagePaths.contact,
    description: "Locations, inboxes, and socials",
  },
];

export const landingCtas: LandingCtaConfig[] = [
  {
    id: "book-call",
    label: "Request Consultation",
    page: "booking",
    variant: "primary",
    description: "Jump straight into the consultation scheduling experience.",
  },
  {
    id: "contact-sales",
    label: "Contact Team",
    page: "contact",
    variant: "outline",
    description: "Prefer email? Send a note to the studio.",
  },
];

export const landingSocials: SocialLink[] = [
  ...(SOCIAL_LINKS.twitter
    ? [
        {
          id: "x" as const,
          label: "X (Formerly Twitter)",
          url: SOCIAL_LINKS.twitter,
        },
      ]
    : []),
  ...(SOCIAL_LINKS.linkedin
    ? [
        {
          id: "linkedin" as const,
          label: "LinkedIn",
          url: SOCIAL_LINKS.linkedin,
        },
      ]
    : []),
  ...(SOCIAL_LINKS.instagram
    ? [
        {
          id: "instagram" as const,
          label: "Instagram",
          url: SOCIAL_LINKS.instagram,
        },
      ]
    : []),
];
