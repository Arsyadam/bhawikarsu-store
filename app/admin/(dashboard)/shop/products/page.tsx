"use client"

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { RetroDataTable } from "@/components/admin/RetroDataTable";
import { columns, ProductColumn } from "./columns";
import { Text } from "@/components/retroui/Text";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminProductsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ProductColumn[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProducts() {
      const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (products) {
        setData(products.map(p => ({
          id: p.id,
          name: p.name || "UNNAMED ENTITY",
          price: p.price || 0,
          discount: p.discount || 0,
          stock: p.stock || 0,
          categories: p.categories || [],
          image: p.image || (p.images && p.images[0]) || "",
          is_preorder: p.is_preorder || false
        })));
      }
      setLoading(false);
    }
    fetchProducts();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-black" />
        <span className="font-bold uppercase text-[10px] tracking-[0.3em]">Querying Catalog Records...</span>
      </div>
    );
  }

  const retroButtonClass = "border-2 border-black font-black uppercase tracking-tighter text-[12px] px-6 py-3 transition-all truncate hover:-translate-y-1 hover:-translate-x-1 active:translate-x-0 active:translate-y-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none";

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
            <Text as="h1" className="text-6xl font-hand m-0 tracking-normal">Product Grid</Text>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-600 animate-pulse border border-black" />
                <Text className="text-[10px] uppercase font-bold tracking-widest opacity-40">Global Inventory Access | System.Admin</Text>
            </div>
        </div>
        
        <Link href="/admin/shop/products/new">
            <button className={cn(retroButtonClass, "bg-black text-white flex items-center gap-2")}>
                <Plus className="w-4 h-4" />
                Register New Product
            </button>
        </Link>
      </div>

      <RetroDataTable 
        columns={columns} 
        data={data} 
        searchKey="name"
      />
    </div>
  );
}
