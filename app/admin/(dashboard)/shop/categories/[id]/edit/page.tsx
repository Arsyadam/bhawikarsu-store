"use client";

import { useState, useEffect, use } from "react";
import { Text } from "@/components/retroui/Text";
import { 
  ArrowLeft, 
  Upload,
  AlertCircle,
  Tag as TagIcon,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const categorySchema = z.object({
  name: z.string().min(2, "NAME MUST BE AT LEAST 2 CHARACTERS").max(50, "NAME TOO LONG"),
  subtitle: z.string().max(100, "SUBTITLE TOO LONG").optional(),
  image: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    async function fetchCategory() {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (data) {
          reset({
            name: data.name,
            subtitle: data.subtitle || "",
            image: data.image || ""
          });
          if (data.image) setImagePreview(data.image);
        }
      } catch (err: any) {
        alert("FETCH ERROR: " + err.message);
        router.push("/admin/shop/categories");
      } finally {
        setFetching(false);
      }
    }

    fetchCategory();
  }, [id, supabase, reset, router]);

  const uploadFile = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `categories/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("public")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("public")
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    setValue("image", objectUrl);
  };

  const onSubmit = async (values: CategoryFormValues) => {
    setLoading(true);
    
    try {
      let imageUrl = values.image;
      if (imageFile) {
        imageUrl = await uploadFile(imageFile);
      }

      const { error } = await supabase
        .from("categories")
        .update({
          name: values.name.toUpperCase(),
          subtitle: values.subtitle,
          image: imageUrl
        })
        .eq("id", id);

      if (error) throw error;
      
      router.push("/admin/shop/categories");
      router.refresh();
    } catch (err: any) {
      alert("DATABASE REJECTION: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("ARE YOU SURE YOU WANT TO TERMINATE THIS CATEGORY? THIS ACTION IS IRREVERSIBLE.")) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      router.push("/admin/shop/categories");
      router.refresh();
    } catch (err: any) {
      alert("TERMINATION FAILED: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const retroInputClass = "w-full bg-transparent border-2 border-black p-3 text-[12px] font-bold uppercase tracking-tight focus:outline-none focus:bg-white transition-all disabled:opacity-50";
  const retroLabelClass = "flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-black";
  const sectionClass = "bg-[#f8f8f8] border-2 border-black p-6 md:p-8 space-y-6";
  const sectionHeaderClass = "text-xl font-black uppercase tracking-tighter border-b-2 border-black pb-4 mb-6";
  const errorClass = "text-[9px] font-black text-red-600 mt-1 flex items-center gap-1 uppercase tracking-widest";

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-black border-t-red-600 animate-spin" />
          <Text className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Synchronizing Data...</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-32">
      <div className="flex items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-6">
          <Link href="/admin/shop/categories">
            <div className="w-10 h-10 border-2 border-black bg-white flex items-center justify-center hover:-translate-y-1 hover:-translate-x-1 transition-all cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <ArrowLeft className="w-5 h-5" />
            </div>
          </Link>
          <div>
            <Text as="h1" className="text-6xl font-hand m-0 tracking-normal text-black italic">Modify Sector</Text>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-600 border border-black" />
              <Text className="text-[10px] uppercase font-bold tracking-widest opacity-40">Entry ID: {id.toString().slice(0, 12)}...</Text>
            </div>
          </div>
        </div>

        <button 
          onClick={handleDelete}
          disabled={loading}
          className="w-12 h-12 border-2 border-black bg-white flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] active:shadow-none translate-y-[-2px] active:translate-y-0"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        <div className={sectionClass}>
          <h2 className={sectionHeaderClass}>Category Parameters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className={retroLabelClass}>Category Designation</label>
                <input 
                  {...register("name")}
                  className={cn(retroInputClass, errors.name && "border-red-600")}
                  placeholder="E.G. OUTERWEAR"
                />
                {errors.name && <p className={errorClass}><AlertCircle className="w-3 h-3" /> {errors.name.message}</p>}
              </div>

              <div>
                <label className={retroLabelClass}>Sub-Classification</label>
                <input 
                  {...register("subtitle")}
                  className={cn(retroInputClass, errors.subtitle && "border-red-600")}
                  placeholder="E.G. TECHNICAL APPAREL & GEAR"
                />
                {errors.subtitle && <p className={errorClass}><AlertCircle className="w-3 h-3" /> {errors.subtitle.message}</p>}
              </div>
            </div>

            <div>
              <label className={retroLabelClass}>Category Identity Visual</label>
              <div className="aspect-[3/4] bg-white border-2 border-black relative group overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-50 transition-colors">
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover grayscale" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-black text-[10px] uppercase tracking-widest">Replace Asset</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3 opacity-30 group-hover:opacity-60 transition-all">
                    <TagIcon className="w-12 h-12" />
                    <Upload className="w-6 h-6" />
                    <span className="text-[9px] uppercase font-black">Inject Image</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handleImageUpload}
                />
              </div>
              <p className="text-[8px] font-bold text-zinc-400 mt-2 uppercase tracking-widest text-center">Recommended Aspect Ratio: 3:4</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-8">
            <button 
                type="submit" 
                disabled={loading}
                className="bg-black text-white px-12 py-6 font-black uppercase tracking-[0.2em] text-xl border-4 border-black hover:bg-white hover:text-black transition-all shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1),8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-y-[-4px] active:translate-y-0 disabled:opacity-50"
            >
                {loading ? "DATA_STREAMING..." : "COMMIT_PROTOCOL"}
            </button>
        </div>
      </form>
    </div>
  );
}
