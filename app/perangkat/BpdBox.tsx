"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Icon from "../components/Icon";
import { AnimatePresence, motion } from "framer-motion";

export default function BpdBox({ bpdMembers }: { bpdMembers: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const ketua = bpdMembers.find(m => m.jabatan === "Ketua");
  const wakil = bpdMembers.find(m => m.jabatan === "Wakil Ketua");
  const sekretaris = bpdMembers.find(m => m.jabatan === "Sekretaris");
  const bendahara = bpdMembers.find(m => m.jabatan === "Bendahara");
  const anggota = bpdMembers.filter(m => m.jabatan === "Anggota");

  const pengurus = [
    { title: "Wakil Ketua", member: wakil },
    { title: "Sekretaris", member: sekretaris },
    { title: "Bendahara", member: bendahara },
  ].filter(p => p.member);

  const MemberCard = ({ title, member }: { title: string, member?: any }) => (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="w-full aspect-[3/4] bg-gradient-to-br from-surface-container to-surface-variant flex items-center justify-center overflow-hidden">
        {member?.fotoUrl ? (
          <img src={member.fotoUrl} alt={member?.nama || title} className="w-full h-full object-cover" />
        ) : (
          <span className="material-symbols-outlined text-3xl md:text-5xl text-on-surface-variant/30" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
        )}
      </div>
      <div className="bg-[#1E5B94] text-white text-[10px] font-bold uppercase tracking-widest py-1.5">
        {title}
      </div>
      <div className="py-3 px-3">
        <p className="font-bold text-on-surface text-sm">{member?.nama || "—"}</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Trigger Box di Bagan Organisasi */}
      <div 
        className="w-[180px] h-[306px] flex flex-col items-center justify-center rounded-lg border-2 border-[#1E5B94] shadow-md bg-white cursor-pointer hover:bg-blue-50 transition-all group relative overflow-hidden"
        onClick={() => setIsOpen(true)}
      >
        <div className="absolute inset-0 bg-[#1E5B94]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="text-[#1E5B94] font-bold text-2xl md:text-3xl tracking-widest relative z-10 group-hover:scale-110 transition-transform">BPD</span>
        <span className="text-xs font-medium text-[#1E5B94] mt-2 relative z-10 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          Lihat Anggota <Icon name="touch_app" className="text-[14px]" />
        </span>
      </div>

      {/* Full-Page Overlay di-render di luar hirarki DOM bagan agar tidak terkena efek scale (Portal) */}
      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-4 md:p-6 overflow-hidden"
              onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-background w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden relative"
              >
                {/* Header Modal */}
                <div className="bg-[#1E5B94] px-6 py-5 flex items-center justify-between shrink-0">
                  <div>
                    <h2 className="font-serif text-xl md:text-2xl font-bold text-white">
                      Badan Permusyawaratan Desa
                    </h2>
                    <p className="text-white/70 text-xs md:text-sm mt-0.5">
                      Struktur Keanggotaan BPD
                    </p>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="min-h-[44px] py-2 px-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 transition-colors text-white cursor-pointer"
                  >
                    <Icon name="close" />
                  </button>
                </div>

                {/* Content Modal (Scrollable) */}
                <div className="overflow-y-auto p-4 md:p-6 md:p-4 md:p-10 flex-grow bg-surface-container-lowest custom-scrollbar">
                  {bpdMembers.length === 0 ? (
                    <div className="text-center py-20 text-on-surface-variant">
                      <Icon name="info" className="text-3xl md:text-5xl mb-3 opacity-40" />
                      <p className="font-medium text-lg">Data anggota BPD belum tersedia.</p>
                      <p className="text-sm text-on-surface-variant/60 mt-1">Silakan tambahkan data melalui halaman Admin.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-10 md:gap-12 max-w-4xl mx-auto">
                      {/* Ketua */}
                      {ketua && (
                        <div className="flex justify-center">
                          <div className="w-full max-w-[220px]">
                            <MemberCard title="Ketua BPD" member={ketua} />
                          </div>
                        </div>
                      )}

                      {/* Pengurus */}
                      {pengurus.length > 0 && (
                        <div>
                          <div className="text-center mb-5">
                            <span className="inline-block px-5 py-1.5 rounded-full bg-surface-variant text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">
                              Pengurus
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
                            {pengurus.map(({ title, member }) => (
                              <MemberCard key={title} title={title} member={member} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Anggota */}
                      {anggota.length > 0 && (
                        <div>
                          <div className="text-center mb-5">
                            <span className="inline-block px-5 py-1.5 rounded-full bg-surface-variant text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">
                              Anggota
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
                            {anggota.map(a => (
                              <MemberCard key={a.id} title="Anggota BPD" member={a} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
