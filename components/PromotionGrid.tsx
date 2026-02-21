"use client";

import { Text } from "@/components/retroui/Text";
import { Button } from "@/components/retroui/Button";
import { Badge } from "@/components/retroui/Badge";
import Image from "next/image";
import { cn } from "@/lib/utils";

const MERCH_ITEMS = [
  {
    id: "bundle-1",
    name: "Bundle Merdeka",
    sub: "Hoodie + Tee + Sticker Pack",
    price: "Rp 349.000",
    oldPrice: "Rp 499.000",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "bundle-2",
    name: "Duo Signature",
    sub: "2x Signature Tees (Any Color)",
    price: "Rp 269.000",
    oldPrice: "Rp 318.000",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "bundle-3",
    name: "Starter Pack",
    sub: "Tote Bag + Cap + Lanyard",
    price: "Rp 189.000",
    oldPrice: "Rp 250.000",
    image: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "bundle-4",
    name: "Premium Gift",
    sub: "Varsity Jacket + Exclusive Box",
    price: "Rp 599.000",
    oldPrice: "Rp 750.000",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop",
  }
];

export const PromotionGrid = () => {
  return (
    <section className="px-4 md:px-12 py-4 space-y-6 relative z-0">
      {/* Header */}
      <div className="flex justify-between items-end border-b-4 border-black pb-4">
        <Text as="h3" className="m-0 uppercase font-black tracking-tighter">
          Promo Paket Merchandise
        </Text>
        <Button variant="outline" className="hidden md:flex rounded-full px-6 border-2 border-black hover:bg-black hover:text-white transition-colors">
          Lihat semua paket
        </Button>
      </div>

      {/* Grid Layout Container */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        
        {/* Item 1 - Big on Desktop */}
        <div className="col-span-2 md:col-span-2 md:row-span-2 relative flex flex-col md:block border-4 border-black group overflow-hidden bg-white z-0">
          <div className="aspect-[4/5] md:aspect-auto md:h-full relative transition-transform duration-500 group-hover:scale-105 shrink-0">
            <Image 
              src={MERCH_ITEMS[0].image} 
              alt={MERCH_ITEMS[0].name} 
              fill 
              className="object-cover"
            />
          </div>
          <PromoInfo item={MERCH_ITEMS[0]} />
        </div>

        {/* Promo Paket Box */}
        <div className="col-span-1 md:col-span-1 bg-accent border-4 border-black p-6 flex flex-col justify-center items-start shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <Text as="h1" className="m-0 leading-[0.8] mb-2 font-black italic text-2xl md:text-5xl">PROMO</Text>
          <Text as="h1" className="m-0 leading-[0.8] font-black italic text-primary text-2xl md:text-5xl">PAKET</Text>
          <Text as="p" className="mt-4 text-[10px] md:text-xs font-bold leading-tight">Beli <span className="text-primary italic">Banyak</span>,<br/>Bayar <span className="italic">Lebih Hemat</span></Text>
        </div>

        {/* Item 2 */}
        <div className="col-span-1 md:col-span-1 flex flex-col md:block relative border-4 border-black bg-white overflow-hidden group">
          <div className="aspect-square relative transition-transform duration-500 group-hover:scale-105 shrink-0">
             <Image src={MERCH_ITEMS[1].image} alt={MERCH_ITEMS[1].name} fill className="object-cover" />
          </div>
          <PromoInfo item={MERCH_ITEMS[1]} size="sm" />
        </div>

        {/* Item 3 */}
        <div className="col-span-1 md:col-span-1 flex flex-col md:block relative border-4 border-black bg-white overflow-hidden group">
          <div className="aspect-square relative transition-transform duration-500 group-hover:scale-105 shrink-0">
             <Image src={MERCH_ITEMS[2].image} alt={MERCH_ITEMS[2].name} fill className="object-cover" />
          </div>
          <PromoInfo item={MERCH_ITEMS[2]} size="sm" />
        </div>

        {/* Item 4 */}
        <div className="col-span-1 md:col-span-1 flex flex-col md:block relative border-4 border-black bg-white overflow-hidden group">
          <div className="aspect-square relative transition-transform duration-500 group-hover:scale-105 shrink-0">
             <Image src={MERCH_ITEMS[3].image} alt={MERCH_ITEMS[3].name} fill className="object-cover" />
          </div>
          <PromoInfo item={MERCH_ITEMS[3]} size="sm" />
        </div>

      </div>
    </section>
  );
};

const PromoInfo = ({ item, size = "lg" }: { item: any, size?: "sm" | "lg" }) => (
  <div className={cn(
    "relative md:absolute md:bottom-4 md:right-4 bg-white md:bg-white/90 md:backdrop-blur-sm md:border-2 md:border-black p-3 md:p-4 md:rotate-[-1deg] md:shadow-md transition-all md:group-hover:rotate-0 z-10",
    size === "sm" ? "p-3 md:p-3" : "p-4"
  )}>
    <Badge className="bg-primary text-white border-black text-[8px] md:text-[10px] mb-2 md:mb-3 rounded-none px-2 md:px-3 py-0.5 md:py-1 uppercase font-black">Best Bundle</Badge>
    <Text as="h5" className="m-0 font-black uppercase text-xs md:text-sm">{item.name}</Text>
    <Text as="p" className="m-0 text-[10px] text-zinc-500 mb-1 leading-none">{item.sub}</Text>
    <div className="flex flex-col md:mt-0 mt-2">
       <span className="text-[10px] text-red-500 line-through font-bold opacity-60 leading-none">{item.oldPrice}</span>
       <span className="text-black font-black text-sm md:text-lg leading-none mt-1">{item.price}</span>
    </div>
  </div>
);