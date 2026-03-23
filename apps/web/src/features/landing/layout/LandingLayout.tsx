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
      <ScrollToTop />
      <Navbar />
      <main className="min-h-screen">
        <LandingRouteTransition />
      </main>
      <Footer />
    </div>
  );
}
