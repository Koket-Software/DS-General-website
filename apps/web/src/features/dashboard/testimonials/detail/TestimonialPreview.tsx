import { AppImage } from "@/components/common/AppImage";
import {
  DashboardPreviewCard,
  DashboardPreviewPanel,
  DashboardPreviewRow,
} from "@/features/dashboard/components/detail/DashboardPreviewPrimitives";

interface TestimonialPreviewProps {
  comment?: string;
  companyName?: string;
  spokePersonName?: string;
  spokePersonTitle?: string;
  companyLogoUrl?: string | null;
  spokePersonHeadshotUrl?: string | null;
  partnerLabel?: string;
}

export function TestimonialPreview({
  comment,
  companyName,
  spokePersonName,
  spokePersonTitle,
  companyLogoUrl,
  spokePersonHeadshotUrl,
  partnerLabel,
}: TestimonialPreviewProps) {
  const normalizedComment = comment?.trim();
  const normalizedCompany = companyName?.trim();
  const normalizedSpokesperson = spokePersonName?.trim();
  const normalizedRole = spokePersonTitle?.trim();
  const normalizedPartner = partnerLabel?.trim();

  return (
    <DashboardPreviewPanel title="Testimonial Preview">
      <DashboardPreviewCard title={normalizedCompany || "Company"}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {companyLogoUrl ? (
            <div className="rounded-lg border bg-muted/20 p-3">
              <AppImage
                src={companyLogoUrl}
                alt={normalizedCompany || "Company logo"}
                width={220}
                height={100}
                className="h-20 w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex h-20 items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
              Company logo preview
            </div>
          )}

          {spokePersonHeadshotUrl ? (
            <div className="flex items-center justify-center rounded-lg border bg-muted/20 p-3">
              <AppImage
                src={spokePersonHeadshotUrl}
                alt={normalizedSpokesperson || "Spokesperson headshot"}
                width={96}
                height={96}
                className="h-16 w-16 rounded-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-20 items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
              Headshot preview
            </div>
          )}
        </div>

        <DashboardPreviewRow
          label="Comment"
          value={normalizedComment || "No testimonial comment provided yet."}
          muted={!normalizedComment}
        />
      </DashboardPreviewCard>

      <DashboardPreviewCard title="Spokesperson">
        <DashboardPreviewRow
          label="Name"
          value={normalizedSpokesperson || "Not provided"}
          muted={!normalizedSpokesperson}
        />
        <DashboardPreviewRow
          label="Title"
          value={normalizedRole || "Not provided"}
          muted={!normalizedRole}
        />
        <DashboardPreviewRow
          label="Linked Partner"
          value={normalizedPartner || "Not linked"}
          muted={!normalizedPartner}
        />
      </DashboardPreviewCard>
    </DashboardPreviewPanel>
  );
}
