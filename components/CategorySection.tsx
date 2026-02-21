"use client";

import { Text } from "@/components/retroui/Text";
import { Badge } from "@/components/retroui/Badge";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

interface Category {
  name: string;
  sub: string;
  image: string;
  href: string;
  isEvent?: boolean;
}

export const CategorySection = () => {
  const [categories, setCategories] = useState<Category[]>([
    {
      name: "RUJAKAN",
      sub: "EVENT TERPOPULER",
      image: "https://images.unsplash.com/photo-1555126634-323283e090fa?q=80&w=800&auto=format&fit=crop",
      isEvent: true,
      href: "/events/rujakan"
    }
  ]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (data) {
        const dbCategories = data.map((cat: any) => ({
          name: cat.name,
          sub: cat.subtitle || "",
          image: cat.image || "",
          href: `/shop?category=${encodeURIComponent(cat.name)}`
        }));
        
        // Combine RUJAKAN event with DB categories
        setCategories(prev => [prev[0], ...dbCategories]);
      }
    }
    fetchCategories();
  }, [supabase]);

  return (
    <section className="px-4 md:px-12 py-4 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <Text as="h2" className="m-0 uppercase font-black tracking-tighter text-3xl">Jelajahi kategori</Text>
        <Text as="p" className="text-zinc-500 text-sm font-medium">Temukan koleksi yang paling pas untukmu.</Text>
      </div>

      {/* Horizontal Scroll Layout */}
      <div className="flex overflow-x-auto pb-8 gap-6 md:gap-8 no-scrollbar snap-x items-center">
        {categories.map((cat) => (
          <Link 
            key={cat.name} 
            href={cat.href}
            className={cn(
              "flex-shrink-0 snap-start group relative transition-transform duration-300",
              cat.isEvent ? "w-[280px] md:w-[320px]" : "w-[220px] md:w-[260px]"
            )}
          >
            {cat.isEvent ? (
              /* UNIQUE TICKET STYLE FOR EVENT */
              <div className="relative aspect-[4/5] bg-accent border-4 border-black p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:-translate-y-1">
                {/* Notched Corners (Ticket Effect) - Punched into the corners */}
                <div className="absolute -top-5 -left-5 w-10 h-10 bg-[#f0f0f0] rounded-full z-20 border-r-4 border-b-4 border-black" />
                <div className="absolute -top-5 -right-5 w-10 h-10 bg-[#f0f0f0] rounded-full z-20 border-l-4 border-b-4 border-black" />
                <div className="absolute -bottom-5 -left-5 w-10 h-10 bg-[#f0f0f0] rounded-full z-20 border-r-4 border-t-4 border-black" />
                <div className="absolute -bottom-5 -right-5 w-10 h-10 bg-[#f0f0f0] rounded-full z-20 border-l-4 border-t-4 border-black" />
                
                <div className="relative w-full h-full overflow-hidden border-2 border-dashed border-black/30">
                  <Image 
                    src={cat.image} 
                    alt={cat.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Subtle Yellow Overlay to match the ticket theme */}
                  <div className="absolute inset-0 bg-accent/20 mix-blend-multiply" />
                  
                  {/* Floating Best Seller Badge */}
                  <div className="absolute top-4 left-0 right-0 flex justify-center z-30">
                    <Badge className="bg-accent text-black border-2 border-black rounded-none px-3 py-1 text-[10px] font-black uppercase rotate-[-3deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                       🔥 Paling Laris
                    </Badge>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-6 text-center space-y-1 bg-gradient-to-t from-black via-black/40 to-transparent">
                    <Text as="h1" className="m-0 text-white font-black italic tracking-tight text-4xl leading-none">
                      {cat.name}
                    </Text>
                    <Text as="p" className="m-0 text-accent font-black text-[10px] tracking-widest uppercase">
                      {cat.sub}
                    </Text>
                  </div>
                </div>
              </div>
            ) : (
              /* REGULAR SQUARE STYLE */
              <div className="relative aspect-[4/5] border-4 border-black overflow-hidden bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                {cat.image ? (
                  <Image 
                    src={cat.image} 
                    alt={cat.name} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-200 flex items-center justify-center">
                    <Text className="text-[10px] font-bold opacity-30">NO IMAGE</Text>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />
                <div className="absolute inset-x-0 bottom-0 p-6 space-y-1">
                  <Text as="h3" className="m-0 text-white font-black uppercase text-2xl tracking-tight leading-none group-hover:text-accent transition-colors">
                    {cat.name}
                  </Text>
                  <Text as="p" className="m-0 text-white/50 text-[10px] font-bold uppercase tracking-widest leading-none">
                    {cat.sub}
                  </Text>
                </div>
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
};
