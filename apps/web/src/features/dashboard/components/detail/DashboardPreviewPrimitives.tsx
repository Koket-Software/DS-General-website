import { Eye } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DashboardPreviewPanelProps {
  children: ReactNode;
  title?: string;
}

export function DashboardPreviewPanel({
  children,
  title = "Live Preview",
}: DashboardPreviewPanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b pb-2 text-sm text-muted-foreground">
        <Eye className="h-4 w-4" aria-hidden="true" />
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
}

interface DashboardPreviewCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function DashboardPreviewCard({
  title,
  children,
  className,
}: DashboardPreviewCardProps) {
  return (
    <section
      className={cn("space-y-4 rounded-xl border bg-background p-5", className)}
    >
      <h2 className="text-base font-semibold text-balance">{title}</h2>
      {children}
    </section>
  );
}

interface DashboardPreviewRowProps {
  label: string;
  value?: ReactNode;
  muted?: boolean;
}

export function DashboardPreviewRow({
  label,
  value,
  muted = false,
}: DashboardPreviewRowProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div
        className={cn(
          "break-words text-sm",
          muted && "italic text-muted-foreground",
        )}
      >
        {value}
      </div>
    </div>
  );
}

interface DashboardStatusBadgeProps {
  active: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

export function DashboardStatusBadge({
  active,
  activeLabel = "Active",
  inactiveLabel = "Inactive",
}: DashboardStatusBadgeProps) {
  return (
    <Badge variant={active ? "default" : "secondary"}>
      {active ? activeLabel : inactiveLabel}
    </Badge>
  );
}
