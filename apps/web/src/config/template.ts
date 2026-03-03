/**
 * Template Configuration
 *
 * This is the central configuration file for customizing the template.
 * Update these values to match your company/project branding.
 *
 * For environment-specific values (API URLs, etc.), use .env files.
 */

// =============================================================================
// COMPANY BRANDING
// =============================================================================

export const COMPANY = {
  /** Company/product name */
  name: "DS General PLC",

  /** Short tagline for the company */
  tagline: "Integrated Business & Industrial Solutions",

  /** Full description for SEO and marketing */
  description:
    "DS General PLC delivers reliable engineering, trading, and operational solutions for high-impact business sectors in Ethiopia.",

  /** Year the company was founded (for copyright) */
  foundedYear: 2024,

  /** Primary contact email */
  email: "info@dsgeneralplc.com",

  /** Primary contact phone number */
  phone: "+251 11 000 0000",

  /** Physical address (optional) */
  address: "Addis Ababa, Ethiopia",
} as const;

// =============================================================================
// SITE METADATA (SEO & OG)
// =============================================================================

export const SITE = {
  /** Site name for OG tags */
  name: COMPANY.name,

  /** Base URL of the site (set via VITE_SITE_URL env var for flexibility) */
  url: import.meta.env.VITE_SITE_URL || "https://dsgeneralplc.com",

  /** Default page title (appears in browser tab) */
  defaultTitle: `${COMPANY.name} | ${COMPANY.tagline}`,

  /** Default meta description */
  defaultDescription: COMPANY.description,

  /** Twitter/X handle (without @) */
  twitterHandle: "dsgeneralplc",

  /** Default locale */
  locale: "en_US",

  /** Primary theme color (used in meta tags, PWA) */
  themeColor: "#0600ab",

  /** Keywords for SEO */
  keywords: [
    "ds general",
    "ds general plc",
    "ethiopia business solutions",
    "industrial solutions",
    "engineering services",
    "trading services",
  ],
} as const;

// =============================================================================
// SOCIAL LINKS
// =============================================================================

export const SOCIAL_LINKS = {
  twitter: "",
  linkedin: "",
  instagram: "",
  github: "",
  facebook: "", // Leave empty to hide
  tiktok: "", // Leave empty to hide
} as const;

// =============================================================================
// NAVIGATION
// =============================================================================

export const NAVIGATION = {
  /** Logo text (or replace with logo component in Navbar) */
  logo: COMPANY.name,

  /** Main navigation items */
  items: [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Sectors", href: "/sectors" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" },
  ],

  /** CTA button in header */
  cta: {
    label: "Request Consultation",
    href: "/schedule",
  },
} as const;

// =============================================================================
// FOOTER
// =============================================================================

export const FOOTER = {
  sections: [
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Services", href: "/services" },
        { label: "Business Sectors", href: "/sectors" },
      ],
    },
    {
      title: "Quick Links",
      links: [
        { label: "Services", href: "/services" },
        { label: "Blogs", href: "/blogs" },
        { label: "Projects", href: "/projects" },
        { label: "Careers", href: "/careers" },
      ],
    },
  ],
  copyright: `© ${new Date().getFullYear()} ${COMPANY.name}. All rights reserved.`,
} as const;

// =============================================================================
// FEATURE FLAGS
// =============================================================================

export const FEATURES = {
  /** Enable the demo/marketing landing pages (disable for dashboard-only mode) */
  enableMarketingPages: true,

  /** Enable blog functionality */
  enableBlog: true,

  /** Enable careers/vacancies functionality */
  enableCareers: true,

  /** Enable case studies/projects functionality */
  enableProjects: true,

  /** Enable booking/scheduling functionality */
  enableBooking: true,

  /** Cal.com username for booking (leave empty to disable) */
  calComUsername: "",
} as const;

// =============================================================================
// API CONFIGURATION
// =============================================================================

export const API = {
  /** Base URL for API requests (set via VITE_SERVER_URL env var) */
  baseUrl: import.meta.env.VITE_SERVER_URL || "http://localhost:3000",
} as const;

// =============================================================================
// EXPORTS
// =============================================================================

/** Combined template configuration */
export const templateConfig = {
  company: COMPANY,
  site: SITE,
  socialLinks: SOCIAL_LINKS,
  navigation: NAVIGATION,
  footer: FOOTER,
  features: FEATURES,
  api: API,
} as const;

export type TemplateConfig = typeof templateConfig;
