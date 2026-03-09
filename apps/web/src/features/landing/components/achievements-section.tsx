import { useMemo, useState } from "react";

import { SectionHeader } from "./section-header";

import { AppImage } from "@/components/common/AppImage";
import {
  MediaPreviewDialog,
  type PreviewMediaItem,
} from "@/components/common/MediaPreviewDialog";
import {
  getAchievementImageUrl,
  usePublicAchievementsQuery,
} from "@/lib/achievements";

export function AchievementsSection() {
  const [activePreviewId, setActivePreviewId] = useState<number | null>(null);

  const achievementsQuery = usePublicAchievementsQuery({
    page: 1,
    limit: 6,
  });

  const achievements = useMemo(
    () => achievementsQuery.data?.data ?? [],
    [achievementsQuery.data?.data],
  );
  const hasAchievements = achievements.length > 0;
  const previewItems = useMemo<PreviewMediaItem[]>(
    () =>
      achievements
        .map((achievement) => ({
          id: achievement.id,
          type: "image" as const,
          src: getAchievementImageUrl(achievement.imageUrl) ?? "",
          alt: `${achievement.title} certificate`,
          title: achievement.title,
          description: achievement.description,
        }))
        .filter((item) => item.src),
    [achievements],
  );

  const activePreviewIndex = useMemo(() => {
    if (activePreviewId === null) return 0;
    const index = previewItems.findIndex((item) => item.id === activePreviewId);
    return index >= 0 ? index : 0;
  }, [activePreviewId, previewItems]);

  if (achievementsQuery.isError) {
    return null;
  }

  if (
    achievementsQuery.isSuccess &&
    (!hasAchievements || previewItems.length === 0)
  ) {
    return null;
  }

  return (
    <section className="landing-container landing-section">
      <SectionHeader
        label="/Achievements"
        title="Certified Milestones That Prove Consistent Delivery"
        maxWidth="760px"
      />

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {achievementsQuery.isPending
          ? Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`achievement-skeleton-${index}`}
                className="h-[320px] border border-border bg-muted/60 animate-pulse"
              />
            ))
          : achievements.slice(0, 6).map((achievement) => {
              const imageUrl = getAchievementImageUrl(achievement.imageUrl);

              return (
                <button
                  key={achievement.id}
                  type="button"
                  onClick={() => setActivePreviewId(achievement.id)}
                  className="group relative h-[320px] overflow-hidden border border-border bg-card text-left touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
                  aria-label={`Open preview for ${achievement.title}`}
                >
                  {imageUrl ? (
                    <AppImage
                      src={imageUrl}
                      alt={`${achievement.title} certificate`}
                      width={1200}
                      height={800}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground text-sm">
                      Certificate image unavailable
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-black/55 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-4 p-4 text-white opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                    <h3 className="text-base font-semibold leading-snug text-pretty">
                      {achievement.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm text-white/90">
                      {achievement.description}
                    </p>
                  </div>
                </button>
              );
            })}
      </div>

      <MediaPreviewDialog
        open={activePreviewId !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setActivePreviewId(null);
        }}
        items={previewItems}
        initialIndex={activePreviewIndex}
        title="Achievement Certificate"
      />
    </section>
  );
}
