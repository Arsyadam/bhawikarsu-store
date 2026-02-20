"use client";

import { Text } from "@/components/retroui/Text";
import { Badge } from "@/components/retroui/Badge";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  {
    name: "RUJAKAN",
    sub: "EVENT TERPOPULER",
    image: "https://images.unsplash.com/photo-1555126634-323283e090fa?q=80&w=800&auto=format&fit=crop",
    isEvent: true,
    href: "/events/rujakan"
  },
  {
    name: "KAOS",
    sub: "Koleksi T-Shirt",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
    href: "/category/kaos"
  },
  {
    name: "JACKET",
    sub: "Outerwear & Hoodie",
    image: "https://images.unsplash.com/photo-1591047139829-d91aec06adbd?q=80&w=800&auto=format&fit=crop",
    href: "/category/jacket"
  },
  {
    name: "ACCESSORIES",
    sub: "Tas, Topi & Pernak-pernik",
    image: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=800&auto=format&fit=crop",
    href: "/category/accessories"
  },
  {
    name: "SPORTS",
    sub: "Jersey & Activewear",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop",
    href: "/category/sports"
  }
];

export const CategorySection = () => {
  return (
    <section className="px-4 md:px-12 py-4 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <Text as="h2" className="m-0 uppercase font-black tracking-tighter text-3xl">Jelajahi kategori</Text>
        <Text as="p" className="text-zinc-500 text-sm font-medium">Temukan koleksi yang paling pas untukmu.</Text>
      </div>

      {/* Horizontal Scroll Layout */}
      <div className="flex overflow-x-auto pb-8 gap-6 md:gap-8 no-scrollbar snap-x items-center">
        {CATEGORIES.map((cat) => (
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
                {/* Notched Corners (Ticket Effect) - Repositioned to cover shadow correctly */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#f0f0f0] border-4 border-black rounded-full z-20" />
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#f0f0f0] border-4 border-black rounded-full z-20" />
                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-[#f0f0f0] border-4 border-black rounded-full z-20" />
                <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-[#f0f0f0] border-4 border-black rounded-full z-20" />
                
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
                <Image 
                  src={cat.image} 
                  alt={cat.name} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
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
