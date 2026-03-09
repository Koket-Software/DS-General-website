import { GripVertical, Save, Undo2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  useAchievementsQuery,
  useReorderAchievementsMutation,
  type Achievement,
} from "./lib";

import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api-base";

const resolveImageUrl = (imageUrl: string) => {
  const baseUrl = (API_BASE_URL ?? "").replace(/\/$/, "");
  return imageUrl.startsWith("/") ? `${baseUrl}${imageUrl}` : imageUrl;
};

const reorderArray = <T,>(array: T[], fromIndex: number, toIndex: number) => {
  const clone = [...array];
  const [removed] = clone.splice(fromIndex, 1);

  if (!removed) return array;

  clone.splice(toIndex, 0, removed);
  return clone;
};

const hasOrderChanged = (next: Achievement[], source: Achievement[]) => {
  if (next.length !== source.length) return true;

  return next.some((item, index) => {
    const original = source[index];
    return !original || item.id !== original.id;
  });
};

export function ReorderPanel() {
  const [draftOrder, setDraftOrder] = useState<Achievement[] | null>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);

  const achievementsQuery = useAchievementsQuery({
    page: 1,
    limit: 100,
    sortBy: "position",
    sortOrder: "asc",
  });

  const sourceItems = achievementsQuery.data?.data ?? [];
  const orderedItems = draftOrder ?? sourceItems;

  const reorderMutation = useReorderAchievementsMutation({
    onSuccess: () => {
      toast.success("Achievement order saved");
      setDraftOrder(null);
    },
    onError: (error) => {
      toast.error(`Failed to save order: ${error.message}`);
    },
  });

  const isDirty = hasOrderChanged(orderedItems, sourceItems);

  const handleDrop = (targetIndex: number) => {
    if (draggingId === null) return;

    const currentIndex = orderedItems.findIndex(
      (item) => item.id === draggingId,
    );
    if (currentIndex < 0 || currentIndex === targetIndex) return;

    const reordered = reorderArray(orderedItems, currentIndex, targetIndex).map(
      (item, index) => ({
        ...item,
        position: index,
      }),
    );

    setDraftOrder(reordered);
    setDraggingId(null);
  };

  const moveWithKeyboard = (fromIndex: number, toIndex: number) => {
    if (
      toIndex < 0 ||
      toIndex >= orderedItems.length ||
      fromIndex === toIndex
    ) {
      return;
    }

    const reordered = reorderArray(orderedItems, fromIndex, toIndex).map(
      (item, index) => ({
        ...item,
        position: index,
      }),
    );
    setDraftOrder(reordered);
  };

  const handleSave = () => {
    if (!isDirty || orderedItems.length === 0) return;

    reorderMutation.mutate({
      items: orderedItems.map((item, index) => ({
        id: item.id,
        position: index,
      })),
    });
  };

  const handleReset = () => {
    setDraftOrder(null);
  };

  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Reorder Achievements</h3>
          <p className="text-sm text-muted-foreground">
            Drag and drop certificates to control homepage order.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={!isDirty || reorderMutation.isPending}
          >
            <Undo2 className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || reorderMutation.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            {reorderMutation.isPending ? "Saving..." : "Save Order"}
          </Button>
        </div>
      </div>

      {achievementsQuery.isPending ? (
        <div className="mt-4 grid gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`reorder-skeleton-${index}`}
              className="h-14 animate-pulse rounded-lg bg-muted/60"
            />
          ))}
        </div>
      ) : achievementsQuery.isError ? (
        <div className="mt-4 text-sm text-destructive">
          Failed to load achievements for reordering.
        </div>
      ) : orderedItems.length === 0 ? (
        <div className="mt-4 text-sm text-muted-foreground">
          No achievements found yet.
        </div>
      ) : (
        <ul className="mt-4 grid gap-2">
          {orderedItems.map((item, index) => (
            <li
              key={item.id}
              draggable
              onDragStart={() => setDraggingId(item.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDrop(index)}
              onKeyDown={(event) => {
                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  moveWithKeyboard(index, index - 1);
                }
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  moveWithKeyboard(index, index + 1);
                }
              }}
              tabIndex={0}
              role="button"
              aria-grabbed={draggingId === item.id}
              className="flex items-center gap-3 rounded-lg border bg-background px-3 py-2 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              aria-label={`Reorder ${item.title}`}
            >
              <GripVertical
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="w-8 text-sm text-muted-foreground">
                #{index + 1}
              </span>
              <img
                src={resolveImageUrl(item.imageUrl)}
                alt={item.title}
                width={112}
                height={80}
                loading="lazy"
                decoding="async"
                className="h-10 w-14 rounded object-cover"
              />
              <div className="min-w-0">
                <p className="truncate font-medium">{item.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {item.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
