"use client";

import { Text } from "@/components/retroui/Text";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const UPCOMING_EVENTS = [
  {
    id: "rujakan-2026",
    title: "RUJAKAN BARENG B96",
    date: "20 MARET 2026",
    location: "Aula Utama Bhawikarsu",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
    price: "RP 50.000"
  },
  {
    id: "reuni-agustus",
    title: "REUNI AKBAR SPESIAL",
    date: "15 AGUSTUS 2026",
    location: "Grand Ballroom Malang",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop",
    price: "GRATIS"
  }
];

export const EventTicketSection = () => {
  return (
    <section className="px-4 md:px-12 py-12 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end border-b-4 border-black pb-4">
        <Text as="h3" className="m-0 uppercase font-black tracking-tighter">
          ACARA MENDATANG
        </Text>
        <Link href="/events" className="group flex items-center gap-2 font-black text-xs uppercase tracking-widest hover:text-primary transition-colors">
          Lihat Semua Acara <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {UPCOMING_EVENTS.map((event) => (
          <Link key={event.id} href={`/events/${event.id}`} className="group relative block">
            {/* Ticket Shape Wrapper */}
            <div className="relative bg-white border-[4px] border-black flex flex-col md:flex-row min-h-[220px] transition-transform group-hover:-translate-y-1 group-hover:shadow-[12px_12px_0px_0px_rgba(255,49,49,1)] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
               
               {/* Ticket Left: Image Section */}
               <div className="w-full md:w-1/3 relative border-b-[4px] md:border-b-0 md:border-r-[4px] border-black bg-zinc-200">
                  <Image 
                    src={event.image} 
                    alt={event.title} 
                    fill 
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors" />
               </div>

               {/* Ticket Right: Info Section */}
               <div className="w-full md:w-2/3 p-6 flex flex-col justify-between relative">
                  
                  {/* Decorative Ticket Notches */}
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#f0f0f0] border-[4px] border-black rounded-full hidden md:block" />
                  
                  <div>
                     <div className="flex justify-between items-start mb-2">
                        <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Tiket Resmi</Text>
                        <div className="bg-black text-white px-2 py-0.5 text-[10px] font-black uppercase">TIKET MASUK</div>
                     </div>
                    <Text as="h3" className="text-2xl font-black uppercase tracking-tighter leading-tight mb-4 group-hover:text-primary transition-colors">
                       {event.title}
                    </Text>
                    
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 text-xs font-bold uppercase italic text-zinc-600">
                          <Calendar className="w-3.5 h-3.5" /> {event.date}
                       </div>
                       <div className="flex items-center gap-2 text-xs font-bold uppercase italic text-zinc-600">
                          <MapPin className="w-3.5 h-3.5" /> {event.location}
                       </div>
                    </div>
                  </div>

                  {/* Price Tag Sticker Style */}
                  <div className="mt-6 flex justify-between items-center">
                     <div className="px-3 py-1 bg-[#ffe616] border-2 border-black font-black text-sm rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        {event.price}
                     </div>
                     <span className="font-black text-[10px] uppercase tracking-widest border-b-2 border-primary">Beli Tiket Sekarang</span>
                  </div>

                  {/* Perforated Line Decoration */}
                  <div className="absolute right-[25%] top-0 bottom-0 w-[2px] border-r-2 border-dashed border-zinc-300 hidden md:block pointer-events-none" />
               </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
