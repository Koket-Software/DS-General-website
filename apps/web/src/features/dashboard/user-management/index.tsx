import { useNavigate } from "@tanstack/react-router";
import { Users, FilterX } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

import { Columns } from "./columns";
import {
  useUsersQuery,
  useDeleteUserMutation,
  useAssignRoleMutation,
  useRolesQuery,
} from "./lib/users-query";
import type { User, AssignRoleInput } from "./lib/users-schema";
import { DeleteDialog } from "../components/deletedialog";
import { DataTable } from "../components/table/DataTable";
import { DashboardPageShell } from "../layout/dashboard-page-shell";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function Index() {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isRoleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<
    "admin" | "blogger" | "user" | undefined
  >(undefined);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<
    "admin" | "blogger" | "user" | undefined
  >(undefined);

  // Debounce search input with 500ms delay
  const [debouncedSearch] = useDebounce(search, 500);

  const {
    data: users,
    isPending,
    isError,
    error,
  } = useUsersQuery(
    {
      page,
      limit,
      search: debouncedSearch || undefined,
      role: roleFilter,
    },
    {},
  );

  const { data: rolesData } = useRolesQuery();

  const handleCreate = () => {
    setSelected(null);
    navigate({ to: "/dashboard/user-management/create" });
  };

  const onView = (user: User) => {
    setSelected(user);
    navigate({
      to: "/dashboard/user-management/$userId",
      params: { userId: user.id },
    });
  };

  const onEdit = (user: User) => {
    setSelected(user);
    navigate({
      to: "/dashboard/user-management/$userId/edit",
      params: { userId: user.id },
    });
  };

  const onAssignRole = (user: User) => {
    setSelected(user);
    setSelectedRole(user.role);
    setRoleDialogOpen(true);
  };

  const onDelete = (user: User) => {
    setSelected(user);
    setDeleteDialogOpen(true);
  };

  const deleteMutation = useDeleteUserMutation({
    onSuccess: () => {
      toast.success("User deleted successfully!");
    },
    onError: (mutationError) => {
      toast.error(`Failed to delete user: ${mutationError.message}`);
    },
  });

  const assignRoleMutation = useAssignRoleMutation({
    onSuccess: () => {
      toast.success("Role assigned successfully!");
      setRoleDialogOpen(false);
    },
    onError: (mutationError) => {
      toast.error(`Failed to assign role: ${mutationError.message}`);
    },
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setLimit(newPageSize);
    setPage(1);
  };

  const handleRoleAssignment = () => {
    if (!selected || !selectedRole) return;

    const roleData: AssignRoleInput = { role: selectedRole };
    assignRoleMutation.mutate({
      id: selected.id,
      role: roleData,
    });
  };

  const handleRoleFilterChange = (value: string) => {
    if (value === "all") {
      setRoleFilter(undefined);
    } else {
      setRoleFilter(value as "admin" | "blogger" | "user");
    }
    setPage(1);
  };

  const handleClearFilters = () => {
    setRoleFilter(undefined);
    setSearch("");
    setPage(1);
  };

  const hasActiveFilters = roleFilter !== undefined || search !== "";

  const pagination = users?.meta?.pagination
    ? {
        pageCount: users.meta.pagination.totalPages,
        pageIndex: users.meta.pagination.page - 1,
        pageSize: users.meta.pagination.limit,
        onPageChange: handlePageChange,
        onPageSizeChange: handlePageSizeChange,
      }
    : undefined;

  // Loading skeleton
  if (isPending) {
    return (
      <DashboardPageShell>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-12 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </DashboardPageShell>
    );
  }

  // Empty state
  const isEmpty = !users?.data || users.data.length === 0;
  if (isEmpty && !hasActiveFilters) {
    return (
      <DashboardPageShell>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <div className="rounded-full bg-primary/10 p-6">
            <Users className="h-12 w-12 text-primary" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">No users yet</h3>
            <p className="text-muted-foreground max-w-md">
              Get started by creating your first user. Users can have different
              roles and permissions.
            </p>
          </div>
          <Button onClick={handleCreate} size="lg" className="rounded-none">
            Create First User
          </Button>
        </div>
      </DashboardPageShell>
    );
  }

  return (
    <DashboardPageShell title={<h1 className="text-2xl font-bold">Users</h1>}>
      {/* Filters section */}
      <div className="mb-4 flex flex-wrap items-end gap-3 md:gap-4">
        <div className="flex w-full flex-col gap-1 sm:w-auto">
          <Label
            htmlFor="role-filter"
            className="text-xs uppercase tracking-wide"
          >
            Filter by Role
          </Label>
          <Select
            value={roleFilter || "all"}
            onValueChange={handleRoleFilterChange}
          >
            <SelectTrigger
              id="role-filter"
              className="w-full rounded-none sm:w-[200px]"
            >
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="blogger">Blogger</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="rounded-none"
          >
            <FilterX className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Empty state with filters applied */}
      {isEmpty && hasActiveFilters ? (
        <div className="flex h-[50vh] flex-col items-center justify-center space-y-4 border-2 border-dashed">
          <div className="rounded-full bg-muted p-6">
            <FilterX className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">No users found</h3>
            <p className="text-muted-foreground max-w-md">
              No users match your current filters. Try adjusting your search or
              filter criteria.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="rounded-none"
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <DataTable
          columns={Columns(onView, onEdit, onAssignRole, onDelete)}
          data={users?.data || []}
          pagination={pagination}
          isLoading={isPending}
          isError={isError}
          error={error}
          searchKey="name"
          searchValue={search}
          onSearchChange={handleSearchChange}
        />
      )}

      {isDeleteDialogOpen && selected && (
        <DeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onDelete={() => {
            deleteMutation.mutate(selected.id);
            setDeleteDialogOpen(false);
          }}
          isDeleting={deleteMutation.isPending}
        />
      )}
      {isRoleDialogOpen && selected && (
        <Dialog open={isRoleDialogOpen} onOpenChange={setRoleDialogOpen}>
          <DialogContent className="rounded-none">
            <DialogHeader>
              <DialogTitle>Assign Role</DialogTitle>
              <DialogDescription>
                Change the role for {selected.name}. Current role:{" "}
                <span className="font-semibold">{selected.role}</span>
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="role-select">Select Role</Label>
              <Select
                value={selectedRole}
                onValueChange={(value) =>
                  setSelectedRole(value as "admin" | "blogger" | "user")
                }
              >
                <SelectTrigger id="role-select" className="mt-2 rounded-none">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {rolesData?.data?.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                className="rounded-none"
                onClick={() => setRoleDialogOpen(false)}
                disabled={assignRoleMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="rounded-none"
                onClick={handleRoleAssignment}
                disabled={
                  assignRoleMutation.isPending || selectedRole === selected.role
                }
              >
                {assignRoleMutation.isPending ? "Assigning..." : "Assign Role"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardPageShell>
  );
}
