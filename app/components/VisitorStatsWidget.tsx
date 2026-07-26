"use client";

import { useEffect, useState } from "react";
import { getVisitorStats } from "./footer-actions";
import Icon from "./Icon";
import AnimateIn from "./AnimateIn";

export default function VisitorStatsWidget() {
  const [stats, setStats] = useState({
    today: "0",
    yesterday: "0",
    month: "0",
    year: "0",
    total: "0",
  });

  useEffect(() => {
    getVisitorStats().then((data) => {
      setStats(data);
    });
  }, []);

  const statItems = [
    { label: "Hari Ini", value: stats.today, icon: "today" },
    { label: "Kemarin", value: stats.yesterday, icon: "history" },
    { label: "Bulan Ini", value: stats.month, icon: "calendar_month" },
    { label: "Tahun Ini", value: stats.year, icon: "date_range" },
    { label: "Total Kunjungan", value: stats.total, icon: "group" },
  ];

  return (
    <section className="py-16 md:py-20 bg-background relative overflow-hidden">
      {/* Subtle Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      <div className="w-full max-w-7xl mx-auto px-6 relative z-10">
        <AnimateIn delay={0.1} direction="up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl md:text-3xl md:text-2xl md:text-4xl font-bold text-primary mb-4">
              Statistik Kunjungan Website
            </h2>
            <p className="text-on-surface-variant text-base max-w-xl mx-auto leading-relaxed">
              Pantauan langsung jumlah kunjungan ke portal web resmi Desa Kedungdowo secara transparan dan berkala.
            </p>
          </div>
          
          <div className="bg-surface/60 backdrop-blur-2xl border border-outline-variant/30 rounded-[2rem] p-4 md:p-8 md:p-4 md:p-10 shadow-2xl shadow-primary/5">
            <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-5 gap-y-10 gap-x-4 md:gap-y-0 divide-y md:divide-y-0 md:divide-x divide-outline-variant/20">
              {statItems.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`flex flex-col items-center justify-center text-center px-4 group ${idx > 1 ? "pt-10 md:pt-0" : idx === 0 || idx === 1 ? "pt-0" : "pt-10 md:pt-0"}`}
                >
                  <div className="mb-5 text-primary/60 group-hover:text-secondary group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 ease-out">
                    <Icon name={item.icon} className="text-2xl md:text-4xl drop-shadow-sm" filled />
                  </div>
                  <h3 className="text-2xl md:text-3xl md:text-2xl md:text-4xl font-bold text-on-background mb-2 font-serif tracking-tight">
                    {item.value}
                  </h3>
                  <p className="text-xs font-bold text-on-surface-variant/80 uppercase tracking-widest">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
