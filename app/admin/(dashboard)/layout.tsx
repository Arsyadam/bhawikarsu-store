import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/admin/login");
  }

  const handleLogout = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-[#f0f0f0] text-black selection:bg-primary selection:text-white font-sans">
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-end border-b-[3px] border-black bg-white px-6">
          <form action={handleLogout}>
             <button 
                className="flex items-center gap-2 bg-white border-2 border-black px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                type="submit"
             >
                <LogOut className="h-4 w-4" />
                Logout
             </button>
          </form>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-8 bg-[#f4f4f4]">{children}</main>
      </div>
    </div>
  );
}
