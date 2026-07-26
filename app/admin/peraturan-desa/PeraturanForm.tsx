"use client";

import { useState } from "react";
import { tambahPeraturan, editPeraturan } from "@/app/actions/peraturan";
import Icon from "@/app/components/Icon";
import { AnimatePresence, motion } from "framer-motion";

interface PeraturanFormProps {
  initialData?: any;
}

export default function PeraturanForm({ initialData }: PeraturanFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      let res;
      if (initialData) {
        res = await editPeraturan(formData, initialData.id);
      } else {
        res = await tambahPeraturan(formData);
      }

      if (res.success) {
        setMessage({ type: "success", text: initialData ? "Peraturan berhasil diubah!" : "Peraturan berhasil ditambahkan!" });
        if (!initialData) (e.target as HTMLFormElement).reset();
        
        // Tutup modal secara otomatis setelah 2 detik
        setTimeout(() => {
          setIsOpen(false);
          setMessage(null);
        }, 2000);
      } else {
        setMessage({ type: "error", text: res.error || "Gagal menyimpan data." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Terjadi kesalahan." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* Tombol Pemicu Modal */}
      {initialData ? (
        <button onClick={() => setIsOpen(true)} className="min-h-[44px] py-2 px-4 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
          title="Edit"
        >
          <Icon name="edit" className="text-[18px]" />
        </button>
      ) : (
        <button onClick={() => setIsOpen(true)} className="min-h-[44px] py-2 px-4 h-12 px-6 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary/90 hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Icon name="add" className="text-xl" />
          Tambah Peraturan Baru
        </button>
      )}

      {/* Modal Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-4 md:p-6 overflow-hidden"
            onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden relative"
            >
              {/* Header Modal */}
              <div className="px-6 md:px-8 py-5 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-lowest shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Icon name={initialData ? "edit" : "add_circle"} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-on-surface font-serif">{initialData ? "Edit Peraturan" : "Tambah Peraturan"}</h2>
                    <p className="text-xs text-on-surface-variant mt-0.5">{initialData ? "Ubah data dokumen peraturan ini" : "Unggah dokumen baru ke arsip JDIH"}</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="min-h-[44px] py-2 px-4 w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors"
                >
                  <Icon name="close" />
                </button>
              </div>

              {/* Body Modal (Scrollable) */}
              <div className="overflow-y-auto p-4 md:p-6 md:p-4 md:p-8 flex-grow custom-scrollbar">
                {message && (
                  <div className={`p-4 rounded-xl mb-6 text-sm flex items-start gap-2 ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    <Icon name={message.type === "success" ? "check_circle" : "error"} className="mt-0.5 text-lg" />
                    <p>{message.text}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  
                  {/* Row 1: Judul & Kategori */}
                  <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="judul" className="text-sm font-semibold text-on-surface">Judul Peraturan <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="judul"
                        id="judul"
                        required
                        defaultValue={initialData?.judul}
                        className="h-12 px-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="Contoh: Peraturan Desa tentang Pungutan Desa"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="kategori" className="text-sm font-semibold text-on-surface">Kategori <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <select
                          name="kategori"
                          id="kategori"
                          required
                          defaultValue={initialData?.kategori || "Peraturan Desa"}
                          className="w-full h-12 px-4 appearance-none rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
                        >
                          <option value="Peraturan Desa">Peraturan Desa</option>
                          <option value="Peraturan Kepala Desa">Peraturan Kepala Desa</option>
                          <option value="Keputusan Kepala Desa">Keputusan Kepala Desa</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                          <Icon name="expand_more" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Nomor & Tahun */}
                  <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="nomor" className="text-sm font-semibold text-on-surface">Nomor <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="nomor"
                        id="nomor"
                        required
                        defaultValue={initialData?.nomor}
                        className="h-12 px-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="Contoh: 01/PERDES/2026"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="tahun" className="text-sm font-semibold text-on-surface">Tahun <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="tahun"
                        id="tahun"
                        required
                        defaultValue={initialData?.tahun}
                        className="h-12 px-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="Contoh: 2026"
                      />
                    </div>
                  </div>

                  {/* Row 3: Isi Dokumen */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="isiDokumen" className="text-sm font-semibold text-on-surface">Isi Ringkas Peraturan <span className="text-red-500">*</span></label>
                    <textarea
                      name="isiDokumen"
                      id="isiDokumen"
                      required
                      defaultValue={initialData?.isiDokumen}
                      rows={4}
                      className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-y"
                      placeholder="Tuliskan penjelasan singkat mengenai isi peraturan ini..."
                    ></textarea>
                  </div>

                  {/* Row 4: File Upload */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="file" className="text-sm font-semibold text-on-surface">File PDF {initialData ? "(Opsional, isi jika ingin mengubah PDF)" : "(Maks. 5MB) *"} </label>
                    <input
                      type="file"
                      name="file"
                      id="file"
                      accept="application/pdf"
                      required={!initialData}
                      className="w-full text-sm text-on-surface-variant file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer border border-dashed border-outline-variant/40"
                    />
                  </div>

                  {/* Row 5: Lokasi Simpan & Jumlah FIsik */}
                  <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-outline-variant/20">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="lokasiSimpan" className="text-sm font-semibold text-on-surface">Lokasi Simpan Fisik <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="lokasiSimpan"
                        id="lokasiSimpan"
                        required
                        defaultValue={initialData?.lokasiSimpan}
                        className="h-12 px-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="Contoh: Lemari A Rak 2"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="jumlah" className="text-sm font-semibold text-on-surface">Jumlah Rangkap <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        name="jumlah"
                        id="jumlah"
                        min="1"
                        defaultValue={initialData?.jumlah || "1"}
                        required
                        className="h-12 px-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-3 shrink-0 pb-2">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="h-12 px-6 bg-surface-variant text-on-surface-variant font-bold rounded-xl hover:bg-outline-variant/30 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="h-12 px-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-md flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>sync</span>
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <Icon name="save" className="text-lg" />
                          Simpan
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
