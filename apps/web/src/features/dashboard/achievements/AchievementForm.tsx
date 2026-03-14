import { type FormValidateOrFn } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { infer as ZodInfer } from "zod";

import { AchievementPreview } from "./detail/AchievementPreview";
import {
  useCreateAchievementMutation,
  useDeleteAchievementMutation,
  useUpdateAchievementMutation,
} from "./lib/achievements-query";
import {
  updateAchievementFormSchema,
  type Achievement,
  type AchievementUpdatePayload,
} from "./lib/achievements-schema";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

const achievementFormSchema = updateAchievementFormSchema.omit({ image: true });
type AchievementFormValues = ZodInfer<typeof achievementFormSchema>;

type FormMode = "create" | "edit" | "view";

interface AchievementFormProps {
  mode?: FormMode;
  achievement?: Achievement | null;
  onClose?: () => void;
  onSuccess?: () => void;
}

export function AchievementForm({
  mode = "create",
  achievement,
  onClose,
  onSuccess,
}: AchievementFormProps) {
  const navigate = useNavigate();
  const formId = "achievement-form";

  const baseUrl = (API_BASE_URL ?? "").replace(/\/$/, "");
  const existingImage = achievement?.imageUrl
    ? achievement.imageUrl.startsWith("/")
      ? `${baseUrl}${achievement.imageUrl}`
      : achievement.imageUrl
    : null;

  const {
    files,
    previews,
    handleFiles,
    reset: resetUploads,
  } = useUploadField({
    accept: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    initialUrls: existingImage ? [existingImage] : [],
  });

  const createMutation = useCreateAchievementMutation({
    onSuccess: () => {
      toast.success("Achievement created successfully!");
      onSuccess?.();
      onClose?.();
      navigate({ to: "/dashboard/achievements" });
    },
    onError: (error) => {
      toastApiError(error, "Failed to create achievement");
    },
  });

  const updateMutation = useUpdateAchievementMutation({
    onSuccess: () => {
      toast.success("Achievement updated successfully!");
      onSuccess?.();
      onClose?.();
      navigate({ to: "/dashboard/achievements" });
    },
    onError: (error) => {
      toastApiError(error, "Failed to update achievement");
    },
  });

  const deleteMutation = useDeleteAchievementMutation({
    onSuccess: () => {
      toast.success("Achievement deleted successfully!");
      onSuccess?.();
      onClose?.();
      navigate({ to: "/dashboard/achievements" });
    },
    onError: (error) => {
      toastApiError(error, "Failed to delete achievement");
    },
  });

  const isSaving =
    mode === "create"
      ? createMutation.isPending
      : mode === "edit"
        ? updateMutation.isPending
        : false;

  const form = useDashboardForm<AchievementFormValues>({
    defaultValues: {
      title: achievement?.title ?? "",
      description: achievement?.description ?? "",
      position: achievement?.position ?? 0,
      isActive: achievement?.isActive ?? true,
    } satisfies AchievementFormValues,
    validators: {
      onSubmit:
        achievementFormSchema as FormValidateOrFn<AchievementFormValues>,
    },
    onSubmit: async ({ value }) => {
      if (mode === "view") return;

      if (mode === "create") {
        const image = files[0];
        if (!image) {
          toast.error("Please upload an image");
          return;
        }

        createMutation.mutate({ ...value, image });
      } else if (mode === "edit" && achievement) {
        const payload: AchievementUpdatePayload = {
          title: value.title,
          description: value.description,
          position: value.position,
          isActive: value.isActive,
        };

        if (files[0]) {
          payload.image = files[0];
        }

        updateMutation.mutate({
          id: achievement.id,
          payload,
        });
      }

      resetUploads();
    },
  });

  const isReadOnly = mode === "view";
  const currentImage = previews[0] ?? existingImage ?? null;

  const pageTitle =
    mode === "create"
      ? "Create Achievement"
      : mode === "edit"
        ? "Edit Achievement"
        : "View Achievement";

  return (
    <DashboardDetailShell
      mode={mode}
      title={pageTitle}
      formId={formId}
      onBack={() => onClose?.() ?? navigate({ to: "/dashboard/achievements" })}
      isSubmitting={form.state.isSubmitting || isSaving}
      isSubmitDisabled={
        !form.state.canSubmit || form.state.isSubmitting || isSaving
      }
      submitLabel={
        mode === "create" ? "Create Achievement" : "Update Achievement"
      }
      submittingLabel={mode === "create" ? "Creating…" : "Updating…"}
      headerActions={
        mode === "view" && achievement ? (
          <Button
            type="button"
            variant="destructive"
            onClick={() => deleteMutation.mutate(achievement.id)}
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
            position: state.values.position,
            isActive: state.values.isActive,
          })}
        >
          {(values) => (
            <AchievementPreview
              title={values.title}
              description={values.description}
              position={values.position}
              isActive={values.isActive}
              imageUrl={currentImage}
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
                    placeholder="ISO 9001 Certification…"
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
                    placeholder="Summarize what was certified and why it matters…"
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <form.Field name="position">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Position</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min={0}
                      inputMode="numeric"
                      autoComplete="off"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      disabled={isReadOnly || isSaving}
                      onChange={(event) =>
                        field.handleChange(
                          Number.parseInt(event.target.value || "0", 10),
                        )
                      }
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="isActive">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                  <div className="flex h-10 items-center gap-3 rounded-md border border-input px-3">
                    <Checkbox
                      id={field.name}
                      checked={field.state.value}
                      onCheckedChange={(checked) =>
                        field.handleChange(Boolean(checked))
                      }
                      disabled={isReadOnly || isSaving}
                    />
                    <span className="text-sm text-muted-foreground">
                      {field.state.value ? "Active" : "Inactive"}
                    </span>
                  </div>
                </Field>
              )}
            </form.Field>
          </div>

          <Field>
            <FieldLabel htmlFor="achievement-image">
              Certificate Image
            </FieldLabel>
            <Input
              id="achievement-image"
              name="certificateImage"
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
