import { Outlet, useLocation } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import type { Transition } from "motion/react";
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

function LandingRouteTransition() {
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();
  const transition: Transition = reduceMotion
    ? { duration: 0.01 }
    : { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <motion.div
      key={pathname}
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
      className="min-h-screen will-change-[opacity,transform]"
    >
      <Outlet />
    </motion.div>
  );
}

export function LandingLayout() {
  return (
    <div className="landing-boxy min-h-screen bg-background text-foreground font-sans">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-background focus:px-4 focus:py-3 focus:text-primary focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
      >
        Skip to main content
      </a>
      <ScrollToTop />
      <Navbar />
      <main id="main-content" className="min-h-screen" tabIndex={-1}>
        <LandingRouteTransition />
      </main>
      <Footer />
    </div>
  );
}
