"use client";

import { useCart } from "@/context/CartContext";

import { Text } from "@/components/retroui/Text";
import { Button } from "@/components/retroui/Button";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const { cart, removeItem, updateQuantity, subtotal, totalItems, donation, setDonation, totalAmount } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] pt-12">
      
      <main className="max-w-7xl mx-auto px-4 md:px-12 pb-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b-4 border-black pb-8">
          <div>
            <Text as="h1" className="text-7xl font-hand m-0 tracking-tight italic">Keranjang Belanja</Text>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-3 h-3 bg-primary border-2 border-black" />
              <Text className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-60">
                Total: {totalItems} Produk
              </Text>
            </div>
          </div>
          
          <Link href="/shop" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Lanjut Belanja
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 md:py-24 border-4 border-black border-dashed bg-white/50">
            <ShoppingBag className="w-24 h-24 opacity-10 mb-6" />
            <Text as="h2" className="text-4xl font-black italic opacity-20 uppercase mb-8 text-center px-4 leading-tight">
              Keranjang Masih Kosong
            </Text>
            <Link href="/shop">
              <Button size="lg" className="px-12 py-8 text-xl font-black rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                KEMBALI KE TOKO
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item, idx) => (
                <div 
                  key={`${item.id}-${item.variantKey}-${idx}`} 
                  className="bg-white border-4 border-black p-4 md:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row gap-6 relative"
                >
                  {/* Product Image */}
                  <div className="w-full md:w-32 aspect-square bg-[#f0f0f0] border-2 border-black relative overflow-hidden shrink-0">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <Link href={`/shop/${item.id}`}>
                          <Text as="h3" className="text-2xl font-black uppercase tracking-tight m-0 hover:text-primary transition-colors">
                            {item.name}
                          </Text>
                        </Link>
                        <button 
                          onClick={() => removeItem(item.id, item.variantKey)}
                          className="w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-red-600 hover:text-white transition-all group"
                          aria-label="Hapus item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {item.variantKey && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.variantKey.split(" - ").map((part, i) => (
                            <span key={i} className="px-2 py-0.5 border-2 border-black text-[9px] font-black uppercase bg-zinc-100">
                              {part}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-auto border-t-2 border-black pt-4">
                      {/* Price per unit */}
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Harga Satuan</span>
                        <span className="text-lg font-black">{formatPrice(item.price)}</span>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center">
                        <div className="border-2 border-black flex items-center bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                          <button 
                            onClick={() => updateQuantity(item.id, item.variantKey, item.quantity - 1)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-zinc-100 transition-colors border-r-2 border-black"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <div className="w-12 text-center font-black text-sm">
                            {item.quantity}
                          </div>
                          <button 
                            onClick={() => updateQuantity(item.id, item.variantKey, item.quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-zinc-100 transition-colors border-l-2 border-black"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Total Price */}
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Subtotal Produk</span>
                        <span className="text-xl font-black text-primary">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white text-black border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sticky top-32">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-6 bg-primary" />
                    <Text as="h3" className="text-2xl font-black uppercase m-0 tracking-tighter">
                        Ringkasan
                    </Text>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex justify-between items-center text-sm">
                    <span className="uppercase font-bold opacity-40 tracking-widest text-[10px]">Subtotal ({totalItems} item)</span>
                    <span className="font-black">{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="pt-4 border-t-4 border-black border-double flex justify-between items-end">
                    <span className="text-xl font-black uppercase">Total</span>
                    <div className="text-right">
                        <span className="text-3xl font-black text-primary block leading-none decoration-black decoration-4 underline-offset-4">
                        {formatPrice(subtotal)}
                        </span>
                    </div>
                  </div>
                </div>

                <Link href="/checkout" className="block">
                  <Button className="w-full py-5 text-sm font-black rounded-none border-2 border-black bg-primary text-black hover:bg-black hover:text-white transition-all group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-y-[-2px] active:translate-y-0">
                    <span className="flex items-center justify-center gap-3">
                      LANJUT KE PEMBAYARAN
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </Link>

                <div className="mt-8 pt-6 border-t border-black/10 flex flex-col gap-3">
                    <div className="flex items-center gap-2 opacity-40">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Transaksi Aman & Terenkripsi</span>
                    </div>
                    <p className="text-[8px] font-bold text-zinc-400 uppercase leading-relaxed">
                        PAJAK DAN ONGKOS KIRIM AKAN DIHITUNG PADA SAAT PROSES PEMBAYARAN AKHIR.
                    </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
