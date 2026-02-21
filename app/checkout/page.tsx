"use client";

import { useCart } from "@/context/CartContext";

import { Text } from "@/components/retroui/Text";
import { Button } from "@/components/retroui/Button";
import { ArrowLeft, ShieldCheck, Truck, CreditCard, Loader2, CheckCircle2, ChevronRight, ChevronDown, MapPin, Search, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { createMidtransTransaction, checkPaymentStatus } from "@/app/actions/checkout";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { cart, totalAmount, subtotal, donation, setDonation, totalItems } = useCart();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [transactionDetails, setTransactionDetails] = useState<any>(null);
  const [countdown, setCountdown] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    locationName: "", // District, City, Province
    postalCode: "",
  });

  const finalAmount = subtotal + donation;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const [customDonation, setCustomDonation] = useState("");
  const [showCustomDonation, setShowCustomDonation] = useState(false);

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
      // Automatically trigger payment process when moving to step 2
      setTimeout(() => {
        handleProcessPayment();
      }, 100);
    }
  };

  const handleProcessPayment = async () => {
    setLoading(true);
    setQrUrl(null);
    setIsExpired(false);
    setCountdown(null);
    try {
        // Prepare items for Midtrans
        const items = cart.map(item => ({
            id: item.id || item.variantKey,
            price: item.price,
            quantity: item.quantity,
            name: item.name
        }));

        // Add donation as an item if present
        if (donation > 0) {
            items.push({
                id: "donation-community",
                price: donation,
                quantity: 1,
                name: "Dukungan Komunitas B.96"
            });
        }

        console.log("Processing payment for:", { finalAmount, items });

        if (isNaN(finalAmount) || finalAmount <= 0) {
            throw new Error("Invalid total amount");
        }

        const result = await createMidtransTransaction({
            amount: finalAmount,
            items: items,
            customerDetails: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                address: `${formData.address}, ${formData.locationName}, ${formData.postalCode}`
            }
        });

        if (result.success && result.qr_url) {
            setQrUrl(result.qr_url);
            setTransactionDetails(result);
            setLoading(false);
            toast.success("QR Code Pembayaran Berhasil Dibuat");
        } else {
            toast.error(result.error || "Gagal membuat transaksi QRIS.");
            setLoading(false);
        }
    } catch (err: any) {
        console.error("Payment Process Error:", err);
        toast.error("Terjadi kesalahan teknis: " + (err.message || "Unknown error"));
        setLoading(false);
    }
  };

   const handleCheckStatus = async () => {
    if (!transactionDetails?.order_id) return;
    
    setLoading(true);
    try {
        const result = await checkPaymentStatus(transactionDetails.order_id);
        if (result.success && result.paid) {
            setPaymentSuccess(true);
            toast.success("Pembayaran Berhasil! Pesanan Anda diproses.");
        } else {
            // Show status based on API response
            if (result.status === "pending") {
                toast.info("Pembayaran belum masuk. Silakan selesaikan pembayaran di aplikasi e-wallet Anda.");
            } else {
                toast.error(`Status: ${result.status}. ${result.message || ""}`);
            }
        }
    } catch (err) {
        toast.error("Gagal mengecek status. Silakan coba lagi.");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (transactionDetails?.expiry_time && qrUrl && !paymentSuccess) {
      // Midtrans expiry_time format: "2026-02-21 17:13:16" (WIB)
      const expiryStr = transactionDetails.expiry_time.replace(" ", "T") + "+07:00";
      const expiryDate = new Date(expiryStr).getTime();
      
      timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = expiryDate - now;
        
        if (distance <= 0) {
          clearInterval(timer);
          setCountdown("EXPIRED");
          setIsExpired(true);
        } else {
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setCountdown(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
          setIsExpired(false);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [transactionDetails, qrUrl, paymentSuccess]);

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
        <div className="min-h-screen bg-[#f0f0f0] pt-12">
            <main className="max-w-3xl mx-auto px-4 py-24 text-center">
                <div className="bg-white border-4 border-black p-12 shadow-[12px_12px_0px_0px_rgba(34,197,94,1)]">
                    <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-8" />
                    <Text as="h1" className="text-6xl font-hand m-0 mb-4 tracking-tighter">Terima Kasih!</Text>
                    <Text className="text-sm font-black uppercase tracking-[0.2em] opacity-40 mb-12 block">ID Pesanan: {transactionDetails?.order_id || `#B96-${(Math.random()*10000).toFixed(0)}`}</Text>
                    
                    <div className="flex flex-col gap-4">
                        <Link href="/shop">
                            <Button className="w-full py-6 text-lg font-black bg-black text-white hover:bg-zinc-800 rounded-none border-2 border-black">KEMBALI KE BERANDA</Button>
                        </Link>
                        <Text className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Konfirmasi pesanan telah dikirimkan ke {formData.email}</Text>
                    </div>
                </div>
            </main>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0] pt-12">
      
      <main className="max-w-7xl mx-auto px-4 md:px-12 pb-32">
        {/* Progress Tracker */}
        <div className="flex items-center gap-6 mb-16 border-b-4 border-black pb-8 overflow-x-auto no-scrollbar">
            <Link href="/cart" className="flex items-center gap-2 group shrink-0">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <Text className="text-[10px] font-black uppercase tracking-widest opacity-40">Batal</Text>
            </Link>
            
            <div className="flex items-center gap-6 shrink-0">
                <StepItem num={1} label="Identitas & Alamat" active={step >= 1} current={step === 1} />
                <ChevronRight className="w-4 h-4 opacity-20" />
                <StepItem num={2} label="Pembayaran" active={step >= 2} current={step === 2} />
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
                                <label className="text-[10px] font-black uppercase tracking-widest text-black mb-1 block ml-1">Wilayah (Kecamatan / Kota / Kabupaten / Provinsi)</label>
                                <div className="flex items-center bg-zinc-50 border-2 border-black p-4 group focus-within:bg-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                    <input 
                                        type="text" 
                                        placeholder="CONTOH: KLOJEN, KOTA MALANG, JAWA TIMUR"
                                        value={formData.locationName}
                                        onChange={(e) => {
                                            setFormData({...formData, locationName: e.target.value});
                                        }}
                                        className="bg-transparent border-none focus:outline-none text-xs font-black w-full uppercase placeholder:opacity-20"
                                    />
                                </div>
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

                        {/* Donation moved here from Payment Step */}
                        <div className="p-6 border-4 border-black bg-zinc-50 space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-4 bg-primary" />
                                <Text className="text-xs font-black uppercase tracking-tight m-0">Dukungan Komunitas</Text>
                            </div>
                            <Text className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed block">
                                Tambahkan kontribusi untuk mendukung operasional dan acara B.96 di masa depan (Min. Rp 50.000).
                            </Text>
                            
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                {[50000, 100000, 250000].map((amt) => (
                                    <button
                                        key={amt}
                                        onClick={() => {
                                            setDonation(donation === amt ? 0 : amt);
                                            setShowCustomDonation(false);
                                        }}
                                        className={cn(
                                            "py-3 border-2 border-black text-[10px] font-black transition-all",
                                            donation === amt && !showCustomDonation ? "bg-black text-white" : "bg-white hover:bg-zinc-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                                        )}
                                    >
                                        +{(amt/1000)}RB
                                    </button>
                                ))}
                                <button
                                    onClick={() => setShowCustomDonation(!showCustomDonation)}
                                    className={cn(
                                        "py-3 border-2 border-black text-[10px] font-black transition-all",
                                        showCustomDonation ? "bg-primary text-black" : "bg-white hover:bg-zinc-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                                    )}
                                >
                                    CUSTOM
                                </button>
                            </div>

                            {showCustomDonation && (
                                <div className="animate-in slide-in-from-top-2 fade-in duration-200">
                                    <label className="text-[9px] font-black uppercase tracking-widest mb-1 block">Nominal (Min. 50000)</label>
                                    <div className="flex gap-2">
                                        <div className="flex-1 relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black opacity-30">RP</span>
                                            <input 
                                                type="number"
                                                placeholder="Masukan angka..."
                                                value={customDonation}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setCustomDonation(val);
                                                    const numVal = parseInt(val);
                                                    if (numVal >= 50000) {
                                                        setDonation(numVal);
                                                    } else {
                                                        setDonation(0);
                                                    }
                                                }}
                                                className="w-full bg-white border-2 border-black py-3 pl-10 pr-4 text-xs font-black placeholder:opacity-20 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    {customDonation && parseInt(customDonation) < 50000 && (
                                        <Text className="text-[8px] font-bold text-red-500 uppercase mt-1">Minimal donasi Rp 50.000</Text>
                                    )}
                                </div>
                            )}
                        </div>

                        <Button 
                            onClick={handleNextStep}
                            disabled={!formData.firstName || !formData.email || !formData.address || !formData.locationName}
                            className="w-full py-5 text-sm font-black bg-primary text-black hover:bg-black hover:text-white rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            LANJUT KE PEMBAYARAN <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-8 animate-in fade-in slide-in-from-left-4">
                        <div className="flex items-center gap-4 border-b-2 border-black pb-6">
                            <div className="w-10 h-10 bg-black flex items-center justify-center rotate-[-2deg]">
                                <CreditCard className="text-white w-6 h-6" />
                            </div>
                            <Text as="h2" className="text-4xl font-hand m-0 italic tracking-tighter">Metode Pembayaran</Text>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 border-4 border-black bg-zinc-50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white border-2 border-black p-2 flex items-center justify-center">
                                        <div className="w-10 h-10 bg-primary flex items-center justify-center">
                                            <CreditCard className="w-6 h-6 text-black" />
                                        </div>
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
                                        {qrUrl ? (
                                            <div className="flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300">
                                                <div className="w-64 h-64 bg-white border-4 border-black p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative group">
                                                    <Image 
                                                        src={isExpired ? "https://placehold.co/400x400/000000/FFFFFF?text=EXPIRED" : qrUrl} 
                                                        alt="Midtrans QRIS" 
                                                        fill 
                                                        className={cn("object-contain p-2", isExpired && "opacity-20 grayscale")}
                                                        unoptimized
                                                    />
                                                    {isExpired && (
                                                       <div className="absolute inset-0 flex items-center justify-center">
                                                           <div className="bg-red-600 text-white px-4 py-2 font-black text-xs rotate-[-10deg] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                                               SUDAH KADALUWARSA
                                                           </div>
                                                       </div>
                                                    )}
                                                </div>
                                                <div className="text-center space-y-2">
                                                    {!isExpired ? (
                                                       <div className="flex flex-col items-center gap-1">
                                                           <Text className="text-[10px] font-black uppercase text-black">Scan QR di atas untuk membayar</Text>
                                                           <div className="flex items-center gap-2 bg-black text-white px-3 py-1 rounded-none border border-black shadow-[2px_2px_0px_0px_rgba(163,230,53,1)]">
                                                               <span className="text-[8px] font-bold opacity-50">SISA WAKTU:</span>
                                                               <span className="text-[12px] font-mono font-black">{countdown || "--:--"}</span>
                                                           </div>
                                                       </div>
                                                    ) : (
                                                       <Text className="text-[10px] font-black uppercase text-red-600">QR CODE SUDAH EXPIRED. SILAKAN GENERATE ULANG.</Text>
                                                    )}
                                                    <Text className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest block">ID: {transactionDetails?.order_id}</Text>
                                                </div>
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
                                                <Text className="text-[9px] font-black uppercase text-center opacity-40 max-w-[200px]">QRIS AKAN MUNCUL SETELAH KONFIRMASI</Text>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4 pt-8">
                            <Button onClick={() => setStep(1)} variant="outline" className="flex-1 py-4 border-2 border-black font-black text-xs uppercase rounded-none">Ubah Alamat</Button>
                            <Button 
                                onClick={qrUrl && !isExpired ? handleCheckStatus : handleProcessPayment}
                                disabled={loading}
                                className="flex-[2] py-5 text-sm font-black bg-primary text-black hover:bg-black hover:text-white rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all disabled:opacity-50"
                            >
                                {loading ? "SEDANG MEMPROSES..." : (qrUrl && !isExpired) ? "CEK STATUS PEMBAYARAN" : isExpired ? "GENERATE ULANG QRIS" : "SELESAIKAN PEMBAYARAN"}
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
                            <span className="font-black italic text-primary/60">
                                Nanti (Admin akan menghubungi)
                            </span>
                        </div>

                        <div className="pt-6 border-t-4 border-white border-double mt-6 flex justify-between items-end">
                            <Text className="text-2xl font-black uppercase m-0 bg-primary text-black px-2 py-1">TOTAL</Text>
                            <div className="text-right flex flex-col items-end">
                                <span className="text-4xl font-black text-primary leading-none">
                                    {formatPrice(finalAmount)}
                                </span>
                                <Text className="text-[8px] font-bold opacity-30 mt-2 uppercase tracking-tight">Diproses aman oleh B.96 Store</Text>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
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
