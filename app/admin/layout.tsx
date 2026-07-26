import { logout, getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeaderProfile from "./components/AdminHeaderProfile";
import Icon from "../components/Icon";

export const metadata = { title: "Admin Dashboard | Desa Kedungdowo" };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  async function handleLogout() {
    "use server";
    await logout();
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#f6f5f2] relative antialiased flex text-on-surface">
      {/* Noise background overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Sidebar Navigation */}
      <AdminSidebar logoutAction={handleLogout} role={session?.role || "admin"} />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* TopAppBar */}
        <header className="flex justify-between items-center h-20 px-6 md:px-10 shrink-0 bg-white/70 backdrop-blur-xl border-b border-outline-variant/30 relative z-30">
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative flex items-center w-full h-11 rounded-full bg-white border border-outline-variant/20 focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-300">
              <div className="grid place-items-center h-full w-12 text-on-surface-variant/70">
                <Icon name="search" className="text-xl" />
              </div>
              <input
                className="peer h-full w-full outline-none text-sm text-on-surface bg-transparent pr-4 placeholder:text-on-surface-variant/50"
                id="search"
                placeholder="Cari berita, UMKM, perangkat..."
                type="text"
              />
            </div>
          </div>

          {/* Trailing Actions & Profile */}
          <div className="flex items-center gap-3 ml-auto pl-12 md:pl-0">
            <button className="min-h-[44px] py-2 px-4 w-10 h-10 flex items-center justify-center hover:bg-white/60 rounded-full transition-all text-on-surface-variant/80 border border-outline-variant/25 shadow-sm relative group bg-white/40">
              <Icon name="notifications" className="text-xl group-hover:text-primary transition-colors" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border border-white"></span>
            </button>
            <button className="min-h-[44px] py-2 px-4 w-10 h-10 hidden sm:flex items-center justify-center hover:bg-white/60 rounded-full transition-all text-on-surface-variant/80 border border-outline-variant/25 shadow-sm group bg-white/40">
              <Icon name="help" className="text-xl group-hover:text-primary transition-colors" />
            </button>
            
            {/* Interactive Profile Dropdown & Logout */}
            <AdminHeaderProfile
              logoutAction={handleLogout}
              username={session?.username || "Admin"}
              role={session?.role || "admin"}
              namaLengkap={session?.namaLengkap || ""}
            />
          </div>

        </header>

        {/* Main Canvas */}
        <main className="flex-grow overflow-y-auto p-4 md:p-6 md:p-4 md:p-10 pb-20 custom-scrollbar">
          <div className="w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
