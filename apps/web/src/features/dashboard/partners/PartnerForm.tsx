import { type FormValidateOrFn } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { infer as ZodInfer } from "zod";

import { PartnerPreview } from "./detail/PartnerPreview";
import {
  useCreatePartnerMutation,
  useDeletePartnerMutation,
  useUpdatePartnerMutation,
} from "./lib/partners-query";
import {
  updatePartnerFormSchema,
  type Partner,
  type PartnerUpdatePayload,
} from "./lib/partners-schema";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DashboardDetailShell } from "@/features/dashboard/components/detail/DashboardDetailShell";
import { API_BASE_URL } from "@/lib/api-base";
import { useDashboardForm } from "@/lib/forms";
import { toastApiError } from "@/lib/toast";
import { useUploadField } from "@/lib/useUploadField";

const partnerFormSchema = updatePartnerFormSchema.omit({ logo: true });
type PartnerFormValues = ZodInfer<typeof partnerFormSchema>;

type FormMode = "create" | "edit" | "view";

interface PartnerFormProps {
  mode?: FormMode;
  partner?: Partner | null;
  onClose?: () => void;
  onSuccess?: () => void;
}

export function PartnerForm({
  mode = "create",
  partner,
  onClose,
  onSuccess,
}: PartnerFormProps) {
  const navigate = useNavigate();
  const formId = "partner-form";

  const baseUrl = (API_BASE_URL ?? "").replace(/\/$/, "");
  const resolveImageUrl = (imageUrl?: string | null) => {
    if (!imageUrl) return null;
    return imageUrl.startsWith("/") ? `${baseUrl}${imageUrl}` : imageUrl;
  };

  const existingLogo = resolveImageUrl(partner?.logoUrl ?? null);

  const {
    files,
    previews,
    handleFiles,
    reset: resetUploads,
  } = useUploadField({
    accept: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    initialUrls: existingLogo ? [existingLogo] : [],
  });

  const createMutation = useCreatePartnerMutation({
    onSuccess: () => {
      toast.success("Partner created successfully!");
      onSuccess?.();
      onClose?.();
      navigate({ to: "/dashboard/partners" });
    },
    onError: (error) => {
      toastApiError(error, "Failed to create partner");
    },
  });

  const updateMutation = useUpdatePartnerMutation({
    onSuccess: () => {
      toast.success("Partner updated successfully!");
      onSuccess?.();
      onClose?.();
      navigate({ to: "/dashboard/partners" });
    },
    onError: (error) => {
      toastApiError(error, "Failed to update partner");
    },
  });

  const deleteMutation = useDeletePartnerMutation({
    onSuccess: () => {
      toast.success("Partner deleted successfully!");
      onSuccess?.();
      onClose?.();
      navigate({ to: "/dashboard/partners" });
    },
    onError: (error) => {
      toastApiError(error, "Failed to delete partner");
    },
  });

  const isSaving =
    mode === "create"
      ? createMutation.isPending
      : mode === "edit"
        ? updateMutation.isPending
        : false;

  const form = useDashboardForm<PartnerFormValues>({
    defaultValues: {
      title: partner?.title ?? "",
      description: partner?.description ?? "",
      websiteUrl: partner?.websiteUrl ?? "",
    } satisfies PartnerFormValues,
    validators: {
      onSubmit: partnerFormSchema as FormValidateOrFn<PartnerFormValues>,
    },
    onSubmit: async ({ value }) => {
      if (mode === "view") return;

      if (mode === "create") {
        const logo = files[0];
        if (!logo) {
          toast.error("Please upload a logo");
          return;
        }

        createMutation.mutate({ ...value, logo });
      } else if (mode === "edit" && partner) {
        const payload: PartnerUpdatePayload = {
          title: value.title,
          description: value.description,
          websiteUrl: value.websiteUrl,
        };

        if (files[0]) {
          payload.logo = files[0];
        }

        updateMutation.mutate({
          id: partner.id,
          payload,
        });
      }

      resetUploads();
    },
  });

  const isReadOnly = mode === "view";
  const currentLogo = previews[0] ?? existingLogo ?? null;

  const pageTitle =
    mode === "create"
      ? "Create Partner"
      : mode === "edit"
        ? "Edit Partner"
        : "View Partner";

  return (
    <DashboardDetailShell
      mode={mode}
      title={pageTitle}
      formId={formId}
      onBack={() => onClose?.() ?? navigate({ to: "/dashboard/partners" })}
      isSubmitting={form.state.isSubmitting || isSaving}
      isSubmitDisabled={
        !form.state.canSubmit || form.state.isSubmitting || isSaving
      }
      submitLabel={mode === "create" ? "Create Partner" : "Update Partner"}
      submittingLabel={mode === "create" ? "Creating…" : "Updating…"}
      headerActions={
        mode === "view" && partner ? (
          <Button
            type="button"
            variant="destructive"
            onClick={() => deleteMutation.mutate(partner.id)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting…" : "Delete"}
          </Button>
        ) : null
      }
      preview={
        <form.Subscribe
          selector={(state) => ({
            title: state.values.title,
            description: state.values.description,
            websiteUrl: state.values.websiteUrl,
          })}
        >
          {(values) => (
            <PartnerPreview
              title={values.title}
              description={values.description}
              websiteUrl={values.websiteUrl}
              logoUrl={currentLogo}
            />
          )}
        </form.Subscribe>
      }
    >
      <form
        id={formId}
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
        className="space-y-6"
      >
        <FieldGroup>
          <form.Field name="title">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    placeholder="Partner title…"
                    autoComplete="off"
                    disabled={isReadOnly || isSaving}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="description">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    placeholder="Summarize the partner relationship…"
                    autoComplete="off"
                    disabled={isReadOnly || isSaving}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                    rows={4}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="websiteUrl">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Website URL</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="url"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    placeholder="https://example.com…"
                    autoComplete="off"
                    spellCheck={false}
                    disabled={isReadOnly || isSaving}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <Field>
            <FieldLabel htmlFor="partner-logo">Logo</FieldLabel>
            <Input
              id="partner-logo"
              name="logo"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={(event) => {
                if (!event.target.files) return;
                const { errors } = handleFiles(event.target.files);
                if (errors.length) toast.error(errors.join("\n"));
              }}
              disabled={isReadOnly || isSaving}
            />
          </Field>
        </FieldGroup>
      </form>
    </DashboardDetailShell>
  );
}
