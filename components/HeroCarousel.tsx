"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/retroui/Carousel";
import { Button } from "@/components/retroui/Button";
import { Text } from "@/components/retroui/Text";
import { Badge } from "@/components/retroui/Badge";
import Image from "next/image";
import { cn } from "@/lib/utils";

const ITEMS = [
  {
    title: "Koleksi Terbaru",
    highlight: "B96 Family",
    desc: "Gaya retro yang tak lekang oleh waktu.",
    buttonText: "Temukan inspirasi",
    product: {
      name: "B96 HOODIE",
      detail: "Crimson Red",
      price: "Rp 249.000",
      oldPrice: "Rp 349.000",
      tag: "Harga B96 Family"
    },
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2000&auto=format&fit=crop",
    theme: "bg-[#e5dcd3]" 
  },
  {
    title: "Gaya Klasik",
    highlight: "Edisi Terbatas",
    desc: "Dirancang untuk merayakan hari jadi.",
    buttonText: "Lihat koleksi",
    product: {
      name: "VINTAGE TEE",
      detail: "Oversized Fit",
      price: "Rp 149.000",
      oldPrice: "Rp 199.000",
      tag: "Harga Terbatas"
    },
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2000&auto=format&fit=crop",
    theme: "bg-[#d3e5dc]"
  }
];

export const HeroCarousel = () => {
  return (
    <div className="w-full -mt-24 md:mt-0"> {/* Negative margin to pull under floating nav if needed, or zero it */}
      <Carousel className="w-full relative group overflow-hidden border-b-4 md:border-4 border-black md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <CarouselContent>
          {ITEMS.map((item, index) => (
            <CarouselItem key={index}>
              <div className="flex flex-col md:flex-row h-full min-h-[500px] md:min-h-[600px] md:h-[650px]">
                
                {/* Image Section - Shows FIRST on Mobile now */}
                <div className="relative w-full h-[350px] md:h-full md:flex-1 order-1 md:order-2 overflow-hidden border-b-4 md:border-b-0 md:border-l-4 border-black">
                  <Image 
                    src={item.image} 
                    alt={item.product.name} 
                    fill 
                    priority={index === 0}
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  
                  {/* Minimalist Product Tooltip */}
                  <div className="absolute bottom-6 right-6 md:bottom-20 md:right-32 bg-white/30 backdrop-blur-md p-3 md:p-6 border border-white/40 text-white shadow-2xl">
                    <Text as="h6" className="m-0 font-black text-[10px] md:text-sm uppercase tracking-widest leading-none mb-1">{item.product.name}</Text>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] md:text-xs line-through opacity-70 decoration-primary decoration-2">{item.product.oldPrice}</span>
                        <Badge className="w-fit bg-primary text-[8px] md:text-[10px] py-0 px-1 border-none rounded-none">{item.product.tag}</Badge>
                        <span className="text-xl md:text-3xl font-black">
                          <span className="text-[10px] md:text-base align-top mr-1 font-bold">Rp</span>
                          {item.product.price.replace("Rp ", "")}
                        </span>
                    </div>
                  </div>
                </div>

                {/* Text Info Section */}
                <div className={cn("w-full md:w-[450px] p-6 md:p-16 flex flex-col justify-center order-2 md:order-1 relative", item.theme)}>
                  {/* Decorative Pattern - Scaled down for mobile */}
                  <div className="absolute bottom-4 right-4 opacity-10 w-24 h-24 md:w-48 md:h-48 pointer-events-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-primary">
                        <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
                    </svg>
                  </div>

                  <div className="relative z-10 space-y-4 md:space-y-6">
                    <Text as="h1" className="text-2xl md:text-5xl font-black leading-none text-black uppercase">
                      {item.title} <br/> <span className="text-primary">{item.highlight}</span>
                    </Text>
                    <Text as="p" className="text-xs md:text-base text-zinc-600 max-w-[250px] md:max-w-none">
                      {item.desc}
                    </Text>
                    
                    <Button variant="default" className="w-fit rounded-full px-6 py-4 md:px-8 md:py-6 bg-black text-white border-none hover:bg-zinc-800 transition-all font-bold text-xs md:text-base">
                      {item.buttonText}
                    </Button>
                  </div>
                </div>

              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation Arrows - Hidden on small mobile to save space */}
        <div className="hidden sm:block">
          <CarouselPrevious className="left-4 bg-white/50 backdrop-blur-sm border-2 border-black hover:bg-white" />
          <CarouselNext className="right-4 bg-white/50 backdrop-blur-sm border-2 border-black hover:bg-white" />
        </div>
      </Carousel>
    </div>
  );
};
