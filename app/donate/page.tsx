"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Text } from "@/components/retroui/Text";
import { Heart, HandCoins, Building2, Megaphone, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SPONSOR_TIERS = [
  {
    name: "BRONZE",
    price: "Rp 1.000.000",
    color: "bg-[#CD7F32]",
    benefits: ["Logo on Social Media", "1x Event Shoutout", "Standard Logo Placement"]
  },
  {
    name: "SILVER",
    price: "Rp 2.500.000",
    color: "bg-[#C0C0C0]",
    benefits: ["All Bronze Benefits", "Logo on Event Banner", "2x Event Shoutouts", "Booth Space (Small)"]
  },
  {
    name: "GOLD",
    price: "Rp 5.000.000",
    color: "bg-[#FFD700]",
    benefits: ["All Silver Benefits", "Primary Logo Placement", "Main Stage Shoutout", "Booth Space (Large)", "Logo on Merchandise"]
  },
  {
    name: "PLATINUM",
    price: "Custom",
    color: "bg-black text-white",
    benefits: ["Exclusive Main Partner", "Maximum Brand Visibility", "VIP Access Pass", "Dedicated Activation Area", "Aftermovie Special Mention"]
  }
];

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-[#f0f0f0]">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12">
          
          {/* Hero Section */}
          <div className="mb-20">
            <div className="inline-block bg-primary text-white border-[4px] border-black px-6 py-2 mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-1">
               <Text className="font-black uppercase tracking-widest text-sm">Grow Together</Text>
            </div>
            <Text as="h1" className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
               DONATE & <br />
               <span className="text-primary italic">SPONSORSHIP</span>
            </Text>
            <Text className="text-lg md:text-xl font-bold text-zinc-600 max-w-2xl leading-relaxed">
               Support our community and elevate your brand. Your contributions help us maintain the B96 legacy and create unforgettable events for everyone.
            </Text>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left: General Donation */}
            <div className="lg:col-span-12 xl:col-span-5 space-y-8">
               <div className="bg-white border-[4px] border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="bg-[#ffe616] p-4 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <Heart className="w-8 h-8 text-black" />
                     </div>
                     <Text as="h2" className="text-3xl font-black uppercase tracking-tighter italic">Personal Donation</Text>
                  </div>
                  <Text className="font-bold text-zinc-600 mb-8 leading-relaxed italic">
                     "Every contribution counts. Help us keep the spirit alive with any amount you can share."
                  </Text>

                  <div className="space-y-4">
                     <button className="w-full bg-primary text-white font-black uppercase py-5 border-[4px] border-black text-xl italic tracking-widest hover:bg-red-600 transition-colors shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1">
                        Donate via Saweria
                     </button>
                     <button className="w-full bg-black text-white font-black uppercase py-5 border-[4px] border-black text-xl italic tracking-widest hover:bg-zinc-800 transition-colors shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1">
                        Bank Transfer
                     </button>
                  </div>

                  <div className="mt-8 p-4 bg-zinc-100 border-[3px] border-black border-dashed flex items-center justify-between">
                     <div>
                        <Text className="text-[10px] font-black uppercase text-zinc-400">Total Gathered</Text>
                        <Text className="text-2xl font-black">Rp 12.500.000</Text>
                     </div>
                     <HandCoins className="w-10 h-10 text-zinc-300" />
                  </div>
               </div>

               <div className="bg-[#ffe616] border-[4px] border-black p-10 relative overflow-hidden group">
                  <Megaphone className="absolute -right-4 -bottom-4 w-32 h-32 text-black/10 transition-transform group-hover:scale-110" />
                  <Text as="h3" className="text-2xl font-black uppercase mb-4 relative z-10">Custom Inquiries?</Text>
                  <Text className="font-bold text-sm mb-6 relative z-10">Have a unique way to support or want to offer services? Let's talk about it.</Text>
                  <button className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 font-black uppercase text-sm border-2 border-black hover:bg-white hover:text-black transition-all relative z-10 shadow-[4px_4px_0px_0px_rgba(255,49,49,1)]">
                     Contact WhatsApp <ArrowRight className="w-4 h-4" />
                  </button>
               </div>
            </div>

            {/* Right: Sponshorship Packages */}
            <div className="lg:col-span-12 xl:col-span-7">
               <div className="bg-black text-white px-6 py-3 inline-block mb-8 transform skew-x-12 ml-4">
                  <Text className="font-black uppercase tracking-[0.2em] -skew-x-12">Sponsorship Packages</Text>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {SPONSOR_TIERS.map((tier) => (
                     <div key={tier.name} className="bg-white border-[4px] border-black p-6 flex flex-col items-start shadow-[8px_8px_0px_0px_rgba(100,100,100,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all group overflow-hidden relative">
                        <div className={cn("absolute -right-6 -top-6 w-24 h-24 rotate-12 opacity-10 group-hover:opacity-20 transition-all", tier.color)}></div>
                        
                        <div className={cn("px-4 py-1 text-[10px] font-black uppercase border-2 border-black mb-4", tier.color, tier.name === "PLATINUM" ? "text-white" : "text-black")}>
                          {tier.name} Tier
                        </div>

                        <Text as="h3" className="text-2xl font-black uppercase mb-1">{tier.name}</Text>
                        <Text className="text-xl font-black text-primary italic mb-6">{tier.price}</Text>
                        
                        <div className="w-full space-y-3 mb-8 flex-grow">
                           {tier.benefits.map((benefit, bIdx) => (
                              <div key={bIdx} className="flex items-start gap-2">
                                 <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                 <Text className="text-xs font-bold text-zinc-600 uppercase tracking-tight leading-none">{benefit}</Text>
                              </div>
                           ))}
                        </div>

                        <button className="w-full bg-black text-white font-black uppercase py-3 border-[3px] border-black text-sm tracking-widest hover:bg-primary transition-colors">
                           Become a Sponsor
                        </button>
                     </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Bottom Banner */}
          <div className="mt-20 border-[4px] border-black bg-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
             <div className="flex items-start gap-6 relative z-10">
                <div className="bg-primary p-6 border-[4px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                   <Building2 className="w-12 h-12 text-white" />
                </div>
                <div>
                   <Text as="h2" className="text-4xl font-black uppercase tracking-tighter mb-2">Corporate Partner</Text>
                   <Text className="font-bold text-zinc-500 max-w-md">Download our sponsorship proposal for detailed information about partnerships and visibility across our entire network.</Text>
                </div>
             </div>
             <button className="w-full md:w-auto px-12 py-5 bg-white text-black font-black uppercase border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(255,49,49,1)] hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 hover:shadow-none">
                Download Proposal (PDF)
             </button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
