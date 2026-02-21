"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, Settings2 } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface RetroDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
}

export function RetroDataTable<TData, TValue>({
  columns,
  data,
  searchKey,
}: RetroDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const retroBoxShadow = "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
  const retroHeaderClass = "bg-white border-2 border-black p-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
  const retroInputClass = "bg-zinc-100 border-2 border-black p-3 text-xs font-black uppercase tracking-widest placeholder:text-zinc-400 focus:bg-white focus:outline-none transition-all w-full md:max-w-sm"
  const retroButtonClass = "border-2 border-black font-black uppercase tracking-tighter text-[10px] px-4 py-2 transition-all hover:-translate-y-1 hover:-translate-x-1 active:translate-x-0 active:translate-y-0"

  return (
    <div className="space-y-6">
      <div className={cn(retroHeaderClass, retroBoxShadow)}>
        <div className="flex-1 w-full md:max-w-sm">
          {searchKey && (
            <input
              placeholder={`Search ${searchKey}...`}
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className={retroInputClass}
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(retroButtonClass, "bg-white flex items-center gap-2")}>
                <Settings2 className="w-4 h-4" />
                Columns
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <DropdownMenuLabel className="font-black uppercase text-[10px] tracking-widest">Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-black" />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize font-bold text-xs"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className={cn("bg-white border-2 border-black overflow-hidden", retroBoxShadow)}>
        <Table className="border-collapse">
          <TableHeader className="bg-zinc-100 border-b-2 border-black">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-none">
                {headerGroup.headers.map((header) => (
                  <TableHead 
                    key={header.id} 
                    className="font-black uppercase text-[10px] tracking-widest text-black border-r-2 border-black last:border-r-0 h-12"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-zinc-50 border-b-2 border-black last:border-b-0 group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      key={cell.id} 
                      className="border-r-2 border-zinc-200 group-last:border-r-2 last:border-r-0 py-4"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-xs font-black uppercase opacity-40">
                  No records found in database.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
        <div className="text-[10px] font-black uppercase tracking-widest opacity-60">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} ROW(S) SELECTED
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
                <p className="text-[10px] font-black uppercase tracking-widest">Rows per page</p>
                <select
                    className="border-2 border-black text-[10px] font-black px-2 py-1 bg-white focus:outline-none"
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            {pageSize}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-[10px] font-black uppercase tracking-widest">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
                <button
                    className={cn(retroButtonClass, "bg-white disabled:opacity-30 disabled:hover:translate-x-0 disabled:hover:translate-y-0")}
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                    className={cn(retroButtonClass, "bg-white disabled:opacity-30 disabled:hover:translate-x-0 disabled:hover:translate-y-0")}
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
      </div>
    </div>
  )
}
