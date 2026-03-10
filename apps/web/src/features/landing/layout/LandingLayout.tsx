import { Outlet, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";

import { Footer } from "../components/footer";
import { Navbar } from "../components/navbar";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function LandingLayout() {
  return (
    <div className="landing-boxy min-h-screen bg-background text-foreground font-sans">
      <ScrollToTop />
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
