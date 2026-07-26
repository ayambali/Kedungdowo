"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Icon from "../../components/Icon";
import { useState } from "react";

const adminMenu = [
  { name: "Dashboard", path: "/admin", icon: "dashboard" },
  { name: "Statistik & Fasilitas", path: "/admin/penduduk", icon: "insert_chart" },
  { name: "Berita & Kegiatan", path: "/admin/berita", icon: "newspaper" },
  { name: "UMKM", path: "/admin/umkm", icon: "storefront" },
  { name: "Perangkat Desa", path: "/admin/perangkat", icon: "badge" },
  { name: "Layanan Publik", path: "/admin/layanan", icon: "support_agent" },
  { name: "JDIH (Peraturan)", path: "/admin/peraturan-desa", icon: "gavel" },
  { name: "Arsip Digital", path: "/admin/arsip", icon: "folder" },
  { name: "Pengetahuan AI", path: "/admin/chatbot-knowledge", icon: "smart_toy" },
];

// Menu khusus superadmin
const superadminMenu = [
  { name: "Kelola Admin", path: "/admin/kelola-admin", icon: "admin_panel_settings" },
];

export default function AdminSidebar({
  logoutAction,
  role,
}: {
  logoutAction: () => Promise<void>;
  role: string;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const fullMenu = role === "superadmin" 
    ? [...adminMenu, ...superadminMenu] 
    : adminMenu;

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button onClick={() => setMobileOpen(!mobileOpen)} className="min-h-[44px] py-2 px-4 w-10 h-10 bg-white border border-outline-variant/30 rounded-xl flex items-center justify-center shadow-md text-on-surface-variant hover:text-primary"
        >
          <Icon name={mobileOpen ? "close" : "menu"} className="text-xl" />
        </button>
      </div>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* Sidebar aside element */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-[280px] bg-white/70 backdrop-blur-xl border-r border-outline-variant/30 pt-8 pb-6 px-6 shadow-sm flex flex-col shrink-0 z-30 transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-4 mb-12 px-2">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-[0_10px_40px_-10px_rgba(13,99,27,0.3)]">
            <span className="text-on-primary font-serif font-bold text-xl">K</span>
          </div>
          <div>
            <h1 className="text-lg font-serif font-bold text-primary leading-tight tracking-tight">
              Kedungdowo
            </h1>
            <p className="text-[10px] text-secondary font-sans uppercase tracking-widest font-semibold mt-1">
              Admin Panel
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto pr-2 custom-scrollbar">
          {fullMenu.map((item, index) => {
            const isActive = pathname === item.path;
            // Tambah separator sebelum menu superadmin
            const showDivider = role === "superadmin" && index === adminMenu.length;
            return (
              <div key={item.path}>
                {showDivider && (
                  <div className="my-3 mx-2 flex items-center gap-2">
                    <div className="flex-1 h-px bg-outline-variant/30" />
                    <span className="text-[9px] uppercase tracking-widest text-on-surface-variant/50 font-bold">
                      Superadmin
                    </span>
                    <div className="flex-1 h-px bg-outline-variant/30" />
                  </div>
                )}
                <Link
                  href={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`group relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] text-primary font-bold border border-outline-variant/10"
                      : "text-on-surface-variant hover:text-primary hover:bg-white/40"
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 w-1.5 h-6 bg-primary rounded-r-full" />
                  )}
                  <Icon
                    name={item.icon}
                    filled={isActive}
                    className={`text-[20px] transition-transform group-hover:scale-110 ${
                      isActive ? "text-primary" : "text-on-surface-variant/70 group-hover:text-primary"
                    }`}
                  />
                  <span className="text-sm">{item.name}</span>
                </Link>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
