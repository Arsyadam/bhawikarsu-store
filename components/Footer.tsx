"use client";

import { Mail, Phone } from "lucide-react";
import { Text } from "@/components/retroui/Text";
import { Button } from "@/components/retroui/Button";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full mt-24">
      {/* Main Footer Box */}
      <div className="bg-white border-4 border-black rounded-t-[40px] p-8 md:p-16 max-w-7xl mx-auto shadow-[12px_-12px_1px_0px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          
          {/* Stay Connected Section */}
          <div className="md:col-span-6 space-y-6">
            <Text as="h3" className="uppercase font-black text-black tracking-tight">Stay Connected</Text>
            <Text as="p" className="text-zinc-500 max-w-sm leading-relaxed">
              Join our community and get the latest updates, exclusive content, and special offers delivered straight to your inbox.
            </Text>
            
            <div className="flex flex-col sm:flex-row gap-0 max-w-md group">
              <input 
                type="email" 
                placeholder="your@email.com" 
                className="flex-grow border-4 border-black p-4 outline-none font-sans text-black focus:bg-zinc-50 transition-colors"
              />
              <Button 
                className="bg-accent text-black border-4 border-l-0 border-black rounded-none px-8 h-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase font-black"
              >
                Subscribe
              </Button>
            </div>

            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="bg-black text-accent p-2 border-2 border-black group-hover:bg-primary transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <Text as="h6" className="m-0 font-bold group-hover:text-primary">store@b96.com</Text>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="bg-black text-accent p-2 border-2 border-black group-hover:bg-primary transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <Text as="h6" className="m-0 font-bold group-hover:text-primary">+62 812 3456 789</Text>
              </div>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="md:col-span-3 space-y-6">
            <Text as="h4" className="uppercase font-black text-black tracking-tight">Quick Links</Text>
            <ul className="space-y-3">
              {["Home", "About", "Services", "Portfolio", "Blog", "Contact"].map((link) => (
                <li key={link}>
                  <Link href={`/${link.toLowerCase()}`} className="hover:text-primary transition-colors">
                    <Text as="h6" className="m-0 uppercase font-bold">{link}</Text>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Section */}
          <div className="md:col-span-3 space-y-6">
            <Text as="h4" className="uppercase font-black text-black tracking-tight">Resources</Text>
            <ul className="space-y-3">
              {["Documentation", "API Reference", "Tutorials", "Community", "Support", "Status"].map((resource) => (
                <li key={resource}>
                  <Link href={`/${resource.toLowerCase().replace(" ", "-")}`} className="hover:text-primary transition-colors">
                    <Text as="h6" className="m-0 uppercase font-bold">{resource}</Text>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Black Bar */}
      <div className="bg-black py-6 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Text as="p" className="text-white m-0 text-sm opacity-80 uppercase tracking-widest font-bold">
            © 2026 B96 STORE. Crafted with passion and code. All rights reserved.
          </Text>
        </div>
      </div>
    </footer>
  );
};
