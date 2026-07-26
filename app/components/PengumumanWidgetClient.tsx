"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "./Icon";

interface Pengumuman {
  id: number;
  judul: string;
  konten: string;
  createdAt: Date | string;
}

interface Props {
  pengumumanList: Pengumuman[];
}

export default function PengumumanWidgetClient({ pengumumanList }: Props) {
  const [selected, setSelected] = useState<Pengumuman | null>(null);

  // Mencegah scroll pada body saat modal terbuka
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selected]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div className="relative border-l border-outline-variant ml-3 space-y-6 overflow-y-auto flex-grow max-h-[500px] pr-2 scrollbar-thin">
        {pengumumanList.length > 0 ? (
          pengumumanList.map((pengumuman) => (
            <div key={pengumuman.id} className="relative pl-6 group/item">
              <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-outline ring-4 ring-surface-container-lowest group-hover/item:bg-primary transition-colors"></div>
              <div className="text-xs mb-1 text-on-surface-variant font-medium">
                {new Date(pengumuman.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <h4
                onClick={() => setSelected(pengumuman)}
                className="text-sm font-semibold text-on-surface leading-snug hover:text-primary cursor-pointer transition-colors group-hover/item:text-primary decoration-primary hover:underline underline-offset-4"
              >
                {pengumuman.judul}
              </h4>
              <p className="text-xs font-medium text-on-surface-variant mt-1 line-clamp-2">
                {pengumuman.konten}
              </p>
            </div>
          ))
        ) : (
          <div className="relative pl-6">
            <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-outline ring-4 ring-surface-container-lowest"></div>
            <p className="text-sm text-on-surface-variant italic">
              Belum ada pengumuman saat ini.
            </p>
          </div>
        )}
      </div>

      {/* AJAX Popup Modal */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-2xl p-4 md:p-6 md:p-4 md:p-8 overflow-hidden z-10 flex flex-col"
            >
              {/* Close Button Top Right */}
              <button onClick={() => setSelected(null)} className="min-h-[44px] py-2 px-4 absolute top-4 right-4 text-on-surface-variant hover:text-primary hover:bg-surface-container p-2 rounded-full transition-all duration-200"
                aria-label="Tutup"
              >
                <Icon name="close" className="text-xl" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <span className="bg-secondary-container text-on-secondary-container text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Icon name="campaign" className="text-sm" filled /> Pengumuman Penting
                </span>
                <span className="text-xs text-on-surface-variant font-medium">
                  {new Date(selected.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              <h3 className="font-serif text-xl md:text-2xl font-bold text-on-surface mb-4 leading-snug">
                {selected.judul}
              </h3>

              <div className="h-px bg-outline-variant/30 mb-4" />

              <div className="overflow-y-auto max-h-[300px] pr-2 scrollbar-thin text-sm md:text-base text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                {selected.konten}
              </div>

              <div className="mt-6 flex justify-end">
                <button onClick={() => setSelected(null)} className="min-h-[44px] py-2 px-4 bg-primary text-on-primary hover:bg-primary/90 text-sm font-semibold px-5 h-[40px] rounded-lg shadow-sm transition-colors"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
