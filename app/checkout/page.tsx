"use client";

import { useCart } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Text } from "@/components/retroui/Text";
import { Button } from "@/components/retroui/Button";
import { ArrowLeft, ShieldCheck, Truck, CreditCard, Loader2, CheckCircle2, ChevronRight, ChevronDown, MapPin, Search, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getShippingRates, searchAreas } from "@/app/actions/shipping";

export default function CheckoutPage() {
  const { cart, totalAmount, subtotal, donation, setDonation, totalItems } = useCart();
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Info, 2: Shipping, 3: Payment
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    areaId: "",
    locationName: "", // Readable name (District, City, Province)
    postalCode: "",
  });

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<any>(null);
  const [shippingRates, setShippingRates] = useState<any[]>([]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Debounced search for areas according to Biteship Docs "Search Area"
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (formData.locationName && formData.locationName.length > 2 && !formData.areaId) {
        setIsSearching(true);
        try {
          const data = await searchAreas(formData.locationName);
          if (data.areas) setSearchResults(data.areas);
        } catch (err) {
          console.error("Search failed", err);
        }
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 600); // 600ms debounce to avoid rapid API calls as per docs tip

    return () => clearTimeout(timer);
  }, [formData.locationName, formData.areaId]);

  // Fetch Shipping Rates when Area is selected
  useEffect(() => {
    if (formData.areaId && cart.length > 0) {
      async function loadRates() {
        setLoading(true);
        try {
          const data = await getShippingRates({
            origin_area_id: "IDNP5IDNC136IDND804IDZ65122", // Valid Malang ID
            destination_area_id: formData.areaId,
            couriers: "jne,jnt,sicepat,tiki,anteraja,ninja", // More couriers
            items: cart.map(item => ({
              name: item.name,
              value: item.price,
              weight: 500, // 500g default
              quantity: item.quantity,
              length: 10,
              width: 10,
              height: 10
            }))
          });
          
          if (data.success && data.pricing) {
            setShippingRates(data.pricing);
          } else {
            console.error("Biteship Error:", data.error || data.message || "Unknown error");
            setShippingRates([]);
          }
        } catch (err) {
          console.error("Failed to load rates", err);
          setShippingRates([]);
        }
        setLoading(false);
      }
      loadRates();
    }
  }, [formData.areaId, cart]);

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleProcessPayment = () => {
    setLoading(true);
    setTimeout(() => {
        setPaymentSuccess(true);
        setLoading(false);
    }, 2000);
  };

  if (cart.length === 0 && !paymentSuccess) {
    return (
      <div className="min-h-screen bg-[#f0f0f0] pt-24 md:pt-32 flex flex-col items-center justify-center gap-6">
        <Text as="h2" className="text-4xl font-black opacity-20 uppercase">KERANJANG KOSONG</Text>
        <Link href="/shop">
          <Button className="border-4 border-black font-black uppercase tracking-widest px-8">Kembali ke Toko</Button>
        </Link>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
        <div className="min-h-screen bg-[#f0f0f0] pt-24 md:pt-32">
            <Navbar />
            <main className="max-w-3xl mx-auto px-4 py-24 text-center">
                <div className="bg-white border-4 border-black p-12 shadow-[12px_12px_0px_0px_rgba(34,197,94,1)]">
                    <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-8" />
                    <Text as="h1" className="text-6xl font-hand m-0 mb-4 tracking-tighter">Terima Kasih!</Text>
                    <Text className="text-sm font-black uppercase tracking-[0.2em] opacity-40 mb-12 block">ID Pesanan: #B96-{(Math.random()*10000).toFixed(0)}</Text>
                    
                    <div className="flex flex-col gap-4">
                        <Link href="/shop">
                            <Button className="w-full py-6 text-lg font-black bg-black text-white hover:bg-zinc-800 rounded-none border-2 border-black">KEMBALI KE BERANDA</Button>
                        </Link>
                        <Text className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Konfirmasi pesanan telah dikirimkan ke {formData.email}</Text>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0] pt-24 md:pt-32">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 md:px-12 pb-32">
        {/* Progress Tracker */}
        <div className="flex items-center gap-6 mb-16 border-b-4 border-black pb-8 overflow-x-auto no-scrollbar">
            <Link href="/cart" className="flex items-center gap-2 group shrink-0">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <Text className="text-[10px] font-black uppercase tracking-widest opacity-40">Batal</Text>
            </Link>
            
            <div className="flex items-center gap-6 shrink-0">
                <StepItem num={1} label="Identitas" active={step >= 1} current={step === 1} />
                <ChevronRight className="w-4 h-4 opacity-20" />
                <StepItem num={2} label="Pengiriman" active={step >= 2} current={step === 2} />
                <ChevronRight className="w-4 h-4 opacity-20" />
                <StepItem num={3} label="Pembayaran" active={step >= 3} current={step === 3} />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Forms */}
            <div className="lg:col-span-7 space-y-12">
                
                {step === 1 && (
                    <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-8 animate-in fade-in slide-in-from-left-4">
                        <div className="flex items-center gap-4 border-b-2 border-black pb-6">
                            <div className="w-10 h-10 bg-black flex items-center justify-center rotate-[-5deg]">
                                <ShieldCheck className="text-white w-6 h-6" />
                            </div>
                            <Text as="h2" className="text-4xl font-hand m-0 italic tracking-tighter">Detail Penerima</Text>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup label="Nama Depan" placeholder="BUDI" value={formData.firstName} onChange={(v) => setFormData({...formData, firstName: v})} />
                            <InputGroup label="Nama Belakang" placeholder="SANTOSO" value={formData.lastName} onChange={(v) => setFormData({...formData, lastName: v})} />
                            <InputGroup label="Email" placeholder="USER@DOMAIN.COM" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
                            <InputGroup label="Nomor WhatsApp" placeholder="08XX XXXX XXXX" value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />
                        </div>

                        <div className="space-y-6 pt-10 border-t-2 border-black/10">
                            <Text as="h3" className="text-xl font-black uppercase tracking-tighter mb-4 m-0">Alamat Pengiriman</Text>
                            
                            <div className="relative">
                                <label className="text-[10px] font-black uppercase tracking-widest text-black mb-1 block ml-1">Cari Wilayah (Kecamatan / Kota / Kabupaten / Provinsi)</label>
                                <div className="flex items-center bg-zinc-50 border-2 border-black p-4 group focus-within:bg-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                    <Search className="w-4 h-4 mr-3 opacity-40 shrink-0" />
                                    <input 
                                        type="text" 
                                        placeholder="KETIK NAMA DAERAH UNTUK MENCARI..."
                                        value={formData.locationName}
                                        onChange={(e) => {
                                            setFormData({...formData, locationName: e.target.value, areaId: ""});
                                            setShippingRates([]);
                                        }}
                                        className="bg-transparent border-none focus:outline-none text-xs font-black w-full uppercase placeholder:opacity-20"
                                    />
                                    {formData.locationName && (
                                        <X 
                                            className="w-4 h-4 cursor-pointer hover:text-primary transition-colors" 
                                            onClick={() => {
                                                setFormData({...formData, locationName: "", areaId: "", postalCode: ""});
                                                setSearchResults([]);
                                            }} 
                                        />
                                    )}
                                </div>

                                {/* Search Results Dropdown according to Biteship Maps Search docs */}
                                {(isSearching || searchResults.length > 0) && (
                                    <div className="absolute z-50 top-full left-0 w-full bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mt-1 max-h-64 overflow-y-auto custom-scrollbar">
                                        {isSearching ? (
                                            <div className="p-4 flex items-center justify-center gap-3">
                                                <Loader2 className="w-4 h-4 animate-spin opacity-40" />
                                                <Text className="text-[10px] font-black uppercase opacity-40">Mencari Area...</Text>
                                            </div>
                                        ) : (
                                            searchResults.map((area) => (
                                                <div 
                                                    key={area.id}
                                                    onClick={() => {
                                                        // Use the unified name or construct it
                                                        const fullName = `${area.administrative_division_level_3_name}, ${area.administrative_division_level_2_name}, ${area.administrative_division_level_1_name}`;
                                                        setFormData({
                                                            ...formData, 
                                                            locationName: fullName, 
                                                            areaId: area.id,
                                                            postalCode: area.postal_code.toString()
                                                        });
                                                        setSearchResults([]);
                                                    }}
                                                    className="p-4 text-[10px] font-black uppercase cursor-pointer hover:bg-black hover:text-white border-b border-black/5 last:border-none group flex flex-col gap-1 transition-colors"
                                                >
                                                    <span className="block truncate">{area.name}</span>
                                                    <span className="block text-[8px] opacity-40 group-hover:opacity-60">ID: {area.id}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="col-span-1">
                                    <InputGroup label="Kode Pos" placeholder="XXXXX" value={formData.postalCode} onChange={(v) => setFormData({...formData, postalCode: v})} />
                                </div>
                                <div className="col-span-2">
                                    <InputGroup label="Alamat Lengkap (Jalan, No Rumah)" placeholder="NAMA JALAN, NOMOR RUMAH, PATOKAN" value={formData.address} onChange={(v) => setFormData({...formData, address: v})} />
                                </div>
                            </div>
                        </div>

                        <Button 
                            onClick={handleNextStep}
                            disabled={!formData.areaId || !formData.firstName || !formData.email || !formData.address}
                            className="w-full py-5 text-sm font-black bg-primary text-black hover:bg-black hover:text-white rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            SIMPAN DETAIL PENGIRIMAN <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-8 animate-in fade-in slide-in-from-left-4">
                        <div className="flex items-center gap-4 border-b-2 border-black pb-6">
                            <div className="w-10 h-10 bg-black flex items-center justify-center rotate-[3deg]">
                                <Truck className="text-white w-6 h-6" />
                            </div>
                            <Text as="h2" className="text-4xl font-hand m-0 italic tracking-tighter">Opsi Pengiriman</Text>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4 bg-zinc-100 p-3 border-2 border-black border-dashed">
                              <MapPin className="w-4 h-4 text-primary" />
                              <Text className="text-[10px] font-black uppercase tracking-widest leading-none">
                                Mengirim ke: {formData.locationName}
                              </Text>
                            </div>
                            
                            {loading ? (
                                <div className="py-12 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-black/20">
                                    <Loader2 className="w-8 h-8 animate-spin opacity-20" />
                                    <Text className="text-[8px] font-black uppercase tracking-widest opacity-40">Mendapatkan Tarif dari Biteship...</Text>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {shippingRates.length > 0 ? shippingRates.map((rate, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => setShippingMethod(rate)}
                                            className={cn(
                                                "w-full p-6 border-4 text-left transition-all flex justify-between items-center group",
                                                shippingMethod?.courier_code === rate.courier_code && shippingMethod?.courier_service_code === rate.courier_service_code
                                                    ? "border-black bg-zinc-50 shadow-[6px_6px_0px_0px_rgba(255,49,49,1)]" 
                                                    : "border-black/5 hover:border-black/20"
                                            )}
                                        >
                                            <div>
                                                <Text className="font-black text-lg m-0 uppercase flex items-center gap-2">
                                                    {rate.courier_name} {rate.courier_service_name}
                                                    {shippingMethod?.courier_code === rate.courier_code && <CheckCircle2 className="w-4 h-4 text-primary" />}
                                                </Text>
                                                <Text className="text-[10px] uppercase font-bold opacity-40 tracking-widest">Estimasi: {rate.duration}</Text>
                                            </div>
                                            <Text className="text-xl font-black italic">{formatPrice(rate.price)}</Text>
                                        </button>
                                    )) : (
                                      <div className="py-12 text-center border-2 border-dashed border-black/10">
                                          <Text className="text-[10px] font-black opacity-30 uppercase">Tidak ada kurir tersedia untuk wilayah ini</Text>
                                      </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 pt-8">
                            <Button onClick={() => setStep(1)} variant="outline" className="flex-1 py-4 border-2 border-black font-black text-xs uppercase rounded-none">Ubah Alamat</Button>
                            <Button 
                                onClick={handleNextStep}
                                disabled={!shippingMethod}
                                className="flex-[2] py-5 text-sm font-black bg-primary text-black hover:bg-black hover:text-white rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all disabled:opacity-50"
                            >
                                LANJUT KE PEMBAYARAN
                            </Button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-8 animate-in fade-in slide-in-from-left-4">
                        <div className="flex items-center gap-4 border-b-2 border-black pb-6">
                            <div className="w-10 h-10 bg-black flex items-center justify-center rotate-[-2deg]">
                                <CreditCard className="text-white w-6 h-6" />
                            </div>
                            <Text as="h2" className="text-4xl font-hand m-0 italic tracking-tighter">Metode Pembayaran</Text>
                        </div>

                        {/* Donation moved here from Cart */}
                        <div className="p-6 border-4 border-black bg-zinc-50 space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-4 bg-primary" />
                                <Text className="text-xs font-black uppercase tracking-tight m-0">Dukungan Komunitas</Text>
                            </div>
                            <Text className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed block">
                                Tambahkan kontribusi untuk mendukung operasional dan acara B.96 di masa depan.
                            </Text>
                            
                            <div className="grid grid-cols-3 gap-2">
                                {[10000, 25000, 50000].map((amt) => (
                                    <button
                                        key={amt}
                                        onClick={() => setDonation(donation === amt ? 0 : amt)}
                                        className={cn(
                                            "py-2 border-2 border-black text-[10px] font-black transition-all",
                                            donation === amt ? "bg-black text-white" : "bg-white hover:bg-zinc-100"
                                        )}
                                    >
                                        +{amt/1000}RB
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 border-4 border-black bg-zinc-50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white border-2 border-black p-2">
                                        <Image src="/qris-logo.svg" alt="QRIS" width={60} height={20} className="grayscale" onError={(e) => (e.currentTarget.style.display='none')} />
                                        <Text className="text-[10px] font-black">QRIS</Text>
                                    </div>
                                    <div>
                                        <Text className="font-black text-lg m-0 uppercase">QRIS via Midtrans</Text>
                                        <Text className="text-[10px] uppercase font-bold opacity-40 tracking-widest">Pembayaran Instan & Aman</Text>
                                    </div>
                                </div>
                                <div className="w-6 h-6 rounded-full border-4 border-black bg-primary shrink-0" />
                            </div>

                            <div className="bg-zinc-100 p-8 flex flex-col items-center justify-center gap-6 border-2 border-dashed border-black/20">
                                {loading ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                                        <Text className="text-[10px] font-black uppercase tracking-[0.3em]">Memproses Pembayaran...</Text>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-48 h-48 bg-white border-4 border-black flex items-center justify-center relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-black/5 flex flex-col items-center justify-center p-4 text-center">
                                                <div className="grid grid-cols-4 grid-rows-4 gap-1 w-full h-full opacity-20">
                                                    {[...Array(16)].map((_, i) => <div key={i} className="bg-black" />)}
                                                </div>
                                                <Text className="absolute font-black text-[10px] uppercase">PEMBAYARAN_SIAP</Text>
                                            </div>
                                        </div>
                                        <Text className="text-[9px] font-black uppercase text-center opacity-40 max-w-[200px]">PINDAI UNTUK MENYELESAIKAN TRANSAKSI</Text>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4 pt-8">
                            <Button onClick={() => setStep(2)} variant="outline" className="flex-1 py-4 border-2 border-black font-black text-xs uppercase rounded-none">Ubah Pengiriman</Button>
                            <Button 
                                onClick={handleProcessPayment}
                                className="flex-[2] py-5 text-sm font-black bg-primary text-black hover:bg-black hover:text-white rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all"
                            >
                                SELESAIKAN PEMBAYARAN
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5">
                <div className="bg-black text-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(255,49,49,1)] sticky top-32">
                    <Text as="h3" className="text-3xl font-black uppercase border-b border-white/20 pb-4 mb-6 m-0">
                        Rincian Pesanan
                    </Text>

                    <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                        {cart.map((item, i) => (
                            <div key={i} className="flex gap-4 pb-4 border-b border-white/10 last:border-0">
                                <div className="w-16 h-16 border-2 border-white/20 bg-zinc-900 shrink-0 relative overflow-hidden">
                                    <Image src={item.image} alt={item.name} fill className="object-cover grayscale" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Text className="font-black text-xs uppercase truncate block">{item.name}</Text>
                                    <Text className="text-[10px] font-bold opacity-40 uppercase tracking-tighter block">{item.variantKey}</Text>
                                    <div className="flex justify-between items-center mt-1">
                                        <Text className="text-[10px] font-black">{item.quantity} unit</Text>
                                        <Text className="text-xs font-black">{formatPrice(item.price * item.quantity)}</Text>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4 pt-6 border-t border-white/20">
                        <div className="flex justify-between items-center text-xs">
                            <span className="uppercase font-bold opacity-40 tracking-widest">Subtotal</span>
                            <span className="font-black">{formatPrice(subtotal)}</span>
                        </div>
                        
                        {donation > 0 && (
                            <div className="flex justify-between items-center text-xs">
                                <span className="uppercase font-bold opacity-40 tracking-widest">Donasi Dukungan</span>
                                <span className="font-black text-primary">+{formatPrice(donation).replace("Rp", "")}</span>
                            </div>
                        )}

                        <div className="flex justify-between items-center text-xs">
                            <span className="uppercase font-bold opacity-40 tracking-widest">Biaya Pengiriman</span>
                            <span className="font-black">
                                {shippingMethod ? formatPrice(shippingMethod.price) : "Belum dihitung"}
                            </span>
                        </div>

                        <div className="pt-6 border-t-4 border-white border-double mt-6 flex justify-between items-end">
                            <Text className="text-2xl font-black uppercase m-0 bg-primary text-black px-2 py-1">TOTAL</Text>
                            <div className="text-right flex flex-col items-end">
                                <span className="text-4xl font-black text-primary leading-none">
                                    {formatPrice(totalAmount + (shippingMethod?.price || 0))}
                                </span>
                                <Text className="text-[8px] font-bold opacity-30 mt-2 uppercase tracking-tight">Diproses aman oleh B.96 Store</Text>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

const StepItem = ({ num, label, active, current }: { num: number, label: string, active: boolean, current: boolean }) => (
    <div className={cn(
        "flex items-center gap-3 transition-opacity",
        !active && "opacity-20"
    )}>
        <div className={cn(
            "w-6 h-6 border-2 border-black flex items-center justify-center text-[10px] font-black transition-all",
            current ? "bg-primary rotate-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" : "bg-white"
        )}>
            {num}
        </div>
        <Text className={cn(
            "text-[10px] uppercase tracking-widest font-black transition-all",
            current ? "text-black scale-110" : "text-black/60"
        )}>
            {label}
        </Text>
    </div>
);

const InputGroup = ({ label, placeholder, value, onChange }: { 
    label: string; 
    placeholder: string; 
    value: string; 
    onChange: (v: string) => void;
}) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-black mb-1 block ml-1">{label}</label>
        <input 
            type="text" 
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-zinc-50 border-2 border-black p-4 text-xs font-black placeholder:opacity-20 focus:outline-none focus:bg-primary/5 focus:border-primary transition-all uppercase"
        />
    </div>
);
