import type { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function DataTablePagination<TData>({
  table,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps<TData>) {
  // Handle page index change
  const handlePageIndexChange = (pageIndex: number) => {
    if (onPageChange) {
      onPageChange(pageIndex);
    } else {
      table.setPageIndex(pageIndex);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    const pageSize = Number(value);
    if (onPageSizeChange) {
      onPageSizeChange(pageSize);
    } else {
      table.setPageSize(pageSize);
    }
  };
  return (
    <div className="flex flex-col gap-3 border-t pt-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-3 md:gap-5">
        <div className="flex items-center gap-2">
          <p className="whitespace-nowrap text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="h-8 w-[74px] rounded-none border">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
      </div>
      <div className="flex items-center justify-end gap-1.5">
        <Button
          variant="ghost"
          className="hidden h-8 w-8 rounded-none p-0 md:flex"
          onClick={() => handlePageIndexChange(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="h-8 w-8 rounded-none p-0"
          onClick={() => {
            if (onPageChange) {
              handlePageIndexChange(table.getState().pagination.pageIndex - 1);
            } else {
              table.previousPage();
            }
          }}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="h-8 w-8 rounded-none p-0"
          onClick={() => {
            if (onPageChange) {
              handlePageIndexChange(table.getState().pagination.pageIndex + 1);
            } else {
              table.nextPage();
            }
          }}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="hidden h-8 w-8 rounded-none p-0 md:flex"
          onClick={() => handlePageIndexChange(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to last page</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
