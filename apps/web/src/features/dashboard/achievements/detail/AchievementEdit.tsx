import { AchievementForm } from "../AchievementForm";
import { useAchievementByIdQuery } from "../lib/achievements-query";

interface AchievementEditProps {
  achievementId: number;
}

export default function AchievementEdit({
  achievementId,
}: AchievementEditProps) {
  const { data, isPending, isError, error } =
    useAchievementByIdQuery(achievementId);

  if (isPending) return <div className="p-8">Loading achievement...</div>;
  if (isError || !data?.data) {
    return (
      <div className="p-8 text-destructive">
        Failed to load achievement{error ? `: ${error.message}` : ""}
      </div>
    );
  }

  return <AchievementForm mode="edit" achievement={data.data} />;
}
