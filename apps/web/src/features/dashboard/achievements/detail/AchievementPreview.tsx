import { AppImage } from "@/components/common/AppImage";
import {
  DashboardPreviewCard,
  DashboardPreviewPanel,
  DashboardPreviewRow,
  DashboardStatusBadge,
} from "@/features/dashboard/components/detail/DashboardPreviewPrimitives";

interface AchievementPreviewProps {
  title?: string;
  description?: string;
  position?: number;
  isActive?: boolean;
  imageUrl?: string | null;
}

export function AchievementPreview({
  title,
  description,
  position,
  isActive,
  imageUrl,
}: AchievementPreviewProps) {
  const normalizedTitle = title?.trim();
  const normalizedDescription = description?.trim();

  return (
    <DashboardPreviewPanel title="Achievement Preview">
      <DashboardPreviewCard title="Certificate">
        {imageUrl ? (
          <AppImage
            src={imageUrl}
            alt={normalizedTitle || "Achievement certificate"}
            width={720}
            height={400}
            className="h-44 w-full rounded-lg border object-cover"
          />
        ) : (
          <div className="flex h-44 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            Add an image to preview the certificate.
          </div>
        )}
      </DashboardPreviewCard>

      <DashboardPreviewCard title={normalizedTitle || "Untitled Achievement"}>
        <DashboardPreviewRow
          label="Description"
          value={normalizedDescription || "No description provided yet."}
          muted={!normalizedDescription}
        />
        <DashboardPreviewRow
          label="Position"
          value={Number.isFinite(position) ? String(position) : "0"}
        />
        <DashboardPreviewRow
          label="Status"
          value={<DashboardStatusBadge active={Boolean(isActive)} />}
        />
      </DashboardPreviewCard>
    </DashboardPreviewPanel>
  );
}
