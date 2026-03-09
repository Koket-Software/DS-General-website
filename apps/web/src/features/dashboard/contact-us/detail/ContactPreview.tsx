import {
  DashboardPreviewCard,
  DashboardPreviewPanel,
  DashboardPreviewRow,
  DashboardStatusBadge,
} from "@/features/dashboard/components/detail/DashboardPreviewPrimitives";

interface ContactPreviewProps {
  fullName?: string;
  contact?: string;
  message?: string;
  serviceId?: number | null;
  isHandled?: boolean;
}

export function ContactPreview({
  fullName,
  contact,
  message,
  serviceId,
  isHandled,
}: ContactPreviewProps) {
  const normalizedName = fullName?.trim();
  const normalizedContact = contact?.trim();
  const normalizedMessage = message?.trim();

  return (
    <DashboardPreviewPanel title="Contact Preview">
      <DashboardPreviewCard title={normalizedName || "Unnamed Contact"}>
        <DashboardPreviewRow
          label="Contact"
          value={normalizedContact || "No contact provided yet."}
          muted={!normalizedContact}
        />
        <DashboardPreviewRow
          label="Message"
          value={normalizedMessage || "No message provided yet."}
          muted={!normalizedMessage}
        />
        <DashboardPreviewRow
          label="Service ID"
          value={serviceId ?? "Not set"}
          muted={serviceId === null || serviceId === undefined}
        />
        <DashboardPreviewRow
          label="Status"
          value={
            <DashboardStatusBadge
              active={Boolean(isHandled)}
              activeLabel="Handled"
              inactiveLabel="Pending"
            />
          }
        />
      </DashboardPreviewCard>
    </DashboardPreviewPanel>
  );
}
