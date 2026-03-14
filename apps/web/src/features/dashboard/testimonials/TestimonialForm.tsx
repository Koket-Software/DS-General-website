import { type FormValidateOrFn } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { infer as ZodInfer } from "zod";

import { TestimonialPreview } from "./detail/TestimonialPreview";
import {
  useCreateTestimonialMutation,
  useDeleteTestimonialMutation,
  useUpdateTestimonialMutation,
} from "./lib/testimonials-query";
import {
  createTestimonialFormSchema as createTestimonialSchema,
  updateTestimonialFormSchema as updateTestimonialSchema,
  type Testimonial,
  type TestimonialUpdatePayload,
} from "./lib/testimonials-schema";
import { AsyncSearchableSelect } from "../components/AsyncSearchableSelect";
import type { Partner } from "../partners/lib/partners-schema";

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
import { AUTH_API_ENDPOINTS } from "@/lib/API_ENDPOINTS";
import apiClient from "@/lib/axios";
import { DEFAULT_DEBOUNCE_MS, useDashboardForm } from "@/lib/forms";
import { toastApiError } from "@/lib/toast";
import { useAsyncSelect, type BaseOption } from "@/lib/useAsyncSelect";
import { useUploadField } from "@/lib/useUploadField";

const createTestimonialFormSchema = createTestimonialSchema.omit({
  companyLogo: true,
  spokePersonHeadshot: true,
});
const updateTestimonialFormSchema = updateTestimonialSchema.omit({
  companyLogo: true,
  spokePersonHeadshot: true,
});
type TestimonialFormValues = ZodInfer<typeof createTestimonialFormSchema>;

type FormMode = "create" | "edit" | "view";

interface TestimonialFormProps {
  mode?: FormMode;
  testimonial?: Testimonial | null;
  onClose?: () => void;
  onSuccess?: () => void;
}

const toResolvedAssetUrl = (url?: string | null) => {
  if (!url) return null;
  const baseUrl = (API_BASE_URL ?? "").replace(/\/$/, "");
  return url.startsWith("/") ? `${baseUrl}${url}` : url;
};

export function TestimonialForm({
  mode = "create",
  testimonial,
  onClose,
  onSuccess,
}: TestimonialFormProps) {
  const navigate = useNavigate();
  const formId = "testimonial-form";

  const companyLogoUpload = useUploadField({
    accept: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    initialUrls: testimonial?.companyLogoUrl
      ? [
          toResolvedAssetUrl(testimonial.companyLogoUrl) ??
            testimonial.companyLogoUrl,
        ]
      : [],
  });

  const headshotUpload = useUploadField({
    accept: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    initialUrls: testimonial?.spokePersonHeadshotUrl
      ? [
          toResolvedAssetUrl(testimonial.spokePersonHeadshotUrl) ??
            testimonial.spokePersonHeadshotUrl,
        ]
      : [],
  });

  type PartnerOption = BaseOption & Partner;

  const partnerSelect = useAsyncSelect<PartnerOption>({
    queryKey: (search) => [AUTH_API_ENDPOINTS.PARTNER, "select", search],
    queryFn: async (search) => {
      const { data } = await apiClient.get<{ data: Partner[] }>(
        AUTH_API_ENDPOINTS.PARTNER,
        {
          params: { page: 1, limit: 20, search: search || undefined },
        },
      );
      return (data.data ?? []).map((partner) => ({
        ...partner,
        label: partner.title,
        value: partner.id,
      }));
    },
    debounceMs: DEFAULT_DEBOUNCE_MS,
  });

  const createMutation = useCreateTestimonialMutation({
    onSuccess: () => {
      toast.success("Testimonial created successfully!");
      onSuccess?.();
      onClose?.();
      navigate({ to: "/dashboard/testimonials" });
    },
    onError: (error) => {
      toastApiError(error, "Failed to create testimonial");
    },
  });

  const updateMutation = useUpdateTestimonialMutation({
    onSuccess: () => {
      toast.success("Testimonial updated successfully!");
      onSuccess?.();
      onClose?.();
      navigate({ to: "/dashboard/testimonials" });
    },
    onError: (error) => {
      toastApiError(error, "Failed to update testimonial");
    },
  });

  const deleteMutation = useDeleteTestimonialMutation({
    onSuccess: () => {
      toast.success("Testimonial deleted successfully!");
      onSuccess?.();
      onClose?.();
      navigate({ to: "/dashboard/testimonials" });
    },
    onError: (error) => {
      toastApiError(error, "Failed to delete testimonial");
    },
  });

  const isSaving =
    mode === "create"
      ? createMutation.isPending
      : mode === "edit"
        ? updateMutation.isPending
        : false;

  const form = useDashboardForm<TestimonialFormValues>({
    defaultValues: {
      comment: testimonial?.comment ?? "",
      companyName: testimonial?.companyName ?? "",
      spokePersonName: testimonial?.spokePersonName ?? "",
      spokePersonTitle: testimonial?.spokePersonTitle ?? "",
      partnerId: testimonial?.partnerId ?? undefined,
    } satisfies TestimonialFormValues,
    validators: {
      onSubmit: (mode === "create"
        ? createTestimonialFormSchema
        : updateTestimonialFormSchema) as FormValidateOrFn<TestimonialFormValues>,
    },
    onSubmit: async ({ value }) => {
      if (mode === "view") return;

      if (mode === "create") {
        await createMutation.mutateAsync({
          comment: value.comment,
          companyName: value.companyName,
          spokePersonName: value.spokePersonName || undefined,
          spokePersonTitle: value.spokePersonTitle || undefined,
          partnerId: value.partnerId,
          companyLogo: companyLogoUpload.files[0],
          spokePersonHeadshot: headshotUpload.files[0],
        });
      } else if (mode === "edit" && testimonial) {
        const payload: TestimonialUpdatePayload = {
          comment: value.comment,
          companyName: value.companyName,
          spokePersonName: value.spokePersonName || undefined,
          spokePersonTitle: value.spokePersonTitle || undefined,
          partnerId: value.partnerId,
        };

        if (companyLogoUpload.files[0]) {
          payload.companyLogo = companyLogoUpload.files[0];
        }

        if (headshotUpload.files[0]) {
          payload.spokePersonHeadshot = headshotUpload.files[0];
        }

        await updateMutation.mutateAsync({
          id: testimonial.id,
          payload,
        });
      }

      companyLogoUpload.reset();
      headshotUpload.reset();
    },
  });

  const isReadOnly = mode === "view";

  const pageTitle =
    mode === "create"
      ? "Create Testimonial"
      : mode === "edit"
        ? "Edit Testimonial"
        : "View Testimonial";

  return (
    <DashboardDetailShell
      mode={mode}
      title={pageTitle}
      formId={formId}
      onBack={() => onClose?.() ?? navigate({ to: "/dashboard/testimonials" })}
      isSubmitting={form.state.isSubmitting || isSaving}
      isSubmitDisabled={
        !form.state.canSubmit || form.state.isSubmitting || isSaving
      }
      submitLabel={
        mode === "create" ? "Create Testimonial" : "Update Testimonial"
      }
      submittingLabel={mode === "create" ? "Creating…" : "Updating…"}
      headerActions={
        mode === "view" && testimonial ? (
          <Button
            type="button"
            variant="destructive"
            onClick={() => deleteMutation.mutate(testimonial.id)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting…" : "Delete"}
          </Button>
        ) : null
      }
      preview={
        <form.Subscribe
          selector={(state) => ({
            comment: state.values.comment,
            companyName: state.values.companyName,
            spokePersonName: state.values.spokePersonName,
            spokePersonTitle: state.values.spokePersonTitle,
            partnerId: state.values.partnerId,
          })}
        >
          {(values) => {
            const selectedPartner = partnerSelect.options.find(
              (option) => option.id === values.partnerId,
            );

            return (
              <TestimonialPreview
                comment={values.comment}
                companyName={values.companyName}
                spokePersonName={values.spokePersonName}
                spokePersonTitle={values.spokePersonTitle}
                partnerLabel={
                  selectedPartner?.title ||
                  testimonial?.partner?.title ||
                  (values.partnerId
                    ? `Partner #${values.partnerId}`
                    : undefined)
                }
                companyLogoUrl={companyLogoUpload.previews[0] ?? null}
                spokePersonHeadshotUrl={headshotUpload.previews[0] ?? null}
              />
            );
          }}
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
          <form.Field name="comment">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Comment</FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    placeholder="What did the client say…"
                    autoComplete="off"
                    disabled={isReadOnly || isSaving}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                    rows={5}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="companyName">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Company Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    placeholder="Acme Inc…"
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <form.Field name="spokePersonName">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Spokesperson Name
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    placeholder="Jane Doe…"
                    autoComplete="off"
                    disabled={isReadOnly || isSaving}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="spokePersonTitle">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Spokesperson Title
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    placeholder="CTO…"
                    autoComplete="off"
                    disabled={isReadOnly || isSaving}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </Field>
              )}
            </form.Field>
          </div>

          <form.Field name="partnerId">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Linked Partner</FieldLabel>
                <AsyncSearchableSelect
                  id="partner-select"
                  value={field.state.value}
                  onChange={(value) => field.handleChange(Number(value))}
                  query={partnerSelect.search}
                  onQueryChange={partnerSelect.setSearch}
                  options={partnerSelect.options}
                  placeholder={
                    partnerSelect.isLoading
                      ? "Searching partners…"
                      : "Select partner…"
                  }
                  searchPlaceholder="Type to search partners…"
                  className="w-full"
                  isSearching={partnerSelect.isLoading}
                  error={
                    partnerSelect.isError ? "Failed to load partners" : null
                  }
                  disabled={isReadOnly || isSaving}
                />
              </Field>
            )}
          </form.Field>

          <Field>
            <FieldLabel htmlFor="testimonial-company-logo">
              Company Logo
            </FieldLabel>
            <Input
              id="testimonial-company-logo"
              name="companyLogo"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={(event) => {
                if (!event.target.files) return;
                const { errors } = companyLogoUpload.handleFiles(
                  event.target.files,
                );
                if (errors.length) toast.error(errors.join("\n"));
              }}
              disabled={isReadOnly || isSaving}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="testimonial-headshot">
              Spokesperson Headshot
            </FieldLabel>
            <Input
              id="testimonial-headshot"
              name="spokespersonHeadshot"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={(event) => {
                if (!event.target.files) return;
                const { errors } = headshotUpload.handleFiles(
                  event.target.files,
                );
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
