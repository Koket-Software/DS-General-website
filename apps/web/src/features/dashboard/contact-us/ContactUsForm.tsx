import { type FormValidateOrFn } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { ContactPreview } from "./detail/ContactPreview";
import {
  useCreateContactMutation,
  useDeleteContactMutation,
  useUpdateContactMutation,
} from "./lib/contact-query";
import {
  createContactSchema,
  updateContactSchema,
  type Contact,
  type CreateContact,
} from "./lib/contact-schema";

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
import { useDashboardForm } from "@/lib/forms";
import { toastApiError } from "@/lib/toast";

type FormMode = "create" | "edit" | "view";

interface ContactUsFormProps {
  mode?: FormMode;
  contactUs?: Contact | null;
  onClose?: () => void;
  onSuccess?: () => void;
}

export function ContactUsForm({
  mode = "create",
  contactUs,
  onClose,
  onSuccess,
}: ContactUsFormProps) {
  const navigate = useNavigate();
  const formId = "contact-us-form";

  const createMutation = useCreateContactMutation({
    onSuccess: () => {
      toast.success("Contact created successfully!");
      onSuccess?.();
      onClose?.();
      navigate({ to: "/dashboard/contact-us" });
    },
    onError: (error: Error) => {
      toastApiError(error, "Failed to create contact");
    },
  });

  const updateMutation = useUpdateContactMutation({
    onSuccess: () => {
      toast.success("Contact updated successfully!");
      onSuccess?.();
      onClose?.();
      navigate({ to: "/dashboard/contact-us" });
    },
    onError: (error: Error) => {
      toastApiError(error, "Failed to update contact");
    },
  });

  const deleteMutation = useDeleteContactMutation({
    onSuccess: () => {
      toast.success("Contact deleted successfully!");
      onSuccess?.();
      onClose?.();
      navigate({ to: "/dashboard/contact-us" });
    },
    onError: (error: Error) => {
      toastApiError(error, "Failed to delete contact");
    },
  });

  const isSaving =
    mode === "create"
      ? createMutation.isPending
      : mode === "edit"
        ? updateMutation.isPending
        : false;

  type ContactFormValues = Omit<CreateContact, "serviceId"> & {
    serviceId: number | undefined;
    isHandled: boolean;
  };

  const form = useDashboardForm<ContactFormValues>({
    defaultValues: {
      fullName: contactUs?.fullName ?? "",
      contact: contactUs?.contact ?? "",
      message: contactUs?.message ?? "",
      serviceId: contactUs?.serviceId ?? undefined,
      isHandled: contactUs?.isHandled ?? false,
    } satisfies ContactFormValues,
    validators: {
      onSubmit: (mode === "create"
        ? createContactSchema
        : updateContactSchema) as FormValidateOrFn<ContactFormValues>,
    },
    onSubmit: async ({ value }) => {
      if (mode === "view") return;

      if (mode === "create") {
        if (value.serviceId === undefined) {
          toast.error("Please provide a service ID");
          return;
        }

        await createMutation.mutateAsync({
          fullName: value.fullName,
          contact: value.contact,
          message: value.message,
          serviceId: value.serviceId,
        });
      } else if (mode === "edit" && contactUs) {
        await updateMutation.mutateAsync({
          id: contactUs.id,
          data: {
            fullName: value.fullName,
            contact: value.contact,
            message: value.message,
            serviceId: value.serviceId,
            isHandled: value.isHandled,
          },
        });
      }
    },
  });

  const isReadOnly = mode === "view";

  const pageTitle =
    mode === "create"
      ? "Create Contact"
      : mode === "edit"
        ? "Edit Contact"
        : "View Contact";

  return (
    <DashboardDetailShell
      mode={mode}
      title={pageTitle}
      formId={formId}
      onBack={() => onClose?.() ?? navigate({ to: "/dashboard/contact-us" })}
      isSubmitting={form.state.isSubmitting || isSaving}
      isSubmitDisabled={
        !form.state.canSubmit || form.state.isSubmitting || isSaving
      }
      submitLabel={mode === "create" ? "Create Contact" : "Update Contact"}
      submittingLabel={mode === "create" ? "Creating…" : "Updating…"}
      headerActions={
        mode === "view" && contactUs ? (
          <Button
            type="button"
            variant="destructive"
            onClick={() => deleteMutation.mutate(contactUs.id)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting…" : "Delete"}
          </Button>
        ) : null
      }
      preview={
        <form.Subscribe
          selector={(state) => ({
            fullName: state.values.fullName,
            contact: state.values.contact,
            message: state.values.message,
            serviceId: state.values.serviceId,
            isHandled: state.values.isHandled,
          })}
        >
          {(values) => (
            <ContactPreview
              fullName={values.fullName}
              contact={values.contact}
              message={values.message}
              serviceId={values.serviceId}
              isHandled={values.isHandled}
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
          <form.Field name="fullName">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    placeholder="Enter full name…"
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

          <form.Field name="contact">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Contact</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    placeholder="Email or phone…"
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

          <form.Field name="message">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Message</FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    placeholder="Message details…"
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

          <form.Field name="serviceId">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Service ID</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    placeholder="Enter a service ID…"
                    autoComplete="off"
                    disabled={isReadOnly || isSaving}
                    onChange={(event) =>
                      field.handleChange(
                        event.target.value
                          ? Number.parseInt(event.target.value, 10)
                          : undefined,
                      )
                    }
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {mode !== "create" && (
            <form.Field name="isHandled">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Handled Status</FieldLabel>
                  <div className="flex h-10 items-center gap-3 rounded-md border border-input px-3">
                    <Checkbox
                      id={field.name}
                      checked={field.state.value ?? false}
                      onCheckedChange={(checked) =>
                        field.handleChange(Boolean(checked))
                      }
                      disabled={isReadOnly || isSaving}
                    />
                    <span className="text-sm text-muted-foreground">
                      {field.state.value ? "Handled" : "Pending"}
                    </span>
                  </div>
                </Field>
              )}
            </form.Field>
          )}
        </FieldGroup>
      </form>
    </DashboardDetailShell>
  );
}
