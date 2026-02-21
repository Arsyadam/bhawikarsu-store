"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Text } from "@/components/retroui/Text";
import { Card } from "@/components/retroui/Card";
import { Button } from "@/components/retroui/Button";
import { Badge } from "@/components/retroui/Badge";
import Image from "next/image";
import Link from "next/link";
import { Filter, ChevronDown, X, Ticket, Copy, Check, ShoppingCart, Plus, ArrowRight, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface Product {
  id: string;
  name: string;
  price: number;
  categories: string[];
  images: string[];
  discount: number;
  is_preorder: boolean;
  variants: any;
}

const COUPONS = [
  { code: "B96MABA", desc: "Diskon 10% Siswa Baru", color: "text-primary" },
  { code: "ONGKIR96", desc: "Gratis Ongkir se-Malang", color: "text-black" },
  { code: "RUJAKAN", desc: "Potongan Rp 25.000", color: "text-primary" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "Semua";
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["Semua"]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [sortBy, setSortBy] = useState("Terbaru");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(true);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);

  const { totalItems, subtotal, addItem } = useCart();
  const hasItems = totalItems > 0;

  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      const { data: productsData } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (productsData) {
        setProducts(productsData.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          categories: p.categories || [],
          images: p.images || [],
          discount: p.discount || 0,
          is_preorder: p.is_preorder,
          variants: p.variants
        })));
        
        const prices = productsData.map((p: any) => Number(p.price));
        if (prices.length > 0) {
          setMaxPrice(Math.max(...prices, 1000000));
        }
      }

      const { data: categoriesData } = await supabase
        .from("categories")
        .select("name")
        .order("name");

      if (categoriesData) {
        setCategories(["Semua", ...categoriesData.map((c: any) => c.name)]);
      }

      setLoading(false);
    }
    fetchData();
  }, [supabase]);

  const handleQuickAdd = (p: Product) => {
    // If product has variants, navigate to detail page
    const hasVariants = p.variants?.colors?.enabled || p.variants?.sizes?.enabled || p.variants?.sleeves?.enabled;
    
    if (hasVariants) {
      window.location.href = `/shop/${p.id}`;
      return;
    }

    setAddingId(p.id);
    addItem({
      id: p.id,
      variantKey: null,
      name: p.name,
      price: p.price,
      image: p.images[0],
      quantity: 1
    });

    setTimeout(() => {
      setAddingId(null);
    }, 1000);
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesCategory = selectedCategory === "Semua" || p.categories.includes(selectedCategory);
        const matchesPrice = p.price <= maxPrice;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesPrice && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "Harga: Terendah ke Tertinggi") return a.price - b.price;
        if (sortBy === "Harga: Tertinggi ke Terendah") return b.price - a.price;
        return 0;
      });
  }, [products, selectedCategory, maxPrice, sortBy, searchQuery]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-black opacity-20" />
        <Text className="text-[10px] uppercase font-black tracking-[0.3em] opacity-40">Sinkronisasi Database Katalog...</Text>
      </div>
    );
  }

  return (
    <main className="w-full max-w-[1200px] mx-auto px-4 md:px-12 py-8 overflow-x-hidden">
      {/* Modern Overlapping Title */}
      <div className="mb-16 relative text-left">
        <Text as="h1" className="text-[15vw] md:text-[7vw] italic tracking-tighter m-0 leading-[0.8] font-hand lowercase first-letter:uppercase">
          Koleksi
        </Text>
        <Text as="p" className="text-zinc-500 m-0 uppercase font-bold tracking-[0.6em] text-xs mt-8">
          KATALOG MERCHANDISE RESMI B96
        </Text>
      </div>

      {/* Coupons Row */}
      <div className="mb-12 flex gap-8 items-center overflow-x-auto pb-4 no-scrollbar">
        <div className="flex items-center gap-3 pr-6 border-r-2 border-black/10 shrink-0">
          <div className="bg-black p-1.5 rotate-[-5deg]">
            <Ticket className="w-4 h-4 text-white" />
          </div>
          <Text as="h6" className="m-0 font-black uppercase tracking-widest text-[10px]">Hadiah Aktif</Text>
        </div>
        
        <div className="flex gap-6">
          {COUPONS.map((cp) => (
            <div key={cp.code} className="group relative bg-white border-[2px] border-dashed border-black/40 pl-8 pr-6 py-2 flex items-center gap-4 hover:border-black transition-all cursor-pointer shrink-0">
              <div className="absolute -left-[14px] top-1/2 -translate-y-1/2 w-6 h-6 bg-[#f0f0f0] border-r-[2px] border-dashed border-black/40 group-hover:border-black rounded-full z-10" />
              <div className="absolute -right-[14px] top-1/2 -translate-y-1/2 w-6 h-6 bg-[#f0f0f0] border-l-[2px] border-dashed border-black/40 group-hover:border-black rounded-full z-10" />
              <div className="flex flex-col relative z-20">
                <Text as="h4" className={cn("m-0 font-black italic leading-none text-sm tracking-tight", cp.code === 'ONGKIR96' ? 'text-black' : 'text-primary')}>
                  {cp.code}
                </Text>
              </div>
              <div className="h-8 border-l-[2px] border-dashed border-black/20 relative z-20" />
              <div className="flex flex-col relative z-20">
                <Text as="p" className="text-[10px] font-bold opacity-60 m-0 leading-tight">
                  {cp.desc}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Filter */}
        <aside className="w-full lg:col-span-3 lg:sticky top-[100px] lg:top-32">
          <Card className="bg-white border-[3px] border-black p-0 overflow-hidden w-full">
            <div 
              onClick={() => setIsFilterCollapsed(!isFilterCollapsed)}
              className="bg-black text-white p-4 flex items-center justify-between cursor-pointer lg:cursor-default lg:pointer-events-none"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <Text as="h4" className="m-0 uppercase font-black text-sm tracking-widest">Filter</Text>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-[8px] font-black border border-white/30 px-1 opacity-50">B96-A.01</div>
                <ChevronDown className={cn("w-4 h-4 transition-transform lg:hidden", !isFilterCollapsed && "rotate-180")} />
              </div>
            </div>

            <div className={cn(
              "transition-all duration-300 ease-in-out overflow-hidden lg:!max-h-none lg:!opacity-100",
              isFilterCollapsed ? "max-h-0 opacity-0 pointer-events-none" : "max-h-[1500px] opacity-100 pointer-events-auto"
            )}>
              <div className="p-6 space-y-10 lg:p-6">
                <div className="space-y-3">
                  <Text as="h6" className="uppercase font-black text-[10px] tracking-[0.2em] border-b border-black/10 pb-2">Cari Katalog</Text>
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
                    <input 
                      type="text"
                      placeholder="Cari produk..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-zinc-100 border-2 border-black p-3 pl-10 text-[11px] font-black uppercase tracking-tight focus:bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-black/10 pb-2">
                    <Text as="h6" className="uppercase font-black text-[10px] tracking-[0.2em]">Kategori</Text>
                    <div className="w-8 h-[2px] bg-primary" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                          "group flex items-center justify-between w-full p-3 border-2 border-transparent text-[11px] font-black transition-all text-left",
                          selectedCategory === cat 
                            ? "bg-black text-white border-black" 
                            : "hover:bg-zinc-100 hover:border-black/5"
                        )}
                      >
                        <span className="uppercase tracking-tight">{cat}</span>
                        {selectedCategory === cat ? (
                           <Check className="w-3 h-3 text-primary" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-black/10 group-hover:bg-black/20" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-end border-b border-black/10 pb-2">
                    <Text as="h6" className="uppercase font-black text-[10px] tracking-[0.2em]">Batas Harga</Text>
                    <Text className="text-sm font-black text-primary italic">IDR {maxPrice.toLocaleString("id-ID")}</Text>
                  </div>
                  
                  <div className="px-2 space-y-4">
                    <div className="relative h-6 flex items-center">
                      <div className="absolute w-full h-1 bg-zinc-200 border border-black/5" />
                      <div className="absolute h-1 bg-black" style={{ width: `${((maxPrice - 0) / 2000000) * 100}%` }} />
                      <input 
                        type="range" 
                        min="0" 
                        max="2000000" 
                        step="10000"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                        className="absolute w-full appearance-none bg-transparent cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black"
                      />
                    </div>
                  </div>
                </div>

                {(selectedCategory !== "Semua" || maxPrice < 1000000 || searchQuery !== "") && (
                   <button 
                    onClick={() => { setSelectedCategory("Semua"); setMaxPrice(1000000); setSearchQuery(""); }}
                    className="w-full py-3 bg-zinc-100 border-2 border-dashed border-black/20 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black hover:text-white hover:border-solid hover:border-black transition-all"
                   >
                     <X className="w-3 h-3" /> Hapus
                   </button>
                )}
              </div>
            </div>

            <div className="border-t border-black/5 p-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary animate-pulse" />
              <Text className="text-[8px] font-black uppercase tracking-tighter opacity-40">Sistem Online / Siap Memfilter</Text>
            </div>
          </Card>
        </aside>

        <div className="w-full lg:col-span-9 space-y-8">
          <div className="flex justify-between items-center border-b-2 border-black pb-3">
            <Text as="h5" className="m-0 font-black uppercase italic tracking-tight text-[10px]">{filteredProducts.length} Hasil</Text>
            <div 
              className="flex items-center gap-4 relative cursor-pointer"
              onClick={() => setIsSortOpen(!isSortOpen)}
            >
              <Text as="h6" className="m-0 uppercase font-black text-[9px] tracking-widest opacity-60">Urutkan: {sortBy}</Text>
              <ChevronDown className={cn("w-3 h-3 transition-transform", isSortOpen && "rotate-180")} />
              
              {isSortOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-40 block animate-in fade-in slide-in-from-top-2">
                   {["Terbaru", "Harga: Terendah ke Tertinggi", "Harga: Tertinggi ke Terendah"].map(item => (
                     <button 
                        key={item} 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSortBy(item);
                          setIsSortOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-[10px] font-black uppercase hover:bg-primary hover:text-white border-b-2 border-black last:border-0"
                     >
                       {item}
                     </button>
                   ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {filteredProducts.map((p) => (
              <div key={p.id} className="group flex flex-col w-full p-2 transition-all hover:opacity-80">
                <Link href={`/shop/${p.id}`} className="w-full flex-grow flex flex-col">
                  <div className="relative w-full aspect-square flex items-center justify-center mb-4 md:mb-6 pt-2">
                    <div className="relative z-10 w-[100%] aspect-square overflow-hidden mix-blend-multiply">
                      {p.images?.[0] ? (
                        <Image 
                          src={p.images[0]} 
                          alt={p.name} 
                          fill 
                          className="object-cover transition-transform duration-700 group-hover:scale-110 drop-shadow-md" 
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-200 flex items-center justify-center border-2 border-black">
                           <Text className="text-[10px] font-bold opacity-30 uppercase tracking-widest">No Visual</Text>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full text-left flex flex-col flex-grow">
                    <Text as="p" className="text-zinc-500 font-black text-[8px] md:text-[10px] uppercase tracking-widest mb-1 line-clamp-1">
                      {p.categories.join(" • ")}
                    </Text>
                    <Text as="h4" className="m-0 text-xs md:text-sm tracking-tight mb-4 leading-tight line-clamp-2 md:line-clamp-none">
                      {p.name}
                    </Text>

                    <div className="flex justify-between items-end mt-auto mb-4 md:mb-6">
                      <div className="flex flex-col">
                        {p.discount > 0 && (
                          <span className="text-red-500 line-through text-[9px] md:text-xs font-semibold opacity-80 mb-0">
                            Rp {(p.price / (1 - p.discount/100)).toLocaleString("id-ID")}
                          </span>
                        )}
                        <Text as="h4" className="text-black font-black m-0 text-xs md:text-base tracking-tight leading-none">
                          Rp {p.price.toLocaleString("id-ID")}
                        </Text>
                      </div>

                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleQuickAdd(p);
                        }}
                        className={cn(
                          "w-8 h-8 md:w-10 md:h-10 border-2 border-black flex items-center justify-center transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]",
                          addingId === p.id ? "bg-green-500 text-white" : "bg-white hover:bg-black hover:text-white"
                        )}
                      >
                        {addingId === p.id ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-24 text-center">
              <Text as="h2" className="uppercase font-black italic opacity-10 text-4xl leading-tight">Tidak Ada Produk yang Cocok</Text>
              <button 
                onClick={() => { setSelectedCategory("Semua"); setMaxPrice(1000000); }}
                className="mt-4 uppercase font-black text-xs text-primary hover:underline underline-offset-4 decoration-2"
              >
                Mulai ulang pencarian
              </button>
            </div>
          )}
        </div>
      </div>

      {hasItems && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <Link href="/cart">
            <button 
              className="group relative bg-black text-white px-8 py-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,49,49,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-4"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6 group-hover:text-primary transition-colors" />
                <div className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-black font-black">
                  {totalItems}
                </div>
              </div>
              <div className="flex flex-col items-start leading-none mt-1">
                <span className="text-[10px] uppercase font-black tracking-widest opacity-60 text-left">Total Manifest: Rp {subtotal.toLocaleString("id-ID")}</span>
                <span className="text-lg font-black uppercase italic tracking-tight">Protokol Pembayaran</span>
              </div>
              <div className="ml-4 w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </Link>
        </div>
      )}
    </main>

  );
}

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-[#f0f0f0] pt-24 md:pt-32">
      <Navbar />
      <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin" /></div>}>
        <ShopContent />
      </Suspense>
      <Footer />
    </div>
  );
}
