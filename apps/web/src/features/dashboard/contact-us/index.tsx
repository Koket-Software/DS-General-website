import { useNavigate, useSearch } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Columns } from "./columns";
import {
  useContactsQuery,
  useUpdateContactMutation,
  useDeleteContactMutation,
  type Contact,
} from "./lib";
import { DeleteDialog } from "../components/deletedialog";
import { ResourceTable } from "../components/ResourceTable";
import { DashboardPageShell } from "../layout/dashboard-page-shell";

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
import { usePublicServices } from "@/lib/services/services-query";
import { useTableFilters } from "@/lib/useTableFilters";

export default function Index() {
  const navigate = useNavigate({ from: "/dashboard/contact-us" });
  const searchParams = useSearch({
    from: "/dashboard/contact-us/",
  }) as { serviceId?: number };

  // State for pagination
  const {
    page,
    limit: pageSize,
    search,
    debouncedSearch,
    setPage,
    setLimit: setPageSize,
    setSearch,
  } = useTableFilters({ route: "/dashboard/contact-us/" });

  // State for filters
  const [statusFilter, setStatusFilter] = useState<
    "all" | "handled" | "pending"
  >("all");
  const selectedServiceId = searchParams.serviceId;

  // State for delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const servicesQuery = usePublicServices({
    page: 1,
    limit: 50,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Fetch contacts
  const {
    data: contactsData,
    isPending,
    isError,
    error,
  } = useContactsQuery({
    page,
    limit: pageSize,
    search: debouncedSearch,
    sortBy: "createdAt",
    sortOrder: "desc",
    isHandled: statusFilter === "all" ? undefined : statusFilter === "handled",
    serviceId: selectedServiceId,
  });

  // Update mutation (for toggling handled status)
  const updateMutation = useUpdateContactMutation({
    onSuccess: () => {
      toast.success("Contact status updated successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to update contact: ${error.message}`);
    },
  });

  // Delete mutation
  const deleteMutation = useDeleteContactMutation({
    onSuccess: () => {
      toast.success("Contact deleted successfully!");
      setDeleteDialogOpen(false);
      setContactToDelete(null);
    },
    onError: (error) => {
      toast.error(`Failed to delete contact: ${error.message}`);
    },
  });

  // Action handlers
  const handleView = (contact: Contact) => {
    navigate({
      to: `/dashboard/contact-us/$id`,
      params: { id: String(contact.id) },
    });
  };

  const handleEdit = (contact: Contact) => {
    navigate({
      to: `/dashboard/contact-us/$id/edit`,
      params: { id: String(contact.id) },
    });
  };

  const handleCreate = () => {
    navigate({ to: "/dashboard/contact-us/create" });
  };

  const handleToggleStatus = (contact: Contact) => {
    updateMutation.mutate({
      id: contact.id,
      data: { isHandled: !contact.isHandled },
    });
  };

  const handleDelete = (contact: Contact) => {
    setContactToDelete(contact);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (contactToDelete) {
      deleteMutation.mutate(contactToDelete.id);
    }
  };

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  // Search handler
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page on search
  };
  const handleServiceFilterChange = (value: string) => {
    navigate({
      to: "/dashboard/contact-us",
      search: (prev: Record<string, unknown>) =>
        ({
          ...prev,
          serviceId: value === "all" ? undefined : Number(value),
          page: 1,
        }) as never,
    });
  };

  const contacts = contactsData?.data || [];
  const services = servicesQuery.data?.data ?? [];
  const pagination = contactsData?.meta?.pagination
    ? {
        pageCount: contactsData.meta.pagination.totalPages,
        page: contactsData.meta.pagination.page,
        limit: contactsData.meta.pagination.limit,
        setPage: handlePageChange,
        setLimit: handlePageSizeChange,
      }
    : undefined;

  // Loading skeleton
  if (isPending) {
    return (
      <DashboardPageShell>
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </DashboardPageShell>
    );
  }

  // Empty state when no contacts exist
  const hasNoContacts =
    !isPending &&
    contacts.length === 0 &&
    !search &&
    statusFilter === "all" &&
    !selectedServiceId;
  if (hasNoContacts) {
    return (
      <DashboardPageShell
        title={<h1 className="text-2xl font-bold">Contact Submissions</h1>}
        actions={
          <Button type="button" className="rounded-none" onClick={handleCreate}>
            Create Contact
          </Button>
        }
      >
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Mail className="mb-4 h-16 w-16 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">
            No contact submissions yet
          </h3>
          <p className="max-w-sm text-muted-foreground">
            Contact submissions from your website will appear here.
          </p>
        </div>
      </DashboardPageShell>
    );
  }

  // Empty state for filtered results
  const hasNoResults =
    !isPending &&
    contacts.length === 0 &&
    (search || statusFilter !== "all" || Boolean(selectedServiceId));

  return (
    <DashboardPageShell
      title={<h1 className="text-2xl font-bold">Contact Submissions</h1>}
    >
      <div className="mb-4 flex flex-wrap items-end gap-3 md:gap-4">
        <div className="flex w-full flex-col gap-1 sm:w-auto">
          <Label
            htmlFor="status-filter"
            className="text-xs uppercase tracking-wide"
          >
            Status
          </Label>
          <Select
            value={statusFilter}
            onValueChange={(value: "all" | "handled" | "pending") => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger
              id="status-filter"
              className="w-full rounded-none sm:w-[180px]"
            >
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="handled">Handled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-full flex-col gap-1 sm:w-auto">
          <Label
            htmlFor="service-filter"
            className="text-xs uppercase tracking-wide"
          >
            Service
          </Label>
          <Select
            value={selectedServiceId ? String(selectedServiceId) : "all"}
            onValueChange={handleServiceFilterChange}
          >
            <SelectTrigger
              id="service-filter"
              className="w-full rounded-none sm:w-[240px]"
            >
              <SelectValue placeholder="Filter by service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All services</SelectItem>
              {services.map((service) => (
                <SelectItem key={service.id} value={String(service.id)}>
                  {service.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasNoResults ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Mail className="mb-4 h-16 w-16 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No results found</h3>
          <p className="mb-6 max-w-sm text-muted-foreground">
            No contacts match your filters. Try adjusting your search or filter
            criteria.
          </p>
          <Button
            type="button"
            variant="outline"
            className="rounded-none"
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
              navigate({
                to: "/dashboard/contact-us",
                search: (prev: Record<string, unknown>) =>
                  ({
                    ...prev,
                    serviceId: undefined,
                    page: 1,
                  }) as never,
              });
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <ResourceTable
          columns={Columns(
            handleView,
            handleEdit,
            handleToggleStatus,
            handleDelete,
          )}
          data={contacts}
          onAction={handleCreate}
          actionTitle="Create Contact"
          pagination={pagination}
          isLoading={isPending}
          isError={isError}
          error={error}
          searchKey="fullName"
          searchValue={search}
          onSearchChange={handleSearchChange}
        />
      )}

      {/* Delete confirmation dialog */}
      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={confirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </DashboardPageShell>
  );
}
