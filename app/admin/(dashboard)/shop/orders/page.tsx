"use client"

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { RetroDataTable } from "@/components/admin/RetroDataTable";
import { columns, OrderColumn } from "./columns";
import { Text } from "@/components/retroui/Text";
import { Loader2 } from "lucide-react";

export default function AdminOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<OrderColumn[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchOrders() {
      const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (orders && orders.length > 0) {
        setData(orders.map(o => ({
          id: o.id,
          customer: o.customer || "ANONYMOUS UNIT",
          date: new Date(o.created_at || o.date).toLocaleDateString("id-ID"),
          total: o.total || 0,
          status: o.status || "pending"
        })));
      } else {
        setData([]);
      }
      setLoading(false);
    }
    fetchOrders();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-black" />
        <span className="font-bold uppercase text-[10px] tracking-[0.3em]">Syncing Order Records...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <Text as="h1" className="text-6xl font-hand m-0 tracking-normal">Order Log</Text>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 animate-pulse border border-black" />
            <Text className="text-[10px] uppercase font-bold tracking-widest opacity-40">Live Database Tracking | System.Admin</Text>
        </div>
      </div>

      <RetroDataTable 
        columns={columns} 
        data={data} 
        searchKey="customer"
      />
    </div>
  );
}
