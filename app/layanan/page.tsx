"use client";

import { useState, useEffect, useCallback } from "react";
import AnimateIn from "../components/AnimateIn";
import Icon from "../components/Icon";

// ========== TIPE DATA ==========
interface LayananItem {
  id: string;
  kategori: string;
  namaPemohon: string;
  perihal: string;
  tanggapan: string | null;
  status: string;
  createdAt: string;
}

// ========== HELPER: Samarkan Nama ==========
function samarkanNama(nama: string): string {
  const parts = nama.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 3) + "***";
  }
  const first = parts[0];
  const rest = parts
    .slice(1)
    .map((p) => p.charAt(0).toUpperCase() + "***")
    .join(" ");
  return `${first} ${rest}`;
}

const KATEGORI_OPTIONS = [
  "Permohonan Informasi Publik",
  "Pengaduan & Pelaporan",
  "Aspirasi & Usulan",
];

const INITIAL_FORM = {
  kategori: "",
  namaPemohon: "",
  kontak: "",
  perihal: "",
};

// ========== KOMPONEN UTAMA ==========
export default function LayananPage() {
  const [activeTab, setActiveTab] = useState<"form" | "data">("form");

  // --- State Form ---
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // --- State Tabel ---
  const [daftarLayanan, setDaftarLayanan] = useState<LayananItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  // --- State Modal ---
  const [selectedItem, setSelectedItem] = useState<LayananItem | null>(null);

  // --- State Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // --- State Search ---
  const [searchQuery, setSearchQuery] = useState("");

  // ========== HANDLER FORM ==========
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    let value = e.target.value;
    // Validasi input nomor WA: hanya boleh angka
    if (e.target.name === "kontak") {
      value = value.replace(/\D/g, "");
    }
    setFormData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/layanan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(data.message);
        setFormData(INITIAL_FORM);
      } else {
        setErrorMsg(data.message || "Terjadi kesalahan.");
      }
    } catch {
      setErrorMsg("Gagal menghubungi server. Periksa koneksi internet Anda.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========== FETCH DATA TABEL ==========
  const fetchData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const res = await fetch("/api/layanan");
      const json = await res.json();
      if (json.success) setDaftarLayanan(json.data);
    } catch {
      // Silently fail
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "data") {
      fetchData();
      setCurrentPage(1); // Reset page saat pindah ke tab data
    }
  }, [activeTab, fetchData]);

  // Clear messages automatically
  useEffect(() => {
    if (successMsg || errorMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg("");
        setErrorMsg("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg, errorMsg]);

  // Data yang ditampilkan untuk halaman aktif
  const filteredData = daftarLayanan.filter(item => 
    item.namaPemohon.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.perihal.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kategori.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ========== STYLE HELPERS ==========
  const inputClass =
    "w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200";

  const labelClass = "block text-sm font-semibold text-on-surface mb-2";

  // ========== RENDER ==========
  return (
    <main className="w-full relative">
      {/* ===== HERO ===== */}
      <section className="py-16 md:py-32 bg-surface relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#0d631b_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.03] pointer-events-none" />
        <div className="w-full max-w-7xl mx-auto px-6 relative z-10 text-center mt-12 md:mt-0">
          <AnimateIn delay={0.1} direction="up">
            <p className="text-xs font-medium text-primary tracking-[0.2em] uppercase mb-6 inline-block border-b-2 border-primary pb-2">
              Layanan Publik
            </p>
          </AnimateIn>
          <AnimateIn delay={0.2} direction="up">
            <h1 className="font-serif text-2xl md:text-4xl md:text-6xl font-bold text-on-surface mb-8 leading-tight tracking-tight">
              Pusat{" "}
              <span className="italic font-light text-primary">Layanan</span>
              <br />& Informasi Publik
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.3} direction="up">
            <p className="text-lg md:text-xl text-on-surface-variant max-w-3xl mx-auto font-light leading-relaxed">
              Sampaikan pengaduan, permohonan surat, atau pertanyaan seputar
              layanan desa. Pantau status permohonan Anda secara transparan.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* ===== KONTEN UTAMA ===== */}
      <section className="py-16 md:py-24 bg-surface-container-low relative">
        <div className="w-full max-w-7xl mx-auto px-6">
          <AnimateIn delay={0.1} direction="up">
            {/* --- TAB NAVIGASI --- */}
            <div className="flex bg-surface-container rounded-2xl p-1.5 mb-8 border border-outline-variant/30">
              <button
                onClick={() => setActiveTab("form")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === "form"
                    ? "bg-surface-container-lowest text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <Icon name="edit_note" className="text-lg" />
                Isi Formulir
              </button>
              <button
                onClick={() => setActiveTab("data")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === "data"
                    ? "bg-surface-container-lowest text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <Icon name="list_alt" className="text-lg" />
                Daftar Permohonan
              </button>
            </div>

            {/* ======================= */}
            {/* TAB 1: ISI FORMULIR     */}
            {/* ======================= */}
            {activeTab === "form" && (
              <div className="bg-surface-container-lowest rounded-3xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] border border-outline/20 overflow-hidden">
                <div className="relative overflow-hidden bg-gradient-to-br from-primary via-[#0f7a24] to-primary-container px-8 py-8 md:px-10 md:py-10">
                  {/* Dekorasi Background */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-y-1/3 pointer-events-none"></div>
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)] skew-x-12 opacity-50 pointer-events-none"></div>
                  
                  <div className="relative z-10 flex flex-col sm:flex-col md:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
                        <Icon
                          name="description"
                          className="text-2xl md:text-3xl text-white drop-shadow-md"
                        />
                      </div>
                      <div>
                        <h2 className="text-white font-serif text-2xl md:text-2xl md:text-3xl font-bold tracking-tight">
                          Formulir Layanan
                        </h2>
                        <p className="text-white/80 text-sm mt-1.5 font-medium">
                          Desa Kedungdowo, Kec. Andong, Kab. Boyolali
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 md:p-8 md:p-4 md:p-10">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="kategori" className={labelClass}>
                        Kategori Layanan
                      </label>
                      <div className="relative">
                        <select
                          id="kategori"
                          name="kategori"
                          value={formData.kategori}
                          onChange={handleChange}
                          required
                          className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                        >
                          <option value="" disabled>Pilih kategori layanan</option>
                          {KATEGORI_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <Icon name="expand_more" className="absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="namaPemohon" className={labelClass}>
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          id="namaPemohon"
                          name="namaPemohon"
                          value={formData.namaPemohon}
                          onChange={handleChange}
                          placeholder="Masukkan nama lengkap"
                          required
                          maxLength={50}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="kontak" className={labelClass}>
                          Nomor WhatsApp
                        </label>
                        <input
                          type="tel"
                          id="kontak"
                          name="kontak"
                          value={formData.kontak}
                          onChange={handleChange}
                          placeholder="Contoh: 08123456789"
                          required
                          maxLength={15}
                          minLength={9}
                          inputMode="numeric"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="perihal" className={labelClass}>
                        Perihal / Keterangan
                      </label>
                      <textarea
                        id="perihal"
                        name="perihal"
                        value={formData.perihal}
                        onChange={handleChange}
                        placeholder="Jelaskan secara singkat keperluan atau isi pengaduan Anda..."
                        required
                        maxLength={500}
                        rows={4}
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-surface-container rounded-xl border border-outline-variant/30">
                      <Icon name="info" className="text-primary text-lg shrink-0 mt-0.5" />
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        Data Anda akan ditangani secara rahasia oleh perangkat
                        desa. Nomor WhatsApp <strong>tidak ditampilkan</strong>{" "}
                        di halaman publik demi keamanan privasi.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-primary text-on-primary font-semibold text-sm rounded-xl hover:bg-primary-container active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Mengirim...</span>
                        </>
                      ) : (
                        <>
                          <Icon name="send" className="text-base" />
                          <span>Kirim Permohonan</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ================================ */}
            {/* TAB 2: DAFTAR PERMOHONAN PUBLIK  */}
            {/* ================================ */}
            {activeTab === "data" && (
              <div className="bg-surface-container-lowest rounded-3xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] border border-outline/20 overflow-hidden">
                <div className="relative overflow-hidden bg-gradient-to-br from-primary via-[#0f7a24] to-primary-container px-8 py-8 md:px-10 md:py-10 flex flex-col sm:flex-col md:flex-row sm:items-center justify-between gap-6">
                  {/* Dekorasi Background */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-y-1/3 pointer-events-none"></div>
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)] skew-x-12 opacity-50 pointer-events-none"></div>
                  
                  <div className="relative z-10 flex items-center gap-5">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
                      <Icon name="fact_check" className="text-2xl md:text-3xl text-white drop-shadow-md" />
                    </div>
                    <div>
                      <h2 className="text-white font-serif text-2xl md:text-2xl md:text-3xl font-bold tracking-tight">
                        Daftar Permohonan
                      </h2>
                      <p className="text-white/80 text-sm mt-1.5 font-medium">
                        Pantau status layanan secara transparan
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={fetchData}
                    disabled={isLoadingData}
                    className="relative z-10 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/25 transition-all duration-300 border border-white/20 disabled:opacity-50 shadow-sm backdrop-blur-md hover:scale-105 active:scale-95 shrink-0"
                    title="Muat ulang data"
                  >
                    <Icon name="refresh" className={`text-white text-2xl ${isLoadingData ? "animate-spin" : ""}`} />
                  </button>
                </div>

                <div className="p-4 md:p-6 md:p-4 md:p-8">
                  {/* --- Kotak Pencarian --- */}
                  <div className="mb-6 relative">
                    <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                    <input
                      type="text"
                      placeholder="Cari permohonan berdasarkan nama, perihal, atau kategori..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    />
                  </div>

                  {isLoadingData ? (
                    <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant">
                      <svg className="animate-spin h-8 w-8 mb-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <p className="text-sm">Memuat data...</p>
                    </div>
                  ) : filteredData.length === 0 ? (
                    <div className="text-center py-16">
                      <Icon name="inbox" className="text-3xl md:text-5xl text-outline/30 mb-4" />
                      <p className="text-sm text-on-surface-variant">
                        {searchQuery ? "Tidak ada permohonan yang sesuai pencarian." : "Belum ada data permohonan."}
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Tabel Desktop */}
                      <div className="w-full overflow-x-auto whitespace-nowrap scrollbar-hide">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b-2 border-outline/20">
                              <th className="text-left py-3 px-4 text-xs font-semibold text-outline uppercase tracking-wider">Tanggal</th>
                              <th className="text-left py-3 px-4 text-xs font-semibold text-outline uppercase tracking-wider">Nama</th>
                              <th className="text-left py-3 px-4 text-xs font-semibold text-outline uppercase tracking-wider">Perihal</th>
                              <th className="text-center py-3 px-4 text-xs font-semibold text-outline uppercase tracking-wider">Status</th>
                              <th className="text-center py-3 px-4 text-xs font-semibold text-outline uppercase tracking-wider">Aksi</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentData.map((item, idx) => (
                              <tr
                                key={item.id}
                                className={`border-b border-outline/10 hover:bg-surface-container/30 transition-colors ${
                                  idx % 2 === 0 ? "" : "bg-surface-container/10"
                                }`}
                              >
                                <td className="py-4 px-4 text-on-surface-variant whitespace-nowrap align-top">
                                  {new Date(item.createdAt).toLocaleDateString("id-ID", {
                                    day: "numeric", month: "short", year: "numeric",
                                  })}
                                </td>
                                <td className="py-4 px-4 font-medium text-on-surface align-top">
                                  {samarkanNama(item.namaPemohon)}
                                  <div className="mt-1">
                                    <span className="inline-block text-[10px] uppercase font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                                      {item.kategori}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-4 px-4 text-on-surface-variant max-w-[250px] align-top">
                                  <p className="line-clamp-2 leading-relaxed text-sm mb-1">{item.perihal}</p>
                                  {item.tanggapan && (
                                    <div className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1">
                                      <Icon name="check" className="text-[12px]" /> Ada Tanggapan
                                    </div>
                                  )}
                                </td>
                                <td className="py-4 px-4 text-center align-top">
                                  <StatusBadge status={item.status} />
                                </td>
                                <td className="py-4 px-4 text-center align-top">
                                  <button onClick={() => setSelectedItem(item)} className="min-h-[44px] py-2 px-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-xs font-semibold text-on-surface"
                                  >
                                    <Icon name="visibility" className="text-[14px]" /> Lihat Detail
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Card Layout Mobile */}
                      <div className="md:hidden space-y-4">
                        {currentData.map((item) => (
                          <div
                            key={item.id}
                            className="bg-surface rounded-2xl border border-outline/15 p-5 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-outline">
                                {new Date(item.createdAt).toLocaleDateString("id-ID", {
                                  day: "numeric", month: "long", year: "numeric",
                                })}
                              </span>
                              <StatusBadge status={item.status} />
                            </div>
                            <p className="font-semibold text-on-surface text-sm">
                              {samarkanNama(item.namaPemohon)}
                            </p>
                            <div>
                              <span className="inline-block text-[10px] bg-surface-container text-on-surface-variant px-2 py-0.5 uppercase font-bold rounded">
                                {item.kategori}
                              </span>
                            </div>
                            <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2">
                              {item.perihal}
                            </p>
                            {item.tanggapan && (
                              <div className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                <Icon name="check" className="text-[12px]" /> Sudah ditanggapi
                              </div>
                            )}
                            <div className="pt-2 border-t border-outline/10 mt-2">
                              <button onClick={() => setSelectedItem(item)} className="min-h-[44px] py-2 px-4 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-xs font-semibold text-on-surface"
                              >
                                <Icon name="visibility" className="text-[14px]" /> Baca Selengkapnya
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pagination Controls (Selalu Tampil) */}
                      <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-outline/10 overflow-x-auto pb-2">
                          <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold border border-outline/20 text-on-surface-variant hover:bg-surface-container disabled:opacity-50 transition-colors"
                          >
                            <Icon name="chevron_left" className="text-lg" /> Sebelumnya
                          </button>

                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                            (page) => (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all shrink-0 ${
                                  currentPage === page
                                    ? "bg-primary text-on-primary shadow-sm"
                                    : "border border-outline/20 text-on-surface-variant hover:bg-surface-container"
                                }`}
                              >
                                {page}
                              </button>
                            )
                          )}

                          <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold border border-outline/20 text-on-surface-variant hover:bg-surface-container disabled:opacity-50 transition-colors"
                          >
                            Selanjutnya <Icon name="chevron_right" className="text-lg" />
                          </button>
                        </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </AnimateIn>

          <AnimateIn delay={0.2} direction="up">
            <div className="mt-10 text-center">
              <p className="text-sm text-on-surface-variant leading-relaxed max-w-lg mx-auto">
                Butuh bantuan lebih lanjut? Hubungi Balai Desa Kedungdowo pada
                jam kerja (Senin–Jumat, 08.00–15.00 WIB) atau gunakan Asisten
                Desa di pojok kanan bawah layar.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ========== MODAL POPUP (BACA DETAIL) ========== */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-lowest">
              <h3 className="font-serif text-xl font-bold text-on-surface flex items-center gap-2">
                <Icon name="description" className="text-primary" /> Detail Laporan
              </h3>
              <button onClick={() => setSelectedItem(null)} className="min-h-[44px] py-2 px-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"
              >
                <Icon name="close" className="text-xl" />
              </button>
            </div>

            <div className="p-4 md:p-6 overflow-y-auto space-y-6 bg-surface-container-lowest flex-1">
              <div className="bg-surface-container/30 rounded-2xl p-5 border border-outline-variant/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-outline mb-1">Nama Pemohon</p>
                    <p className="font-medium text-on-surface text-sm">{samarkanNama(selectedItem.namaPemohon)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-outline mb-1">Status</p>
                    <StatusBadge status={selectedItem.status} />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-outline mb-1">Kategori</p>
                    <span className="inline-block text-[11px] font-bold uppercase text-on-surface-variant bg-white px-2 py-0.5 rounded shadow-sm border border-outline-variant/10">
                      {selectedItem.kategori}
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-outline mb-1">Tanggal Masuk</p>
                    <p className="text-sm text-on-surface-variant">
                      {new Date(selectedItem.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric", month: "long", year: "numeric"
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-outline mb-2 ml-1">Perihal / Keterangan</p>
                <div className="bg-white rounded-2xl p-5 border border-outline-variant/20 shadow-sm text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
                  {selectedItem.perihal}
                </div>
              </div>

              {selectedItem.tanggapan && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1 mb-2 ml-1">
                    <Icon name="reply" className="text-[14px]" /> Tanggapan Desa
                  </p>
                  <div className="bg-primary/5 rounded-2xl p-5 border border-primary/20 shadow-sm text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
                    {selectedItem.tanggapan}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-outline-variant/20 bg-surface-container-low flex justify-end">
              <button onClick={() => setSelectedItem(null)} className="min-h-[44px] py-2 px-4 px-6 py-2 rounded-xl text-sm font-semibold bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {(successMsg || errorMsg) && (
        <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          {successMsg && (
            <div className="flex items-start gap-3 p-4 bg-white border border-primary/20 rounded-2xl shadow-xl min-w-[300px] max-w-[400px]">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Icon name="check_circle" className="text-primary text-xl" />
              </div>
              <div className="flex-1 pt-0.5">
                <p className="font-semibold text-primary text-sm mb-1">Berhasil Terkirim!</p>
                <p className="text-sm text-on-surface-variant leading-relaxed">{successMsg}</p>
              </div>
              <button onClick={() => setSuccessMsg("")} className="min-h-[44px] py-2 px-4 text-outline hover:text-on-surface p-1">
                <Icon name="close" className="text-xl" />
              </button>
            </div>
          )}
          {errorMsg && (
            <div className="flex items-start gap-3 p-4 bg-white border border-error/20 rounded-2xl shadow-xl min-w-[300px] max-w-[400px]">
              <div className="w-10 h-10 bg-error/10 rounded-xl flex items-center justify-center shrink-0">
                <Icon name="error" className="text-error text-xl" />
              </div>
              <div className="flex-1 pt-0.5">
                <p className="font-semibold text-error text-sm mb-1">Gagal Mengirim</p>
                <p className="text-sm text-on-surface-variant leading-relaxed">{errorMsg}</p>
              </div>
              <button onClick={() => setErrorMsg("")} className="min-h-[44px] py-2 px-4 text-outline hover:text-on-surface p-1">
                <Icon name="close" className="text-xl" />
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

// ========== SUB-KOMPONEN: Badge Status ==========
function StatusBadge({ status }: { status: string }) {
  const lower = status.toLowerCase();
  const isSudah = lower.includes("sudah");

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap ${
        isSudah
          ? "bg-primary text-on-primary"
          : "bg-orange-500 text-white"
      }`}
    >
      {isSudah && <Icon name="check_circle" className="text-[12px]" />}
      {status}
    </span>
  );
}
