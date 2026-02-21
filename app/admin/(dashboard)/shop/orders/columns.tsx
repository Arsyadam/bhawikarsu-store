"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export type OrderColumn = {
  id: string
  customer: string
  date: string
  total: number
  status: string
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="border-2 border-black data-[state=checked]:bg-black data-[state=checked]:text-white rounded-none"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="border-2 border-black data-[state=checked]:bg-black data-[state=checked]:text-white rounded-none"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      <span className="font-black font-mono text-xs italic">{row.getValue("id")}</span>
    )
  },
  {
    accessorKey: "customer",
    header: "Customer Identity",
    cell: ({ row }) => (
      <span className="font-bold uppercase text-[11px]">{row.getValue("customer")}</span>
    )
  },
  {
    accessorKey: "date",
    header: "Timestamp",
    cell: ({ row }) => (
      <span className="font-medium text-xs text-zinc-500 tabular-nums">{row.getValue("date")}</span>
    )
  },
  {
    accessorKey: "total",
    header: "Net Value",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total"))
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount)
      return <span className="font-black text-xs tabular-nums text-black">{formatted}</span>
    },
  },
  {
    accessorKey: "status",
    header: "Protocol Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge 
          className="rounded-none border-2 border-black bg-white text-black font-black uppercase text-[10px] px-2 py-0.5"
          style={{
            backgroundColor: status === 'completed' ? '#22c55e' : status === 'pending' ? '#eab308' : '#ef4444',
            color: 'black'
          }}
        >
          {status}
        </Badge>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 border-2 border-black flex items-center justify-center bg-white hover:bg-black hover:text-white transition-all">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <DropdownMenuLabel className="font-black uppercase text-[10px] tracking-widest">Protocol Actions</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-black" />
            <DropdownMenuItem className="font-bold text-xs cursor-pointer flex items-center gap-2">
                <Eye className="w-4 h-4" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem 
               className="font-bold text-xs cursor-pointer text-red-600 focus:text-red-600"
               onClick={() => console.log("Delete order", order.id)}
            >
                Terminate Record
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
