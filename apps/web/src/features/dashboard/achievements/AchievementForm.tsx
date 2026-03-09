import { type FormValidateOrFn } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { infer as ZodInfer } from "zod";

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

import { AppImage } from "@/components/common/AppImage";
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
    accept: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ],
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

  const isLoading =
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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
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
                  placeholder="e.g., ISO 9001 Certification"
                  autoComplete="off"
                  disabled={isReadOnly || isLoading}
                  onChange={(e) => field.handleChange(e.target.value)}
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
                  placeholder="Summarize what was certified and why it matters..."
                  autoComplete="off"
                  disabled={isReadOnly || isLoading}
                  onChange={(e) => field.handleChange(e.target.value)}
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
                    disabled={isReadOnly || isLoading}
                    onChange={(e) =>
                      field.handleChange(
                        Number.parseInt(e.target.value || "0", 10),
                      )
                    }
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                    disabled={isReadOnly || isLoading}
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
          <FieldLabel>Certificate Image</FieldLabel>
          <Input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
            onChange={(e) => {
              if (!e.target.files) return;
              const { errors } = handleFiles(e.target.files);
              if (errors.length) toast.error(errors.join("\n"));
            }}
            disabled={isReadOnly || isLoading}
          />
          {currentImage && (
            <div className="mt-3 flex items-center gap-3">
              <AppImage
                src={currentImage}
                alt="Achievement preview"
                width={96}
                height={64}
                className="h-16 w-24 rounded object-cover border"
              />
              <span className="text-xs text-muted-foreground">
                Preview (first image used as certificate image)
              </span>
            </div>
          )}
        </Field>

        <div className="flex justify-end space-x-2">
          {mode === "view" && achievement && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => deleteMutation.mutate(achievement.id)}
              disabled={isLoading}
            >
              Delete
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              onClose?.() ?? navigate({ to: "/dashboard/achievements" })
            }
            disabled={isLoading}
          >
            Close
          </Button>
          {mode !== "view" && (
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting || isLoading
                    ? mode === "create"
                      ? "Creating..."
                      : "Updating..."
                    : mode === "create"
                      ? "Create Achievement"
                      : "Update Achievement"}
                </Button>
              )}
            />
          )}
        </div>
      </FieldGroup>
    </form>
  );
}
