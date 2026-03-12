import { ChevronLeft, ChevronRight, Film, ImageIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { AppImage } from "@/components/common/AppImage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

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

interface MediaPreviewDialogProps {
  items: PreviewMediaItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialIndex?: number;
  title?: string;
  description?: string;
  className?: string;
}

const clampIndex = (value: number, max: number) => {
  if (max <= 0) return 0;
  return Math.min(Math.max(value, 0), max - 1);
};

export function MediaPreviewDialog({
  items,
  open,
  onOpenChange,
  initialIndex = 0,
  title = "Media Preview",
  description,
  className,
}: MediaPreviewDialogProps) {
  const [activeIndex, setActiveIndex] = useState(() =>
    clampIndex(initialIndex, items.length),
  );

  const safeItems = useMemo(() => items.filter((item) => !!item.src), [items]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setActiveIndex(clampIndex(initialIndex, safeItems.length));
  }, [initialIndex, open, safeItems.length]);

  useEffect(() => {
    setActiveIndex((current) => clampIndex(current, safeItems.length));
  }, [safeItems.length]);

  const goTo = useCallback(
    (nextIndex: number) => {
      setActiveIndex(clampIndex(nextIndex, safeItems.length));
    },
    [safeItems.length],
  );

  const goToPrevious = useCallback(() => {
    if (safeItems.length <= 1) return;
    setActiveIndex((current) =>
      current === 0 ? safeItems.length - 1 : current - 1,
    );
  }, [safeItems.length]);

  const goToNext = useCallback(() => {
    if (safeItems.length <= 1) return;
    setActiveIndex((current) =>
      current === safeItems.length - 1 ? 0 : current + 1,
    );
  }, [safeItems.length]);

  useEffect(() => {
    if (!open || safeItems.length <= 1) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPrevious();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goToNext, goToPrevious, open, safeItems.length]);

  const currentItem = safeItems[activeIndex];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className={cn(
          "h-[min(86vh,52rem)] max-h-[92vh] w-[calc(100vw-1rem)] md:w-[calc(100vw-2rem)] max-w-[calc(var(--landing-content-max)+(var(--landing-gutter-mobile)*2))] md:max-w-[calc(var(--landing-content-max)+(var(--landing-gutter-desktop)*2))] overflow-x-hidden overflow-y-auto overscroll-contain border border-primary/15",
          "bg-[radial-gradient(circle_at_14%_12%,color-mix(in_oklch,var(--primary)_14%,var(--background)),var(--background)_42%),linear-gradient(180deg,color-mix(in_oklch,var(--primary)_4%,var(--background)),var(--background))] p-0 text-foreground shadow-[0_30px_90px_color-mix(in_oklch,var(--primary)_18%,transparent)] dark:bg-[radial-gradient(circle_at_14%_12%,color-mix(in_oklch,var(--primary)_16%,var(--background)),color-mix(in_oklch,var(--background)_92%,black)_46%),linear-gradient(180deg,color-mix(in_oklch,var(--primary)_9%,var(--background)),color-mix(in_oklch,var(--background)_94%,black))]",
          className,
        )}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description ?? title}</DialogDescription>
        </DialogHeader>

        <div className="mx-auto grid h-full w-full max-w-[min(100%,72rem)] grid-rows-[auto_minmax(0,1fr)_auto]">
          <header className="border-b border-primary/10 bg-background/80 px-4 py-3 backdrop-blur-sm sm:px-6 sm:py-4 dark:bg-background/70">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 space-y-1">
                <p className="text-[0.65rem] font-medium tracking-[0.22em] text-primary/70 uppercase">
                  Media Preview
                </p>
                <h2 className="truncate text-sm font-semibold sm:text-base">
                  {currentItem?.title ?? title}
                </h2>
                {currentItem?.description && (
                  <p className="line-clamp-2 text-xs text-muted-foreground sm:text-sm">
                    {currentItem.description}
                  </p>
                )}
              </div>

              {safeItems.length > 0 && (
                <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {activeIndex + 1} / {safeItems.length}
                </div>
              )}
            </div>
          </header>

          <div className="relative min-h-0 flex-1 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--primary)_4%,var(--background)),var(--background))] dark:bg-[linear-gradient(180deg,color-mix(in_oklch,var(--primary)_10%,var(--background)),color-mix(in_oklch,var(--background)_94%,black))]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_oklch,var(--primary)_8%,transparent),transparent_60%)]" />

            <div className="relative flex h-full items-center justify-center p-4 sm:p-8 lg:px-12">
              {!currentItem ? (
                <div className="flex h-full w-full max-w-[min(100%,64rem)] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-primary/20 bg-primary/5 text-muted-foreground dark:bg-primary/10">
                  <ImageIcon className="size-10" />
                  <p className="text-sm">No media assets available.</p>
                </div>
              ) : currentItem.type === "video" ? (
                <video
                  key={currentItem.src}
                  className="mx-auto max-h-[calc(100dvh-23rem)] w-full max-w-[min(100%,64rem)] rounded-xl border border-primary/15 bg-black/95 object-contain shadow-[0_20px_50px_color-mix(in_oklch,var(--primary)_16%,transparent)] lg:max-h-[calc(100dvh-26rem)]"
                  controls
                  playsInline
                  preload="metadata"
                  poster={currentItem.posterSrc || currentItem.thumbnailSrc}
                  src={currentItem.src}
                />
              ) : (
                <div className="custom-scrollbar mx-auto w-full max-w-[min(100%,64rem)] overflow-x-auto overflow-y-hidden rounded-xl border border-primary/15 bg-background/80 shadow-[0_20px_50px_color-mix(in_oklch,var(--primary)_16%,transparent)] dark:bg-background/70">
                  <div className="flex w-fit min-w-full justify-center p-2 sm:p-3">
                    <AppImage
                      src={currentItem.src}
                      alt={
                        currentItem.alt || currentItem.title || "Media preview"
                      }
                      width={1920}
                      height={1080}
                      className="block h-auto max-h-[calc(100dvh-24rem)] w-auto max-w-none object-contain lg:max-h-[calc(100dvh-27rem)]"
                    />
                  </div>
                </div>
              )}
            </div>

            {safeItems.length > 1 && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={goToPrevious}
                  className="absolute top-1/2 left-3 h-10 w-10 -translate-y-1/2 touch-manipulation rounded-full border border-primary/20 bg-background/85 text-primary shadow-sm hover:bg-background dark:bg-background/70 dark:hover:bg-background/85"
                  aria-label="Show previous media"
                >
                  <ChevronLeft className="size-5" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={goToNext}
                  className="absolute top-1/2 right-3 h-10 w-10 -translate-y-1/2 touch-manipulation rounded-full border border-primary/20 bg-background/85 text-primary shadow-sm hover:bg-background dark:bg-background/70 dark:hover:bg-background/85"
                  aria-label="Show next media"
                >
                  <ChevronRight className="size-5" />
                </Button>
              </>
            )}
          </div>

          {safeItems.length > 0 && (
            <footer className="relative z-10 min-h-[5.25rem] border-t border-primary/10 bg-background/75 px-3 py-3 backdrop-blur-sm sm:min-h-[6rem] sm:px-5 lg:min-h-[7.25rem] dark:bg-background/65">
              <div className="custom-scrollbar flex snap-x items-center gap-2 overflow-x-auto pb-1 lg:justify-center">
                {safeItems.map((item, index) => {
                  const thumbSrc =
                    item.thumbnailSrc || item.posterSrc || item.src;
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={item.id ?? `${item.src}-${index}`}
                      type="button"
                      aria-label={`Open media ${index + 1}`}
                      onClick={() => goTo(index)}
                      className={cn(
                        "group relative h-14 w-20 shrink-0 snap-start touch-manipulation overflow-hidden rounded-md border transition sm:h-16 sm:w-24 lg:h-20 lg:w-32",
                        isActive
                          ? "border-primary/80 ring-2 ring-primary/35"
                          : "border-primary/20 opacity-80 hover:opacity-100",
                      )}
                    >
                      {item.type === "video" &&
                      !item.thumbnailSrc &&
                      !item.posterSrc ? (
                        <div className="flex h-full w-full items-center justify-center bg-primary/10">
                          <Film className="size-5 text-primary/70" />
                        </div>
                      ) : (
                        <AppImage
                          src={thumbSrc}
                          alt={item.alt || `Thumbnail ${index + 1}`}
                          width={320}
                          height={180}
                          className="h-full w-full object-cover"
                        />
                      )}

                      {item.type === "video" && (
                        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-primary/20">
                          <span className="rounded-full border border-primary/30 bg-background/90 p-1.5 dark:bg-background/80">
                            <Film className="size-3 text-primary" />
                          </span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </footer>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
