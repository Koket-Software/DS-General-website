import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { Logo } from "./icons";

import { Button } from "@/components/ui/button";

const dropdownItems = [
  { label: "Sourcing & Logistics", path: "/sectors/sourcing-logistics" },
];

const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Gallery", path: "/gallery" },
  { label: "Articles", path: "/articles" },
  { label: "Business Sectors", path: "#", hasDropdown: true },
  { label: "Career", path: "/career" },
  { label: "Contact Us", path: "/contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    if (path === "#") return false;
    return location.pathname.startsWith(path);
  };

  const isSectorActive = dropdownItems.some((item) =>
    location.pathname.startsWith(item.path),
  );

  // Close dropdown on outside click
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

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
    setMobileDropdownOpen(false);
  }, [location.pathname]);

  return (
    <header className="bg-background sticky top-0 z-50 border-b border-border/60">
      <div className="max-w-360 mx-auto flex items-center justify-between px-6 md:px-24 py-3">
        <Link to="/" className="flex gap-3 items-center no-underline">
          <Logo size="sm" />
          <span className="font-sans font-semibold text-primary text-[20px] md:text-[24px] leading-[0.9]">
            DS General PLC
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center">
          {navItems.map((item) => {
            if (item.hasDropdown) {
              return (
                <div key={item.label} ref={dropdownRef} className="relative">
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex items-center gap-2.5 px-4 py-2 font-sans font-medium text-[14px] transition-colors cursor-pointer ${
                      isSectorActive || dropdownOpen
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:text-primary"
                    }`}
                  >
                    {item.label}
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      viewBox="0 0 20 20"
                      className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
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
                  </Button>

                  {/* Dropdown menu */}
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 mt-0 bg-background border border-border/60 shadow-lg min-w-55 z-50">
                      {dropdownItems.map((di) => (
                        <Link
                          key={di.path}
                          to={di.path}
                          className={`block px-5 py-3 font-sans font-medium text-[14px] no-underline transition-colors ${
                            isActive(di.path)
                              ? "bg-primary/10 text-primary"
                              : "text-foreground hover:bg-primary/5 hover:text-primary"
                          }`}
                        >
                          {di.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-2.5 px-4 py-2 font-sans font-medium text-[14px] no-underline transition-colors ${
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

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          type="button"
          className="lg:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="lg:hidden bg-background border-t border-border/60 px-6 py-4 flex flex-col gap-2">
          {navItems.map((item) => {
            if (item.hasDropdown) {
              return (
                <div key={item.label}>
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                    className={`flex items-center justify-between w-full px-4 py-3 font-sans font-medium text-[14px] rounded cursor-pointer ${
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
                      className={`transition-transform duration-200 ${mobileDropdownOpen ? "rotate-180" : ""}`}
                    >
                      <path
                        d="M16.6922 7.94219L10.4422 14.1922C10.3841 14.2503 10.3152 14.2964 10.2393 14.3279C10.1635 14.3593 10.0821 14.3755 10 14.3755C9.91787 14.3755 9.83654 14.3593 9.76066 14.3279C9.68479 14.2964 9.61586 14.2503 9.55781 14.1922L3.30781 7.94219C3.19054 7.82491 3.12465 7.66585 3.12465 7.5C3.12465 7.33415 3.19054 7.17509 3.30781 7.05781C3.42509 6.94054 3.58415 6.87465 3.75 6.87465C3.91585 6.87465 4.07491 6.94054 4.19219 7.05781L10 12.8664L15.8078 7.05781C15.8659 6.99974 15.9348 6.95368 16.0107 6.92225C16.0866 6.89083 16.1679 6.87465 16.25 6.87465C16.3321 6.87465 16.4134 6.89083 16.4893 6.92225C16.5652 6.95368 16.6341 6.99974 16.6922 7.05781C16.7503 7.11588 16.7963 7.18482 16.8277 7.26069C16.8592 7.33656 16.8753 7.41788 16.8753 7.5C16.8753 7.58212 16.8592 7.66344 16.8277 7.73931C16.7963 7.81518 16.7503 7.88412 16.6922 7.94219Z"
                        fill={isSectorActive ? "white" : "var(--foreground)"}
                      />
                    </svg>
                  </Button>
                  {mobileDropdownOpen && (
                    <div className="ml-4 mt-1 flex flex-col gap-1">
                      {dropdownItems.map((di) => (
                        <Link
                          key={di.path}
                          to={di.path}
                          onClick={() => setMobileOpen(false)}
                          className={`px-4 py-2 font-sans font-medium text-[14px] rounded no-underline ${
                            isActive(di.path)
                              ? "text-primary bg-primary/10"
                              : "text-foreground hover:bg-muted/50"
                          }`}
                        >
                          {di.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 font-sans font-medium text-[14px] rounded no-underline ${
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
      )}
    </header>
  );
}
