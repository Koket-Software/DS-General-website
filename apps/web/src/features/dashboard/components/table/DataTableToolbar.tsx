import type { Table } from "@tanstack/react-table";
import { PlusCircle, X } from "lucide-react";

import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { DataTableViewOptions } from "./DataTableViewOptions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DataTableToolbarProps<TData> {
  tableTitle?: string;
  table: Table<TData>;
  filterableColumns: {
    id: string;
    title: string;
    options: {
      label: string;
      value: string;
    }[];
  }[];
  searchKey?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onAction?: () => void;
  actionTitle?: string;
}

export function DataTableToolbar<TData>({
  tableTitle,
  table,
  searchKey,
  searchValue,
  onSearchChange,
  filterableColumns = [],
  onAction,
  actionTitle,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      <div className="flex w-full flex-wrap items-center gap-2">
        {tableTitle && (
          <h2 className="border bg-muted-foreground px-3 py-1.5 text-base font-bold text-background md:text-lg">
            {tableTitle}
          </h2>
        )}
        {searchKey && (
          <Input
            placeholder="Search ..."
            value={
              onSearchChange && searchValue !== undefined
                ? searchValue
                : ((table.getColumn(searchKey)?.getFilterValue() as string) ??
                  "")
            }
            onChange={(event) => {
              if (onSearchChange) {
                onSearchChange(event.target.value);
              } else {
                table.getColumn(searchKey)?.setFilterValue(event.target.value);
              }
            }}
            className="h-10 w-full rounded-none border-border bg-sidebar md:max-w-sm"
          />
        )}
      </div>

      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {filterableColumns.map((column) => {
            const columnFilter = table.getColumn(column.id);
            if (!columnFilter) return null;

            return (
              <DataTableFacetedFilter
                key={column.id}
                column={columnFilter}
                title={column.title}
                options={column.options}
              />
            );
          })}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-10 rounded-none px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex w-full flex-wrap items-center justify-end gap-2 md:w-auto">
          <DataTableViewOptions table={table} />
          {onAction && (
            <Button
              className="h-9 gap-2 rounded-none px-4 text-primary"
              onClick={onAction}
              title="Add New"
              variant="ghost"
            >
              <PlusCircle size={16} /> {actionTitle ?? "Add New"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
