import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";

import type { Achievement } from "./lib";

import { AppImage } from "@/components/common/AppImage";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/features/dashboard/components/table/DataTableColumnHeader";
import { API_BASE_URL } from "@/lib/api-base";
import { humanizeDate } from "@/utils/dateHuman";

const resolveImageUrl = (imageUrl: string | null | undefined) => {
  if (!imageUrl) return null;

  const baseUrl = (API_BASE_URL ?? "").replace(/\/$/, "");
  return imageUrl.startsWith("/") ? `${baseUrl}${imageUrl}` : imageUrl;
};

export const Columns = (
  onView: (achievement: Achievement) => void,
  onEdit: (achievement: Achievement) => void,
  onDelete: (achievement: Achievement) => void,
): ColumnDef<Achievement>[] => [
  {
    accessorKey: "id",
    meta: { title: "Id" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "title",
    meta: { title: "Title" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[280px] truncate font-medium">
        {row.getValue("title")}
      </div>
    ),
  },
  {
    accessorKey: "description",
    meta: { title: "Description" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[320px] truncate text-muted-foreground text-sm">
        {row.getValue("description")}
      </div>
    ),
  },
  {
    accessorKey: "position",
    meta: { title: "Position" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Position" />
    ),
    cell: ({ row }) => <div>{row.getValue("position")}</div>,
  },
  {
    accessorKey: "isActive",
    meta: { title: "Status" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;

      return (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
            isActive
              ? "bg-green-100 text-green-700"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      );
    },
  },
  {
    accessorKey: "imageUrl",
    meta: { title: "Image" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
    cell: ({ row }) => {
      const src = resolveImageUrl(row.getValue("imageUrl") as string | null);

      return src ? (
        <AppImage
          src={src}
          alt="Achievement certificate"
          width={80}
          height={48}
          className="h-12 w-20 rounded-md object-cover"
        />
      ) : (
        <div className="h-12 w-20 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
          No image
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    meta: { title: "Created At" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[140px] truncate">
        {humanizeDate(row.getValue("createdAt")) || ""}
      </div>
    ),
  },
  {
    id: "actions",
    meta: { title: "Action" },
    header: "Action",
    cell: ({ row }) => {
      const achievement = row.original;

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(achievement)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(achievement)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(achievement)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
