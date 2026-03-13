import { ChevronLeft, ChevronRight, Film, ImageIcon, X } from "lucide-react";
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

  /* --- index state ------------------------------------------------ */
  const [idx, setIdx] = useState(() => clamp(initialIndex, count));

  useEffect(() => {
    if (open) setIdx(clamp(initialIndex, count));
  }, [initialIndex, open, count]);

  useEffect(() => {
    setIdx((c) => clamp(c, count));
  }, [count]);

  const go = useCallback((n: number) => setIdx(clamp(n, count)), [count]);

  const prev = useCallback(
    () => count > 1 && setIdx((c) => (c === 0 ? count - 1 : c - 1)),
    [count],
  );
  const next = useCallback(
    () => count > 1 && setIdx((c) => (c === count - 1 ? 0 : c + 1)),
    [count],
  );

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "fixed inset-0 top-0 left-0 h-dvh w-dvw max-w-none translate-x-0 translate-y-0 rounded-none border-0 bg-black/95 p-0 shadow-none backdrop-blur-xl data-[state=open]:zoom-in-100 data-[state=closed]:zoom-out-100 sm:max-w-none",
          className,
        )}
        onPointerMove={resetIdle}
        onPointerDown={resetIdle}
      >
        {/* Accessible header - sr only */}
        <DialogTitle className="sr-only">{currentTitle}</DialogTitle>
        <DialogDescription className="sr-only">
          {description ?? currentTitle}
        </DialogDescription>

        {/* ---- top bar ------------------------------------------- */}
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between bg-gradient-to-b from-black/70 via-black/30 to-transparent px-4 pb-10 pt-4 transition-opacity duration-500 sm:px-6 sm:pt-5",
            idle && count > 0
              ? "opacity-0 motion-reduce:opacity-100"
              : "opacity-100",
          )}
        >
          {/* Title + counter */}
          <div className="pointer-events-auto min-w-0 flex-1">
            <h2 className="truncate text-sm font-medium tracking-wide text-white/90 sm:text-base">
              {currentTitle}
            </h2>
            {count > 1 && (
              <p className="mt-0.5 text-xs tabular-nums text-white/50">
                {idx + 1} of {count}
              </p>
            )}
          </div>

          {/* Close */}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="pointer-events-auto -mr-1 ml-4 flex size-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
            aria-label="Close media preview"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* ---- main viewport ------------------------------------- */}
        <div className="relative flex h-full w-full items-center justify-center">
          {!current ? (
            /* empty state */
            <div className="flex flex-col items-center gap-4 px-8 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <ImageIcon
                  className="size-7 text-white/40"
                  aria-hidden="true"
                />
              </div>
              <div className="space-y-1">
                <p className="text-base font-medium text-white/80">
                  No Media Available
                </p>
                <p className="text-sm text-white/40">Nothing to preview yet.</p>
              </div>
            </div>
          ) : current.type === "video" ? (
            <video
              key={current.src}
              className="max-h-[calc(100dvh-10rem)] w-auto max-w-[calc(100vw-2rem)] rounded-lg object-contain sm:max-w-[calc(100vw-6rem)]"
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
              className="max-h-[calc(100dvh-10rem)] w-auto max-w-[calc(100vw-2rem)] select-none rounded-lg object-contain sm:max-w-[calc(100vw-6rem)]"
              draggable={false}
            />
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
                  "absolute left-2 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white/80 backdrop-blur-sm transition-all hover:bg-black/60 hover:text-white focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none sm:left-4 sm:size-11",
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
                  "absolute right-2 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white/80 backdrop-blur-sm transition-all hover:bg-black/60 hover:text-white focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none sm:right-4 sm:size-11",
                  idle ? "opacity-0 motion-reduce:opacity-100" : "opacity-100",
                )}
                aria-label="Next media"
              >
                <ChevronRight className="size-5 sm:size-6" aria-hidden="true" />
              </button>
            </>
          )}
        </div>

        {/* ---- thumbnail strip ----------------------------------- */}
        {count > 1 && (
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-4 pt-10 transition-opacity duration-500 sm:px-6 sm:pb-5",
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
                        ? "border-white ring-1 ring-white/30"
                        : "border-transparent opacity-50 hover:opacity-80 focus-visible:opacity-80",
                      "focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none",
                    )}
                  >
                    {item.type === "video" &&
                    !item.thumbnailSrc &&
                    !item.posterSrc ? (
                      <span className="flex size-full items-center justify-center bg-white/10">
                        <Film
                          className="size-4 text-white/60"
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
                      <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Film
                          className="size-3 text-white/80"
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
