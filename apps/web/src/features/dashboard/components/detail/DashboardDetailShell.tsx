import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DashboardDetailMode = "create" | "edit" | "view";
export type DashboardDetailMobilePreviewMode = "tabs" | "stack";

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
  mobilePreviewMode?: DashboardDetailMobilePreviewMode;
  initialMobileTab?: "form" | "preview";
  contentClassName?: string;
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
  mobilePreviewMode = "tabs",
  initialMobileTab = "form",
  contentClassName,
}: DashboardDetailShellProps) {
  const [mobileTab, setMobileTab] = useState<"form" | "preview">(
    initialMobileTab,
  );

  const showFormOnMobile =
    mobilePreviewMode === "stack" || mobileTab === "form";
  const showPreviewOnMobile =
    mobilePreviewMode === "stack" || mobileTab === "preview";

  return (
    <div
      className={cn(
        "flex min-h-[calc(100svh-3.25rem)] flex-col",
        contentClassName,
      )}
    >
      <div className="sticky left-0 right-0 top-0 z-20 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-sm md:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-lg font-bold text-balance md:text-2xl">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {headerActions}
            <Button
              type="button"
              variant="outline"
              className="h-9 rounded-none"
              onClick={onBack}
            >
              Back
            </Button>
            {mode !== "view" && (
              <Button
                type="submit"
                form={formId}
                disabled={isSubmitDisabled}
                className="h-9 rounded-none"
              >
                {isSubmitting ? submittingLabel : submitLabel}
              </Button>
            )}
          </div>
        </div>
      </div>

      {mobilePreviewMode === "tabs" && (
        <div className="border-b border-border px-4 py-2 lg:hidden">
          <div className="inline-flex border border-border">
            <Button
              type="button"
              variant={mobileTab === "form" ? "default" : "ghost"}
              className="h-9 rounded-none"
              onClick={() => setMobileTab("form")}
            >
              Form
            </Button>
            <Button
              type="button"
              variant={mobileTab === "preview" ? "default" : "ghost"}
              className="h-9 rounded-none"
              onClick={() => setMobileTab("preview")}
            >
              Preview
            </Button>
          </div>
        </div>
      )}

      <div className="grid flex-1 overflow-hidden lg:grid-cols-2">
        <section
          className={cn(
            "min-w-0 overflow-y-auto border-r border-border px-4 py-4 md:px-6 md:py-6",
            !showFormOnMobile && "hidden lg:block",
          )}
        >
          {children}
        </section>

        <aside
          className={cn(
            "min-w-0 overflow-y-auto bg-muted/30 px-4 py-4 md:px-6 md:py-6",
            !showPreviewOnMobile && "hidden lg:block",
          )}
        >
          {preview}
        </aside>
      </div>
    </div>
  );
}
