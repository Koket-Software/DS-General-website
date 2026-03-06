import { AUTH_BASE_PATH } from "@suba-company-template/auth/constants";
import { Link, createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import dsLogoLarge from "@/assets/ds/ds_logo_large.svg";
import googleLogo from "@/assets/external-company-logos/google.svg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/lib/api-base";
import { authClient } from "@/lib/auth-client";
import {
  getLastUsedAuthMethod,
  setLastUsedAuthMethod,
} from "@/lib/auth-last-used";
import { useAppForm } from "@/lib/forms";

export const Route = createLazyFileRoute("/login")({
  component: LoginPage,
});

type LoginFormValues = {
  email: string;
  password: string;
};

function LoginPage() {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [lastUsedMethod, setLastUsedMethod] = useState(getLastUsedAuthMethod);

  const form = useAppForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      if (isPending || isSubmitting) return;
      setIsSubmitting(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_BASE_URL}${AUTH_BASE_PATH}/sign-in/email`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: value.email,
              password: value.password,
            }),
          },
        );

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          const message =
            payload?.error?.message || payload?.message || "Failed to sign in";
          throw new Error(message);
        }

        setLastUsedAuthMethod("email");
        setLastUsedMethod("email");
        await authClient.getSession();
        navigate({ to: "/dashboard" });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to sign in");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (session) {
      navigate({ to: "/dashboard" });
    }
  }, [session, navigate]);

  const handleGoogleSignIn = async () => {
    if (isPending || isGoogleSubmitting) return;
    setIsGoogleSubmitting(true);
    setError(null);

    try {
      setLastUsedAuthMethod("google");
      setLastUsedMethod("google");
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to sign in with Google",
      );
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border bg-background p-8 shadow-sm">
        <div className="mb-6 flex justify-center">
          <img
            src={dsLogoLarge}
            alt="DS General PLC logo"
            className="h-10 w-auto"
          />
        </div>
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Admin Sign In</h1>
          <p className="text-muted-foreground">
            Enter your credentials to access the dashboard.
          </p>
        </div>

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

        <div className="mt-6">
          <Button
            type="button"
            variant="outline"
            className="relative w-full justify-center gap-2"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting || isGoogleSubmitting || isPending}
          >
            <span className="flex items-center gap-2">
              <img
                src={googleLogo}
                alt=""
                aria-hidden="true"
                className="h-4 w-4 shrink-0"
              />
              <span>
                {isGoogleSubmitting ? "Redirecting..." : "Continue with Google"}
              </span>
            </span>
            {lastUsedMethod === "google" ? (
              <Badge variant="secondary" className="absolute right-2">
                Last Used
              </Badge>
            ) : null}
          </Button>
          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            <span>or</span>
            <span className="h-px flex-1 bg-border" />
          </div>
        </div>

        <form
          className="mt-8 space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field name="email">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Work Email</FieldLabel>
                <Input
                  id={field.name}
                  type="email"
                  autoComplete="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <Input
                  id={field.name}
                  type="password"
                  autoComplete="current-password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </Field>
            )}
          </form.Field>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <span>{isSubmitting ? "Signing in..." : "Sign In"}</span>
            {lastUsedMethod === "email" ? (
              <Badge variant="secondary" className="ml-2">
                Last Used
              </Badge>
            ) : null}
          </Button>
        </form>

        <div className="mt-6 space-y-2 text-center text-xs text-muted-foreground">
          <p>Need access? Ask an administrator to add you in Better Auth.</p>
          <p>
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-medium text-primary">
              Create one
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
