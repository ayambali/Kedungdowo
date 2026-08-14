"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getVisitorStats } from "./footer-actions";

function FooterStats() {
  const [stats, setStats] = useState({
    today: "0",
    yesterday: "0",
    month: "0",
    year: "0",
    total: "0",
  });

  useEffect(() => {
    getVisitorStats().then((data) => setStats(data));
  }, []);

  const items = [
    { label: "Hari Ini", value: stats.today, icon: "today" },
    { label: "Kemarin", value: stats.yesterday, icon: "history" },
    { label: "Bulan Ini", value: stats.month, icon: "calendar_month" },
    { label: "Total", value: stats.total, icon: "group" },
  ];

  return (
    <div className="lg:col-span-3">
      <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
        Statistik Pengunjung
      </h4>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between text-sm border-b border-white/5 pb-1.5">
            <span className="flex items-center gap-2 text-white/60">
              <span className="material-symbols-outlined text-base text-[#a3f69c]">{item.icon}</span>
              {item.label}
            </span>
            <span className="font-bold text-white">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const isLogin = pathname === "/login";
  const isAdmin = pathname.startsWith("/admin");

  if (isLogin || isAdmin) return null;

  return (
    <footer
      id="kontak"
      className="bg-[#111612] border-t border-white/5 text-white/80"
    >
      {/* Main Footer */}
      <div className="w-full max-w-7xl mx-auto px-6 pt-8 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* Brand Column */}
          <div className="lg:col-span-5 pr-4">
            <h3 className="font-serif text-xl font-bold text-[#a3f69c] mb-3">
              Desa Kedungdowo
            </h3>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Membangun desa tangguh melalui inovasi peternakan korporasi,
              pemberdayaan UMKM syariah, dan semangat gotong royong.
            </p>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span
                className="material-symbols-outlined text-[#a3f69c] text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                location_on
              </span>
              <span>Kec. Andong, Kab. Boyolali, Jawa Tengah 57384</span>
            </div>
          </div>

          {/* Statistik Pengunjung */}
          <FooterStats />

          {/* Contact Info */}
          <div className="lg:col-span-4">
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Kontak
            </h4>
            <div className="flex flex-col gap-2.5">
              <a
                href="https://wa.me/6281212474281"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/60 hover:text-[#a3f69c] transition-colors text-sm"
              >
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Desa
              </a>
              <a
                href="mailto:desa.kedungdowo@gmail.com"
                className="flex items-center gap-2 text-white/60 hover:text-[#a3f69c] transition-colors text-sm"
              >
                <span className="material-symbols-outlined text-lg">mail</span>
                kedungdowoandong@gmail.com
              </a>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <span className="material-symbols-outlined text-lg">
                  schedule
                </span>
                Sen - Jum, 08:00 - 15:00 WIB
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-4 text-center">
          <p className="text-white/60 text-xs">
            © {new Date().getFullYear()} Pemerintah Desa Kedungdowo. 
          </p>
          <p className="text-white/60 text-xs mt-1">
            Made With ❤️ by Mahasiswa KKN UNDIP TIM II 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
