import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface DashboardPageShellProps {
  title?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function DashboardPageShell({
  title,
  actions,
  children,
  className,
}: DashboardPageShellProps) {
  return (
    <section className={cn("dashboard-page space-y-4", className)}>
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-3">
          {title ? <div className="min-w-0">{title}</div> : <span />}
          {actions ? (
            <div className="flex flex-wrap gap-2">{actions}</div>
          ) : null}
        </header>
      )}
      {children}
    </section>
  );
}
