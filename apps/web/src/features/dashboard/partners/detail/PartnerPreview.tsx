import { AppImage } from "@/components/common/AppImage";
import {
  DashboardPreviewCard,
  DashboardPreviewPanel,
  DashboardPreviewRow,
} from "@/features/dashboard/components/detail/DashboardPreviewPrimitives";

interface PartnerPreviewProps {
  title?: string;
  description?: string;
  websiteUrl?: string;
  logoUrl?: string | null;
}

export function PartnerPreview({
  title,
  description,
  websiteUrl,
  logoUrl,
}: PartnerPreviewProps) {
  const normalizedTitle = title?.trim();
  const normalizedDescription = description?.trim();
  const normalizedWebsite = websiteUrl?.trim();

  return (
    <DashboardPreviewPanel title="Partner Preview">
      <DashboardPreviewCard title="Brand">
        {logoUrl ? (
          <div className="flex h-36 items-center justify-center rounded-lg border bg-muted/20 p-4">
            <AppImage
              src={logoUrl}
              alt={normalizedTitle || "Partner logo"}
              width={220}
              height={120}
              className="max-h-full w-auto max-w-full object-contain"
            />
          </div>
        ) : (
          <div className="flex h-36 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            Add a logo to preview the partner brand.
          </div>
        )}
      </DashboardPreviewCard>

      <DashboardPreviewCard title={normalizedTitle || "Untitled Partner"}>
        <DashboardPreviewRow
          label="Website"
          value={normalizedWebsite || "No website provided yet."}
          muted={!normalizedWebsite}
        />
        <DashboardPreviewRow
          label="Description"
          value={normalizedDescription || "No description provided yet."}
          muted={!normalizedDescription}
        />
      </DashboardPreviewCard>
    </DashboardPreviewPanel>
  );
}
