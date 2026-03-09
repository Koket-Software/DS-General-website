import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

export type DashboardDetailMode = "create" | "edit" | "view";

interface DashboardDetailShellProps {
  mode: DashboardDetailMode;
  title: string;
  formId: string;
  onBack: () => void;
  preview: ReactNode;
  children: ReactNode;
  isSubmitting?: boolean;
  isSubmitDisabled?: boolean;
  submitLabel?: string;
  submittingLabel?: string;
  headerActions?: ReactNode;
}

export function DashboardDetailShell({
  mode,
  title,
  formId,
  onBack,
  preview,
  children,
  isSubmitting = false,
  isSubmitDisabled = false,
  submitLabel = "Save",
  submittingLabel = "Saving…",
  headerActions,
}: DashboardDetailShellProps) {
  return (
    <div className="flex h-screen flex-col">
      <div className="sticky left-0 right-0 top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-5 md:px-8">
        <h1 className="text-2xl font-bold text-balance">{title}</h1>

        <div className="flex items-center gap-3">
          {headerActions}
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          {mode !== "view" && (
            <Button type="submit" form={formId} disabled={isSubmitDisabled}>
              {isSubmitting ? submittingLabel : submitLabel}
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <section className="w-full overflow-y-auto border-r border-border px-6 py-6 md:px-8 lg:w-1/2">
          {children}

          <div className="mt-8 lg:hidden">{preview}</div>
        </section>

        <aside className="hidden w-1/2 overflow-y-auto bg-muted/30 p-8 lg:block">
          {preview}
        </aside>
      </div>
    </div>
  );
}
