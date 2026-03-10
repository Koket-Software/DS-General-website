import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Logo } from "./icons";

import { Button } from "@/components/ui/button";
import {
  publicBusinessSectorDetailQueryOptions,
  usePublicBusinessSectors,
} from "@/lib/business-sectors/business-sectors-query";

type NavItem = {
  label: string;
  path?: string;
  hasDropdown?: boolean;
};

const navItems: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Gallery", path: "/gallery" },
  { label: "Articles", path: "/articles" },
  { label: "Business Sectors", hasDropdown: true },
  { label: "Career", path: "/career" },
  { label: "Contact Us", path: "/contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const queryClient = useQueryClient();

  const sectorsQuery = usePublicBusinessSectors({
    page: 1,
    limit: 50,
    sortBy: "publishDate",
    sortOrder: "desc",
  });

  const sectors = useMemo(
    () =>
      (sectorsQuery.data?.data ?? []).map((sector) => ({
        slug: sector.slug,
        label: sector.title,
        href: `/sectors/${sector.slug}`,
      })),
    [sectorsQuery.data?.data],
  );

  const prefetchSectorDetail = (slug: string) => {
    void queryClient.prefetchQuery(
      publicBusinessSectorDetailQueryOptions(slug),
    );
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const isSectorActive = location.pathname.startsWith("/sectors/");

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
    setMobileDropdownOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background">
      <div className="landing-container flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <Logo size="lg" />
        </Link>

        <nav className="hidden items-center lg:flex">
          {navItems.map((item) => {
            if (item.hasDropdown) {
              return (
                <div key={item.label} ref={dropdownRef} className="relative">
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => setDropdownOpen((open) => !open)}
                    aria-expanded={dropdownOpen}
                    aria-haspopup="menu"
                    aria-label="Toggle business sectors menu"
                    className={`cursor-pointer px-4 py-2 font-sans text-[14px] font-medium transition-colors ${
                      isSectorActive || dropdownOpen
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:text-primary"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      {item.label}
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 20 20"
                        className={`transition-transform duration-200 ${
                          dropdownOpen ? "rotate-180" : ""
                        }`}
                      >
                        <path
                          d="M16.6922 7.94219L10.4422 14.1922C10.3841 14.2503 10.3152 14.2964 10.2393 14.3279C10.1635 14.3593 10.0821 14.3755 10 14.3755C9.91787 14.3755 9.83654 14.3593 9.76066 14.3279C9.68479 14.2964 9.61586 14.2503 9.55781 14.1922L3.30781 7.94219C3.19054 7.82491 3.12465 7.66585 3.12465 7.5C3.12465 7.33415 3.19054 7.17509 3.30781 7.05781C3.42509 6.94054 3.58415 6.87465 3.75 6.87465C3.91585 6.87465 4.07491 6.94054 4.19219 7.05781L10 12.8664L15.8078 7.05781C15.8659 6.99974 15.9348 6.95368 16.0107 6.92225C16.0866 6.89083 16.1679 6.87465 16.25 6.87465C16.3321 6.87465 16.4134 6.89083 16.4893 6.92225C16.5652 6.95368 16.6341 6.99974 16.6922 7.05781C16.7503 7.11588 16.7963 7.18482 16.8277 7.26069C16.8592 7.33656 16.8753 7.41788 16.8753 7.5C16.8753 7.58212 16.8592 7.66344 16.8277 7.73931C16.7963 7.81518 16.7503 7.88412 16.6922 7.94219Z"
                          fill={
                            isSectorActive || dropdownOpen
                              ? "white"
                              : "var(--foreground)"
                          }
                        />
                      </svg>
                    </span>
                  </Button>

                  {dropdownOpen ? (
                    <div className="absolute left-0 top-full z-50 mt-0 min-w-56 border border-border/60 bg-background shadow-lg">
                      {sectors.length > 0 ? (
                        sectors.map((sector) => (
                          <Link
                            key={sector.slug}
                            to="/sectors/$slug"
                            params={{ slug: sector.slug }}
                            onMouseEnter={() =>
                              prefetchSectorDetail(sector.slug)
                            }
                            onFocus={() => prefetchSectorDetail(sector.slug)}
                            className={`block px-5 py-3 font-sans text-[14px] font-medium no-underline transition-colors ${
                              location.pathname === sector.href
                                ? "bg-primary/10 text-primary"
                                : "text-foreground hover:bg-primary/5 hover:text-primary"
                            }`}
                          >
                            {sector.label}
                          </Link>
                        ))
                      ) : sectorsQuery.isPending ? (
                        <p className="px-5 py-3 font-sans text-[14px] text-muted-foreground">
                          Loading sectors...
                        </p>
                      ) : (
                        <p className="px-5 py-3 font-sans text-[14px] text-muted-foreground">
                          Sectors unavailable
                        </p>
                      )}
                    </div>
                  ) : null}
                </div>
              );
            }

            if (!item.path) return null;

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-2.5 px-4 py-2 font-sans text-[14px] font-medium no-underline transition-colors ${
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Button
          variant="ghost"
          type="button"
          className="p-2 lg:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={
            mobileOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {mobileOpen ? (
        <nav
          id="mobile-navigation"
          className="flex flex-col gap-2 border-t border-border/60 bg-background px-6 py-4 lg:hidden"
        >
          {navItems.map((item) => {
            if (item.hasDropdown) {
              return (
                <div key={item.label}>
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => setMobileDropdownOpen((open) => !open)}
                    aria-expanded={mobileDropdownOpen}
                    aria-label="Toggle mobile business sectors menu"
                    className={`w-full cursor-pointer justify-between rounded px-4 py-3 font-sans text-[14px] font-medium ${
                      isSectorActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <span>{item.label}</span>
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      viewBox="0 0 20 20"
                      className={`transition-transform duration-200 ${
                        mobileDropdownOpen ? "rotate-180" : ""
                      }`}
                    >
                      <path
                        d="M16.6922 7.94219L10.4422 14.1922C10.3841 14.2503 10.3152 14.2964 10.2393 14.3279C10.1635 14.3593 10.0821 14.3755 10 14.3755C9.91787 14.3755 9.83654 14.3593 9.76066 14.3279C9.68479 14.2964 9.61586 14.2503 9.55781 14.1922L3.30781 7.94219C3.19054 7.82491 3.12465 7.66585 3.12465 7.5C3.12465 7.33415 3.19054 7.17509 3.30781 7.05781C3.42509 6.94054 3.58415 6.87465 3.75 6.87465C3.91585 6.87465 4.07491 6.94054 4.19219 7.05781L10 12.8664L15.8078 7.05781C15.8659 6.99974 15.9348 6.95368 16.0107 6.92225C16.0866 6.89083 16.1679 6.87465 16.25 6.87465C16.3321 6.87465 16.4134 6.89083 16.4893 6.92225C16.5652 6.95368 16.6341 6.99974 16.6922 7.05781C16.7503 7.11588 16.7963 7.18482 16.8277 7.26069C16.8592 7.33656 16.8753 7.41788 16.8753 7.5C16.8753 7.58212 16.8592 7.66344 16.8277 7.73931C16.7963 7.81518 16.7503 7.88412 16.6922 7.94219Z"
                        fill={isSectorActive ? "white" : "var(--foreground)"}
                      />
                    </svg>
                  </Button>

                  {mobileDropdownOpen ? (
                    <div className="mt-1 ml-4 flex flex-col gap-1">
                      {sectors.length > 0 ? (
                        sectors.map((sector) => (
                          <Link
                            key={sector.slug}
                            to="/sectors/$slug"
                            params={{ slug: sector.slug }}
                            onMouseEnter={() =>
                              prefetchSectorDetail(sector.slug)
                            }
                            onFocus={() => prefetchSectorDetail(sector.slug)}
                            onClick={() => setMobileOpen(false)}
                            className={`rounded px-4 py-2 font-sans text-[14px] font-medium no-underline ${
                              location.pathname === sector.href
                                ? "bg-primary/10 text-primary"
                                : "text-foreground hover:bg-muted/50"
                            }`}
                          >
                            {sector.label}
                          </Link>
                        ))
                      ) : sectorsQuery.isPending ? (
                        <p className="px-4 py-2 font-sans text-[14px] text-muted-foreground">
                          Loading sectors...
                        </p>
                      ) : (
                        <p className="px-4 py-2 font-sans text-[14px] text-muted-foreground">
                          Sectors unavailable
                        </p>
                      )}
                    </div>
                  ) : null}
                </div>
              );
            }

            if (!item.path) return null;

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 rounded px-4 py-3 font-sans text-[14px] font-medium no-underline ${
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted/50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </header>
  );
}
