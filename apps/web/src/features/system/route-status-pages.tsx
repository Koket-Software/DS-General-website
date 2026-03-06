import type {
  ErrorComponentProps,
  NotFoundRouteProps,
} from "@tanstack/react-router";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ArrowLeft,
  Compass,
  Home,
  LifeBuoy,
  Radar,
  RefreshCcw,
  Search,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tone = "notFound" | "error";

type StatusShellProps = {
  tone: Tone;
  code: string;
  eyebrow: string;
  title: string;
  description: string;
  detail: string;
  primaryAction: ReactNode;
  secondaryAction: ReactNode;
  tertiaryAction?: ReactNode;
};

const toneStyles: Record<
  Tone,
  {
    badge: string;
    halo: string;
    panel: string;
    iconWrap: string;
    orbit: string;
    signal: string;
  }
> = {
  notFound: {
    badge: "border-info/20 bg-info/10 text-info",
    halo: "from-info/20 via-primary/10 to-transparent dark:from-info/25 dark:via-primary/15",
    panel:
      "border-border/50 bg-white/75 shadow-[0_30px_120px_-50px_rgba(73,98,225,0.55)] dark:bg-card/75",
    iconWrap: "bg-info/12 text-info ring-1 ring-info/20",
    orbit: "border-info/30",
    signal: "bg-info/70",
  },
  error: {
    badge: "border-destructive/20 bg-destructive/10 text-destructive",
    halo: "from-destructive/20 via-primary/10 to-transparent dark:from-destructive/25 dark:via-primary/15",
    panel:
      "border-border/50 bg-white/75 shadow-[0_30px_120px_-50px_rgba(161,73,57,0.45)] dark:bg-card/75",
    iconWrap: "bg-destructive/12 text-destructive ring-1 ring-destructive/20",
    orbit: "border-destructive/30",
    signal: "bg-destructive/70",
  },
};

export function RouteNotFoundPage(_props: NotFoundRouteProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <StatusShell
      tone="notFound"
      code="404"
      eyebrow="Page lost in transit"
      title="This route slipped off the map."
      description="The destination you requested is not available here anymore, was renamed, or never existed in this deployment."
      detail={`Requested path: ${pathname}`}
      primaryAction={
        <Button
          asChild
          size="lg"
          className="h-12 rounded-full px-6 text-sm font-semibold"
        >
          <Link to="/">
            <Home />
            Return Home
          </Link>
        </Button>
      }
      secondaryAction={
        <Button
          asChild
          size="lg"
          variant="outline"
          className="h-12 rounded-full border-border/60 bg-background/40 px-6 text-sm font-semibold backdrop-blur-sm"
        >
          <Link to="/contact">
            <LifeBuoy />
            Contact DS General
          </Link>
        </Button>
      }
      tertiaryAction={
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
      }
    />
  );
}

export function RouteErrorPage({ error, reset }: ErrorComponentProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <StatusShell
      tone="error"
      code="500"
      eyebrow="Route recovery mode"
      title="The page hit turbulence."
      description="Something interrupted rendering for this route. The fastest path is to retry, move to a known page, or contact the team if the issue persists."
      detail={formatErrorDetail(error, pathname)}
      primaryAction={
        <Button
          type="button"
          size="lg"
          className="h-12 rounded-full px-6 text-sm font-semibold"
          onClick={() => reset()}
        >
          <RefreshCcw />
          Retry View
        </Button>
      }
      secondaryAction={
        <Button
          asChild
          size="lg"
          variant="outline"
          className="h-12 rounded-full border-border/60 bg-background/40 px-6 text-sm font-semibold backdrop-blur-sm"
        >
          <Link to="/">
            <Compass />
            Go To Homepage
          </Link>
        </Button>
      }
      tertiaryAction={
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <Sparkles className="h-4 w-4" />
          Reload Application
        </button>
      }
    />
  );
}

function StatusShell({
  tone,
  code,
  eyebrow,
  title,
  description,
  detail,
  primaryAction,
  secondaryAction,
  tertiaryAction,
}: StatusShellProps) {
  const styles = toneStyles[tone];
  const Icon = tone === "notFound" ? Search : ShieldAlert;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(73,98,225,0.16),transparent_28%),linear-gradient(160deg,color-mix(in_oklch,var(--background)_88%,white_12%),var(--background))] text-foreground dark:bg-[radial-gradient(circle_at_top_left,rgba(73,98,225,0.2),transparent_30%),linear-gradient(160deg,color-mix(in_oklch,var(--background)_92%,black_8%),var(--background))]">
      <div className="pointer-events-none absolute inset-0">
        <div
          className={cn(
            "absolute -left-24 top-8 h-72 w-72 rounded-full bg-[radial-gradient(circle,var(--tw-gradient-stops))] blur-3xl",
            styles.halo,
          )}
        />
        <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(to_right,color-mix(in_oklch,var(--border)_55%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--border)_55%,transparent)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl items-center px-5 py-10 sm:px-8 sm:py-14">
        <section
          className={cn(
            "relative w-full overflow-hidden rounded-[2rem] border p-6 backdrop-blur-xl sm:p-8 lg:p-10",
            styles.panel,
          )}
        >
          <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.28)_100%)] dark:bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.05)_100%)]" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_220px]">
            <div className="max-w-2xl space-y-6">
              <div
                className={cn(
                  "inline-flex items-center gap-3 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em]",
                  styles.badge,
                )}
              >
                <Radar className="h-4 w-4" />
                {eyebrow}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.35rem]",
                      styles.iconWrap,
                    )}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <p className="font-mono text-sm uppercase tracking-[0.42em] text-muted-foreground">
                    Error {code}
                  </p>
                </div>

                <h1 className="max-w-xl text-balance text-4xl leading-none font-semibold tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                  {title}
                </h1>

                <p className="max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                  {description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {primaryAction}
                {secondaryAction}
                {tertiaryAction}
              </div>

              <p className="border-t border-border/50 pt-4 font-mono text-xs leading-6 text-muted-foreground sm:text-sm">
                {detail}
              </p>
            </div>

            <div className="relative mx-auto hidden h-52 w-52 items-center justify-center lg:flex">
              <div
                className={cn(
                  "absolute inset-0 rounded-full border border-dashed opacity-80",
                  styles.orbit,
                )}
              />
              <div
                className={cn(
                  "absolute inset-4 rounded-full border border-dashed opacity-55",
                  styles.orbit,
                )}
              />
              <div className="absolute inset-0 animate-[spin_18s_linear_infinite]">
                <span
                  className={cn(
                    "absolute left-1/2 top-1 h-3 w-3 -translate-x-1/2 rounded-full shadow-[0_0_24px_currentColor]",
                    styles.signal,
                  )}
                />
              </div>
              <div className="absolute inset-6 animate-[spin_24s_linear_infinite_reverse]">
                <span
                  className={cn(
                    "absolute bottom-3 right-3 h-2.5 w-2.5 rounded-full shadow-[0_0_18px_currentColor]",
                    styles.signal,
                  )}
                />
              </div>
              <div className="flex h-28 w-28 items-center justify-center rounded-full border border-border/60 bg-background/75 text-center shadow-[0_18px_60px_-30px_rgba(73,98,225,0.45)] backdrop-blur-md">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-muted-foreground">
                    DSG
                  </p>
                  <p className="mt-1 text-4xl font-semibold tracking-[-0.08em]">
                    {code}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function formatErrorDetail(error: unknown, pathname: string) {
  const prefix = `Route: ${pathname}`;
  const message =
    error instanceof Error ? error.message?.trim() : String(error).trim();

  if (!message) {
    return `${prefix} • Unknown application error`;
  }

  return `${prefix} • ${message}`;
}
