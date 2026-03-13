import { Outlet, useLocation, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Transition } from "motion/react";
import { useEffect, useRef } from "react";

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
  const isLoading = useRouterState({ select: (s) => s.isLoading });
  const reduceMotion = useReducedMotion();

  // Hold the previous pathname while the next route's loader is pending.
  // This prevents AnimatePresence from swapping the key (and running exit
  // + enter animations) before the incoming <Outlet /> has content.
  const resolvedPathname = useRef(pathname);
  if (!isLoading) {
    resolvedPathname.current = pathname;
  }

  const initial = reduceMotion
    ? { opacity: 1 }
    : { opacity: 0, y: 10, filter: "blur(3px)" };
  const animate = { opacity: 1, y: 0, filter: "blur(0px)" };
  const exit = reduceMotion
    ? { opacity: 1 }
    : { opacity: 0, y: -8, filter: "blur(2px)" };
  const transition: Transition = reduceMotion
    ? { duration: 0.01 }
    : { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={resolvedPathname.current}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={transition}
        className="min-h-screen will-change-[opacity,transform,filter]"
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
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
