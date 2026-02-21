"use client";

import { useEffect, useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Text } from "@/components/retroui/Text";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Check, HelpCircle, Ruler, X, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/retroui/Badge";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  discount: number;
  categories: string[];
  description: string;
  images: string[];
  detail_material?: string;
  shipping_info?: string;
  stock: number;
  variants: any;
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSleeve, setSelectedSleeve] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ transform: 'scale(1)', transformOrigin: '50% 50%' });

  const supabase = createClient();

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setProduct({
          id: data.id,
          name: data.name,
          price: Number(data.price),
          discount: data.discount || 0,
          categories: data.categories || [],
          description: data.description,
          images: data.images || [],
          detail_material: data.detail_material,
          shipping_info: data.shipping_info,
          stock: data.stock || 0,
          variants: data.variants
        });
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id, supabase]);

  const combinations = useMemo(() => {
    if (!product || !product.variants) return { colors: [], sizes: [], sleeves: [] };
    const v = product.variants;
    const colors = v.colors?.enabled ? (v.colors.items || []) : [""];
    const sizes = v.sizes?.enabled ? (v.sizes.items?.filter((s: any) => s.active) || []) : [""];
    const sleeves = v.sleeves?.enabled ? [v.sleeves.types?.short && "Lengan Pendek", v.sleeves.types?.long && "Lengan Panjang"].filter(Boolean) : [""];
    return { colors, sizes, sleeves };
  }, [product]);

  const currentVariantKey = useMemo(() => {
    let parts = [
      selectedColor,
      selectedSize,
      selectedSleeve
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(" - ") : null;
  }, [selectedColor, selectedSize, selectedSleeve]);

  const currentPrice = useMemo(() => {
    if (!product) return 0;
    if (currentVariantKey && product.variants?.matrix?.[currentVariantKey]) {
      return product.variants.matrix[currentVariantKey].price;
    }
    return product.price;
  }, [product, currentVariantKey]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2.5)'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: '50% 50%',
      transform: 'scale(1)'
    });
  };

  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (product?.variants?.colors?.enabled && !selectedColor) {
      toast.error("Silakan pilih warna terlebih dahulu!");
      return;
    }
    if (product?.variants?.sizes?.enabled && !selectedSize) {
      toast.error("Silakan pilih ukuran terlebih dahulu!");
      return;
    }
    if (product?.variants?.sleeves?.enabled && !selectedSleeve) {
      toast.error("Silakan pilih jenis lengan terlebih dahulu!");
      return;
    }

    if (!product) return;

    addItem({
      id: product.id,
      variantKey: currentVariantKey,
      name: product.name,
      price: currentPrice,
      image: product.images[0],
      quantity: quantity,
      color: selectedColor,
      size: selectedSize,
      sleeve: selectedSleeve
    });

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-black opacity-20" />
        <Text className="text-[10px] uppercase font-black tracking-[0.3em] opacity-40">Mengakses Data Produk...</Text>
      </div>
    );
  }

  if (!product) {
    return (
       <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <Text as="h2" className="text-4xl font-black italic opacity-20 uppercase">PRODUK TIDAK DITEMUKAN</Text>
          <Link href="/shop" className="uppercase font-black text-xs text-primary hover:underline underline-offset-4 decoration-2">Kembali Ke Toko</Link>
       </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0] pt-24 md:pt-32">
      <Navbar />

      <main className="w-full max-w-[1200px] mx-auto px-4 md:px-12 py-8 overflow-x-hidden">
        <Link 
          href="/shop" 
          className="inline-flex items-center gap-2 mb-8 group hover:text-primary transition-colors hover:-translate-x-1 duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="uppercase font-black text-xs tracking-widest">Kembali Ke Koleksi</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-start">
          
          <div className="lg:col-span-6 w-full space-y-4">
            <div 
              className="relative w-full aspect-square bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex items-center justify-center cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative z-10 w-full h-full mix-blend-multiply flex p-8">
                {product.images?.[activeImage] ? (
                  <Image 
                    src={product.images[activeImage]} 
                    alt={product.name} 
                    fill 
                    className="object-cover drop-shadow-xl transition-transform duration-100 ease-out" 
                    style={zoomStyle}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full opacity-10">
                    <Text className="text-xl font-black uppercase">TIDAK ADA GAMBAR</Text>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {product.images?.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    "relative aspect-square bg-white border-[2px] border-black overflow-hidden transition-all",
                    activeImage === idx 
                      ? "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1 -translate-x-1" 
                      : "opacity-60 hover:opacity-100 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1"
                  )}
                >
                  <div className="relative z-10 w-full h-full mix-blend-multiply">
                    <Image 
                      src={img} 
                      alt={`Thumb ${idx}`} 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 w-full flex flex-col pt-2 lg:pt-8 bg-transparent">
            
            <div className="border-b-[3px] border-black pb-8 mb-8">
              <div className="flex justify-between items-start mb-4">
                <Text as="p" className="text-zinc-500 font-black text-xs md:text-sm uppercase tracking-[0.2em]">
                  {product.categories.join(" • ")}
                </Text>
                <div className="flex gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-[10px] font-black uppercase text-green-600 tracking-widest leading-none">
                    {product.stock > 0 ? 'Tersedia' : 'Stok Habis'}
                  </span>
                </div>
              </div>
              
              <Text as="h1" className="m-0 font-black text-5xl md:text-6xl tracking-tighter mb-6 leading-none lowercase first-letter:uppercase italic">
                {product.name}
              </Text>
              
              <div className="flex flex-col">
                {product.discount > 0 && (
                  <span className="text-red-500 line-through text-sm md:text-md font-semibold opacity-80 mb-1">
                    Rp {(currentPrice / (1 - product.discount/100)).toLocaleString("id-ID")}
                  </span>
                )}
                <div className="flex items-baseline gap-3">
                  <Text as="h2" className="text-black font-black m-0 text-4xl tracking-tight leading-none">
                    Rp {currentPrice.toLocaleString("id-ID")}
                  </Text>
                  {product.discount > 0 && (
                    <Badge className="bg-primary text-black border-2 border-black rounded-none px-2 py-0.5 text-[10px] font-black italic">
                      DISKON {product.discount}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Colors */}
            {product.variants?.colors?.enabled && (
              <div className="mb-8">
                <Text as="h4" className="m-0 uppercase font-black text-sm tracking-widest mb-4">Pilih Warna</Text>
                <div className="flex flex-wrap gap-3">
                  {product.variants.colors.items.map((c: any) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={cn(
                        "group relative w-12 h-12 border-[2px] transition-all flex items-center justify-center",
                        selectedColor === c.name 
                          ? "border-black shadow-[4px_4px_0px_0px_rgba(255,49,49,1)] -translate-y-1 -translate-x-1" 
                          : "border-black/20 hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1"
                      )}
                    >
                      <div 
                        className="w-full h-full border-[2px] border-white"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        {c.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.variants?.sizes?.enabled && (
              <div className="mb-10">
                <div className="flex justify-between items-end mb-4 relative z-40">
                  <Text as="h4" className="m-0 uppercase font-black text-sm tracking-widest">Pilih Ukuran</Text>
                  <button 
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-[10px] uppercase font-bold text-zinc-500 hover:text-black flex items-center gap-1 border-b border-black/20 hover:border-black transition-colors pb-0.5"
                  >
                    <Ruler className="w-3 h-3" /> Panduan Ukuran
                  </button>

                  {showSizeGuide && (
                    <div className="absolute bottom-full right-0 mb-2 w-[280px] md:w-[400px] bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] z-50 p-2 animate-in fade-in slide-in-from-bottom-2">
                       <div className="flex justify-between items-center mb-2 px-2 pt-1 border-b-[2px] border-black pb-2">
                        <Text as="h6" className="m-0 font-black text-xs uppercase tracking-widest">Tabel Ukuran</Text>
                         <button onClick={() => setShowSizeGuide(false)} className="hover:text-primary transition-colors">
                            <X className="w-5 h-5" />
                          </button>
                       </div>
                       <div className="relative w-full aspect-video bg-zinc-100 flex items-center justify-center p-2">
                          <Image 
                            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800&auto=format&fit=crop" 
                            alt="Size Guide Layout" 
                            fill 
                            className="object-contain drop-shadow" 
                          />
                       </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.variants.sizes.items.filter((s:any) => s.active).map((s: any) => (
                    <button
                      key={s.name}
                      onClick={() => setSelectedSize(s.name)}
                      className={cn(
                        "min-w-[#50px] h-[45px] px-4 font-black text-sm tracking-widest uppercase border-[2px] transition-all",
                        selectedSize === s.name 
                          ? "bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(255,49,49,1)] -translate-y-1 -translate-x-1" 
                          : "bg-white text-black border-black/20 hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1"
                      )}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sleeves */}
            {product.variants?.sleeves?.enabled && (
              <div className="mb-10">
                <Text as="h4" className="m-0 uppercase font-black text-sm tracking-widest mb-4">Jenis Lengan</Text>
                <div className="flex flex-wrap gap-3">
                  {combinations.sleeves.map((sl: any) => (
                    <button
                      key={sl}
                      onClick={() => setSelectedSleeve(sl)}
                      className={cn(
                        "px-6 h-[45px] font-black text-sm tracking-widest uppercase border-[2px] transition-all",
                        selectedSleeve === sl 
                          ? "bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(255,49,49,1)] -translate-y-1 -translate-x-1" 
                          : "bg-white text-black border-black/20 hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1"
                      )}
                    >
                      {sl}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-[auto_1fr] gap-4">
              <div className="flex items-center justify-between border-[3px] border-black px-4 h-[60px] w-[140px] font-black text-lg bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="hover:text-primary transition-colors hover:scale-125 p-2"
                >
                  -
                </button>
                <span className="w-8 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="hover:text-primary transition-colors hover:scale-125 p-2"
                >
                  +
                </button>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={added}
                className={cn(
                  "w-full h-[60px] border-[3px] border-black flex items-center justify-center transition-all uppercase font-black tracking-widest text-sm relative overflow-hidden group",
                  added 
                    ? "bg-green-500 text-white translate-y-1 translate-x-1 shadow-none" 
                    : "bg-primary text-black hover:-translate-y-1 hover:-translate-x-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                )}
              >
                <div className="relative z-10 flex items-center gap-3">
                  {added ? (
                    <>
                      <Check className="w-5 h-5" />
                      BERHASIL DITAMBAHKAN
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 transition-transform group-hover:rotate-12" />
                      TAMBAH KE KERANJANG
                    </>
                  )}
                </div>
                {!added && (
                  <div className="absolute inset-0 bg-white translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
                )}
              </button>
            </div>

            <div className="mt-12 mb-8 border-t-[3px] border-black pt-8">
              <Text as="p" className="text-zinc-600 font-medium text-sm md:text-base leading-relaxed whitespace-pre-line">
                {product.description}
              </Text>
            </div>

            <div className="space-y-4">
              {product.detail_material && (
                <div className="flex flex-col border-[2px] border-black bg-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <button 
                    onClick={() => setIsDetailOpen(!isDetailOpen)}
                    className="flex w-full justify-between items-center p-4 text-left focus:outline-none hover:bg-zinc-50 transition-colors"
                  >
                    <Text as="h5" className="m-0 font-black uppercase text-xs tracking-widest">Detail & Bahan</Text>
                    <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isDetailOpen ? "rotate-180" : "rotate-0")} />
                  </button>
                  <div 
                    className={cn(
                      "overflow-hidden transition-all duration-300 px-4",
                      isDetailOpen ? "max-h-64 py-4 border-t-[2px] border-black/10" : "max-h-0 py-0"
                    )}
                  >
                    <Text as="p" className="text-xs text-zinc-600 font-medium leading-relaxed">
                      {product.detail_material}
                    </Text>
                  </div>
                </div>
              )}

              {product.shipping_info && (
                <div className="flex flex-col border-[2px] border-black bg-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <button 
                    onClick={() => setIsShippingOpen(!isShippingOpen)}
                    className="flex w-full justify-between items-center p-4 text-left focus:outline-none hover:bg-zinc-50 transition-colors"
                  >
                    <Text as="h5" className="m-0 font-black uppercase text-xs tracking-widest">Informasi Pengiriman</Text>
                    <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isShippingOpen ? "rotate-180" : "rotate-0")} />
                  </button>
                  <div 
                    className={cn(
                      "overflow-hidden transition-all duration-300 px-4",
                      isShippingOpen ? "max-h-64 py-4 border-t-[2px] border-black/10" : "max-h-0 py-0"
                    )}
                  >
                    <Text as="p" className="text-xs text-zinc-600 font-medium leading-relaxed">
                      {product.shipping_info}
                    </Text>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
