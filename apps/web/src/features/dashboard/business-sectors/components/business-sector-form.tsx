import { LexicalEditor } from "@rich-text/LexicalEditor";
import { type FormValidateOrFn } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { SectorGalleryManager } from "./SectorGalleryManager";
import { SectorServicesManager } from "./SectorServicesManager";
import { SectorStatsManager } from "./SectorStatsManager";
import {
  useCreateBusinessSectorMutation,
  useUpdateBusinessSectorMutation,
} from "../lib/business-sectors-query";
import type {
  BusinessSector,
  BusinessSectorGalleryFormItem,
  BusinessSectorServiceFormItem,
  BusinessSectorStatFormItem,
  CreateBusinessSectorInput,
  UpdateBusinessSector,
} from "../lib/business-sectors-schema";

import { LexicalViewer } from "@/components/common/rich-text/LexicalViewer";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DashboardDetailShell } from "@/features/dashboard/components/detail/DashboardDetailShell";
import { API_BASE_URL } from "@/lib/api-base";
import { useDashboardForm } from "@/lib/forms";
import { toastApiError } from "@/lib/toast";
import { useUploadField } from "@/lib/useUploadField";

type FormMode = "create" | "edit" | "view";

interface BusinessSectorFormProps {
  mode?: FormMode;
  initialData?: UpdateBusinessSector;
}

const MAX_TOTAL_UPLOAD_BYTES = 80 * 1024 * 1024;

const formSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(500),
  excerpt: z.string().optional(),
  history: z.string().trim().min(1, "History is required"),
  publishDate: z.string().optional(),
  phoneNumber: z.string().optional(),
  emailAddress: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
  facebookUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const resolveImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl) return "";
  const baseUrl = (API_BASE_URL ?? "").replace(/\/$/, "");
  return imageUrl.startsWith("/") ? `${baseUrl}${imageUrl}` : imageUrl;
};

const toDateTimeLocalValue = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (num: number) => num.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const toIsoFromLocalInput = (value?: string) => {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
};

const normalizeStats = (items: BusinessSectorStatFormItem[]) =>
  items
    .map((item, index) => ({
      statKey: item.statKey.trim(),
      statValue: item.statValue.trim(),
      position: index,
    }))
    .filter((item) => item.statKey.length > 0 && item.statValue.length > 0);

const normalizeServices = (items: BusinessSectorServiceFormItem[]) =>
  items
    .map((item, index) => ({
      title: item.title.trim(),
      description: item.description?.trim(),
      imageUrl: item.imageUrl,
      imageFile: item.imageFile,
      previewUrl: item.previewUrl,
      position: index,
    }))
    .filter((item) => item.title.length > 0);

const normalizeGallery = (items: BusinessSectorGalleryFormItem[]) =>
  items
    .map((item, index) => ({
      imageUrl: item.imageUrl,
      imageFile: item.imageFile,
      previewUrl: item.previewUrl,
      position: index,
    }))
    .filter((item) => Boolean(item.imageUrl || item.imageFile));

const calculateUploadSize = (
  featuredImageFile?: File,
  services: BusinessSectorServiceFormItem[] = [],
  gallery: BusinessSectorGalleryFormItem[] = [],
) => {
  const serviceBytes = services.reduce(
    (acc, service) => acc + (service.imageFile?.size ?? 0),
    0,
  );
  const galleryBytes = gallery.reduce(
    (acc, image) => acc + (image.imageFile?.size ?? 0),
    0,
  );

  return (featuredImageFile?.size ?? 0) + serviceBytes + galleryBytes;
};

export function BusinessSectorForm({
  mode = "create",
  initialData,
}: BusinessSectorFormProps) {
  const navigate = useNavigate();
  const isReadOnly = mode === "view";

  const featuredImageUrl = initialData?.featuredImageUrl
    ? resolveImageUrl(initialData.featuredImageUrl)
    : "";

  const {
    files: featuredFiles,
    previews: featuredPreviews,
    handleFiles: handleFeaturedFiles,
    reset: resetFeatured,
  } = useUploadField({
    accept: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ],
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    initialUrls: featuredImageUrl ? [featuredImageUrl] : [],
  });

  const [stats, setStats] = useState<BusinessSectorStatFormItem[]>(
    (initialData?.stats ?? []).map((item, index) => ({
      statKey: item.statKey ?? "",
      statValue: item.statValue ?? "",
      position: item.position ?? index,
    })),
  );

  const [services, setServices] = useState<BusinessSectorServiceFormItem[]>(
    (initialData?.services ?? []).map((item, index) => ({
      title: item.title ?? "",
      description: item.description ?? "",
      imageUrl: item.imageUrl ?? undefined,
      position: item.position ?? index,
    })),
  );

  const [gallery, setGallery] = useState<BusinessSectorGalleryFormItem[]>(
    (initialData?.gallery ?? []).map((item, index) => ({
      imageUrl: item.imageUrl,
      position: item.position ?? index,
    })),
  );

  const createMutation = useCreateBusinessSectorMutation({
    onSuccess: () => {
      toast.success("Business sector created successfully!");
      navigate({ to: "/dashboard/business-sectors" });
    },
    onError: (error) => {
      toastApiError(error, "Failed to create business sector");
    },
  });

  const updateMutation = useUpdateBusinessSectorMutation({
    onSuccess: () => {
      toast.success("Business sector updated successfully!");
      navigate({ to: "/dashboard/business-sectors" });
    },
    onError: (error) => {
      toastApiError(error, "Failed to update business sector");
    },
  });

  const isLoading =
    mode === "create"
      ? createMutation.isPending
      : mode === "edit"
        ? updateMutation.isPending
        : false;

  const form = useDashboardForm<FormValues>({
    defaultValues: {
      title: initialData?.title ?? "",
      excerpt: initialData?.excerpt ?? "",
      history: initialData?.history ?? "",
      publishDate: toDateTimeLocalValue(initialData?.publishDate),
      phoneNumber: initialData?.phoneNumber ?? "",
      emailAddress: initialData?.emailAddress ?? "",
      address: initialData?.address ?? "",
      facebookUrl: initialData?.facebookUrl ?? "",
      instagramUrl: initialData?.instagramUrl ?? "",
      linkedinUrl: initialData?.linkedinUrl ?? "",
    } satisfies FormValues,
    validators: {
      onSubmit: formSchema as FormValidateOrFn<FormValues>,
    },
    onSubmit: async ({ value }) => {
      if (isReadOnly) return;

      const normalizedStats = normalizeStats(stats);
      const normalizedServices = normalizeServices(services);
      const normalizedGallery = normalizeGallery(gallery);

      const featuredImageFile = featuredFiles[0];
      const uploadBytes = calculateUploadSize(
        featuredImageFile,
        normalizedServices,
        normalizedGallery,
      );

      if (uploadBytes > MAX_TOTAL_UPLOAD_BYTES) {
        toast.error("Total upload size exceeds 80MB");
        return;
      }

      const payload: CreateBusinessSectorInput = {
        title: value.title,
        excerpt: value.excerpt?.trim() || undefined,
        history: value.history,
        publishDate: toIsoFromLocalInput(value.publishDate),
        featuredImageFile,
        featuredImageUrl:
          initialData?.featuredImageUrl && !featuredImageFile
            ? initialData.featuredImageUrl
            : undefined,
        phoneNumber: value.phoneNumber?.trim() || undefined,
        emailAddress: value.emailAddress?.trim() || undefined,
        address: value.address?.trim() || undefined,
        facebookUrl: value.facebookUrl?.trim() || undefined,
        instagramUrl: value.instagramUrl?.trim() || undefined,
        linkedinUrl: value.linkedinUrl?.trim() || undefined,
        stats: normalizedStats,
        services: normalizedServices,
        gallery: normalizedGallery,
      };

      if (mode === "create") {
        await createMutation.mutateAsync(payload);
      } else {
        const sectorId = (initialData as BusinessSector | undefined)?.id;
        if (!sectorId) {
          throw new Error("Business sector ID is required for update");
        }

        await updateMutation.mutateAsync({
          id: sectorId,
          payload,
        });
      }

      resetFeatured();
    },
  });

  const currentFeaturedPreview = useMemo(() => {
    if (featuredPreviews.length > 0) return featuredPreviews[0] ?? null;
    return featuredImageUrl || null;
  }, [featuredImageUrl, featuredPreviews]);

  const pageTitle =
    mode === "create"
      ? "Create Business Sector"
      : mode === "edit"
        ? "Edit Business Sector"
        : "View Business Sector";

  return (
    <DashboardDetailShell
      mode={mode}
      title={pageTitle}
      formId="business-sector-form"
      onBack={() => navigate({ to: "/dashboard/business-sectors" })}
      isSubmitting={isLoading || form.state.isSubmitting}
      isSubmitDisabled={
        isLoading || form.state.isSubmitting || !form.state.canSubmit
      }
      submitLabel={mode === "create" ? "Create Sector" : "Update Sector"}
      submittingLabel={mode === "create" ? "Creating..." : "Updating..."}
      preview={
        <form.Subscribe
          selector={(state) => ({
            title: state.values.title,
            excerpt: state.values.excerpt,
            publishDate: state.values.publishDate,
          })}
        >
          {(values) => (
            <div className="dashboard-box space-y-2 border p-4 text-sm text-muted-foreground">
              <h3 className="text-base font-semibold text-foreground">
                Live Summary
              </h3>
              <p className="text-xl font-medium text-foreground">
                {values.title || "Untitled sector"}
              </p>
              <p>{values.excerpt || "No excerpt"}</p>
              <p>
                Publish date:{" "}
                {values.publishDate ? values.publishDate : "Draft"}
              </p>
              <p>Stats: {stats.length}</p>
              <p>Services: {services.length}</p>
              <p>Gallery images: {gallery.length}</p>
            </div>
          )}
        </form.Subscribe>
      }
    >
      <form
        id="business-sector-form"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <Field>
          <FieldLabel>Featured Image</FieldLabel>
          <Input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
            onChange={(event) => {
              if (!event.target.files) return;
              const { errors } = handleFeaturedFiles(event.target.files);
              if (errors.length > 0) {
                toast.error(errors.join("\n"));
              }
            }}
            disabled={isLoading || isReadOnly}
          />

          {currentFeaturedPreview ? (
            <div className="mt-3 h-44 overflow-hidden border bg-muted">
              <img
                src={currentFeaturedPreview}
                alt="Featured"
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
        </Field>

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
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Sector title"
                  disabled={isLoading || isReadOnly}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="excerpt">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Excerpt</FieldLabel>
              <Textarea
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="Short summary"
                rows={3}
                disabled={isLoading || isReadOnly}
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="publishDate">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Publish Date</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                type="datetime-local"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                disabled={isLoading || isReadOnly}
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="history">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel>History</FieldLabel>
                {isReadOnly ? (
                  <div className="border bg-muted/50 p-3">
                    <LexicalViewer content={field.state.value} />
                  </div>
                ) : (
                  <LexicalEditor
                    value={field.state.value}
                    onChange={field.handleChange}
                    placeholder="Write sector history..."
                  />
                )}
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <SectorStatsManager
          stats={stats}
          onChange={setStats}
          isReadOnly={isReadOnly}
        />

        <SectorServicesManager
          services={services}
          onChange={setServices}
          isReadOnly={isReadOnly}
        />

        <SectorGalleryManager
          gallery={gallery}
          onChange={setGallery}
          isReadOnly={isReadOnly}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <form.Field name="phoneNumber">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="+251..."
                  disabled={isLoading || isReadOnly}
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="emailAddress">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="name@company.com"
                    disabled={isLoading || isReadOnly}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </div>

        <form.Field name="address">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Address</FieldLabel>
              <Textarea
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="Address"
                rows={2}
                disabled={isLoading || isReadOnly}
              />
            </Field>
          )}
        </form.Field>

        <div className="grid gap-4 md:grid-cols-3">
          <form.Field name="facebookUrl">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Facebook URL</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="https://facebook.com/..."
                  disabled={isLoading || isReadOnly}
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="instagramUrl">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Instagram URL</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="https://instagram.com/..."
                  disabled={isLoading || isReadOnly}
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="linkedinUrl">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>LinkedIn URL</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="https://linkedin.com/company/..."
                  disabled={isLoading || isReadOnly}
                />
              </Field>
            )}
          </form.Field>
        </div>
      </form>
    </DashboardDetailShell>
  );
}
