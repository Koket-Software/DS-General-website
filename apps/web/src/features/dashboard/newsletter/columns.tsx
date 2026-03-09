import type { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, EyeOff, Trash2 } from "lucide-react";

import type { Newsletter } from "./lib/newsletter-schema";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/features/dashboard/components/table/DataTableColumnHeader";
import { humanizeDate } from "@/utils/dateHuman";

export const Columns = (
  onToggleStatus: (subscriber: Newsletter) => void,
  onDelete: (subscriber: Newsletter) => void,
): ColumnDef<Newsletter>[] => [
  {
    accessorKey: "id",
    meta: { title: "ID" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[70px] font-medium">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "email",
    meta: { title: "Email" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[250px] truncate font-medium">
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "fullName",
    meta: { title: "Full Name" },
    header: "Full Name",
    cell: ({ row }) => {
      const fullName = row.getValue("fullName") as string | null;
      return (
        <div className="max-w-[180px] truncate text-sm">{fullName || "-"}</div>
      );
    },
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
        <Badge
          variant={isActive ? "default" : "secondary"}
          className={`whitespace-nowrap ${isActive ? "bg-success" : ""}`}
        >
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "subscribedAt",
    meta: { title: "Subscribed" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subscribed" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[180px] truncate text-sm">
        {humanizeDate(row.getValue("subscribedAt")) || ""}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    meta: { title: "Created At" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[140px] truncate text-sm">
        {humanizeDate(row.getValue("createdAt")) || ""}
      </div>
    ),
  },
  {
    id: "actions",
    meta: { title: "Actions" },
    header: "Actions",
    cell: ({ row }) => {
      const subscriber = row.original;
      const isActive = subscriber.isActive;

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
              <DropdownMenuItem onClick={() => onToggleStatus(subscriber)}>
                {isActive ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Mark Inactive
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark Active
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(subscriber)}>
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
