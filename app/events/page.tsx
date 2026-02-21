"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Text } from "@/components/retroui/Text";
import { Card } from "@/components/retroui/Card";
import { Calendar, MapPin, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const EVENTS = [
  {
    id: 1,
    title: "B96 Rujakan Bareng",
    date: "15 Agustus 2026",
    location: "Alun-alun Kota Malang",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
    status: "Mendatang"
  },
  {
    id: 2,
    title: "Halal Bi Halal 1447 H",
    date: "20 Maret 2026",
    location: "Aula Utama Bhawikarsu",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop",
    status: "Selesai"
  },
  {
    id: 3,
    title: "Peresmian B96 Store",
    date: "10 Januari 2026",
    location: "Online",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop",
    status: "Selesai"
  }
];

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-[#f0f0f0] pt-24 md:pt-32">
      <Navbar />

      <main className="w-full max-w-[1200px] mx-auto px-4 md:px-12 py-8 overflow-x-hidden">
        {/* Header */}
        <div className="mb-16 relative text-left">
          <Text as="h1" className="text-[15vw] md:text-[7vw] italic tracking-tighter m-0 leading-[0.8] font-hand lowercase first-letter:uppercase">
            Acara
          </Text>
          <Text as="p" className="text-zinc-500 m-0 uppercase font-bold tracking-[0.6em] text-xs mt-8">
            Aktivitas Mendatang & Selesai
          </Text>
        </div>

        {/* Events List */}
        <div className="space-y-8 mb-24">
          {EVENTS.map((event) => (
            <Card key={event.id} className="bg-white border-[3px] border-black p-0 overflow-hidden flex flex-col md:flex-row group transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1">
              {/* Event Image */}
              <div className="w-full md:w-2/5 aspect-video md:aspect-auto relative border-b-2 md:border-b-0 md:border-r-[3px] border-black md:min-h-[300px]">
                <Image 
                  src={event.image} 
                  alt={event.title} 
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-105" 
                />
                <div className={cn(
                  "absolute top-4 left-4 border-2 border-black font-black italic px-3 py-1 text-[10px] md:text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest z-10 transition-transform group-hover:rotate-0",
                  event.status === "Mendatang" ? "bg-primary text-white -rotate-3" : "bg-white text-black rotate-2"
                )}>
                  {event.status}
                </div>
              </div>
              
              {/* Event Details */}
              <div className="p-6 md:p-8 lg:p-12 flex flex-col justify-between flex-grow bg-[url('/noise.png')] bg-repeat opacity-95">
                <div>
                  <Text as="h2" className="text-3xl md:text-5xl lg:text-5xl font-black uppercase tracking-tighter mb-6 leading-none group-hover:text-primary transition-colors">
                    {event.title}
                  </Text>
                  
                  <div className="flex flex-col gap-4 mt-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-black p-2 md:p-3 transform -rotate-2 group-hover:rotate-0 transition-transform">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex flex-col">
                         <Text as="h6" className="text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-0.5">Tanggal</Text>
                         <Text as="p" className="m-0 font-bold uppercase tracking-wider text-sm md:text-base">{event.date}</Text>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="bg-black p-2 md:p-3 transform rotate-2 group-hover:rotate-0 transition-transform">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex flex-col">
                          <Text as="h6" className="text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-0.5">Lokasi</Text>
                          <Text as="p" className="m-0 font-bold uppercase tracking-wider text-sm md:text-base">{event.location}</Text>
                      </div>
                    </div>
                  </div>
                </div>

                {/* View Details / Join Button Action Area */}
                <div className="mt-8 flex justify-end">
                   <Link href={`/events/${event.id}`}>
                      <button className="flex items-center gap-2 border-2 border-black px-6 py-3 font-black uppercase italic tracking-widest text-xs hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 group-hover:bg-primary group-hover:border-primary group-hover:text-white group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                         {event.status === "Mendatang" ? "Ikuti Acara" : "Lihat Galeri"}
                         <ArrowUpRight className="w-4 h-4" />
                      </button>
                   </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>


      <Footer />
    </div>
  );
}
