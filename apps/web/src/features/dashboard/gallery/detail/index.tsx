import { useNavigate, useParams } from "@tanstack/react-router";
import { Edit, Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DeleteDialog } from "../../components/deletedialog";
import { DashboardPageShell } from "../../layout/dashboard-page-shell";
import {
  useDeleteGalleryItemMutation,
  useGalleryItemByIdQuery,
} from "../lib/gallery-query";

import { AppImage } from "@/components/common/AppImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api-base";
import { cn } from "@/lib/utils";

const resolveImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl) return "";
  const baseUrl = (API_BASE_URL ?? "").replace(/\/$/, "");
  return imageUrl.startsWith("/") ? `${baseUrl}${imageUrl}` : imageUrl;
};

const formatDateTime = (dateStr: string | null) => {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
};

export default function GalleryDetail() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/dashboard/gallery/$id/" });
  const numericId = Number.parseInt(id, 10);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const { data, isPending, isError } = useGalleryItemByIdQuery(numericId);

  const deleteMutation = useDeleteGalleryItemMutation({
    onSuccess: () => {
      toast.success("Gallery entry deleted successfully.");
      navigate({ to: "/dashboard/gallery" });
    },
    onError: (error) => {
      toast.error(`Failed to delete gallery entry: ${error.message}`);
    },
  });

  if (isPending) {
    return (
      <DashboardPageShell>
        <div className="flex min-h-[40svh] items-center justify-center text-sm text-muted-foreground">
          Loading gallery entry...
        </div>
      </DashboardPageShell>
    );
  }

  if (isError || !data?.data) {
    return (
      <DashboardPageShell>
        <div className="flex min-h-[40svh] flex-col items-center justify-center gap-4 text-center">
          <p className="text-destructive">Failed to load gallery entry.</p>
          <Button
            type="button"
            className="rounded-none"
            onClick={() => navigate({ to: "/dashboard/gallery" })}
          >
            Back to Gallery
          </Button>
        </div>
      </DashboardPageShell>
    );
  }

  const item = data.data;
  const galleryImages = item.imageUrls.map((imageUrl) =>
    resolveImageUrl(imageUrl),
  );
  const currentImage = galleryImages[activeIndex] ?? galleryImages[0] ?? "";

  return (
    <DashboardPageShell
      title={<h1 className="text-2xl font-bold">{item.title}</h1>}
      actions={
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-none"
            onClick={() => navigate({ to: "/dashboard/gallery" })}
          >
            Back to Gallery
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-none"
            onClick={() =>
              navigate({
                to: "/dashboard/gallery/$id/edit",
                params: { id },
              })
            }
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="rounded-none"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="space-y-3">
          <div className="dashboard-box overflow-hidden border bg-muted">
            {currentImage ? (
              <AppImage
                src={currentImage}
                alt={`${item.title} image ${activeIndex + 1}`}
                className="h-[260px] w-full object-cover sm:h-[340px] lg:h-[420px]"
              />
            ) : (
              <div className="flex h-[260px] items-center justify-center text-muted-foreground sm:h-[340px] lg:h-[420px]">
                No images available
              </div>
            )}
          </div>

          {galleryImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {galleryImages.map((imageUrl, index) => (
                <Button
                  key={`${imageUrl}-${index}`}
                  type="button"
                  variant="outline"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "h-auto overflow-hidden rounded-none p-0",
                    index === activeIndex && "ring-1 ring-primary",
                  )}
                >
                  <AppImage
                    src={imageUrl}
                    alt={`${item.title} thumbnail ${index + 1}`}
                    className="h-16 w-full object-cover sm:h-20"
                  />
                </Button>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-box space-y-5 border p-4 md:p-6">
          {item.description ? (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Description
              </h3>
              <p className="whitespace-pre-wrap text-sm md:text-base">
                {item.description}
              </p>
            </div>
          ) : null}

          <div className="space-y-4 border-t pt-5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Details
            </h3>

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">Category</span>
              <Badge variant="secondary" className="gap-1 rounded-none">
                <Tag className="h-3 w-3" />
                {item.category.name}
              </Badge>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">Images</span>
              <span className="font-medium">{item.imageUrls.length}</span>
            </div>

            {item.occurredAt && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">
                  Occurred On
                </span>
                <span className="text-right font-medium">
                  {formatDateTime(item.occurredAt)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">Added On</span>
              <span className="text-right font-medium">
                {formatDateTime(item.createdAt)}
              </span>
            </div>

            {item.updatedAt !== item.createdAt && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">
                  Last Modified
                </span>
                <span className="text-right font-medium">
                  {formatDateTime(item.updatedAt)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">Gallery ID</span>
              <span className="font-mono text-sm">{item.id}</span>
            </div>
          </div>
        </section>
      </div>

      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={() => deleteMutation.mutate(numericId)}
        isDeleting={deleteMutation.isPending}
      />
    </DashboardPageShell>
  );
}
