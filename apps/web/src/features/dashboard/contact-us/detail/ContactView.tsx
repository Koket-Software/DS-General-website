import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DeleteDialog } from "../../components/deletedialog";
import {
  useContactByIdQuery,
  useDeleteContactMutation,
  useUpdateContactMutation,
} from "../lib/contact-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { humanizeDate } from "@/utils/dateHuman";

interface ContactViewProps {
  contactId: number;
}

export default function ContactView({ contactId }: ContactViewProps) {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { data, isPending, isError, error } = useContactByIdQuery(contactId);
  const updateMutation = useUpdateContactMutation({
    onSuccess: () => {
      toast.success("Contact status updated successfully!");
    },
    onError: (mutationError) => {
      toast.error(`Failed to update contact: ${mutationError.message}`);
    },
  });
  const deleteMutation = useDeleteContactMutation({
    onSuccess: () => {
      toast.success("Contact deleted successfully!");
      setDeleteDialogOpen(false);
      navigate({ to: "/dashboard/contact-us" });
    },
    onError: (mutationError) => {
      toast.error(`Failed to delete contact: ${mutationError.message}`);
    },
  });

  if (isPending) return <div className="p-8">Loading contact...</div>;
  if (isError || !data?.data)
    return (
      <div className="p-8 text-destructive">
        Failed to load contact{error ? `: ${error.message}` : ""}
      </div>
    );

  const contact = data.data;
  const handleToggleStatus = () => {
    updateMutation.mutate({
      id: contact.id,
      data: { isHandled: !contact.isHandled },
    });
  };
  const handleDelete = () => {
    deleteMutation.mutate(contact.id);
  };
  const serviceTitle = contact.service?.title ?? "Unspecified";

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Contact Details</h1>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={deleteMutation.isPending || updateMutation.isPending}
          >
            Delete
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/dashboard/contact-us" })}
          >
            Back to List
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <Badge
              variant={contact.isHandled ? "default" : "secondary"}
              className={`${contact.isHandled ? "bg-success" : ""}`}
            >
              {contact.isHandled ? (
                <>
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Handled
                </>
              ) : (
                <>
                  <XCircle className="mr-1 h-3 w-3" />
                  Pending
                </>
              )}
            </Badge>
          </div>
          <Button
            type="button"
            onClick={handleToggleStatus}
            disabled={updateMutation.isPending || deleteMutation.isPending}
          >
            {updateMutation.isPending
              ? "Updating..."
              : contact.isHandled
                ? "Mark as Pending"
                : "Mark as Handled"}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Full Name
            </p>
            <p className="mt-1 text-sm font-medium">{contact.fullName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Contact</p>
            <p className="mt-1 text-sm font-medium">{contact.contact}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Requested Service
            </p>
            <p className="mt-1 text-sm font-medium">{serviceTitle}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Submitted
            </p>
            <p className="mt-1 text-sm font-medium">
              {humanizeDate(contact.createdAt) || "-"}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">Message</p>
          <Textarea
            value={contact.message}
            readOnly
            rows={7}
            className="mt-2 resize-none bg-muted/20"
          />
        </div>
      </div>

      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
