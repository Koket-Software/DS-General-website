import { Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Columns } from "./columns";
import {
  useDeleteNewsletterMutation,
  useNewslettersQuery,
  useUpdateNewsletterStatusMutation,
  type Newsletter,
} from "./lib";
import { DeleteDialog } from "../components/deletedialog";
import { ResourceTable } from "../components/ResourceTable";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useTableFilters } from "@/lib/useTableFilters";

export default function NewsletterIndex() {
  const {
    page,
    limit: pageSize,
    search,
    debouncedSearch,
    setPage,
    setLimit: setPageSize,
    setSearch,
  } = useTableFilters({ route: "/dashboard/newsletter/" });

  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] =
    useState<Newsletter | null>(null);

  const {
    data: subscribersData,
    isPending,
    isError,
    error,
  } = useNewslettersQuery({
    page,
    limit: pageSize,
    search: debouncedSearch,
    sortBy: "createdAt",
    sortOrder: "desc",
    isActive: statusFilter === "all" ? undefined : statusFilter === "active",
  });

  const updateStatusMutation = useUpdateNewsletterStatusMutation({
    onSuccess: () => {
      toast.success("Subscriber status updated successfully!");
    },
    onError: (mutationError) => {
      toast.error(`Failed to update subscriber: ${mutationError.message}`);
    },
  });

  const deleteMutation = useDeleteNewsletterMutation({
    onSuccess: () => {
      toast.success("Subscriber deleted successfully!");
      setDeleteDialogOpen(false);
      setSubscriberToDelete(null);
    },
    onError: (mutationError) => {
      toast.error(`Failed to delete subscriber: ${mutationError.message}`);
    },
  });

  const handleToggleStatus = (subscriber: Newsletter) => {
    updateStatusMutation.mutate({
      id: subscriber.id,
      data: { isActive: !subscriber.isActive },
    });
  };

  const handleDelete = (subscriber: Newsletter) => {
    setSubscriberToDelete(subscriber);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (subscriberToDelete) {
      deleteMutation.mutate(subscriberToDelete.id);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const subscribers = subscribersData?.data || [];
  const pagination = subscribersData?.meta?.pagination
    ? {
        pageCount: subscribersData.meta.pagination.totalPages,
        page: subscribersData.meta.pagination.page,
        limit: subscribersData.meta.pagination.limit,
        setPage: handlePageChange,
        setLimit: handlePageSizeChange,
      }
    : undefined;

  if (isPending) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const hasNoSubscribers =
    !isPending && subscribers.length === 0 && !search && statusFilter === "all";

  if (hasNoSubscribers) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Newsletter Subscribers</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Mail className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No subscribers yet</h3>
          <p className="text-muted-foreground max-w-sm">
            Newsletter subscribers from your footer form will appear here.
          </p>
        </div>
      </div>
    );
  }

  const hasNoResults =
    !isPending &&
    subscribers.length === 0 &&
    (search || statusFilter !== "all");

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Newsletter Subscribers</h1>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="status-filter">Status:</Label>
          <Select
            value={statusFilter}
            onValueChange={(value: "all" | "active" | "inactive") => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger id="status-filter" className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasNoResults ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Mail className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No results found</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            No subscribers match your filters. Try adjusting your search or
            filter criteria.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
              setPage(1);
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <ResourceTable
          columns={Columns(handleToggleStatus, handleDelete)}
          data={subscribers}
          pagination={pagination}
          isLoading={isPending}
          isError={isError}
          error={error}
          searchKey="email"
          searchValue={search}
          onSearchChange={handleSearchChange}
        />
      )}

      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={confirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
