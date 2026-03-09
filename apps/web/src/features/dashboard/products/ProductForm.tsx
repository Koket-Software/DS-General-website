import { LexicalEditor } from "@rich-text/LexicalEditor";
import { type FormValidateOrFn } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { toast } from "sonner";
import type { infer as ZodInfer } from "zod";

import { AsyncSearchableSelect } from "../components/AsyncSearchableSelect";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "./lib/products-query";
import {
  createProductSchema,
  updateProductSchema,
  type UpdateProduct,
  type Product,
} from "./lib/products-schema";

import { AppImage } from "@/components/common/AppImage";
import { LexicalViewer } from "@/components/common/rich-text/LexicalViewer";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldSet,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DashboardDetailShell } from "@/features/dashboard/components/detail/DashboardDetailShell";
import { fetchTags } from "@/features/dashboard/tags/lib/tags-api";
import { tagKeys } from "@/features/dashboard/tags/lib/tags-query";
import {
  normalizeTagListParams,
  type Tag,
} from "@/features/dashboard/tags/lib/tags-schema";
import { API_BASE_URL } from "@/lib/api-base";
import { DEFAULT_DEBOUNCE_MS, useDashboardForm } from "@/lib/forms";
import { toastApiError } from "@/lib/toast";
import { useAsyncSelect, type BaseOption } from "@/lib/useAsyncSelect";
import { useUploadField } from "@/lib/useUploadField";

type FormMode = "create" | "edit" | "view";

interface ProductFormProps {
  mode?: FormMode;
  initialData?: UpdateProduct;
}

const createProductFormSchema = createProductSchema.omit({
  images: true,
  imagesMeta: true,
});
const updateProductFormSchema = updateProductSchema.omit({
  images: true,
  imagesMeta: true,
});
type ProductFormValues = Omit<
  ZodInfer<typeof createProductFormSchema>,
  "tagIds"
> & {
  tagIds: number[];
};

type TagOption = BaseOption & Tag;

const resolveImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl) return "";
  const baseUrl = (API_BASE_URL ?? "").replace(/\/$/, "");
  return imageUrl.startsWith("/") ? `${baseUrl}${imageUrl}` : imageUrl;
};

export function ProductForm({
  mode = "create",
  initialData,
}: ProductFormProps) {
  const navigate = useNavigate();

  const existingImages =
    initialData?.existingImages?.map((img) => resolveImageUrl(img.imageUrl)) ??
    [];

  const {
    files: uploadFiles,
    previews,
    handleFiles,
    reset: resetUploads,
  } = useUploadField({
    accept: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
    initialUrls: existingImages,
  });

  const tagSelect = useAsyncSelect<TagOption>({
    queryKey: (search) => [...tagKeys.all, "select", search],
    queryFn: async (search) => {
      const params = normalizeTagListParams({
        page: 1,
        limit: 10,
        search: search || undefined,
      });
      const res = await fetchTags(params);
      return (res.data ?? []).map((tag) => ({
        ...tag,
        label: tag.name,
        value: tag.id,
      }));
    },
    debounceMs: DEFAULT_DEBOUNCE_MS,
  });

  const createMutation = useCreateProductMutation({
    onSuccess: () => {
      toast.success("Product created successfully!");
      navigate({ to: "/dashboard/products" });
    },
    onError: (error) => {
      toastApiError(error, "Failed to create product");
    },
  });

  const updateMutation = useUpdateProductMutation({
    onSuccess: () => {
      toast.success("Product updated successfully!");
      navigate({ to: "/dashboard/products" });
    },
    onError: (error) => {
      toastApiError(error, "Failed to update product");
    },
  });

  const isLoading =
    mode === "create"
      ? createMutation.isPending
      : mode === "edit"
        ? updateMutation.isPending
        : false;

  const form = useDashboardForm<ProductFormValues>({
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      overview: initialData?.overview ?? null,
      productLink: initialData?.productLink ?? null,
      tagIds: initialData?.tagIds ?? [],
    } satisfies ProductFormValues,
    validators: {
      onSubmit: (mode === "create"
        ? createProductFormSchema
        : updateProductFormSchema) as FormValidateOrFn<ProductFormValues>,
    },
    onSubmit: async ({ value }) => {
      if (mode === "view") return;

      const tagsToSend = value.tagIds ?? [];
      const imagesMeta =
        uploadFiles.length > 0
          ? uploadFiles.map((file, index) => ({
              position: index,
              caption: file.name,
            }))
          : undefined;

      if (mode === "create") {
        if (uploadFiles.length === 0) {
          toast.error("Please add at least one image");
          return;
        }

        await createMutation.mutateAsync({
          title: value.title,
          description: value.description,
          overview: value.overview,
          productLink: value.productLink ?? null,
          tagIds: tagsToSend,
          imagesMeta,
          images: uploadFiles,
        });
      } else {
        const productId = (initialData as Product | undefined)?.id;
        if (!productId) {
          throw new Error("Product ID is required for update");
        }

        await updateMutation.mutateAsync({
          id: productId,
          payload: {
            title: value.title,
            description: value.description,
            overview: value.overview ?? null,
            productLink: value.productLink ?? null,
            tagIds: tagsToSend,
            imagesMeta,
            images: uploadFiles.length > 0 ? uploadFiles : undefined,
          },
        });
      }

      resetUploads();
    },
  });

  const selectedTags = useMemo(
    () =>
      tagSelect.options.filter((tag) =>
        form.state.values.tagIds.includes(tag.id),
      ),
    [form.state.values.tagIds, tagSelect.options],
  );

  const currentPreviews =
    previews.length > 0
      ? previews
      : existingImages.length > 0
        ? existingImages
        : [];

  const isReadOnly = mode === "view";
  const formId = "product-form";
  const pageTitle =
    mode === "create"
      ? "Create Product"
      : mode === "edit"
        ? "Edit Product"
        : "View Product";

  return (
    <DashboardDetailShell
      mode={mode}
      title={pageTitle}
      formId={formId}
      onBack={() => navigate({ to: "/dashboard/products" })}
      isSubmitting={isLoading || form.state.isSubmitting}
      isSubmitDisabled={
        !form.state.canSubmit || isLoading || form.state.isSubmitting
      }
      submitLabel={mode === "create" ? "Create Product" : "Update Product"}
      submittingLabel={mode === "create" ? "Creating..." : "Updating..."}
      preview={
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b pb-2 text-sm text-muted-foreground">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-success" />
            Live Preview
          </div>

          {currentPreviews.length > 0 ? (
            <div className="space-y-2">
              <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Images
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {currentPreviews.map((src, index) => (
                  <div
                    key={src + index}
                    className="relative aspect-video overflow-hidden rounded-none bg-muted/80"
                  >
                    <AppImage
                      src={src}
                      alt={`Product image ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 rounded-none bg-foreground/70 px-1 text-[10px] text-primary-foreground">
                      #{index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-none border border-dashed p-4 text-sm text-muted-foreground">
              Add images to see the preview here.
            </div>
          )}

          <div className="space-y-1">
            <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Title
            </h4>
            <h2 className="text-2xl font-bold text-foreground">
              {form.state.values.title || (
                <span className="italic text-muted-foreground/75">
                  Enter a title...
                </span>
              )}
            </h2>
          </div>

          {form.state.values.overview && (
            <div className="space-y-1">
              <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Overview
              </h4>
              <p className="text-muted-foreground">
                {form.state.values.overview}
              </p>
            </div>
          )}

          {selectedTags.length > 0 && (
            <div className="space-y-1">
              <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Tags
              </h4>
              <div className="flex flex-wrap gap-1">
                {selectedTags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center rounded-none bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {form.state.values.productLink && (
            <div className="space-y-1">
              <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Product Link
              </h4>
              <a
                href={form.state.values.productLink}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-sm text-primary hover:underline"
              >
                {form.state.values.productLink}
              </a>
            </div>
          )}

          <div className="space-y-1">
            <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Description
            </h4>
            {form.state.values.description ? (
              <div className="prose prose-sm max-w-none text-foreground/80">
                <LexicalViewer content={form.state.values.description} />
              </div>
            ) : (
              <p className="text-sm italic text-muted-foreground/75">
                Write a description...
              </p>
            )}
          </div>
        </div>
      }
    >
      <form
        id={formId}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <Field>
          <FieldLabel>Images</FieldLabel>
          <Input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            multiple
            onChange={(e) => {
              if (!e.target.files) return;
              const { errors } = handleFiles(e.target.files);
              if (errors.length) {
                toast.error(errors.join("\n"));
              }
            }}
            disabled={isLoading || isReadOnly}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Upload product images (max 10MB each). The first image is used as
            the primary display.
          </p>
        </Field>

        <form.Field name="title">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Product Title</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  placeholder="Enter product title"
                  disabled={isLoading || isReadOnly}
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
                {isReadOnly ? (
                  <div className="rounded-md border bg-muted/50 p-3">
                    {field.state.value ? (
                      <LexicalViewer content={field.state.value} />
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No description provided.
                      </p>
                    )}
                  </div>
                ) : (
                  <LexicalEditor
                    value={field.state.value}
                    onChange={field.handleChange}
                    placeholder="Write a detailed product description..."
                  />
                )}
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="overview">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Overview</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value ?? ""}
                  rows={3}
                  maxLength={255}
                  onBlur={field.handleBlur}
                  placeholder="Short overview of the product"
                  disabled={isLoading || isReadOnly}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="productLink">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Product Link</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  placeholder="https://example.com/product"
                  disabled={isLoading || isReadOnly}
                  onChange={(e) => {
                    const nextValue = e.target.value;
                    field.handleChange(nextValue.length > 0 ? nextValue : null);
                  }}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <FieldSet>
          <FieldLabel htmlFor="tag-select">Tags</FieldLabel>
          <FieldGroup className="flex-col gap-2">
            <AsyncSearchableSelect
              id="tag-select"
              value={undefined}
              onChange={(value) => {
                const id = Number(value);
                if (!Number.isFinite(id)) return;
                if (form.state.values.tagIds.includes(id)) return;
                form.setFieldValue("tagIds", [...form.state.values.tagIds, id]);
              }}
              query={tagSelect.search}
              onQueryChange={tagSelect.setSearch}
              options={tagSelect.options}
              placeholder={
                tagSelect.isLoading ? "Searching tags…" : "Select tags"
              }
              searchPlaceholder="Type to search tags..."
              className="w-full"
              isSearching={tagSelect.isLoading}
              error={tagSelect.isError ? "Failed to load tags" : null}
              disabled={isLoading || isReadOnly}
            />
          </FieldGroup>
        </FieldSet>

        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Button
                key={tag.id}
                type="button"
                onClick={() =>
                  !isReadOnly &&
                  form.setFieldValue(
                    "tagIds",
                    form.state.values.tagIds.filter((id) => id !== tag.id),
                  )
                }
                className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/20 disabled:opacity-50"
                disabled={isReadOnly}
              >
                <span className="mr-1">{tag.name}</span>
                {!isReadOnly && <span aria-hidden>×</span>}
              </Button>
            ))}
          </div>
        )}
      </form>
    </DashboardDetailShell>
  );
}
