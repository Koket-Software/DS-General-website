import { ChevronLeft, ChevronRight, Film, ImageIcon, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AppImage } from "@/components/common/AppImage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Public types                                                       */
/* ------------------------------------------------------------------ */

export type PreviewMediaType = "image" | "video";

export interface PreviewMediaItem {
  id?: string | number;
  type: PreviewMediaType;
  src: string;
  alt?: string;
  title?: string;
  description?: string;
  thumbnailSrc?: string;
  posterSrc?: string;
}

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface MediaPreviewDialogProps {
  items: PreviewMediaItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialIndex?: number;
  title?: string;
  description?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const clamp = (v: number, max: number) =>
  max <= 0 ? 0 : Math.min(Math.max(v, 0), max - 1);

const thumb = (item: PreviewMediaItem) =>
  item.thumbnailSrc || item.posterSrc || item.src;

/* ------------------------------------------------------------------ */
/*  Slide variants for media transitions                               */
/* ------------------------------------------------------------------ */

const SLIDE_OFFSET = 60;

function getSlideVariants(direction: number) {
  return {
    enter: {
      x: direction > 0 ? SLIDE_OFFSET : -SLIDE_OFFSET,
      opacity: 0,
      scale: 0.97,
    },
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: {
      x: direction > 0 ? -SLIDE_OFFSET : SLIDE_OFFSET,
      opacity: 0,
      scale: 0.97,
    },
  };
}

const REDUCED_MOTION_VARIANTS = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function MediaPreviewDialog({
  items,
  open,
  onOpenChange,
  initialIndex = 0,
  title = "Media Preview",
  description,
  className,
}: MediaPreviewDialogProps) {
  const safeItems = useMemo(() => items.filter((i) => !!i.src), [items]);
  const count = safeItems.length;
  const reducedMotion = useReducedMotion();

  /* --- index + direction state ------------------------------------ */
  const [idx, setIdx] = useState(() => clamp(initialIndex, count));
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (open) {
      setIdx(clamp(initialIndex, count));
      setDirection(0);
    }
  }, [initialIndex, open, count]);

  useEffect(() => {
    setIdx((c) => clamp(c, count));
  }, [count]);

  const go = useCallback(
    (n: number) => {
      setDirection(n > idx ? 1 : -1);
      setIdx(clamp(n, count));
    },
    [count, idx],
  );

  const prev = useCallback(() => {
    if (count <= 1) return;
    setDirection(-1);
    setIdx((c) => (c === 0 ? count - 1 : c - 1));
  }, [count]);

  const next = useCallback(() => {
    if (count <= 1) return;
    setDirection(1);
    setIdx((c) => (c === count - 1 ? 0 : c + 1));
  }, [count]);

  /* --- idle-fade for chrome --------------------------------------- */
  const [idle, setIdle] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const resetIdle = useCallback(() => {
    setIdle(false);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIdle(true), 3000);
  }, []);

  useEffect(() => {
    if (!open) {
      setIdle(false);
      clearTimeout(idleTimer.current);
      return;
    }
    resetIdle();
    return () => clearTimeout(idleTimer.current);
  }, [open, resetIdle]);

  /* --- keyboard --------------------------------------------------- */
  useEffect(() => {
    if (!open || count <= 1) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
        resetIdle();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
        resetIdle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, open, count, resetIdle]);

  /* --- thumbnail scroll into view --------------------------------- */
  const thumbStripRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const strip = thumbStripRef.current;
    if (!strip) return;
    const active = strip.children[idx] as HTMLElement | undefined;
    active?.scrollIntoView({
      block: "nearest",
      inline: "center",
      behavior: "smooth",
    });
  }, [idx]);

  /* --- derived ---------------------------------------------------- */
  const current = safeItems[idx];
  const currentTitle = current?.title ?? title;
  const currentAlt = current?.alt || currentTitle || "Media preview";

  const slideVariants = reducedMotion
    ? REDUCED_MOTION_VARIANTS
    : getSlideVariants(direction);

  const slideTransition = reducedMotion
    ? { duration: 0.15 }
    : { type: "spring" as const, stiffness: 350, damping: 32, mass: 0.8 };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          /* Full-viewport takeover */
          "fixed inset-0 top-0 left-0 h-dvh w-dvw max-w-none translate-x-0 translate-y-0 rounded-none border-0 p-0 shadow-none sm:max-w-none",
          /* Theme-aware background */
          "bg-white/95 backdrop-blur-2xl dark:bg-neutral-950/95",
          /* Override default dialog animations — we handle our own */
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          "data-[state=open]:zoom-in-[0.98] data-[state=closed]:zoom-out-[0.98]",
          "duration-300",
          className,
        )}
        onPointerMove={resetIdle}
        onPointerDown={resetIdle}
      >
        {/* Accessible header — sr only */}
        <DialogTitle className="sr-only">{currentTitle}</DialogTitle>
        <DialogDescription className="sr-only">
          {description ?? currentTitle}
        </DialogDescription>

        {/* -------------------------------------------------------- */}
        {/*  Top bar                                                  */}
        {/* -------------------------------------------------------- */}
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between px-4 pb-12 pt-4 transition-opacity duration-500 sm:px-6 sm:pt-5",
            /* Gradient scrim — adapts to theme */
            "bg-gradient-to-b from-white/80 via-white/30 to-transparent dark:from-neutral-950/80 dark:via-neutral-950/30 dark:to-transparent",
            idle && count > 0
              ? "opacity-0 motion-reduce:opacity-100"
              : "opacity-100",
          )}
        >
          {/* Title + counter */}
          <div className="pointer-events-auto min-w-0 flex-1">
            <h2 className="truncate text-sm font-medium tracking-wide text-foreground/90 sm:text-base">
              {currentTitle}
            </h2>
            {count > 1 && (
              <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
                {idx + 1} of {count}
              </p>
            )}
          </div>

          {/* Close */}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="pointer-events-auto -mr-1 ml-4 flex size-9 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-foreground/8 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            aria-label="Close media preview"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* -------------------------------------------------------- */}
        {/*  Main viewport                                            */}
        {/* -------------------------------------------------------- */}
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
          {!current ? (
            /* Empty state */
            <div className="flex flex-col items-center gap-4 px-8 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl border border-border bg-muted">
                <ImageIcon
                  className="size-7 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
              <div className="space-y-1">
                <p className="text-base font-medium text-foreground">
                  No Media Available
                </p>
                <p className="text-sm text-muted-foreground">
                  Nothing to preview yet.
                </p>
              </div>
            </div>
          ) : (
            <AnimatePresence
              initial={false}
              mode="popLayout"
              custom={direction}
            >
              <motion.div
                key={current.src + idx}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
                className="flex h-full w-full items-center justify-center"
              >
                {current.type === "video" ? (
                  <video
                    key={current.src}
                    className="max-h-[calc(100dvh-10rem)] w-auto max-w-[calc(100vw-2rem)] rounded-xl border border-border/50 object-contain shadow-lg sm:max-w-[calc(100vw-6rem)]"
                    controls
                    playsInline
                    preload="metadata"
                    poster={current.posterSrc || current.thumbnailSrc}
                    src={current.src}
                  />
                ) : (
                  <AppImage
                    key={current.src}
                    src={current.src}
                    alt={currentAlt}
                    width={1920}
                    height={1080}
                    className="max-h-[calc(100dvh-10rem)] w-auto max-w-[calc(100vw-2rem)] select-none rounded-xl border border-border/30 object-contain shadow-lg sm:max-w-[calc(100vw-6rem)]"
                    draggable={false}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {/* ---- prev / next arrows ------------------------------- */}
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => {
                  prev();
                  resetIdle();
                }}
                className={cn(
                  "absolute left-2 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full transition-all sm:left-4 sm:size-11",
                  /* Theme-aware buttons */
                  "border border-border/50 bg-background/80 text-foreground/70 shadow-sm backdrop-blur-md",
                  "hover:bg-background hover:text-foreground hover:shadow-md",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  idle ? "opacity-0 motion-reduce:opacity-100" : "opacity-100",
                )}
                aria-label="Previous media"
              >
                <ChevronLeft className="size-5 sm:size-6" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => {
                  next();
                  resetIdle();
                }}
                className={cn(
                  "absolute right-2 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full transition-all sm:right-4 sm:size-11",
                  /* Theme-aware buttons */
                  "border border-border/50 bg-background/80 text-foreground/70 shadow-sm backdrop-blur-md",
                  "hover:bg-background hover:text-foreground hover:shadow-md",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  idle ? "opacity-0 motion-reduce:opacity-100" : "opacity-100",
                )}
                aria-label="Next media"
              >
                <ChevronRight className="size-5 sm:size-6" aria-hidden="true" />
              </button>
            </>
          )}
        </div>

        {/* -------------------------------------------------------- */}
        {/*  Thumbnail strip                                          */}
        {/* -------------------------------------------------------- */}
        {count > 1 && (
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 z-30 px-4 pb-4 pt-12 transition-opacity duration-500 sm:px-6 sm:pb-5",
              /* Gradient scrim — adapts to theme */
              "bg-gradient-to-t from-white/80 via-white/40 to-transparent dark:from-neutral-950/80 dark:via-neutral-950/40 dark:to-transparent",
              idle ? "opacity-0 motion-reduce:opacity-100" : "opacity-100",
            )}
          >
            <div
              ref={thumbStripRef}
              className="mx-auto flex max-w-3xl items-center justify-start gap-2 overflow-x-auto overscroll-x-contain scroll-smooth pb-[env(safe-area-inset-bottom)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {safeItems.map((item, i) => {
                const active = i === idx;
                const src = thumb(item);
                return (
                  <button
                    key={item.id ?? `${item.src}-${i}`}
                    type="button"
                    onClick={() => {
                      go(i);
                      resetIdle();
                    }}
                    aria-label={`View media ${i + 1}`}
                    aria-pressed={active}
                    className={cn(
                      "relative size-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all sm:h-16 sm:w-20",
                      active
                        ? "border-primary shadow-md ring-1 ring-primary/30"
                        : "border-border/40 opacity-50 hover:opacity-80 focus-visible:opacity-80",
                      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                    )}
                  >
                    {item.type === "video" &&
                    !item.thumbnailSrc &&
                    !item.posterSrc ? (
                      <span className="flex size-full items-center justify-center bg-muted">
                        <Film
                          className="size-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </span>
                    ) : (
                      <AppImage
                        src={src}
                        alt={item.alt || `Thumbnail ${i + 1}`}
                        width={160}
                        height={90}
                        className="size-full object-cover"
                      />
                    )}
                    {item.type === "video" && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/25 dark:bg-black/40">
                        <Film
                          className="size-3 text-white"
                          aria-hidden="true"
                        />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
