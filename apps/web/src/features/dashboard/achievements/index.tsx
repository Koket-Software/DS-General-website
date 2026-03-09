import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Columns } from "./columns";
import {
  useAchievementsQuery,
  useDeleteAchievementMutation,
  type Achievement,
} from "./lib";
import { ReorderPanel } from "./ReorderPanel";
import { DeleteDialog } from "../components/deletedialog";
import { ResourceTable } from "../components/ResourceTable";
import { DashboardPageShell } from "../layout/dashboard-page-shell";

import { useTableFilters } from "@/lib/useTableFilters";

export default function AchievementsIndex() {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selected, setSelected] = useState<Achievement | null>(null);

  const { page, limit, search, debouncedSearch, setPage, setLimit, setSearch } =
    useTableFilters({ route: "/dashboard/achievements/" });

  const {
    data: achievements,
    isPending,
    isError,
    error,
  } = useAchievementsQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
  });

  const deleteMutation = useDeleteAchievementMutation({
    onSuccess: () => {
      toast.success("Achievement deleted successfully!");
      setDeleteDialogOpen(false);
    },
    onError: (mutationError) => {
      toast.error(`Failed to delete achievement: ${mutationError.message}`);
    },
  });

  const onView = (achievement: Achievement) => {
    navigate({
      to: "/dashboard/achievements/$id",
      params: { id: achievement.id.toString() },
    });
  };

  const onEdit = (achievement: Achievement) => {
    navigate({
      to: "/dashboard/achievements/$id/edit",
      params: { id: achievement.id.toString() },
    });
  };

  const onDelete = (achievement: Achievement) => {
    setSelected(achievement);
    setDeleteDialogOpen(true);
  };

  const handleCreate = () => {
    navigate({ to: "/dashboard/achievements/create" });
  };

  const pagination = achievements?.meta?.pagination
    ? {
        pageCount: achievements.meta.pagination.totalPages,
        page: achievements.meta.pagination.page,
        limit: achievements.meta.pagination.limit,
        setPage,
        setLimit,
      }
    : undefined;

  return (
    <DashboardPageShell className="space-y-6">
      <ReorderPanel />

      <ResourceTable
        columns={Columns(onView, onEdit, onDelete)}
        data={achievements?.data || []}
        onAction={handleCreate}
        actionTitle="Create Achievement"
        pagination={pagination}
        isLoading={isPending}
        isError={isError}
        error={error}
        searchKey="title"
        searchValue={search}
        onSearchChange={setSearch}
      />

      {isDeleteDialogOpen && selected && (
        <DeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onDelete={() => {
            deleteMutation.mutate(selected.id);
          }}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </DashboardPageShell>
  );
}
