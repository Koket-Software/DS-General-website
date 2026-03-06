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
      detail={pathname}
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
  const currentPath = useRouterState({
    select: (state) => state.location.pathname,
  });

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

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-12 sm:px-8 lg:px-12">
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1.15fr)_24rem]">
          <section
            className={cn(
              "relative overflow-hidden rounded-[2rem] border p-8 backdrop-blur-xl sm:p-10 lg:p-12",
              styles.panel,
            )}
          >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.32)_100%)] dark:bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.05)_100%)]" />

            <div className="relative flex flex-col gap-10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div
                  className={cn(
                    "inline-flex items-center gap-3 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]",
                    styles.badge,
                  )}
                >
                  <Radar className="h-4 w-4" />
                  {eyebrow}
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Active route
                  </p>
                  <p className="mt-1 font-mono text-sm text-foreground/80">
                    {currentPath}
                  </p>
                </div>
              </div>

              <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_15rem]">
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "flex h-16 w-16 items-center justify-center rounded-3xl",
                        styles.iconWrap,
                      )}
                    >
                      <Icon className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="font-mono text-sm uppercase tracking-[0.45em] text-muted-foreground">
                        Error {code}
                      </p>
                      <h1 className="mt-2 max-w-3xl text-balance text-4xl leading-none font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                        {title}
                      </h1>
                    </div>
                  </div>

                  <p className="max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                    {description}
                  </p>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <SignalCard
                      label="Status"
                      value={code}
                      caption="Global route state"
                    />
                    <SignalCard
                      label="Route"
                      value={compactPath(currentPath)}
                      caption="Current location"
                    />
                    <SignalCard
                      label="Action"
                      value={tone === "notFound" ? "Reroute" : "Recover"}
                      caption="Recommended next step"
                    />
                  </div>
                </div>

                <div className="relative mx-auto flex h-48 w-48 items-center justify-center lg:mx-0 lg:ml-auto">
                  <div
                    className={cn(
                      "absolute inset-0 rounded-full border border-dashed",
                      styles.orbit,
                    )}
                  />
                  <div
                    className={cn(
                      "absolute inset-5 rounded-full border border-dashed opacity-70",
                      styles.orbit,
                    )}
                  />
                  <div className="absolute inset-10 rounded-full border border-border/40" />
                  <div className="absolute inset-0 animate-[spin_20s_linear_infinite]">
                    <span
                      className={cn(
                        "absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full shadow-[0_0_24px_currentColor]",
                        styles.signal,
                      )}
                    />
                    <span
                      className={cn(
                        "absolute bottom-4 right-4 h-2.5 w-2.5 rounded-full shadow-[0_0_18px_currentColor]",
                        styles.signal,
                      )}
                    />
                  </div>
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border border-border/60 bg-background/70 text-center backdrop-blur-md">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.35em] text-muted-foreground">
                        DSG
                      </p>
                      <p className="mt-1 text-4xl font-semibold tracking-[-0.08em]">
                        {code}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-border/50 bg-background/60 p-5 backdrop-blur-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      Diagnostic note
                    </p>
                    <p className="mt-2 max-w-3xl font-mono text-sm leading-6 text-foreground/85">
                      {detail}
                    </p>
                  </div>
                  <div className="rounded-full border border-border/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                    Functional recovery enabled
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {primaryAction}
                {secondaryAction}
                {tertiaryAction}
              </div>
            </div>
          </section>

          <aside className="grid gap-4 self-stretch">
            <AsidePanel
              title="Why this exists"
              body={
                tone === "notFound"
                  ? "The route table could not resolve this URL. That usually means a moved page, a typo, or an outdated external link."
                  : "A route component, loader, or boundary raised an exception while the current view was loading or rendering."
              }
            />
            <AsidePanel
              title="Best next move"
              body={
                tone === "notFound"
                  ? "Return to the homepage or contact the team if you expected this page to exist."
                  : "Retry first. If the failure repeats, reload the app or report the route and timestamp to the team."
              }
            />
            <AsidePanel title="Current target" body={currentPath} mono />
          </aside>
        </div>
      </div>
    </div>
  );
}

function SignalCard({
  label,
  value,
  caption,
}: {
  label: string;
  value: string;
  caption: string;
}) {
  return (
    <div className="rounded-[1.4rem] border border-border/50 bg-background/45 p-4 backdrop-blur-sm">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 text-xl font-semibold tracking-[-0.04em]">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{caption}</p>
    </div>
  );
}

function AsidePanel({
  title,
  body,
  mono = false,
}: {
  title: string;
  body: string;
  mono?: boolean;
}) {
  return (
    <section className="rounded-[1.6rem] border border-border/50 bg-background/55 p-5 backdrop-blur-md">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        {title}
      </p>
      <p
        className={cn(
          "mt-3 text-sm leading-6 text-foreground/85",
          mono && "font-mono break-all",
        )}
      >
        {body}
      </p>
    </section>
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

function compactPath(pathname: string) {
  if (pathname === "/") {
    return "home";
  }

  const compact = pathname.replaceAll("/", " / ").trim();

  return compact.length > 24 ? `${compact.slice(0, 21)}...` : compact;
}
