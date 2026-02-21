"use client";

import { Github, Globe, Linkedin } from "lucide-react";
import { Text } from "@/components/retroui/Text";
import Link from "next/link";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="w-full mt-24 pb-12 px-4 md:px-12 flex flex-col items-center">
      {/* Main Red Bar */}
      <div className="w-full max-w-[1200px] border-[3px] border-black bg-primary py-6 px-8 md:px-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-0 group flex-shrink-0">
          <Image 
            src="/B.96.svg" 
            alt="B96 Logo" 
            width={45} 
            height={45} 
            className="transition-all duration-300 group-hover:rotate-[-5deg] brightness-0 invert"
          />
          <Text as="h2" className="m-0 -ml-2 uppercase tracking-tight text-white transition-all font-hand italic flex text-3xl">
            STORE
          </Text>
        </Link>

        {/* Middle: WhatsApp Number */}
        <div className="flex gap-8 items-center flex-wrap justify-center text-black">
           <span className="m-0 text-white font-black text-sm md:text-xl tracking-widest cursor-pointer hover:scale-105 transition-transform drop-shadow-md">
             WA: +62 812 3456 789
           </span>
        </div>

        {/* Right: Icons in square boxes */}
        <div className="flex items-center gap-3">
          {[
            { tag: Github, url: "#" },
            { tag: Globe, url: "#" },
            { tag: Linkedin, url: "#" }
          ].map((item, i) => (
             <a 
               key={i} 
               href={item.url}
               className="bg-white border-[2.5px] border-black p-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
             >
                <item.tag className="w-5 h-5 text-black" strokeWidth={2.5} />
             </a>
          ))}
        </div>
        
      </div>

      {/* Copyright Below */}
      <div className="mt-8 text-center px-4 space-y-2">
        <Text as="p" className="text-black/60 m-0 text-[10px] md:text-sm font-black uppercase tracking-widest">
            © 2026 B96 STORE. DIBUAT DENGAN SEMANGAT DAN KODE. SELURUH HAK CIPTA DILINDUNGI.
        </Text>
        <Text as="p" className="text-black/40 m-0 text-[9px] font-black uppercase tracking-widest">
            DIBUAT OLEH <Link href="https://arsyadam.id" target="_blank" className="text-primary hover:underline transition-all">ARSYADAM.ID</Link>
        </Text>
      </div>
    </footer>
  );
};
