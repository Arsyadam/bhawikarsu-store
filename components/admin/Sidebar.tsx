"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Package, 
  Folder, 
  ShoppingCart, 
  LayoutDashboard,
  Menu,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { type: "divider", label: "Shop Management" },
    { href: "/admin/shop/products", icon: Package, label: "Products" },
    { href: "/admin/shop/categories", icon: Folder, label: "Categories" },
    { href: "/admin/shop/orders", icon: ShoppingCart, label: "Orders" },
  ];

  return (
    <>
      {/* Mobile Toggle Button - Floating Top Left */}
      <button 
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-[100] w-10 h-10 bg-white border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[80] md:hidden" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside 
        className={cn(
          "bg-white border-r-[3px] border-black transition-all duration-300 flex flex-col h-screen sticky top-0 z-[90]",
          "fixed md:sticky left-0",
          isCollapsed ? "w-20" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b-[3px] border-black px-4 shrink-0">
          {!isCollapsed && <span className="font-black text-xl italic tracking-tighter uppercase">B96 Admin</span>}
          {isCollapsed && <span className="font-black text-xl italic tracking-tighter mx-auto w-full text-center">B96</span>}
        </div>

        <nav className="flex flex-col gap-2 p-4 flex-1 overflow-y-auto overflow-x-hidden">
          {navItems.map((item, index) => {
            if (item.type === "divider") {
              return (
                <div 
                  key={index} 
                  className={cn(
                    "mt-4 mb-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-all",
                    isCollapsed ? "text-center opacity-0 h-0 overflow-hidden" : "px-3 opacity-100"
                  )}
                >
                  {item.label}
                </div>
              );
            }

            const Icon = item.icon!;
            const isActive = item.href && (pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href)));

            return (
              <Link
                key={index}
                href={item.href || "#"}
                onClick={() => setIsMobileOpen(false)}
                title={isCollapsed ? item.label : ""}
                className={cn(
                  "flex items-center gap-3 rounded-none px-3 py-3 font-semibold uppercase text-[12px] tracking-tight transition-all border-2 border-transparent",
                  isActive 
                    ? "bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(255,49,49,1)]" 
                    : "text-zinc-600 hover:border-black hover:bg-zinc-50",
                  isCollapsed ? "justify-center px-0" : ""
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t-[3px] border-black shrink-0 hidden md:block">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex w-full items-center justify-center gap-2 bg-zinc-100 border-2 border-black p-2 font-black uppercase text-[10px] hover:bg-black hover:text-white transition-all"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /> Collapse</>}
          </button>
        </div>
      </aside>
    </>
  );
}
