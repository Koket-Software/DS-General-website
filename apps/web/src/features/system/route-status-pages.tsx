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
    panel: string;
    iconWrap: string;
    rail: string;
    detail: string;
    signal: string;
  }
> = {
  notFound: {
    badge: "border-info/25 bg-info/10 text-info",
    panel:
      "border-border/70 bg-card/95 shadow-[0_18px_55px_-32px_rgba(73,98,225,0.45)]",
    iconWrap: "border-info/30 bg-info/8 text-info",
    rail: "border-border/60 bg-[linear-gradient(180deg,rgba(73,98,225,0.09),transparent_72%)]",
    detail: "border-info/20 bg-info/7",
    signal: "bg-info/70",
  },
  error: {
    badge: "border-destructive/25 bg-destructive/10 text-destructive",
    panel:
      "border-border/70 bg-card/95 shadow-[0_18px_55px_-32px_rgba(166,64,48,0.38)]",
    iconWrap: "border-destructive/30 bg-destructive/8 text-destructive",
    rail: "border-border/60 bg-[linear-gradient(180deg,rgba(166,64,48,0.1),transparent_72%)]",
    detail: "border-destructive/20 bg-destructive/7",
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
      eyebrow="Route not found"
      title="This page is not available."
      description="The destination may have moved, been removed, or the URL may be incorrect. Use the options below to continue."
      detail={`Requested route: ${pathname}\nTip: Verify the URL or continue from the homepage.`}
      primaryAction={
        <Button
          asChild
          size="lg"
          className="h-11 rounded-none px-5 text-sm font-semibold uppercase tracking-wide"
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
          className="h-11 rounded-none border-border/70 bg-background/70 px-5 text-sm font-semibold uppercase tracking-wide"
        >
          <Link to="/contact">
            <LifeBuoy />
            Contact Team
          </Link>
        </Button>
      }
      tertiaryAction={
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex h-11 items-center gap-2 border border-border/70 px-4 text-sm font-medium text-muted-foreground transition hover:text-foreground"
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
      eyebrow="Route recovery"
      title="This route could not render."
      description="The page encountered an unexpected failure. Retry the view or continue to a known page."
      detail={formatErrorDetail(error, pathname)}
      primaryAction={
        <Button
          type="button"
          size="lg"
          className="h-11 rounded-none px-5 text-sm font-semibold uppercase tracking-wide"
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
          className="h-11 rounded-none border-border/70 bg-background/70 px-5 text-sm font-semibold uppercase tracking-wide"
        >
          <Link to="/">
            <Compass />
            Go Home
          </Link>
        </Button>
      }
      tertiaryAction={
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex h-11 items-center gap-2 border border-border/70 px-4 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <Sparkles className="h-4 w-4" />
          Reload App
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
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(73,98,225,0.14)_0%,transparent_42%),linear-gradient(125deg,color-mix(in_oklch,var(--background)_92%,white_8%),var(--background))]" />
        <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(to_right,color-mix(in_oklch,var(--border)_55%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--border)_55%,transparent)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="absolute inset-x-0 top-20 border-t border-border/70" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1200px] items-center px-4 py-8 sm:px-8 sm:py-12">
        <section className={cn("w-full overflow-hidden border", styles.panel)}>
          <div className="grid lg:grid-cols-[minmax(0,1fr)_290px]">
            <div className="p-6 sm:p-10">
              <div
                className={cn(
                  "inline-flex items-center gap-2 border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em]",
                  styles.badge,
                )}
              >
                <Radar className="h-4 w-4" />
                {eyebrow}
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center border",
                    styles.iconWrap,
                  )}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <p className="font-mono text-xs uppercase tracking-[0.34em] text-muted-foreground">
                  Status {code}
                </p>
              </div>

              <h1 className="mt-6 max-w-3xl text-balance text-4xl leading-tight font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                {title}
              </h1>

              <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                {description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {primaryAction}
                {secondaryAction}
                {tertiaryAction}
              </div>

              <pre
                className={cn(
                  "mt-8 overflow-x-auto border p-4 font-mono text-xs leading-6 whitespace-pre-wrap break-words text-muted-foreground sm:text-sm",
                  styles.detail,
                )}
              >
                {detail}
              </pre>
            </div>

            <aside
              className={cn(
                "border-t p-6 sm:p-8 lg:border-t-0 lg:border-l",
                styles.rail,
              )}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                DS General
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Route status panel
              </p>

              <div className="mt-6 border border-border/70 bg-background/75 p-5">
                <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                  Error Code
                </p>
                <p className="mt-2 font-mono text-5xl leading-none tracking-[-0.05em]">
                  {code}
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <SignalStrip label="UI" value="RECOVERY READY" tone={styles} />
                <SignalStrip label="ROUTE" value="CHECKED" tone={styles} />
                <SignalStrip label="ACTION" value="AVAILABLE" tone={styles} />
              </div>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}

function SignalStrip({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: { signal: string };
}) {
  return (
    <div className="border border-border/70 bg-background/65 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </p>
        <span className={cn("h-2.5 w-2.5", tone.signal)} />
      </div>
      <p className="mt-2 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function formatErrorDetail(error: unknown, pathname: string) {
  const routeLine = `Route: ${pathname}`;

  if (!import.meta.env.PROD) {
    const message = serializeError(error);
    return message ? `${routeLine}\n${message}` : `${routeLine}\nUnknown error`;
  }

  return `${routeLine}\nAn unexpected error occurred. Detailed diagnostics are hidden in production for security.`;
}

function serializeError(error: unknown) {
  if (error instanceof Error) {
    const name = error.name?.trim() || "Error";
    const message = error.message?.trim();
    const stack = error.stack?.trim();
    const header = message ? `${name}: ${message}` : name;
    return stack ? `${header}\n${stack}` : header;
  }

  if (typeof error === "string") {
    return error.trim();
  }

  try {
    return JSON.stringify(error, null, 2);
  } catch {
    return String(error);
  }
}
