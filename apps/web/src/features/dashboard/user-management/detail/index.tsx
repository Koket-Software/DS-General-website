import { useNavigate, useParams } from "@tanstack/react-router";
import { CheckCircle2, Edit, Trash2, UserCog, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DeleteDialog } from "../../components/deletedialog";
import { DashboardPageShell } from "../../layout/dashboard-page-shell";
import {
  useAssignRoleMutation,
  useDeleteUserMutation,
  useRolesQuery,
  useUserByIdQuery,
} from "../lib/users-query";
import type { AssignRole } from "../lib/users-schema";

import { AppImage } from "@/components/common/AppImage";
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
import { API_BASE_URL } from "@/lib/api-base";
import { cn } from "@/lib/utils";

export default function UserDetail() {
  const navigate = useNavigate();
  const { userId } = useParams({
    from: "/dashboard/user-management/$userId/",
  });
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isRoleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<
    "admin" | "blogger" | "user" | undefined
  >(undefined);

  const { data, isPending, isError } = useUserByIdQuery(userId);
  const { data: rolesData } = useRolesQuery();

  const deleteMutation = useDeleteUserMutation({
    onSuccess: () => {
      toast.success("User deleted successfully!");
      navigate({ to: "/dashboard/user-management" });
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

  const handleRoleAssignment = () => {
    if (!selectedRole) return;

    const roleData: AssignRole = { role: selectedRole };
    assignRoleMutation.mutate({
      id: userId,
      role: roleData,
    });
  };

  if (isPending) {
    return (
      <DashboardPageShell>
        <div className="flex min-h-[40svh] items-center justify-center">
          <div className="text-sm text-muted-foreground">
            Loading user details...
          </div>
        </div>
      </DashboardPageShell>
    );
  }

  if (isError || !data?.data) {
    return (
      <DashboardPageShell>
        <div className="flex min-h-[40svh] flex-col items-center justify-center gap-4 text-center">
          <div className="text-sm text-destructive">
            Failed to load user details. Please try again.
          </div>
          <Button
            type="button"
            variant="outline"
            className="rounded-none"
            onClick={() => navigate({ to: "/dashboard/user-management" })}
          >
            Back to Users
          </Button>
        </div>
      </DashboardPageShell>
    );
  }

  const user = data.data;
  const baseUrl = (API_BASE_URL ?? "").replace(/\/$/, "");
  const resolveImageUrl = (imageUrl?: string | null) =>
    imageUrl
      ? imageUrl.startsWith("/")
        ? `${baseUrl}${imageUrl}`
        : imageUrl
      : "";

  const roleStyles = {
    admin: "border-destructive/40 bg-destructive/10 text-destructive",
    blogger: "border-info/40 bg-info/10 text-info",
    user: "border-border bg-muted text-foreground",
  };
  const roleLabels = {
    admin: "Admin",
    blogger: "Blogger",
    user: "User",
  };

  return (
    <DashboardPageShell
      title={<h1 className="text-2xl font-bold">User Details</h1>}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-none"
            onClick={() =>
              navigate({
                to: "/dashboard/user-management/$userId/edit",
                params: { userId: user.id },
              })
            }
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-none"
            onClick={() => {
              setSelectedRole(user.role);
              setRoleDialogOpen(true);
            }}
          >
            <UserCog className="mr-2 h-4 w-4" />
            Assign Role
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="rounded-none"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      }
    >
      <div className="dashboard-box space-y-6 border p-4 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          {user.image ? (
            <AppImage
              src={resolveImageUrl(user.image)}
              alt={user.name}
              className="h-20 w-20 rounded-full border object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full border bg-primary/10 text-2xl font-semibold text-primary">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-semibold md:text-2xl">
              {user.name}
            </h2>
            <p className="truncate text-sm text-muted-foreground md:text-base">
              {user.email}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span
                className={cn(
                  "inline-flex items-center border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
                  roleStyles[user.role],
                )}
              >
                {roleLabels[user.role]}
              </span>
              <div className="flex items-center gap-1 text-sm">
                {user.emailVerified ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="text-success">Email Verified</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Email Not Verified
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {(user.profile.firstName ||
          user.profile.lastName ||
          user.profile.phoneNumber ||
          user.profile.headshotUrl) && (
          <section className="border-t pt-6">
            <h3 className="mb-4 text-base font-semibold md:text-lg">
              Profile Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {user.profile.firstName && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    First Name
                  </p>
                  <p className="font-medium">{user.profile.firstName}</p>
                </div>
              )}
              {user.profile.lastName && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Last Name
                  </p>
                  <p className="font-medium">{user.profile.lastName}</p>
                </div>
              )}
              {user.profile.phoneNumber && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Phone Number
                  </p>
                  <p className="font-medium">{user.profile.phoneNumber}</p>
                </div>
              )}
              {user.profile.headshotUrl && (
                <div className="sm:col-span-2">
                  <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                    Profile Headshot
                  </p>
                  <AppImage
                    src={resolveImageUrl(user.profile.headshotUrl)}
                    alt="Profile headshot"
                    className="h-40 w-40 border object-cover"
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {user.profile.socials && user.profile.socials.length > 0 && (
          <section className="border-t pt-6">
            <h3 className="mb-4 text-base font-semibold md:text-lg">
              Social Links
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {user.profile.socials.map((social) => (
                <div
                  key={social.socialId}
                  className="dashboard-box flex items-center gap-3 border bg-muted/20 p-3"
                >
                  {social.socialIconUrl ? (
                    <AppImage
                      src={resolveImageUrl(social.socialIconUrl)}
                      alt={social.socialTitle}
                      className="h-6 w-6 object-contain"
                    />
                  ) : (
                    <div className="h-6 w-6 bg-muted" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {social.socialTitle}
                    </p>
                    {social.handle && (
                      <p className="truncate text-xs text-muted-foreground">
                        {social.handle}
                      </p>
                    )}
                  </div>
                  {(social.fullUrl ||
                    (social.socialBaseUrl && social.handle)) && (
                    <a
                      href={
                        social.fullUrl ||
                        `${social.socialBaseUrl}/${social.handle?.replace(/^@/, "")}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Visit
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="border-t pt-6">
          <h3 className="mb-4 text-base font-semibold md:text-lg">
            Account Information
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                User ID
              </p>
              <p className="font-mono text-sm font-medium">{user.id}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Active Sessions
              </p>
              <p className="font-medium">{user.sessions}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Created At
              </p>
              <p className="font-medium">
                {new Date(user.createdAt).toLocaleDateString()} at{" "}
                {new Date(user.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Last Updated
              </p>
              <p className="font-medium">
                {new Date(user.updatedAt).toLocaleDateString()} at{" "}
                {new Date(user.updatedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </section>
      </div>

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={() => {
          deleteMutation.mutate(user.id);
          setDeleteDialogOpen(false);
        }}
        isDeleting={deleteMutation.isPending}
      />

      <Dialog open={isRoleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="rounded-none">
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              Change the role for {user.name}. Current role:{" "}
              <span className="font-semibold">{user.role}</span>
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
                assignRoleMutation.isPending || selectedRole === user.role
              }
            >
              {assignRoleMutation.isPending ? "Assigning..." : "Assign Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardPageShell>
  );
}
