"use client";

import { useCart } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Text } from "@/components/retroui/Text";
import { Button } from "@/components/retroui/Button";
import { ArrowLeft, ShieldCheck, Truck, CreditCard, Loader2, CheckCircle2, ChevronRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart, totalAmount, subtotal, donation, totalItems } = useCart();
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
    province: "",
    city: "",
    district: "",
    postalCode: "",
  });

  const [shippingMethod, setShippingMethod] = useState<any>(null);
  const [shippingRates, setShippingRates] = useState<any[]>([]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Mock Mengantar API Location Search
  const [provinces] = useState(["JAWA TIMUR", "JAWA TENGAH", "JAWA BARAT", "DKI JAKARTA"]);
  const [cities] = useState(["MALANG", "SURABAYA", "SIDOARJO", "BATU"]);

  // Mock Shipping Rates Calculation (Mengantar API Simulation)
  useEffect(() => {
    if (formData.city && formData.district) {
      setLoading(true);
      setTimeout(() => {
        setShippingRates([
          { id: "reg", name: "J&T REGULAR", price: 12000, etd: "2-3 DAYS" },
          { id: "exp", name: "SICEPAT BEST", price: 25000, etd: "1-2 DAYS" },
          { id: "eco", name: "JNE OKE", price: 9000, etd: "4-5 DAYS" }
        ]);
        setLoading(false);
      }, 1000);
    }
  }, [formData.city, formData.district]);

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleProcessPayment = () => {
    setLoading(true);
    // Simulate Midtrans QRIS Generation
    setTimeout(() => {
        setPaymentSuccess(true);
        setLoading(false);
    }, 2000);
  };

  if (cart.length === 0 && !paymentSuccess) {
    return (
      <div className="min-h-screen bg-[#f0f0f0] pt-24 md:pt-32 flex flex-col items-center justify-center gap-6">
        <Text as="h2" className="text-4xl font-black italic opacity-20">TIDAK ADA PEMBAYARAN</Text>
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
                    <Text as="h1" className="text-6xl font-hand italic m-0 mb-4 tracking-tighter">Transaksi Berhasil</Text>
                    <Text className="text-sm font-black uppercase tracking-[0.2em] opacity-40 mb-12 block">Protokol Pesanan: #B96-{(Math.random()*10000).toFixed(0)}</Text>
                    
                    <div className="flex flex-col gap-4">
                        <Link href="/shop">
                            <Button className="w-full py-6 text-lg font-black bg-black text-white hover:bg-zinc-800 rounded-none border-2 border-black">KEMBALI KE SEKTOR: TOKO</Button>
                        </Link>
                        <Text className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Digital-manifest konfirmasi telah dikirimkan ke {formData.email}</Text>
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
                <StepItem num={2} label="Logistik" active={step >= 2} current={step === 2} />
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
                            <InputGroup label="Nama Depan" placeholder="CONTOH: BUDI" value={formData.firstName} onChange={(v) => setFormData({...formData, firstName: v})} />
                            <InputGroup label="Nama Belakang" placeholder="CONTOH: SANTOSO" value={formData.lastName} onChange={(v) => setFormData({...formData, lastName: v})} />
                            <InputGroup label="Protokol Komunikasi (Email)" placeholder="USER@DOMAIN.COM" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
                            <InputGroup label="Sinyal Seluler (Nomor HP)" placeholder="+62 XXX XXXX" value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />
                        </div>

                        <div className="space-y-6 pt-6 border-t-2 border-black/5">
                            <InputGroup label="Sektor Pendaratan (Alamat)" placeholder="NAMA JALAN, NOMOR RUMAH" value={formData.address} onChange={(v) => setFormData({...formData, address: v})} />
                            <div className="grid grid-cols-2 gap-6">
                                <SelectGroup label="Wilayah (Provinsi)" options={provinces} value={formData.province} onChange={(v) => setFormData({...formData, province: v})} />
                                <SelectGroup label="Pusat (Kota)" options={cities} value={formData.city} onChange={(v) => setFormData({...formData, city: v})} />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <InputGroup label="Kecamatan" placeholder="KECAMATAN" value={formData.district} onChange={(v) => setFormData({...formData, district: v})} />
                                <InputGroup label="Kode Pos" placeholder="XXXXX" value={formData.postalCode} onChange={(v) => setFormData({...formData, postalCode: v})} />
                            </div>
                        </div>

                        <Button 
                            onClick={handleNextStep}
                            className="w-full py-8 text-xl font-black bg-black text-white hover:bg-zinc-800 rounded-none border-2 border-black shadow-[6px_6px_0px_0px_rgba(255,49,49,1)] hover:shadow-none transition-all flex items-center justify-center gap-3"
                        >
                            SIMPAN DETAIL IDENTITAS <ChevronRight className="w-6 h-6" />
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-8 animate-in fade-in slide-in-from-left-4">
                        <div className="flex items-center gap-4 border-b-2 border-black pb-6">
                            <div className="w-10 h-10 bg-black flex items-center justify-center rotate-[3deg]">
                                <Truck className="text-white w-6 h-6" />
                            </div>
                            <Text as="h2" className="text-4xl font-hand m-0 italic tracking-tighter">Protokol Logistik</Text>
                        </div>

                        <div className="space-y-4">
                            <Text className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4 block">MENGANTAR_API: Menghubungi Jaringan Kurir...</Text>
                            
                            {loading ? (
                                <div className="py-12 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-black/20">
                                    <Loader2 className="w-8 h-8 animate-spin opacity-20" />
                                    <Text className="text-[8px] font-black uppercase tracking-widest opacity-40">Menghitung Tarif Pengiriman</Text>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {shippingRates.map((rate) => (
                                        <button 
                                            key={rate.id}
                                            onClick={() => setShippingMethod(rate)}
                                            className={cn(
                                                "w-full p-6 border-4 text-left transition-all flex justify-between items-center group",
                                                shippingMethod?.id === rate.id 
                                                    ? "border-black bg-zinc-50 shadow-[6px_6px_0px_0px_rgba(255,49,49,1)]" 
                                                    : "border-black/5 hover:border-black/20"
                                            )}
                                        >
                                            <div>
                                                <Text className="font-black text-lg m-0 uppercase flex items-center gap-2">
                                                    {rate.name}
                                                    {shippingMethod?.id === rate.id && <CheckCircle2 className="w-4 h-4 text-primary" />}
                                                </Text>
                                                <Text className="text-[10px] uppercase font-bold opacity-40 tracking-widest">Estimasi Pengiriman: {rate.etd}</Text>
                                            </div>
                                            <Text className="text-xl font-black italic">{formatPrice(rate.price)}</Text>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 pt-8">
                            <Button onClick={() => setStep(1)} variant="outline" className="flex-1 py-6 border-2 border-black italic font-black text-sm uppercase rounded-none">Ubah Identitas</Button>
                            <Button 
                                onClick={handleNextStep}
                                disabled={!shippingMethod}
                                className="flex-[2] py-8 text-xl font-black bg-black text-white hover:bg-zinc-800 rounded-none border-2 border-black shadow-[6px_6px_0px_0px_rgba(255,49,49,1)] hover:shadow-none transition-all disabled:opacity-50"
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
                            <Text as="h2" className="text-4xl font-hand m-0 italic tracking-tighter">Pusat Pembayaran</Text>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 border-4 border-black bg-zinc-50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white border-2 border-black p-2">
                                        <Image src="/qris-logo.svg" alt="QRIS" width={60} height={20} className="grayscale" onError={(e) => (e.currentTarget.style.display='none')} />
                                        <Text className="text-[10px] font-black italic">QRIS</Text>
                                    </div>
                                    <div>
                                        <Text className="font-black text-lg m-0 uppercase">MIDTRANS_GATEWAY: QRIS</Text>
                                        <Text className="text-[10px] uppercase font-bold opacity-40 tracking-widest">Protokol Transmisi Instan</Text>
                                    </div>
                                </div>
                                <div className="w-6 h-6 rounded-full border-4 border-black bg-primary shrink-0" />
                            </div>

                            <div className="bg-zinc-100 p-8 flex flex-col items-center justify-center gap-6 border-2 border-dashed border-black/20">
                                {loading ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                                        <Text className="text-[10px] font-black uppercase tracking-[0.3em]">Sinkronisasi dengan Midtrans...</Text>
                                    </div>
                                ) : (
                                    <>
                                        {/* Mocking QR Code Area */}
                                        <div className="w-48 h-48 bg-white border-4 border-black flex items-center justify-center relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-black/5 flex flex-col items-center justify-center p-4 text-center">
                                                <div className="grid grid-cols-4 grid-rows-4 gap-1 w-full h-full opacity-20">
                                                    {[...Array(16)].map((_, i) => <div key={i} className="bg-black" />)}
                                                </div>
                                                <Text className="absolute font-black text-[10px] uppercase">QRIS_MANIFEST_READY</Text>
                                            </div>
                                        </div>
                                        <Text className="text-[9px] font-black uppercase text-center opacity-40 max-w-[200px]">PINDAI UNTUK OTORISASI PEMBAYARAN DARI PROTOKOL TRANSIT</Text>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4 pt-8">
                            <Button onClick={() => setStep(2)} variant="outline" className="flex-1 py-6 border-2 border-black italic font-black text-sm uppercase rounded-none">Ubah Logistik</Button>
                            <Button 
                                onClick={handleProcessPayment}
                                className="flex-[2] py-8 text-xl font-black bg-primary text-black hover:bg-red-600 hover:text-white rounded-none border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all"
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
                    <Text as="h3" className="text-3xl font-black uppercase italic border-b border-white/20 pb-4 mb-6 m-0">
                        Manifest Pesanan
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
                            <span className="uppercase font-bold opacity-40 tracking-widest">Manifest Dasar</span>
                            <span className="font-black">{formatPrice(subtotal)}</span>
                        </div>
                        
                        {donation > 0 && (
                            <div className="flex justify-between items-center text-xs">
                                <span className="uppercase font-bold opacity-40 tracking-widest">Protokol Dukungan</span>
                                <span className="font-black text-primary">+{formatPrice(donation).replace("Rp", "")}</span>
                            </div>
                        )}

                        <div className="flex justify-between items-center text-xs">
                            <span className="uppercase font-bold opacity-40 tracking-widest">Layanan Pengiriman</span>
                            <span className="font-black">
                                {shippingMethod ? formatPrice(shippingMethod.price) : "MENUNGGU_INPUT"}
                            </span>
                        </div>

                        <div className="pt-6 border-t-4 border-white border-double mt-6 flex justify-between items-end">
                            <Text className="text-2xl font-black uppercase italic m-0 bg-primary text-black px-2 py-1 rotate-[-2deg]">TOTAL</Text>
                            <div className="text-right flex flex-col items-end">
                                <span className="text-4xl font-black text-primary leading-none">
                                    {formatPrice(totalAmount + (shippingMethod?.price || 0))}
                                </span>
                                <Text className="text-[8px] font-bold opacity-30 mt-2 uppercase tracking-tight">Transmisi diotorisasi oleh B.96 Gateway</Text>
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
        <label className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">{label}</label>
        <input 
            type="text" 
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-zinc-50 border-2 border-black p-4 text-xs font-black placeholder:opacity-20 focus:outline-none focus:bg-primary/5 focus:border-primary transition-all uppercase"
        />
    </div>
);

const SelectGroup = ({ label, options, value, onChange }: {
    label: string;
    options: string[];
    value: string;
    onChange: (v: string) => void;
}) => (
    <div className="space-y-2">
        <label className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">{label}</label>
        <div className="relative">
            <select 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-zinc-50 border-2 border-black p-4 text-xs font-black appearance-none focus:outline-none focus:bg-primary/5 focus:border-primary transition-all uppercase"
            >
                <option value="">SCANNING...</option>
                {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-40" />
        </div>
    </div>
);
