
import { createClient } from "@/utils/supabase/server";
import { Text } from "@/components/retroui/Text";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash2, Tag as TagIcon, Eye } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <Text as="h1" className="text-6xl font-hand m-0 tracking-normal">Category Hub</Text>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 animate-pulse border border-black" />
            <Text className="text-[10px] uppercase font-bold tracking-widest opacity-40">System Taxonomy | Classification Layers</Text>
          </div>
        </div>
        
        <Link href="/admin/shop/categories/new">
          <button className="bg-black text-white border-2 border-black font-bold uppercase tracking-tighter text-[12px] px-6 py-3 transition-all flex items-center gap-2 hover:-translate-y-1 hover:-translate-x-1 active:translate-x-0 active:translate-y-0 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1),4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none">
            <Plus className="w-4 h-4" />
            Initialize Category
          </button>
        </Link>
      </div>

      {/* Categories Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {categories && categories.length > 0 ? (
          categories.map((cat: any) => (
            <div 
              key={cat.id} 
              className="group relative bg-[#f8f8f8] border-2 border-black flex flex-col transition-all hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              {/* Image Container - Aspect Ratio 3:4 */}
              <div className="relative aspect-[3/4] overflow-hidden border-b-2 border-black bg-zinc-200">
                {cat.image ? (
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-10">
                      <TagIcon className="w-20 h-20" />
                  </div>
                )}
                
                {/* Overlay ID Sticker */}
                <div className="absolute top-4 left-4 bg-white border-2 border-black px-2 py-1 flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                  <span className="text-[8px] font-mono font-bold uppercase leading-none truncate max-w-[80px]">
                      ID: {cat.id?.toString().slice(0, 8)}
                  </span>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-5 flex flex-col flex-1 bg-white">
                <Text className="text-xl font-bold uppercase tracking-tighter mb-1 leading-none group-hover:text-red-600 transition-colors">
                    {cat.name}
                </Text>
                <Text className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-normal mb-8 line-clamp-2 italic">
                    {cat.subtitle || "No classification sub-data identified"}
                </Text>

                {/* Action Bar */}
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-black/10">
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/shop/categories/${cat.id}/edit`}>
                          <div className="w-8 h-8 border-2 border-black bg-white flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none translate-y-[-2px] active:translate-y-0">
                            <Edit className="w-4 h-4" />
                          </div>
                      </Link>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end">
                          <span className="text-[8px] font-mono font-bold text-zinc-300 uppercase leading-none">Status</span>
                          <span className="text-[9px] font-black uppercase text-green-600">Active</span>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    </div>
                </div>
              </div>
              
              {/* Brutalist Detail Accents */}
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-red-600 border border-black z-10" />
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 border-2 border-dashed border-black/20 flex flex-col items-center justify-center gap-4">
            <TagIcon className="w-12 h-12 opacity-10" />
            <Text className="text-[10px] font-bold uppercase tracking-widest opacity-40">No records found in current sector</Text>
          </div>
        )}
      </div>
    </div>
  );
}
