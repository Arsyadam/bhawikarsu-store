"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Text } from "@/components/retroui/Text";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Upload,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const productSchema = z.object({
  name: z.string().min(3, "NAME MUST BE AT LEAST 3 CHARACTERS").max(100, "NAME TOO LONG"),
  price: z.string().refine((val) => {
    const raw = val.replace(/\./g, '');
    return !isNaN(Number(raw)) && Number(raw) >= 0;
  }, "VALID PRICE REQUIRED"),
  discount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, "DISCOUNT MUST BE 0-100"),
  description: z.string().min(10, "DESCRIPTION TOO SHORT").max(2000, "DESCRIPTION TOO LONG"),
  detailMaterial: z.string().optional(),
  shippingInfo: z.string().optional(),
  stock: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "VALID STOCK REQUIRED"),
  isPreOrder: z.boolean(),
  preOrderType: z.enum(["days", "date"]),
  preOrderValue: z.string().optional(),
});

type ProductFormValues = {
  name: string;
  price: string;
  discount: string;
  description: string;
  detailMaterial?: string;
  shippingInfo?: string;
  stock: string;
  isPreOrder: boolean;
  preOrderType: "days" | "date";
  preOrderValue?: string;
};

export default function NewProductPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  
  // Non-zod status states
  const propagationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [colors, setColors] = useState({ 
    enabled: false, 
    items: [] as { 
      name: string; 
      hex: string; 
      shortImage?: { file: File; preview: string }; 
      longImage?: { file: File; preview: string } 
    }[] 
  });
  const [sizes, setSizes] = useState({ 
    enabled: false, 
    sizeGuide: null as { file: File; preview: string } | null, 
    items: [
      { name: "S", active: false },
      { name: "M", active: true },
      { name: "L", active: true },
      { name: "XL", active: true },
      { name: "XXL", active: false },
    ]
  });
  const [sleeves, setSleeves] = useState({ enabled: false, types: { short: false, long: false } });
  const [stockMatrix, setStockMatrix] = useState<Record<string, { stock: number; price: string }>>({});

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      stock: "0",
      discount: "0",
      isPreOrder: false,
      preOrderType: "days"
    }
  });

  const isPreOrder = watch("isPreOrder");
  const preOrderType = watch("preOrderType");

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from("categories").select("*").order("name");
      if (data) setCategories(data);
    }
    fetchCategories();
  }, [supabase]);

  const toggleCategory = (catName: string) => {
    setSelectedCategories(prev => 
      prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImages = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("public")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("public")
      .getPublicUrl(filePath);

    return publicUrl;
  };

  // Matrix Generation
  const combinations = useMemo(() => {
    const activeColors = colors.enabled && colors.items.length > 0 ? colors.items.map((c, i) => c.name.trim() || `Color ${i + 1}`) : [""];
    const activeSizes = sizes.enabled && sizes.items.some(s => s.active) ? sizes.items.filter(s => s.active).map(s => s.name) : [""];
    const activeSleeves = sleeves.enabled && (sleeves.types.short || sleeves.types.long) 
        ? [sleeves.types.short && "Short Sleeve", sleeves.types.long && "Long Sleeve"].filter(Boolean) as string[]
        : [""];

    const hasOptions = colors.enabled || sizes.enabled || sleeves.enabled;
    if (!hasOptions) return [];

    let combos: string[] = [];
    activeColors.forEach(color => {
      activeSizes.forEach(size => {
        activeSleeves.forEach(sleeve => {
           let parts = [color, size, sleeve].filter(Boolean);
           if (parts.length > 0) combos.push(parts.join(" - "));
        });
      });
    });
    return combos;
  }, [colors, sizes, sleeves]);

  const handleMatrixChange = (key: string, field: "stock" | "price", value: string) => {
      let finalValue: any = value;
      if (field === "price") {
          const raw = value.replace(/\D/g, "");
          finalValue = raw ? new Intl.NumberFormat("id-ID").format(Number(raw)) : "";
      } else if (field === "stock") {
          finalValue = parseInt(value) || 0;
      }

      setStockMatrix(prev => ({ 
          ...prev, 
          [key]: {
              ...prev[key],
              [field]: finalValue 
          }
      }));

      // If this is the first combo being edited, propagate to others if they are currently unconfigured (0 or undefined)
      if (combinations.length > 0 && key === combinations[0]) {
          if (propagationTimeoutRef.current) clearTimeout(propagationTimeoutRef.current);
          propagationTimeoutRef.current = setTimeout(() => {
              setStockMatrix(currentMatrix => {
                  let changed = false;
                  const next = { ...currentMatrix };
                  combinations.forEach(combo => {
                     if (combo !== key) {
                         const comboData = next[combo] || { stock: 0, price: "" };
                         if (!comboData[field] || comboData[field] === 0 || comboData[field] === "") {
                               next[combo] = { ...comboData, [field]: finalValue };
                               changed = true;
                         }
                     }
                  });
                  return changed ? next : currentMatrix;
              });
          }, 5000);
      }
  };

  const handleBaseValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "");
      const formatted = new Intl.NumberFormat("id-ID").format(Number(raw));
      setValue("price", formatted);
  };

  const handleDiscountAdjust = (amount: number) => {
      const current = watch("discount");
      let next = parseInt(current) || 0;
      next = Math.max(0, Math.min(100, next + amount));
      setValue("discount", next.toString());
  };

  // If variants exist, base price is the cheapest variant
  useEffect(() => {
     if (combinations.length > 0) {
        const prices = combinations
            .map(c => {
                const p = stockMatrix[c]?.price || "";
                return parseInt(p.toString().replace(/\./g, '')) || 0;
            })
            .filter(p => p > 0);
            
        if (prices.length > 0) {
             const minPrice = Math.min(...prices);
             const formatted = new Intl.NumberFormat("id-ID").format(minPrice);
             setValue("price", formatted);
        }
     }
  }, [combinations, stockMatrix, setValue]);

  const onSubmit = async (values: ProductFormValues) => {
    if (images.length === 0) {
      alert("AT LEAST ONE PRODUCT IMAGE IS REQUIRED");
      return;
    }

    setLoading(true);
    
    try {
      // 1. Upload Base Images
      const uploadedImageUrls = await Promise.all(
        images.map(img => uploadFile(img.file))
      );

      // 2. Upload Size Guide if exists
      let sizeGuideUrl = "";
      if (sizes.sizeGuide) {
        sizeGuideUrl = await uploadFile(sizes.sizeGuide.file);
      }

      // 3. Upload Color Specific Images
      const updatedColorItems = await Promise.all(
        colors.items.map(async (item) => {
          let shortImageUrl = "";
          let longImageUrl = "";
          if (item.shortImage) {
            shortImageUrl = await uploadFile(item.shortImage.file);
          }
          if (item.longImage) {
            longImageUrl = await uploadFile(item.longImage.file);
          }
          
          // Return the item with strings instead of File objects
          const { shortImage, longImage, ...rest } = item;
          return {
            ...rest,
            shortImage: shortImageUrl,
            longImage: longImageUrl
          };
        })
      );

      const dbPayload = {
        name: values.name,
        price: parseInt(values.price.replace(/\./g, '')) || 0,
        discount: parseInt(values.discount) || 0,
        images: uploadedImageUrls,
        description: values.description,
        detail_material: values.detailMaterial,
        shipping_info: values.shippingInfo,
        categories: selectedCategories,
        is_preorder: values.isPreOrder,
        preorder_data: values.isPreOrder ? {
          type: values.preOrderType,
          value: values.preOrderValue
        } : null,
        stock: (combinations.length > 0) ? Object.values(stockMatrix).reduce((a, b) => a + (b?.stock || 0), 0) : (parseInt(values.stock) || 0),
        variants: {
          colors: {
            enabled: colors.enabled,
            items: updatedColorItems
          },
          sizes: {
            ...sizes,
            sizeGuide: sizeGuideUrl
          },
          sleeves,
          matrix: Object.fromEntries(
              Object.entries(stockMatrix).map(([k, v]) => [
                  k, 
                  { ...v, price: parseInt(v.price.toString().replace(/\./g, '')) || 0 }
              ])
          )
        }
      };
      
      const { error } = await supabase.from("products").insert([dbPayload]);
      if (error) throw error;
      
      router.push("/admin/shop/products");
    } catch (err: any) {
      alert("DATABASE REJECTION: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const retroInputClass = "w-full bg-transparent border-2 border-black p-3 text-[12px] font-bold uppercase tracking-tight focus:outline-none focus:bg-white transition-all disabled:opacity-50";
  const retroLabelClass = "flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-black";
  const sectionClass = "bg-[#f8f8f8] border-2 border-black p-6 md:p-8 space-y-6";
  const sectionHeaderClass = "text-xl font-black uppercase tracking-tighter border-b-2 border-black pb-4 mb-6";
  const errorClass = "text-[9px] font-black text-red-600 mt-1 flex items-center gap-1 uppercase tracking-widest";

  return (
    <div className="max-w-4xl mx-auto pb-32">
      <div className="flex items-center gap-6 mb-12">
        <Link href="/admin/shop/products">
          <div className="w-10 h-10 border-2 border-black bg-white flex items-center justify-center hover:-translate-y-1 hover:-translate-x-1 transition-all cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <ArrowLeft className="w-5 h-5" />
          </div>
        </Link>
        <div>
          <Text as="h1" className="text-6xl font-hand m-0 tracking-normal">Register Unit</Text>
          <Text className="text-[10px] uppercase font-bold tracking-widest opacity-40">Entry point for new catalog entities</Text>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        {/* Images & Categories */}
        <div className={sectionClass}>
          <h2 className={sectionHeaderClass}>Visuals & Classifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className={retroLabelClass}>Unit Assets {images.length === 0 && <AlertCircle className="w-3 h-3 text-red-600" />}</label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="aspect-square bg-white border-2 border-black relative group overflow-hidden">
                        <img src={img.preview} alt="Product" className="w-full h-full object-cover" />
                        <button 
                            type="button" 
                            onClick={() => removeImage(idx)}
                            className="absolute inset-0 bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-black uppercase text-[9px]"
                        >TERMINATE</button>
                    </div>
                  ))}
                  <label className="aspect-square bg-white border-2 border-black border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-zinc-100 transition-colors">
                      <Upload className="w-6 h-6 opacity-30" />
                      <span className="text-[9px] uppercase font-black opacity-40">Inject Image</span>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                  </label>
              </div>
            </div>

            <div>
              <label className={retroLabelClass}>Sectors/Tags</label>
              <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                      <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategory(cat.name)}
                          className={cn(
                              "px-3 py-2 text-[9px] font-black border-2 border-black uppercase transition-all",
                              selectedCategories.includes(cat.name) 
                                  ? "bg-black text-white" 
                                  : "bg-white text-black hover:bg-zinc-100"
                          )}
                      >
                          {cat.name}
                      </button>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* General Identity */}
        <div className={sectionClass}>
          <h2 className={sectionHeaderClass}>Unit Parameters</h2>
          <div className="space-y-6">
            <div>
              <label className={retroLabelClass}>Designation Name</label>
              <input 
                {...register("name")}
                className={cn(retroInputClass, errors.name && "border-red-600")}
                placeholder="E.G. BRUTALIST ALMAMATER"
              />
              {errors.name && <p className={errorClass}>{errors.name.message}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={retroLabelClass}>Base Value (RP)</label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-[10px] text-zinc-400">IDR</div>
                    <input 
                      {...register("price", {
                          onChange: handleBaseValueChange
                      })}
                      type="text"
                      disabled={combinations.length > 0}
                      className={cn(retroInputClass, "pl-12", errors.price && "border-red-600")}
                    />
                </div>
                {combinations.length > 0 && <span className="text-[8px] font-black uppercase text-zinc-400 mt-1 block tracking-wider">LOCKED BY VARIANT PRICING (CHEAPEST)</span>}
                {errors.price && <p className={errorClass}>{errors.price.message}</p>}
              </div>
              <div>
                <label className={retroLabelClass}>Promo Offset (%)</label>
                <div className="flex relative">
                    <button type="button" onClick={() => handleDiscountAdjust(-5)} className="w-12 border-2 border-black border-r-0 bg-white font-black hover:bg-zinc-100 flex items-center justify-center">-</button>
                    <div className="relative flex-1">
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 font-black text-[10px] text-zinc-400">%</div>
                        <input 
                          {...register("discount")}
                          type="number"
                          className={cn(retroInputClass, "border-l-0 border-r-0 text-center", errors.discount && "border-red-600")}
                        />
                    </div>
                    <button type="button" onClick={() => handleDiscountAdjust(5)} className="w-12 border-2 border-black border-l-0 bg-white font-black hover:bg-zinc-100 flex items-center justify-center">+</button>
                </div>
                {errors.discount && <p className={errorClass}>{errors.discount.message}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Variants Section */}
        <div className={sectionClass}>
            <h2 className={sectionHeaderClass}>Configuration Matrix</h2>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b-2 border-dashed border-black">
                    {/* Size */}
                    <div className="border-2 border-black bg-white p-4">
                        <div className="flex flex-col gap-4 mb-4">
                            <div className="flex items-center justify-between">
                                <span className="font-black uppercase text-[10px] tracking-widest">Dimension</span>
                                <input type="checkbox" checked={sizes.enabled} onChange={(e) => setSizes(p => ({...p, enabled: e.target.checked}))} className="w-4 h-4 accent-black" />
                            </div>
                            {sizes.enabled && (
                                <div className="flex items-center gap-4 border-2 border-black p-2 bg-zinc-50 relative overflow-hidden group">
                                    {sizes.sizeGuide ? (
                                        <>
                                            <div className="w-12 h-12 bg-zinc-200 border-2 border-black overflow-hidden shrink-0">
                                                <img src={sizes.sizeGuide.preview} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest block">Size Guide Visual</span>
                                                <span className="text-[8px] font-bold text-zinc-500 uppercase">INJECTED SUCESSFULLY</span>
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => setSizes(p => ({...p, sizeGuide: null}))}
                                                className="absolute inset-0 bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 font-black text-[9px] uppercase transition-opacity"
                                            >TERMINATE ASSET</button>
                                        </>
                                    ) : (
                                        <label className="flex items-center gap-3 w-full cursor-pointer hover:bg-zinc-100 transition-colors p-1">
                                            <div className="w-8 h-8 flex items-center justify-center border-2 border-black bg-white shrink-0">
                                                <Upload className="w-4 h-4 opacity-40" />
                                            </div>
                                            <span className="text-[9px] font-black uppercase">Attach Size Guide (Optional)</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setSizes(p => ({...p, sizeGuide: { file, preview: URL.createObjectURL(file) }}));
                                                }
                                            }} />
                                        </label>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className={cn("flex flex-wrap gap-2", !sizes.enabled && "opacity-20 pointer-events-none")}>
                            {sizes.items.map((s, idx) => (
                                <button key={idx} type="button" onClick={() => setSizes(p => ({...p, items: p.items.map((item, i) => i === idx ? {...item, active: !item.active} : item)}))} className={cn("w-10 h-10 border-2 border-black uppercase font-black text-[9px]", s.active ? "bg-black text-white" : "bg-white text-black hover:bg-zinc-100")}>{s.name}</button>
                            ))}
                        </div>
                    </div>
                    {/* Sleeve */}
                    <div className="border-2 border-black bg-white p-4">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-black uppercase text-[10px] tracking-widest">Sleeve Spec</span>
                            <input type="checkbox" checked={sleeves.enabled} onChange={(e) => setSleeves(p => ({...p, enabled: e.target.checked}))} className="w-4 h-4 accent-black" />
                        </div>
                        <div className={cn("grid grid-cols-2 gap-2", !sleeves.enabled && "opacity-20 pointer-events-none")}>
                            {["short", "long"].map(type => (
                                <button key={type} type="button" onClick={() => setSleeves(p => ({...p, types: {...p.types, [type]: !p.types[type as keyof typeof p.types]}}))} className={cn("border-2 border-black p-2 uppercase font-black text-[9px]", sleeves.types[type as keyof typeof sleeves.types] ? "bg-black text-white" : "bg-white")}>{type} sleeve</button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Color */}
                <div className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-black uppercase text-sm italic">Chrome Variants</span>
                        <input type="checkbox" checked={colors.enabled} onChange={(e) => setColors(p => ({...p, enabled: e.target.checked}))} className="w-5 h-5 accent-black" />
                    </div>
                    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", !colors.enabled && "opacity-20 pointer-events-none")}>
                        {colors.items.map((c, idx) => (
                            <div key={idx} className="border-2 border-black p-4 bg-white relative">
                                <button type="button" onClick={() => setColors(p => ({...p, items: p.items.filter((_, i) => i !== idx)}))} className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white border-2 border-black flex items-center justify-center hover:bg-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><Plus className="w-4 h-4 rotate-45" /></button>
                                <div className="flex flex-col gap-4">
                                    <div className="flex gap-2">
                                        <input type="color" value={c.hex} onChange={(e) => setColors(p => ({...p, items: p.items.map((item, i) => i === idx ? {...item, hex: e.target.value} : item)}))} className="w-10 h-10 border-2 border-black p-0 bg-transparent cursor-pointer shrink-0" />
                                        <input type="text" placeholder="COLOR IDENTITY" value={c.name} onChange={(e) => setColors(p => ({...p, items: p.items.map((item, i) => i === idx ? {...item, name: e.target.value} : item)}))} className="flex-1 border-2 border-black px-3 text-[10px] font-black uppercase focus:bg-zinc-50" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(["shortImage", "longImage"] as const).map(imgKey => (
                                            (sleeves.enabled ? sleeves.types[imgKey === 'shortImage' ? 'short' : 'long'] : true) && (
                                                <div key={imgKey} className="aspect-square border-2 border-black bg-zinc-100 relative group overflow-hidden">
                                                    {(c as any)[imgKey] ? (
                                                        <>
                                                            <img src={(c as any)[imgKey].preview} className="w-full h-full object-cover" />
                                                            <button type="button" onClick={() => setColors(p => ({...p, items: p.items.map((item, i) => i === idx ? {...item, [imgKey]: undefined} : item)}))} className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 font-black text-[9px]">DEL</button>
                                                        </>
                                                    ) : (
                                                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-200 uppercase text-[8px] font-black">
                                                            <Plus className="w-4 h-4 opacity-20" /> {imgKey.replace("Image", "")}
                                                            <input type="file" className="hidden" onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if(file) setColors(p => ({...p, items: p.items.map((item, i) => i === idx ? {...item, [imgKey]: { file, preview: URL.createObjectURL(file) }} : item)}));
                                                            }} />
                                                        </label>
                                                    )}
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={() => setColors(p => ({...p, items: [...p.items, {name: "", hex: "#000000", shortImage: undefined, longImage: undefined}]}))} className="h-full min-h-[140px] border-2 border-black border-dashed flex flex-col items-center justify-center gap-2 hover:bg-black hover:text-white transition-all group">
                            <Plus className="w-8 h-8 opacity-20 group-hover:opacity-100" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Add Color Identity</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Inventory */}
        <div className={sectionClass}>
             <h2 className={sectionHeaderClass}>Stock Logistics</h2>
             <div className="flex items-center justify-between bg-zinc-100 border-2 border-black p-4 mb-6">
                <div>
                    <span className="font-black uppercase text-[10px] tracking-widest">Pre-Order Protocol</span>
                    <span className="block text-[8px] font-bold opacity-40">Waitlist mode for upcoming batches</span>
                </div>
                <input type="checkbox" {...register("isPreOrder")} className="w-5 h-5 accent-black" />
             </div>

             {isPreOrder ? (
                  <div className="grid grid-cols-2 gap-6 bg-white border-2 border-black p-6">
                    <div>
                        <label className={retroLabelClass}>Metric Type</label>
                        <select {...register("preOrderType")} className={retroInputClass}>
                            <option value="days">DAYS FROM ORDER</option>
                            <option value="date">SPECIFIC CALENDAR</option>
                        </select>
                    </div>
                    <div>
                        <label className={retroLabelClass}>{preOrderType === 'days' ? 'Estimate (D)' : 'Closure'}</label>
                        <input {...register("preOrderValue")} type={preOrderType === 'days' ? 'number' : 'date'} className={retroInputClass} />
                    </div>
                  </div>
              ) : (
                 combinations.length > 0 ? (
                    <div className="space-y-4">
                        <label className={retroLabelClass}>Variant Stock Map</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border-2 border-black bg-white p-2">
                            {combinations.map((combo, idx) => (
                                <div key={idx} className="flex flex-col gap-2 p-3 border-2 border-zinc-100 hover:border-black transition-all">
                                    <span className="font-black uppercase text-[9px] truncate w-full border-b border-black/10 pb-2 mb-1">{combo}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <span className="text-[8px] font-bold text-zinc-400 uppercase leading-none block mb-1">Stock</span>
                                            <input type="number" placeholder="0" value={stockMatrix[combo]?.stock || ""} onChange={(e) => handleMatrixChange(combo, "stock", e.target.value)} className="w-full border-2 border-black p-1 text-[10px] font-black" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-[8px] font-bold text-zinc-400 uppercase leading-none block mb-1">Price (IDR)</span>
                                            <input type="text" placeholder="Base" value={stockMatrix[combo]?.price || ""} onChange={(e) => handleMatrixChange(combo, "price", e.target.value)} className="w-full border-2 border-black p-1 text-[10px] font-black" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                 ) : (
                    <div>
                        <label className={retroLabelClass}>Flat Quantity</label>
                        <input {...register("stock")} type="number" className={cn(retroInputClass, errors.stock && "border-red-600")} />
                        {errors.stock && <p className={errorClass}>{errors.stock.message}</p>}
                    </div>
                 )
              )}
        </div>

        {/* Descriptive */}
        <div className={sectionClass}>
             <h2 className={sectionHeaderClass}>Manifesto Content</h2>
             <div className="space-y-6">
                <div>
                    <label className={retroLabelClass}>Unit Description</label>
                    <textarea {...register("description")} rows={4} className={cn(retroInputClass, "normal-case font-medium resize-none", errors.description && "border-red-600")} />
                    {errors.description && <p className={errorClass}>{errors.description.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className={retroLabelClass}>Fiber & Details</label>
                        <textarea {...register("detailMaterial")} rows={3} className={cn(retroInputClass, "normal-case font-medium resize-none")} />
                    </div>
                    <div>
                        <label className={retroLabelClass}>Logistics Data</label>
                        <textarea {...register("shippingInfo")} rows={3} className={cn(retroInputClass, "normal-case font-medium resize-none")} />
                    </div>
                </div>
            </div>
        </div>

        <div className="flex justify-end pt-8">
            <button 
                type="submit" 
                disabled={loading}
                className="bg-red-600 text-white px-12 py-6 font-black uppercase tracking-[0.2em] text-xl border-4 border-black hover:bg-white hover:text-black transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-y-[-4px] active:translate-y-0"
            >
                {loading ? "DATA_STREAMING..." : "REGISTER UNIT_CATALOG"}
            </button>
        </div>
      </form>
    </div>
  );
}
