"use client";

import { Menu, X, ShoppingCart } from "lucide-react";
import { Text } from "@/components/retroui/Text";
import { Button } from "@/components/retroui/Button";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const storeText = "STORE";
  
  // Animation variants
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 * i },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 10,
    },
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Shop", href: "/shop" },
    { name: "Events", href: "/events" },
    { name: "Donate", href: "/donate" },
  ];

  return (
    <>
      <nav 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex justify-center",
          scrolled ? "top-4 px-4" : "top-0 px-0"
        )}
      >
        <div className={cn(
          "bg-white border-black flex items-center justify-between transition-all duration-300 w-full",
          scrolled 
            ? "max-w-7xl border-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] py-2 px-6" 
            : "max-w-full border-b-4 py-4 px-6 md:px-12"
        )}>
          {/* Left: Logo + Brand */}
          <Link href="/" className="flex items-center gap-0 group">
            <Image 
              src="/B.96.svg" 
              alt="B96 Logo" 
              width={scrolled ? 45 : 65} 
              height={scrolled ? 45 : 65} 
              className="transition-all duration-300 group-hover:rotate-[-5deg]"
            />
            <motion.div 
              variants={container}
              initial="hidden"
              animate="visible"
              className={cn(
                "m-0 -ml-2 uppercase tracking-tight transition-all font-hand italic flex", 
                scrolled ? "text-2xl" : "text-4xl"
              )}
            >
              {storeText.split("").map((letter, index) => (
                <motion.span variants={child} key={index}>
                  {letter}
                </motion.span>
              ))}
            </motion.div>
          </Link>

          {/* Center/Right: Nav Links (Desktop) */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="relative group"
              >
                <Text as="h6" className="m-0 uppercase font-bold">{link.name}</Text>
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-primary transition-all group-hover:w-full border-x border-black" />
              </Link>
            ))}

            {/* Cart Button visible only at top of page */}
            <Link 
              href="/cart"
              className={cn(
                "transition-all duration-300 overflow-hidden flex items-center",
                scrolled ? "w-0 opacity-0 pointer-events-none" : "w-auto opacity-100"
              )}
            >
              <Button variant="default" className="gap-2 px-6 border-2 border-black">
                <ShoppingCart className="w-5 h-5 text-white" />
                <Text as="h6" className="m-0 uppercase font-black text-white">Cart (0)</Text>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setIsOpen(!isOpen)}
              className="border-2 border-black shadow-sm"
            >
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav Links Dropdown */}
        <div className={cn(
          "absolute top-full left-0 right-0 mt-2 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-all duration-300 md:hidden",
          isOpen ? "max-h-64 opacity-100 p-4" : "max-h-0 opacity-0 p-0"
        )}>
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="p-2 border-b-2 border-black last:border-0"
              >
                <Text as="h5" className="m-0 uppercase">{link.name}</Text>
              </Link>
            ))}
            <Link 
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="p-2 flex items-center gap-2 bg-primary text-white border-2 border-black"
              >
                <ShoppingCart className="w-5 h-5" />
                <Text as="h5" className="m-0 uppercase">Cart (0)</Text>
              </Link>
          </div>
        </div>
      </nav>

      {/* Floating Cart Button - visible only when scrolled */}
      <Link 
        href="/cart"
        className={cn(
          "fixed bottom-8 right-8 z-[60] transition-all duration-500",
          scrolled ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
        )}
      >
        <div className="relative bg-primary border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all">
          <ShoppingCart className="w-8 h-8 text-white" />
          <span className="absolute -top-3 -right-3 bg-white text-black border-2 border-black rounded-full w-8 h-8 flex items-center justify-center font-black text-sm shadow-sm">
            0
          </span>
        </div>
      </Link>
    </>
  );
};
