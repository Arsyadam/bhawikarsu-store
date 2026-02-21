"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"

export type ProductColumn = {
  id: string
  name: string
  price: number
  discount: number
  stock: number
  categories: string[]
  image: string
  is_preorder: boolean
}

const deleteProduct = async (id: string) => {
  const supabase = createClient()
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) {
    toast.error("Gagal menghapus produk: " + error.message)
  } else {
    toast.success("Produk berhasil dihapus!")
    setTimeout(() => {
        window.location.reload()
    }, 1000)
  }
}

export const columns: ColumnDef<ProductColumn>[] = [
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
    accessorKey: "image",
    header: "Visual",
    cell: ({ row }) => (
      <div className="w-12 h-12 border-2 border-black bg-zinc-100 overflow-hidden">
        {row.getValue("image") ? (
          <img src={row.getValue("image")} alt={row.original.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-20">
            <Eye className="w-4 h-4" />
          </div>
        )}
      </div>
    )
  },
  {
    accessorKey: "name",
    header: "Product Entity",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-black uppercase text-[11px] leading-tight">{row.getValue("name")}</span>
        <span className="text-[9px] font-bold text-zinc-400 font-mono italic">ID: {row.original.id}</span>
      </div>
    )
  },
  {
    accessorKey: "categories",
    header: "Tags",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1 max-w-[150px]">
        {(row.getValue("categories") as string[])?.map((cat, i) => (
          <span key={i} className="text-[8px] font-black border border-black px-1 bg-zinc-100 uppercase">{cat}</span>
        ))}
      </div>
    )
  },
  {
    accessorKey: "price",
    header: "Unit Value",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount)
      return (
        <div className="flex flex-col">
          <span className="font-black text-xs tabular-nums text-black">{formatted}</span>
          {row.original.discount > 0 && (
            <span className="text-[9px] font-bold text-red-600 line-through">-{row.original.discount}%</span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "stock",
    header: "Inventory",
    cell: ({ row }) => {
      const stock = row.getValue("stock") as number
      const isPreOrder = row.original.is_preorder
      return (
        <div className="flex items-center gap-2">
          <span className={cn(
            "font-black text-xs tabular-nums",
            stock <= 5 ? "text-red-500" : "text-black"
          )}>
            {stock}
          </span>
          {isPreOrder && (
            <span className="text-[8px] font-black bg-yellow-400 px-1 border border-black uppercase">PRE-ORDER</span>
          )}
        </div>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 border-2 border-black flex items-center justify-center bg-white hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none translate-y-[-2px] active:translate-y-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <DropdownMenuLabel className="font-black uppercase text-[10px] tracking-widest">Record Operations</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-black" />
            <DropdownMenuItem asChild>
              <Link href={`/admin/shop/products/${product.id}/edit`} className="font-bold text-xs cursor-pointer flex items-center gap-2">
                <Edit className="w-4 h-4" /> Edit Configuration
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
               className="font-bold text-xs cursor-pointer text-red-600 focus:text-red-600 flex items-center gap-2"
               onClick={() => {
                 if(confirm("DANGER: This action will permanently delete this product record. Proceed?")) {
                    deleteProduct(product.id)
                 }
               }}
            >
                <Trash2 className="w-4 h-4" /> Terminate Record
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

import { cn } from "@/lib/utils"
