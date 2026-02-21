"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Text } from "@/components/retroui/Text";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Clock, Info, Map, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const EVENT_DETAIL = {
  id: "rujakan-2026",
  title: "B96 Rujakan Bareng - Spesial Reuni",
  date: "15 Agustus 2026",
  time: "15:00 - 22:00 WIB",
  location: "Bhawikarsu Main Hall, Malang, Jawa Timur",
  image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
  layoutImage: "https://images.unsplash.com/photo-1516280440502-d28b0304c10c?q=80&w=800&auto=format&fit=crop", 
  mapImage: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop", 
  priceStart: "Rp 50.000",
  description: "Acara tahunan Rujakan Bareng kembali hadir! Menikmati rujak bersama seluruh angkatan B96 dengan hiburan live music, games, dan doorprize menarik. Jangan lewatkan momen kebersamaan ini setelah sekian lama kita berpisah. Akan ada banyak kejutan yang menanti.",
  importantInfo: [
    "Wajib membawa ID Card B96 atau bukti alumni (Digital/Fisik).",
    "Tiket yang sudah dibeli tidak dapat dikembalikan (Non-refundable).",
    "Mohon hadir 30 menit sebelum acara dimulai untuk registrasi ulang.",
    "Dilarang membawa makanan dan minuman dari luar."
  ],
  tickets: [
    { id: "t1", name: "EARLY BIRD - TRIBUN", price: 50000, available: false },
    { id: "t2", name: "REGULAR - FLOOR", price: 75000, available: true },
    { id: "t3", name: "VIP (Include F&B) - STAGE", price: 150000, available: true }
  ]
};

export default function EventDetailPage() {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#f0f0f0]">
      <Navbar />

      <main className="w-full overflow-x-hidden">
        
        {/* HERO SECTION - Dark Background like the reference */}
        <div className="relative w-full bg-[#18181b] text-white min-h-[500px] flex items-center pt-32 pb-16">
          <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-12 w-full flex flex-col md:flex-row gap-8 lg:gap-16 items-center md:items-start">
             
             {/* Thumbnail Poster */}
             <div className="w-full md:w-[500px] lg:w-[600px] aspect-[3/2] relative border-[8px] border-white shadow-[16px_16px_0px_0px_rgba(255,49,49,1)] flex-shrink-0 bg-white transition-transform duration-300 overflow-hidden">
                <Image src={EVENT_DETAIL.image} alt="poster" fill className="object-cover" />
                
                <div className="absolute top-4 left-4 bg-black text-white px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest border-2 border-white z-20">
                   Acara Resmi
                </div>
             </div>
             
             {/* Event Info Header */}
             <div className="flex-grow flex flex-col justify-center py-4 w-full">
                
                {/* Back Link */}
                <Link href="/events" className="inline-flex items-center gap-2 mb-6 group w-fit text-zinc-400 hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="uppercase font-black text-xs tracking-widest">Kembali ke Acara</span>
                </Link>

                <Text as="h1" className="text-2xl lg:text-4xl   tracking-tighter mb-10 leading-[1.1] md:leading-[1.05] drop-shadow-md">
                   {EVENT_DETAIL.title}
                </Text>
                                {/* Info List */}
                <div className="space-y-4 mb-4">
                   <div className="flex items-center gap-5 bg-[#1f1f22] px-6 py-4 border-l-4 border-primary">
                      <MapPin className="w-5 h-5 text-primary shrink-0" />
                      <span className="font-bold text-sm md:text-base tracking-wide">{EVENT_DETAIL.location}</span>
                   </div>
                   <div className="flex items-center gap-5 bg-[#1f1f22] px-6 py-4 border-l-4 border-primary">
                      <Calendar className="w-5 h-5 text-primary shrink-0" />
                      <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <span className="font-bold text-sm md:text-base tracking-wide">{"20 Maret 2026"}</span>
                        {(() => {
                           const eventDate = new Date('2026-03-20');
                           const today = new Date('2026-02-21'); // Using current local time from metadata
                           const diffTime = eventDate.getTime() - today.getTime();
                           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                           
                           if (diffDays > 0) {
                              return (
                                 <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 uppercase tracking-widest border border-white">
                                    {diffDays} Hari Lagi
                                 </span>
                              );
                           } else if (diffDays < 0) {
                              return (
                                 <span className="bg-zinc-600 text-white text-[10px] font-black px-2 py-0.5 uppercase tracking-widest border border-white">
                                    {Math.abs(diffDays)} Hari yang lalu
                                 </span>
                              );
                           } else {
                              return (
                                 <span className="bg-white text-black text-[10px] font-black px-2 py-0.5 uppercase tracking-widest border border-black animate-pulse">
                                    Hari Ini
                                 </span>
                              );
                           }
                        })()}
                      </div>
                   </div>
                   <div className="flex items-center gap-5 bg-[#1f1f22] px-6 py-4 border-l-4 border-primary">
                      <Clock className="w-5 h-5 text-primary shrink-0" />
                      <span className="font-bold text-sm md:text-base tracking-wide">{EVENT_DETAIL.time}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div className="max-w-[1200px] mx-auto px-4 md:px-12 py-12 md:py-16">
           
           {/* Horizontal Sponsor Marquee (Colored, Transparent Background) */}
           <div className="mb-16 -mx-4 md:-mx-12 py-8 relative overflow-hidden flex flex-col items-center border-y-[4px] border-black bg-white shadow-[0px_8px_0px_0px_rgba(0,0,0,1)]">
              <Text as="h4" className="text-black font-black uppercase tracking-[0.2em] text-sm text-center mb-8 relative z-10 border-b-2 border-primary pb-1">Didukung Oleh</Text>
              
              <style>{`
                @keyframes scroll-horizontal {
                  from { transform: translateX(0); }
                  to { transform: translateX(-50%); }
                }
                .animate-scroll-horizontal {
                  animation: scroll-horizontal 30s linear infinite;
                }
              `}</style>
              
              <div className="flex items-center gap-16 md:gap-32 w-max animate-scroll-horizontal relative z-10">
                 {/* Repeat groups for seamless scrolling */}
                 {[1, 2].map((group) => (
                    <div key={group} className="flex items-center gap-16 md:gap-32">
                       {/* Mock Logo 1 */}
                       <div className="flex items-center gap-3">
                          <div className="flex gap-1 text-primary">
                            <div className="w-2 h-6 bg-primary transform -skew-x-12" />
                            <div className="w-5 h-6 bg-primary transform -skew-x-12" />
                          </div>
                          <span className="text-black font-bold text-2xl md:text-3xl tracking-tight">MarshMcLennan</span>
                       </div>

                       {/* Mock Logo 2 */}
                       <div className="flex items-center gap-2">
                          <div className="relative w-8 h-8 flex items-center justify-center text-[#20c997]">
                             <div className="absolute top-0 w-1.5 h-3 bg-[#20c997]" />
                             <div className="absolute bottom-0 w-1.5 h-3 bg-[#20c997]" />
                             <div className="absolute left-0 w-3 h-1.5 bg-[#20c997]" />
                             <div className="absolute right-0 w-3 h-1.5 bg-[#20c997]" />
                          </div>
                          <span className="text-black font-black text-2xl md:text-3xl tracking-normal">netlify</span>
                       </div>

                       {/* Mock Logo 3 */}
                       <div className="flex items-center gap-3">
                          <div className="flex flex-col gap-1.5 text-black">
                             <div className="w-6 h-1.5 bg-black" />
                             <div className="w-10 h-1.5 bg-black" />
                          </div>
                          <span className="text-black font-serif italic text-2xl md:text-3xl tracking-tight">SoftBank</span>
                       </div>

                       {/* Mock Logo 4 */}
                       <div className="flex items-center gap-2">
                          <div className="grid grid-cols-2 gap-1 text-[#fec514]">
                             <div className="w-3 h-3 rounded-full border-[2px] border-[#fec514]" />
                             <div className="w-4 h-4 rounded-full bg-[#fec514]" />
                             <div className="w-4 h-4 rounded-full border-[3px] border-[#fec514]" />
                             <div className="w-3 h-3 rounded-full bg-[#fec514]" />
                          </div>
                          <span className="text-black font-sans text-2xl md:text-3xl">elastic</span>
                       </div>

                       {/* Mock Logo 5 */}
                       <div className="flex items-center gap-2">
                          <div className="grid grid-cols-2 gap-1 w-6 h-6">
                             <div className="bg-[#f26207] rounded-sm" />
                             <div className="bg-zinc-800 rounded-sm" />
                             <div className="bg-zinc-800 rounded-sm" />
                             <div className="bg-[#f26207] rounded-sm" />
                          </div>
                          <span className="text-black font-black font-mono text-xl md:text-2xl tracking-tighter">replit</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Section: Categories & Prices */}
           <div className="mb-20">
               <Text as="h2" className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-8 inline-block bg-black text-white px-4 py-2 transform -rotate-1">
                  Kategori & Harga
               </Text>
               
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                  
                  {/* Left: Layout Image (Denah) */}
                  <div className="lg:col-span-6 xl:col-span-7">
                     <div className="w-full aspect-[4/3] md:aspect-video lg:aspect-[4/3] relative border-[4px] border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-3">
                        <Image src={EVENT_DETAIL.layoutImage} alt="Denah Lokasi" fill className="object-cover p-3 grayscale hover:grayscale-0 transition-all duration-500" />
                        <div className="absolute top-0 right-0 bg-black text-white text-[10px] font-black uppercase px-2 py-1 tracking-widest border-l-4 border-b-4 border-black">
                           Denah Area
                        </div>
                     </div>
                  </div>
                  
                  {/* Right: Ticket Selection */}
                  <div className="lg:col-span-6 xl:col-span-5 space-y-6">
                     <div className="border-b-2 border-black pb-2 mb-6">
                        <Text as="h4" className="uppercase font-black tracking-widest text-xs">Pilih Tiket</Text>
                     </div>
                     
                     {EVENT_DETAIL.tickets.map(ticket => (
                        <div 
                           key={ticket.id} 
                           onClick={() => ticket.available && setSelectedTicket(ticket.id)}
                           className={cn(
                              "border-[4px] border-black p-6 flex flex-col gap-4 transition-all cursor-pointer relative", 
                              ticket.available 
                                ? (selectedTicket === ticket.id ? "bg-primary/5" : "bg-white") 
                                : "bg-[#e5e5e5] cursor-not-allowed"
                           )}
                        >
                           {selectedTicket === ticket.id && ticket.available && (
                              <div className="absolute top-4 right-4 text-primary">
                                 <CheckCircle2 className="w-6 h-6" fill="currentColor" />
                              </div>
                           )}

                           <div className="flex flex-col gap-1">
                              <Text as="h4" className="uppercase font-black tracking-tight text-lg text-[#444]">
                                 {ticket.name}
                              </Text>
                              <Text as="h5" className="font-black text-2xl italic text-primary">
                                 Rp {ticket.price.toLocaleString("id-ID")}
                              </Text>
                           </div>
                           
                           {ticket.available ? (
                              <button className={cn(
                                 "w-full font-black uppercase py-4 text-sm tracking-widest border-[3px] border-black transition-all", 
                                 selectedTicket === ticket.id ? "bg-primary text-white" : "bg-black text-white hover:bg-zinc-800"
                              )}>
                                 {selectedTicket === ticket.id ? "TIKET DIPILIH" : "PILIH TIKET"}
                              </button>
                           ) : (
                              <div className="w-full bg-[#cccccc] text-[#888888] font-black uppercase py-4 text-sm tracking-widest border-[3px] border-[#999999] text-center">
                                 HABIS TERJUAL
                              </div>
                           )}
                        </div>
                     ))}

                     {/* Main Checkout Button */}
                     <div className="mt-8 pt-8 border-t-2 border-black">
                        <button 
                           disabled={!selectedTicket}
                           className={cn(
                              "w-full py-5 font-black text-xl tracking-widest uppercase transition-all border-[4px] border-black",
                              selectedTicket 
                                ? "bg-black text-white hover:bg-primary hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -translate-y-1" 
                                : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                           )}
                        >
                           Lanjut Pembayaran
                        </button>
                     </div>
                  </div>
               </div>
           </div>

           {/* Section: Event Details (Accordion-style / Boxed) */}
           <div className="mb-20">
               <Text as="h2" className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-8 inline-block bg-black text-white px-4 py-2 transform rotate-1">
                  Detail Event
               </Text>
               
               <div className="bg-white border-[4px] border-black p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-10">
                   
                   {/* Info Penting */}
                   <div className="bg-yellow-100 border-[3px] border-black p-6">
                      <Text as="h4" className="font-black uppercase tracking-widest mb-4 flex items-center gap-3">
                         <Info className="w-6 h-6" /> Info Penting
                      </Text>
                      <ul className="list-disc list-inside space-y-3 font-bold text-sm md:text-base text-zinc-800 tracking-wide">
                         {EVENT_DETAIL.importantInfo.map((info, idx) => (
                            <li key={idx} className="leading-relaxed">{info}</li>
                         ))}
                      </ul>
                   </div>

                   {/* Deskripsi */}
                   <div>
                      <Text as="h4" className="font-black text-xl uppercase tracking-widest mb-4 border-b-2 border-black pb-2">Tentang Acara</Text>
                      <Text as="p" className="font-bold text-sm md:text-base text-zinc-700 leading-relaxed text-justify">
                         {EVENT_DETAIL.description}
                      </Text>
                   </div>
               </div>
           </div>

           {/* Section: Location */}
           <div className="mb-20">
               <Text as="h2" className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-8 inline-block bg-black text-white px-4 py-2 transform -rotate-1">
                  Lokasi
               </Text>

               <div className="bg-white border-[4px] border-black p-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <div className="relative w-full aspect-video md:aspect-[21/9] bg-zinc-200 mb-4 border-[3px] border-black overflow-hidden group">
                     <iframe 
                        className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-1000"
                        src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Malang+(B96)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                     />
                  </div>
                  
                  <div className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                     <div className="flex items-start gap-4">
                        <div className="bg-primary p-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                           <Map className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex flex-col">
                           <Text as="h5" className="font-black text-xl uppercase tracking-widest mb-1">{EVENT_DETAIL.location}</Text>
                           <Text as="p" className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Lihat rute di peta</Text>
                        </div>
                     </div>
                     <button className="w-full md:w-auto px-8 py-4 bg-black text-white font-black uppercase tracking-widest text-sm border-[3px] border-black hover:bg-white hover:text-black transition-colors">
                        Buka di Google Maps
                     </button>
                  </div>
               </div>
           </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
