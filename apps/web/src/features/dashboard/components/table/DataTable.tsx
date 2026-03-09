import {
  type Cell,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { DataTableError } from "./DataTableError";
import { DataTableLoadingSkeleton } from "./DataTableLoadingSkeleton";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableToolbar } from "./DataTableToolbar";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface PaginationProps {
  pageCount?: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export type DataTableColumnMeta = {
  title?: string;
  mobileLabel?: string;
  mobileOrder?: number;
  mobileHidden?: boolean;
  mobilePrimary?: boolean;
  mobileClassName?: string;
};

interface DataTableProps<TData, TValue> {
  tableTitle?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  pagination?: PaginationProps;
  searchKey?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filterableColumns?: {
    id: string;
    title: string;
    options: {
      label: string;
      value: string;
    }[];
  }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toolbar?: React.ComponentType<any>;
  CustomToolbar?: React.ReactNode;
  onAction?: () => void;
  actionTitle?: string;
  mobileCard?: {
    enabled?: boolean;
    className?: string;
    cardClassName?: string;
    renderPrimary?: (row: Row<TData>) => React.ReactNode;
  };
}

export function DataTable<TData, TValue>({
  tableTitle,
  columns,
  data,
  isLoading,
  isError,
  error,
  pagination,
  searchKey,
  searchValue,
  onSearchChange,
  filterableColumns = [],
  toolbar: CustomToolbar,
  CustomToolbar: CustomToolbarJSX,
  onAction,
  actionTitle,
  mobileCard,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const isMobile = useIsMobile();

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      ...(pagination && {
        pagination: {
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        },
      }),
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    ...(pagination && {
      manualPagination: true,
      pageCount: pagination.pageCount ?? 0,
    }),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    ...(pagination
      ? {}
      : {
          initialState: {
            pagination: {
              pageSize: 10,
            },
          },
        }),
  });

  const useMobileCards = (mobileCard?.enabled ?? true) && isMobile;

  const orderedMobileColumns = React.useMemo(() => {
    return table
      .getVisibleLeafColumns()
      .filter((column) => {
        const meta = (column.columnDef.meta ?? {}) as DataTableColumnMeta;
        return !meta.mobileHidden;
      })
      .sort((a, b) => {
        const aMeta = (a.columnDef.meta ?? {}) as DataTableColumnMeta;
        const bMeta = (b.columnDef.meta ?? {}) as DataTableColumnMeta;
        return (
          (aMeta.mobileOrder ?? Number.MAX_SAFE_INTEGER) -
          (bMeta.mobileOrder ?? Number.MAX_SAFE_INTEGER)
        );
      });
  }, [table]);

  const primaryColumn = React.useMemo(() => {
    const explicit = orderedMobileColumns.find((column) => {
      const meta = (column.columnDef.meta ?? {}) as DataTableColumnMeta;
      return meta.mobilePrimary;
    });
    if (explicit) return explicit;
    return orderedMobileColumns.find((column) => column.id !== "actions");
  }, [orderedMobileColumns]);

  const getColumnLabel = (column: (typeof orderedMobileColumns)[number]) => {
    const humanize = (value: string) =>
      value
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

    const meta = (column.columnDef.meta ?? {}) as DataTableColumnMeta;
    if (meta.mobileLabel) return meta.mobileLabel;
    if (meta.title) return meta.title;
    if (column.id === "actions") return "Actions";
    if (typeof column.columnDef.header === "string")
      return column.columnDef.header;
    return humanize(column.id);
  };

  const renderMobileCell = (row: Row<TData>, columnId: string) => {
    const cell = row
      .getVisibleCells()
      .find((candidate) => candidate.column.id === columnId) as
      | Cell<TData, unknown>
      | undefined;
    if (!cell) return null;
    return flexRender(cell.column.columnDef.cell, cell.getContext());
  };

  const ToolbarComponent = CustomToolbar || DataTableToolbar;

  const handlePaginationChange = (pageIndex: number) => {
    if (pagination) {
      pagination.onPageChange(pageIndex + 1);
    } else {
      table.setPageIndex(pageIndex);
    }
  };

  const handlePageSizeChange = (pageSize: number) => {
    if (pagination) {
      pagination.onPageSizeChange(pageSize);
    } else {
      table.setPageSize(pageSize);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {CustomToolbarJSX ? (
        CustomToolbarJSX
      ) : CustomToolbar ? (
        <ToolbarComponent
          table={table}
          filterableColumns={filterableColumns}
          searchKey={searchKey}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          onAction={onAction}
          actionTitle={actionTitle}
        />
      ) : (
        <DataTableToolbar
          tableTitle={tableTitle}
          table={table}
          filterableColumns={filterableColumns}
          searchKey={searchKey}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          onAction={onAction}
          actionTitle={actionTitle}
        />
      )}

      <Separator />

      {useMobileCards ? (
        <div className={cn("space-y-3", mobileCard?.className)}>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "dashboard-box animate-pulse border bg-muted/40 p-4",
                  mobileCard?.cardClassName,
                )}
              >
                <div className="mb-3 h-4 w-2/3 bg-muted" />
                <div className="h-3 w-full bg-muted" />
              </div>
            ))
          ) : isError && error ? (
            <div
              className={cn(
                "dashboard-box border p-4",
                mobileCard?.cardClassName,
              )}
            >
              <div className="space-y-3 text-sm">
                <p className="font-semibold text-destructive">
                  Failed to load data
                </p>
                <p className="text-muted-foreground">{error.message}</p>
                <Button
                  variant="outline"
                  className="h-9 rounded-none"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => {
              return (
                <article
                  key={row.id}
                  className={cn(
                    "dashboard-box space-y-3 border bg-background p-4",
                    mobileCard?.cardClassName,
                  )}
                >
                  <div className="border-b pb-2">
                    {mobileCard?.renderPrimary ? (
                      mobileCard.renderPrimary(row)
                    ) : primaryColumn ? (
                      <div className="text-sm font-semibold">
                        {renderMobileCell(row, primaryColumn.id)}
                      </div>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    {orderedMobileColumns.map((column) => {
                      if (column.id === primaryColumn?.id) return null;
                      const meta = (column.columnDef.meta ??
                        {}) as DataTableColumnMeta;

                      return (
                        <div
                          key={`${row.id}-${column.id}`}
                          className={cn(
                            "grid grid-cols-[96px_1fr] items-start gap-3 text-sm",
                            meta.mobileClassName,
                          )}
                        >
                          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {getColumnLabel(column)}
                          </span>
                          <div className="min-w-0 break-words">
                            {renderMobileCell(row, column.id)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </article>
              );
            })
          ) : (
            <div
              className={cn(
                "dashboard-box border p-4 text-sm",
                mobileCard?.cardClassName,
              )}
            >
              No results found.
            </div>
          )}
        </div>
      ) : (
        <div className="dashboard-box overflow-hidden">
          <Table>
            <TableHeader className="h-11 bg-sidebar">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-0">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="whitespace-nowrap border-0 px-4 py-2"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            {isLoading ? (
              <DataTableLoadingSkeleton columns={columns} />
            ) : isError && error ? (
              <DataTableError error={error} columns={columns.length} />
            ) : (
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="border-0 hover:bg-muted/50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="border-0">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 border-0 text-center"
                    >
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </div>
      )}

      {!isError && table.getRowModel().rows.length > 1 && (
        <DataTablePagination
          table={table}
          onPageChange={handlePaginationChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
}
