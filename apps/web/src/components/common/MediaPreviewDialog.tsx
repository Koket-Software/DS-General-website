import { ChevronLeft, ChevronRight, Film, ImageIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { AppImage } from "@/components/common/AppImage";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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

const getMediaLabel = (type: PreviewMediaType) =>
  type === "video" ? "Video" : "Image";

const getThumbnailSource = (item: PreviewMediaItem) =>
  item.thumbnailSrc || item.posterSrc || item.src;

export function MediaPreviewDialog({
  items,
  open,
  onOpenChange,
  initialIndex = 0,
  title = "Media Preview",
  description,
  className,
}: MediaPreviewDialogProps) {
  const safeItems = useMemo(() => items.filter((item) => !!item.src), [items]);
  const [activeIndex, setActiveIndex] = useState(() =>
    clampIndex(initialIndex, safeItems.length),
  );

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
  const currentTitle = currentItem?.title ?? title;
  const currentDescription = currentItem?.description ?? description;
  const currentAlt = currentItem?.alt || currentTitle || "Media preview";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className={cn(
          "h-[min(96dvh,58rem)] max-h-[96dvh] w-[calc(100vw-0.75rem)] max-w-[82rem] overflow-hidden overscroll-contain border border-primary/15 bg-transparent p-0 shadow-[0_40px_120px_color-mix(in_oklch,var(--primary)_22%,transparent)] sm:w-[calc(100vw-2rem)]",
          className,
        )}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{currentTitle}</DialogTitle>
          <DialogDescription>
            {currentDescription ?? currentTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-[1.6rem] border border-primary/15 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklch,var(--primary)_12%,var(--background)),transparent_34%),radial-gradient(circle_at_bottom_right,color-mix(in_oklch,var(--primary)_10%,transparent),transparent_34%),linear-gradient(180deg,color-mix(in_oklch,var(--background)_94%,white),color-mix(in_oklch,var(--background)_98%,black))] text-foreground dark:bg-[radial-gradient(circle_at_top_left,color-mix(in_oklch,var(--primary)_18%,var(--background)),transparent_32%),radial-gradient(circle_at_bottom_right,color-mix(in_oklch,var(--primary)_12%,transparent),transparent_34%),linear-gradient(180deg,color-mix(in_oklch,var(--background)_92%,black),color-mix(in_oklch,var(--background)_96%,black))]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,color-mix(in_oklch,var(--primary)_6%,transparent)_48%,transparent_100%)] opacity-80" />

          <div className="relative grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,1fr)_22rem] lg:grid-rows-1">
            <section className="flex min-h-0 flex-col lg:border-r lg:border-primary/10">
              <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-4 sm:px-6 sm:pb-4 sm:pt-6 lg:px-8">
                <div className="min-w-0 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-primary/20 bg-background/75 px-3 py-1 text-[0.65rem] tracking-[0.2em] uppercase backdrop-blur"
                    >
                      Media Viewer
                    </Badge>
                    {currentItem ? (
                      <Badge
                        variant="outline"
                        className="border-primary/15 bg-primary/8 px-3 py-1 text-[0.65rem] tracking-[0.18em] uppercase text-primary"
                      >
                        {getMediaLabel(currentItem.type)}
                      </Badge>
                    ) : null}
                  </div>

                  <div className="min-w-0 space-y-1.5">
                    <h2 className="max-w-3xl text-balance font-sans text-lg font-semibold tracking-[-0.02em] sm:text-2xl lg:text-[1.9rem]">
                      {currentTitle}
                    </h2>
                    {currentDescription ? (
                      <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-[0.95rem]">
                        {currentDescription}
                      </p>
                    ) : null}
                  </div>
                </div>

                {safeItems.length > 0 ? (
                  <div className="rounded-full border border-primary/15 bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground/80 backdrop-blur-sm sm:px-4 sm:text-sm">
                    {activeIndex + 1} / {safeItems.length}
                  </div>
                ) : null}
              </div>

              <div className="min-h-0 flex-1 px-3 pb-3 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8">
                <div className="relative flex h-full min-h-[19rem] items-center justify-center overflow-hidden rounded-[1.5rem] border border-primary/12 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--background)_94%,white),color-mix(in_oklch,var(--background)_88%,black))] shadow-[inset_0_1px_0_color-mix(in_oklch,white_55%,transparent),0_24px_70px_color-mix(in_oklch,var(--primary)_14%,transparent)] dark:bg-[linear-gradient(180deg,color-mix(in_oklch,var(--background)_76%,black),color-mix(in_oklch,var(--background)_92%,black))]">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--primary)_10%,transparent),transparent)]" />

                  {!currentItem ? (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center text-muted-foreground">
                      <div className="rounded-full border border-primary/15 bg-primary/8 p-4 text-primary">
                        <ImageIcon aria-hidden="true" className="size-8" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-base font-medium text-foreground">
                          No media available
                        </p>
                        <p className="text-sm text-muted-foreground">
                          This item does not include a previewable asset yet.
                        </p>
                      </div>
                    </div>
                  ) : currentItem.type === "video" ? (
                    <div className="flex h-full w-full items-center justify-center p-3 sm:p-5 lg:p-6">
                      <video
                        key={currentItem.src}
                        className="max-h-full w-full rounded-[1.15rem] border border-primary/10 bg-black object-contain shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
                        controls
                        playsInline
                        preload="metadata"
                        poster={
                          currentItem.posterSrc || currentItem.thumbnailSrc
                        }
                        src={currentItem.src}
                      />
                    </div>
                  ) : (
                    <ScrollArea className="h-full w-full">
                      <div className="flex min-h-full min-w-full items-center justify-center p-4 sm:p-6 lg:p-8">
                        <AppImage
                          src={currentItem.src}
                          alt={currentAlt}
                          width={1920}
                          height={1080}
                          className="block h-auto max-h-[68vh] w-auto max-w-none rounded-[1rem] object-contain shadow-[0_18px_60px_color-mix(in_oklch,var(--primary)_18%,transparent)] lg:max-h-[42rem]"
                        />
                      </div>
                    </ScrollArea>
                  )}
                </div>
              </div>
            </section>

            <aside className="flex min-h-0 flex-col border-t border-primary/10 bg-background/72 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:border-t-0 lg:pb-0">
              <div className="space-y-3 px-3 py-3 sm:space-y-4 sm:px-5 sm:py-5">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="rounded-[1.05rem] border border-primary/12 bg-primary/6 p-2.5 sm:rounded-[1.25rem] sm:p-3">
                    <p className="text-[0.68rem] tracking-[0.18em] text-muted-foreground uppercase">
                      Asset
                    </p>
                    <p className="mt-2 text-lg font-semibold tracking-[-0.03em]">
                      {safeItems.length > 0 ? `${activeIndex + 1}` : "0"}
                    </p>
                  </div>
                  <div className="rounded-[1.05rem] border border-primary/12 bg-background/80 p-2.5 sm:rounded-[1.25rem] sm:p-3">
                    <p className="text-[0.68rem] tracking-[0.18em] text-muted-foreground uppercase">
                      Format
                    </p>
                    <p className="mt-2 text-lg font-semibold tracking-[-0.03em]">
                      {currentItem ? getMediaLabel(currentItem.type) : "None"}
                    </p>
                  </div>
                </div>

                {safeItems.length > 1 ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={goToPrevious}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "h-10 touch-manipulation justify-center rounded-full border-primary/15 bg-background/80 backdrop-blur-sm",
                      )}
                      aria-label="Show previous media"
                    >
                      <ChevronLeft aria-hidden="true" className="size-4" />
                      <span className="sm:hidden">Prev</span>
                      <span className="hidden sm:inline">Previous</span>
                    </button>
                    <button
                      type="button"
                      onClick={goToNext}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "h-10 touch-manipulation justify-center rounded-full border-primary/15 bg-background/80 backdrop-blur-sm",
                      )}
                      aria-label="Show next media"
                    >
                      <span>Next</span>
                      <ChevronRight aria-hidden="true" className="size-4" />
                    </button>
                  </div>
                ) : null}

                <div className="hidden rounded-[1.25rem] border border-primary/12 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--primary)_8%,transparent),transparent)] p-3.5 lg:block">
                  <p className="text-[0.68rem] tracking-[0.18em] text-muted-foreground uppercase">
                    Navigation
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Use thumbnail selection or the left and right arrow keys to
                    move through the collection.
                  </p>
                </div>
              </div>

              <Separator className="bg-primary/10" />

              {safeItems.length > 0 ? (
                <>
                  <div className="px-3 py-2 sm:px-5 lg:hidden">
                    <div className="custom-scrollbar flex gap-2 overflow-x-auto pb-[calc(0.25rem+env(safe-area-inset-bottom))]">
                      {safeItems.map((item, index) => {
                        const isActive = index === activeIndex;
                        const thumbSrc = getThumbnailSource(item);

                        return (
                          <button
                            key={item.id ?? `${item.src}-${index}`}
                            type="button"
                            onClick={() => goTo(index)}
                            aria-label={`Open media ${index + 1}`}
                            aria-pressed={isActive}
                            className={cn(
                              "group relative h-[4.5rem] w-24 shrink-0 touch-manipulation overflow-hidden rounded-[1rem] border transition-[opacity,border-color,box-shadow] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2",
                              isActive
                                ? "border-primary/60 shadow-[0_10px_30px_color-mix(in_oklch,var(--primary)_18%,transparent)]"
                                : "border-primary/15 opacity-75 hover:opacity-100",
                            )}
                          >
                            {item.type === "video" &&
                            !item.thumbnailSrc &&
                            !item.posterSrc ? (
                              <div className="flex h-full w-full items-center justify-center bg-primary/10">
                                <Film
                                  aria-hidden="true"
                                  className="size-4 text-primary/70"
                                />
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
                            {item.type === "video" ? (
                              <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/15">
                                <span className="rounded-full border border-white/25 bg-black/55 p-1.5 text-white backdrop-blur-sm">
                                  <Film aria-hidden="true" className="size-3" />
                                </span>
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="hidden min-h-0 flex-1 lg:flex lg:flex-col">
                    <div className="px-5 py-3">
                      <p className="text-[0.68rem] tracking-[0.18em] text-muted-foreground uppercase">
                        Collection
                      </p>
                    </div>
                    <ScrollArea className="min-h-0 flex-1 px-5 pb-5">
                      <div className="grid grid-cols-2 gap-3 pr-3">
                        {safeItems.map((item, index) => {
                          const isActive = index === activeIndex;
                          const thumbSrc = getThumbnailSource(item);

                          return (
                            <button
                              key={item.id ?? `${item.src}-${index}`}
                              type="button"
                              onClick={() => goTo(index)}
                              aria-label={`Open media ${index + 1}`}
                              aria-pressed={isActive}
                              className={cn(
                                "group relative aspect-[4/3] touch-manipulation overflow-hidden rounded-[1.05rem] border text-left transition-[transform,opacity,border-color,box-shadow] motion-reduce:translate-y-0 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2",
                                isActive
                                  ? "border-primary/65 shadow-[0_12px_30px_color-mix(in_oklch,var(--primary)_20%,transparent)]"
                                  : "border-primary/15 opacity-80 hover:-translate-y-0.5 hover:opacity-100",
                              )}
                            >
                              {item.type === "video" &&
                              !item.thumbnailSrc &&
                              !item.posterSrc ? (
                                <div className="flex h-full w-full items-center justify-center bg-primary/10">
                                  <Film
                                    aria-hidden="true"
                                    className="size-5 text-primary/70"
                                  />
                                </div>
                              ) : (
                                <AppImage
                                  src={thumbSrc}
                                  alt={item.alt || `Thumbnail ${index + 1}`}
                                  width={320}
                                  height={240}
                                  className="h-full w-full object-cover transition-transform duration-300 motion-reduce:transition-none motion-reduce:group-hover:scale-100 group-hover:scale-[1.04]"
                                />
                              )}

                              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent px-3 pb-2 pt-6 text-white">
                                <div className="flex items-center justify-between gap-2 text-xs">
                                  <span className="truncate font-medium">
                                    {index + 1}
                                  </span>
                                  <span className="text-white/75">
                                    {getMediaLabel(item.type)}
                                  </span>
                                </div>
                              </div>

                              {item.type === "video" ? (
                                <span className="pointer-events-none absolute right-2 top-2 rounded-full border border-white/20 bg-black/50 p-1 text-white backdrop-blur-sm">
                                  <Film aria-hidden="true" className="size-3" />
                                </span>
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </div>
                </>
              ) : null}
            </aside>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
