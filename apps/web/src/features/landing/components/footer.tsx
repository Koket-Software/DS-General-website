import { Link } from "@tanstack/react-router";

import { Logo, YoutubeIcon, XIcon, InstagramIcon, LinkedinIcon } from "./icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePublicSocialsQuery } from "@/lib/socials/socials-query";

function socialIcon(title: string) {
  const normalized = title.toLowerCase();

  if (normalized.includes("youtube")) return <YoutubeIcon />;
  if (normalized.includes("instagram")) return <InstagramIcon />;
  if (normalized.includes("linkedin")) return <LinkedinIcon />;
  return <XIcon />;
}

export function Footer() {
  const socialsQuery = usePublicSocialsQuery({ page: 1, limit: 20 });
  const socials = socialsQuery.data?.data ?? [];
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background landing-container pt-6">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        <div className="flex flex-col gap-6 shrink-0">
          <div className="flex flex-col gap-3">
            <div className="flex items-center">
              <Logo size="lg" />
            </div>
            <p className="font-sans font-light text-foreground text-[16px]">
              Reliable Trade Solutions Across Borders
            </p>
          </div>
          <div className="flex gap-2">
            {socialsQuery.isError ? (
              <p className="text-sm text-muted-foreground">
                Socials unavailable
              </p>
            ) : (
              socials.slice(0, 4).map((social) => (
                <a
                  key={social.id}
                  href={social.baseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.title}
                  className="bg-primary/5 flex items-center justify-center p-1.5 w-10.5 h-10.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  {social.iconUrl ? (
                    <img
                      src={social.iconUrl}
                      alt={social.title}
                      className="h-5 w-5 object-contain"
                    />
                  ) : (
                    socialIcon(social.title)
                  )}
                </a>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <p className="font-sans font-semibold text-foreground text-[16px]">
            Company
          </p>
          <div className="flex flex-col gap-4 font-sans font-normal text-foreground text-[14px]">
            {[
              { label: "About", path: "/about" },
              { label: "Gallery", path: "/gallery" },
              { label: "Articles", path: "/articles" },
              { label: "Contact Us", path: "/contact" },
              { label: "Careers", path: "/career" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="hover:text-primary transition-colors no-underline text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <p className="font-sans font-semibold text-foreground text-[16px]">
            Business Sectors
          </p>
          <div className="flex flex-col gap-4 font-sans font-normal text-foreground text-[14px]">
            {[
              {
                label: "Sourcing & Logistics",
                path: "/sectors/sourcing-logistics",
              },
              { label: "General Contracting", path: "/about" },
              { label: "Material Imports", path: "/about" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="hover:text-primary transition-colors no-underline text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-background border border-primary/10 flex items-center justify-between px-4 py-3">
            <Input
              type="email"
              placeholder="Email Address"
              className="flex-1 border-0 bg-transparent font-sans text-[16px] font-normal text-foreground shadow-none focus-visible:ring-0"
            />
            <Button
              variant="ghost"
              type="button"
              className="ml-4 shrink-0 font-sans text-[16px] font-semibold text-primary transition-opacity hover:opacity-80"
            >
              Subscribe
            </Button>
          </div>
          <p className="font-sans font-normal text-foreground text-[14px] mb-10 py-3 lg:py-6">
            Get the latest news and updates subscribe to our newsletter
          </p>
        </div>
      </div>

      <div className="mt-10 border-t border-primary/10" />

      <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-sans font-normal text-foreground text-[14px]">
          &copy; {currentYear} DS General PLC. All Rights Reserved
        </p>
        <div className="flex gap-6 font-sans font-medium text-primary text-[14px]">
          <Link
            to="/terms-of-service"
            className="hover:opacity-80 transition-opacity no-underline text-primary"
          >
            Term of Service
          </Link>
          <Link
            to="/privacy-policy"
            className="hover:opacity-80 transition-opacity no-underline text-primary"
          >
            Privacy Policy
          </Link>
        </div>
      </div>

      <p className="text-center font-sans font-semibold text-[80px] md:text-[140px] lg:text-[170px] leading-[0.8] bg-linear-to-b from-primary/10 to-primary/0 bg-clip-text text-transparent select-none overflow-hidden">
        DS General PLC
      </p>
    </footer>
  );
}
