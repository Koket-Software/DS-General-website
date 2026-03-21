import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { startTransition, useEffect, useState } from "react";

import { SectionHeader } from "./section-header";

import { AppImage } from "@/components/common/AppImage";
import {
  MediaPreviewDialog,
  type PreviewMediaItem,
} from "@/components/common/MediaPreviewDialog";
import {
  getAchievementImageUrl,
  normalizeAchievementText,
  usePublicAchievementsQuery,
} from "@/lib/achievements";
import { cn } from "@/lib/utils";

const AUTOPLAY_INTERVAL_MS = 7000;
const MAX_VISIBLE_ACHIEVEMENTS = 6;

const slideTransition = {
  duration: 0.52,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function AchievementsSection() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const achievementsQuery = usePublicAchievementsQuery({
    page: 1,
    limit: MAX_VISIBLE_ACHIEVEMENTS,
  });

  const achievements =
    achievementsQuery.data?.data
      ?.slice(0, MAX_VISIBLE_ACHIEVEMENTS)
      .map((achievement) => ({
        ...achievement,
        imageSrc: getAchievementImageUrl(achievement.imageUrl),
        title: normalizeAchievementText(achievement.title),
        description: normalizeAchievementText(achievement.description),
      })) ?? [];
  const hasAchievements = achievements.length > 0;
  const activeAchievement = achievements[activeIndex] ?? null;
  const canRotate = achievements.length > 1;
  const autoPlayEnabled = canRotate && !reduceMotion;
  const previewItems: PreviewMediaItem[] = achievements
    .filter((achievement) => !!achievement.imageSrc)
    .map((achievement) => ({
      id: achievement.id,
      type: "image",
      src: achievement.imageSrc ?? "",
      alt: `${achievement.title} certificate`,
      title: achievement.title,
      description: achievement.description,
      thumbnailSrc: achievement.imageSrc,
    }));
  const activePreviewIndex = activeAchievement
    ? Math.max(
        0,
        previewItems.findIndex((item) => item.id === activeAchievement.id),
      )
    : 0;

  useEffect(() => {
    if (!hasAchievements) {
      setActiveIndex(0);
      return;
    }

    setActiveIndex((currentIndex) =>
      currentIndex >= achievements.length ? 0 : currentIndex,
    );
  }, [achievements.length, hasAchievements]);

  useEffect(() => {
    if (!autoPlayEnabled) {
      return;
    }

    const intervalId = window.setInterval(() => {
      startTransition(() => {
        setActiveIndex((currentIndex) =>
          currentIndex === achievements.length - 1 ? 0 : currentIndex + 1,
        );
      });
    }, AUTOPLAY_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [achievements.length, autoPlayEnabled]);

  if (achievementsQuery.isError) {
    return null;
  }

  if (achievementsQuery.isSuccess && !hasAchievements) {
    return null;
  }

  const goToSlide = (nextIndex: number) => {
    startTransition(() => {
      setActiveIndex(nextIndex);
    });
  };

  const goToPrevious = () => {
    startTransition(() => {
      setActiveIndex((currentIndex) =>
        currentIndex === 0 ? achievements.length - 1 : currentIndex - 1,
      );
    });
  };

  const goToNext = () => {
    startTransition(() => {
      setActiveIndex((currentIndex) =>
        currentIndex === achievements.length - 1 ? 0 : currentIndex + 1,
      );
    });
  };

  return (
    <section className="landing-section">
      <div className="landing-container">
        <SectionHeader
          label="/Achievements"
          title="Verified milestones presented as a living record of delivery"
          maxWidth="820px"
        />
      </div>

      <div className="mt-10">
        {achievementsQuery.isPending ? (
          <div className="relative min-h-[34rem] overflow-hidden bg-[#08111e] md:min-h-[42rem]">
            <div className="absolute inset-0 animate-pulse bg-linear-to-br from-primary/18 via-white/4 to-transparent" />
            <div className="landing-container relative flex min-h-[34rem] flex-col justify-between py-6 md:min-h-[42rem] md:py-8">
              <div className="flex items-center justify-between gap-4">
                <div className="h-8 w-40 bg-white/10" />
                <div className="h-10 w-28 bg-white/10" />
              </div>
              <div className="space-y-4 text-center">
                <div className="mx-auto h-6 w-28 bg-white/10" />
                <div className="mx-auto h-12 w-full max-w-3xl bg-white/10" />
                <div className="mx-auto h-20 w-full max-w-4xl bg-white/10" />
              </div>
              <div className="grid grid-cols-3 gap-3 lg:grid-cols-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={`achievement-showcase-skeleton-${index}`}
                    className="h-10 bg-white/10"
                  />
                ))}
              </div>
            </div>
          </div>
        ) : activeAchievement ? (
          <div
            className="relative isolate min-h-[34rem] overflow-hidden bg-[#08111e] text-white md:min-h-[42rem]"
            aria-label="Achievements showcase"
            aria-roledescription="carousel"
          >
            {activeAchievement.imageSrc ? (
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="absolute inset-0 z-[1] touch-manipulation cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-inset"
                aria-label={`Open ${activeAchievement.title} certificate`}
              />
            ) : null}

            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={activeAchievement.id}
                initial={
                  reduceMotion
                    ? { opacity: 1 }
                    : { opacity: 0, scale: 1.02, filter: "blur(6px)" }
                }
                animate={
                  reduceMotion
                    ? { opacity: 1 }
                    : { opacity: 1, scale: 1, filter: "blur(0px)" }
                }
                exit={
                  reduceMotion
                    ? { opacity: 1 }
                    : { opacity: 0, scale: 0.985, filter: "blur(4px)" }
                }
                transition={reduceMotion ? { duration: 0.01 } : slideTransition}
                className="absolute inset-0"
              >
                {activeAchievement.imageSrc ? (
                  <>
                    <AppImage
                      src={activeAchievement.imageSrc}
                      alt=""
                      aria-hidden
                      width={1800}
                      height={1200}
                      className="absolute inset-0 h-full w-full scale-110 object-cover opacity-45 blur-xl"
                    />
                    <AppImage
                      src={activeAchievement.imageSrc}
                      alt={`${activeAchievement.title} certificate`}
                      width={1800}
                      height={1200}
                      className="absolute inset-0 h-full w-full object-contain px-4 py-6 drop-shadow-[0_30px_90px_rgba(0,0,0,0.55)] md:px-10 md:py-10"
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0b1524]">
                    <p className="text-sm text-white/70">
                      Achievement image unavailable
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div
              className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(73,98,225,0.22),transparent_38%),linear-gradient(180deg,rgba(8,17,30,0.12)_0%,rgba(8,17,30,0.34)_30%,rgba(8,17,30,0.84)_100%)]"
              aria-hidden
            />

            <div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
              aria-hidden
            />

            <div className="landing-container pointer-events-none relative z-10 flex min-h-[34rem] flex-col justify-between py-6 md:min-h-[42rem] md:py-8">
              <div className="flex justify-end">
                <div className="pointer-events-auto flex items-center gap-2">
                  <span className="border border-white/12 bg-black/20 px-4 py-2 font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-white/72 backdrop-blur-md">
                    {String(activeIndex + 1).padStart(2, "0")} /{" "}
                    {String(achievements.length).padStart(2, "0")}
                  </span>
                  {canRotate ? (
                    <>
                      <button
                        type="button"
                        onClick={goToPrevious}
                        className="inline-flex h-11 w-11 touch-manipulation items-center justify-center border border-white/12 bg-black/20 text-white/80 backdrop-blur-md transition-colors hover:border-white/25 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08111e]"
                        aria-label="Show previous achievement"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={goToNext}
                        className="inline-flex h-11 w-11 touch-manipulation items-center justify-center border border-white/12 bg-black/20 text-white/80 backdrop-blur-md transition-colors hover:border-white/25 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08111e]"
                        aria-label="Show next achievement"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center absolute bottom-20 left-0 right-0">
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={`${activeAchievement.id}-copy`}
                    initial={
                      reduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }
                    }
                    animate={
                      reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
                    }
                    exit={
                      reduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }
                    }
                    transition={
                      reduceMotion ? { duration: 0.01 } : slideTransition
                    }
                    className="mt-4"
                  >
                    <h3 className="text-balance break-words font-sans text-[20px] font-semibold leading-[1.05] text-white md:text-[34px]">
                      {activeAchievement.title}
                    </h3>
                    <p className="mx-auto mt-2 max-w-3xl break-words text-pretty font-sans text-[12px] leading-7 text-white/88 md:text-[16px] md:leading-8">
                      {activeAchievement.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="pointer-events-auto grid gap-2 md:grid-cols-2 xl:grid-cols-6">
                {achievements.map((achievement, index) => {
                  const isActive = index === activeIndex;
                  const showCompleted = index < activeIndex;

                  return (
                    <button
                      key={achievement.id}
                      type="button"
                      onClick={() => goToSlide(index)}
                      className={cn(
                        "group flex h-8 min-w-0 touch-manipulation items-center opacity-72 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08111e]",
                        isActive && "opacity-100",
                      )}
                      aria-label={`Show achievement ${index + 1}: ${achievement.title}`}
                      aria-current={isActive}
                    >
                      <div className="h-[2px] w-full overflow-hidden bg-white/18">
                        {isActive ? (
                          <span
                            key={`${achievement.id}-${activeIndex}-${autoPlayEnabled}`}
                            className={cn(
                              "block h-full bg-white",
                              autoPlayEnabled
                                ? "animate-achievement-progress"
                                : "w-full",
                            )}
                            style={
                              autoPlayEnabled
                                ? {
                                    animationDuration: `${AUTOPLAY_INTERVAL_MS}ms`,
                                  }
                                : undefined
                            }
                          />
                        ) : (
                          <span
                            className={cn(
                              "block h-full bg-white/55 transition-[width] duration-300",
                              showCompleted ? "w-full" : "w-0",
                            )}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <MediaPreviewDialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        items={previewItems}
        initialIndex={activePreviewIndex}
        title="Achievement Certificate"
      />
    </section>
  );
}
