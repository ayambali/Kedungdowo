"use client";

import { useState } from "react";
import Icon from "../../components/Icon";
import { createBerita, updateBerita, deleteBerita, toggleSorotanUtama } from "./actions";

type EditorBlok = {
  id: string; // client-side ID for React key
  tipe: "teks" | "gambar";
  konten: string;
  caption: string;
  file?: File | null; // for new image uploads
};

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export default function BeritaClient({ initialData }: { initialData: any[] }) {
  const [data, setData] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<"Semua" | "Berita" | "Pengumuman">("Semua");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // Custom Toast State
  const [toastState, setToastState] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error";
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  // Custom Confirm Dialog State
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    judul: "",
    kategori: "Berita",
    fotoUrl: "",
  });
  const [file, setFile] = useState<File | null>(null);

  // Block editor state
  const [bloks, setBloks] = useState<EditorBlok[]>([]);

  // Helper to trigger custom toasts
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToastState({ isOpen: true, message, type });
    setTimeout(() => {
      setToastState((prev) => ({ ...prev, isOpen: false }));
    }, 4000);
  };

  const handleOpenNew = (defaultCategory: string) => {
    setEditingId(null);
    setFormData({ judul: "", kategori: defaultCategory, fotoUrl: "" });
    setFile(null);
    setBloks([{ id: generateId(), tipe: "teks", konten: "", caption: "" }]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      judul: item.judul,
      kategori: item.kategori,
      fotoUrl: item.fotoUrl || "",
    });
    setFile(null);

    // Load existing bloks or convert legacy content
    if (item.bloks && item.bloks.length > 0) {
      setBloks(item.bloks.map((b: any) => ({
        id: generateId(),
        tipe: b.tipe as "teks" | "gambar",
        konten: b.konten,
        caption: b.caption || "",
        file: null,
      })));
    } else {
      // Legacy: convert old single content to a text block
      const legacyBloks: EditorBlok[] = [];
      if (item.fotoUrl) {
        legacyBloks.push({ id: generateId(), tipe: "gambar", konten: item.fotoUrl, caption: "" });
      }
      if (item.konten) {
        legacyBloks.push({ id: generateId(), tipe: "teks", konten: item.konten, caption: "" });
      }
      if (legacyBloks.length === 0) {
        legacyBloks.push({ id: generateId(), tipe: "teks", konten: "", caption: "" });
      }
      setBloks(legacyBloks);
    }
    setIsModalOpen(true);
  };

  // Block manipulation helpers
  const addBlok = (tipe: "teks" | "gambar") => {
    setBloks([...bloks, { id: generateId(), tipe, konten: "", caption: "" }]);
  };

  const removeBlok = (index: number) => {
    if (bloks.length <= 1) {
      showToast("Artikel harus memiliki minimal 1 blok konten.", "error");
      return;
    }
    setBloks(bloks.filter((_, i) => i !== index));
  };

  const moveBlok = (index: number, direction: "up" | "down") => {
    const newBloks = [...bloks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBloks.length) return;
    [newBloks[index], newBloks[targetIndex]] = [newBloks[targetIndex], newBloks[index]];
    setBloks(newBloks);
  };

  const updateBlok = (index: number, field: keyof EditorBlok, value: any) => {
    const newBloks = [...bloks];
    (newBloks[index] as any)[field] = value;
    setBloks(newBloks);
  };

  const handleDeleteClick = (id: number) => {
    setConfirmState({
      isOpen: true,
      title: "Konfirmasi Hapus",
      message: "Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini akan menghapusnya secara permanen dari website.",
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          await deleteBerita(id);
          setData((prev) => prev.filter((item) => item.id !== id));
          
          // Reset current page if pagination bounds exceed after deletion
          const newTotalItems = data.length - 1;
          const newTotalPages = Math.ceil(newTotalItems / itemsPerPage) || 1;
          if (currentPage > newTotalPages) {
            setCurrentPage(newTotalPages);
          }
          
          showToast("Artikel berhasil dihapus!", "success");
        } catch (error) {
          showToast("Gagal menghapus artikel.", "error");
        } finally {
          setIsDeleting(false);
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleToggleSorotan = async (id: number, currentStatus: boolean) => {
    try {
      await toggleSorotanUtama(id, currentStatus);
      setData(data.map((item) => {
        if (item.id === id) {
          return { ...item, isSorotan: !currentStatus };
        }
        return { ...item, isSorotan: false };
      }));
      showToast(currentStatus ? "Dihapus dari sorotan utama." : "Jadikan sorotan utama berhasil!", "success");
    } catch (error) {
      showToast("Gagal memperbarui sorotan utama.", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Form validation
    if (!formData.judul.trim()) {
      showToast("Judul wajib diisi!", "error");
      setIsLoading(false);
      return;
    }
    
    const hasContent = bloks.some(b => b.konten.trim() || b.file);
    if (!hasContent) {
      showToast("Konten wajib diisi! Tambahkan minimal 1 blok dengan isi.", "error");
      setIsLoading(false);
      return;
    }

    try {
      // Upload hero/thumbnail image if present
      let finalFotoUrl = formData.fotoUrl;
      if (file) {
        const uploadData = new FormData();
        uploadData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: uploadData });
        if (res.ok) {
          const result = await res.json();
          finalFotoUrl = result.url;
        } else {
          showToast("Gagal mengunggah gambar thumbnail.", "error");
          setIsLoading(false);
          return;
        }
      }

      // Upload images in bloks that have files
      const processedBloks = [];
      for (let i = 0; i < bloks.length; i++) {
        const b = bloks[i];
        if (b.tipe === "gambar" && b.file) {
          const uploadData = new FormData();
          uploadData.append("file", b.file);
          const res = await fetch("/api/upload", { method: "POST", body: uploadData });
          if (res.ok) {
            const result = await res.json();
            processedBloks.push({
              tipe: b.tipe,
              konten: result.url,
              caption: b.caption || undefined,
              urutan: i,
            });
          } else {
            showToast(`Gagal mengunggah gambar blok #${i + 1}.`, "error");
            setIsLoading(false);
            return;
          }
        } else if (b.konten.trim()) {
          processedBloks.push({
            tipe: b.tipe,
            konten: b.konten,
            caption: b.caption || undefined,
            urutan: i,
          });
        }
      }

      // Build konten fallback from text bloks
      const kontenFallback = processedBloks
        .filter(b => b.tipe === "teks")
        .map(b => b.konten)
        .join("\n\n");

      const payload = {
        judul: formData.judul,
        kategori: formData.kategori,
        konten: kontenFallback || "(konten blok)",
        fotoUrl: finalFotoUrl,
        bloks: processedBloks,
      };

      if (editingId) {
        await updateBerita(editingId, payload);
        showToast("Perubahan berhasil disimpan!", "success");
        setTimeout(() => window.location.reload(), 800);
      } else {
        await createBerita(payload);
        showToast("Artikel berhasil diterbitkan!", "success");
        setTimeout(() => window.location.reload(), 800);
      }
      setIsModalOpen(false);
    } catch (error) {
      showToast("Gagal menyimpan artikel.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter news articles based on search term AND category tab
  const filteredData = data.filter((item) => {
    // 1. Search term match
    const matchesSearch = 
      item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.konten.toLowerCase().includes(searchTerm.toLowerCase());
      
    // 2. Category filter match
    let matchesCategory = true;
    if (filterCategory === "Berita") {
      matchesCategory = item.kategori !== "Pengumuman";
    } else if (filterCategory === "Pengumuman") {
      matchesCategory = item.kategori === "Pengumuman";
    }
    
    return matchesSearch && matchesCategory;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  const startEntry = filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, filteredData.length);

  return (
    <>
      {/* Search, Filter, and Add Buttons Panel */}
      <div className="mb-6 flex flex-col lg:flex-col md:flex-row justify-between items-start lg:items-center bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 shadow-sm gap-4">
        {/* Left: Search & Filter Segment */}
        <div className="flex flex-col sm:flex-col md:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg" />
            <input 
              type="text" 
              placeholder="Cari berita / pengumuman..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset page on search
              }}
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          
          {/* Filter segment tabs */}
          <div className="flex bg-surface-container-low border border-outline-variant/40 p-1 rounded-lg self-start sm:self-auto shrink-0">
            {(["Semua", "Berita", "Pengumuman"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setFilterCategory(cat);
                  setCurrentPage(1); // Reset page on filter change
                }}
                className={`px-3.5 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${
                  filterCategory === cat 
                    ? "bg-white text-primary shadow-sm" 
                    : "text-on-surface-variant/70 hover:text-on-surface"
                }`}
              >
                {cat === "Berita" ? "Berita & Kegiatan" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Add Buttons */}
        <div className="flex gap-3 w-full lg:w-auto flex-wrap justify-end">
          <button onClick={() => handleOpenNew("Berita")} className="min-h-[44px] py-2 px-4 flex-grow sm:flex-grow-0 bg-primary text-on-primary px-4 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-surface-tint transition-all duration-300 shadow-sm active:scale-95"
          >
            <Icon name="add" className="text-base" /> Tambah Berita
          </button>
          <button onClick={() => handleOpenNew("Pengumuman")} className="min-h-[44px] py-2 px-4 flex-grow sm:flex-grow-0 bg-secondary-container text-on-secondary-container border border-outline-variant/30 px-4 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all duration-300 shadow-sm active:scale-95"
          >
            <Icon name="campaign" className="text-base" /> Tambah Pengumuman
          </button>
        </div>
      </div>

      {/* Table List */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden overflow-x-auto whitespace-nowrap scrollbar-hide">
        <table className="w-full text-left text-sm text-on-surface">
          <thead className="bg-surface-container-low text-on-surface-variant border-b border-outline-variant/20">
            <tr>
              <th className="px-6 py-4 font-semibold">Judul</th>
              <th className="px-6 py-4 font-semibold">Kategori</th>
              <th className="px-6 py-4 font-semibold text-center">Sorotan</th>
              <th className="px-6 py-4 font-semibold">Tanggal</th>
              <th className="px-6 py-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">
                  {searchTerm ? "Tidak menemukan hasil pencarian." : "Belum ada berita atau pengumuman."}
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr key={item.id} className="border-b border-outline-variant/10 hover:bg-surface-container-lowest/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-on-background max-w-sm truncate" title={item.judul}>{item.judul}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                      item.kategori === "Pengumuman" 
                        ? "bg-secondary-container text-on-secondary-container border border-secondary/10" 
                        : "bg-surface-variant text-on-surface-variant"
                    }`}>
                      {item.kategori}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.kategori !== "Pengumuman" ? (
                      <button
                        onClick={() => handleToggleSorotan(item.id, !!item.isSorotan)}
                        className={`p-1.5 rounded-full hover:bg-surface-variant/50 transition-colors ${
                          item.isSorotan ? "text-amber-500 hover:text-amber-600" : "text-on-surface-variant/30 hover:text-on-surface-variant"
                        }`}
                        title={item.isSorotan ? "Batal jadikan sorotan utama" : "Jadikan sorotan utama"}
                      >
                        <Icon name={item.isSorotan ? "star" : "star_border"} className="text-xl" filled={item.isSorotan} />
                      </button>
                    ) : (
                      <span className="text-[10px] text-on-surface-variant/40 italic">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpenEdit(item)} className="min-h-[44px] py-2 px-4 p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-md transition-colors">
                        <Icon name="edit" className="text-lg" />
                      </button>
                      <button onClick={() => handleDeleteClick(item.id)} className="min-h-[44px] py-2 px-4 p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-md transition-colors">
                        <Icon name="delete" className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {filteredData.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-col md:flex-row justify-between items-center bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 shadow-sm gap-4 text-xs font-semibold text-on-surface-variant">
          <div>
            Menampilkan <span className="font-bold text-on-surface">{startEntry}</span> - <span className="font-bold text-on-surface">{endEntry}</span> dari <span className="font-bold text-on-surface">{filteredData.length}</span> artikel
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 rounded-lg border border-outline-variant/30 hover:bg-surface-container-low transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <Icon name="chevron_left" className="text-sm" /> Prev
            </button>
            
            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg font-bold transition-all ${
                    currentPage === page 
                      ? "bg-primary text-on-primary shadow-sm" 
                      : "border border-outline-variant/30 hover:bg-surface-container-low"
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1.5 rounded-lg border border-outline-variant/30 hover:bg-surface-container-low transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Next <Icon name="chevron_right" className="text-sm" />
            </button>
          </div>
        </div>
      )}

      {/* Modal Dialog Form — Block Editor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="p-4 md:p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low/30">
              <h2 className="font-serif text-lg font-bold">
                {editingId 
                  ? (formData.kategori === "Pengumuman" ? "Edit Pengumuman" : "Edit Berita / Kegiatan") 
                  : (formData.kategori === "Pengumuman" ? "Tambah Pengumuman Baru" : "Tambah Berita / Kegiatan Baru")
                }
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="min-h-[44px] py-2 px-4 text-on-surface-variant hover:bg-surface-container p-1 rounded-md transition-colors">
                <Icon name="close" />
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 md:p-6 overflow-y-auto flex-grow flex flex-col gap-5">
              {/* Judul */}
              <div>
                <label className="block text-sm font-semibold mb-1.5">Judul</label>
                <input required type="text" value={formData.judul} onChange={(e) => setFormData({...formData, judul: e.target.value})} className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none" />
              </div>

              {/* Category selector (hidden for pengumuman) */}
              {formData.kategori !== "Pengumuman" && (
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1.5">Kategori</label>
                    <select required value={formData.kategori} onChange={(e) => setFormData({...formData, kategori: e.target.value})} className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none">
                      <option value="Berita">Berita</option>
                      <option value="Kegiatan">Kegiatan</option>
                      <option value="Infrastruktur">Infrastruktur</option>
                      <option value="Ekonomi">Ekonomi</option>
                    </select>
                  </div>

                  {/* Thumbnail / Hero image */}
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1.5">Thumbnail / Gambar Utama</label>
                    <div className="flex items-center gap-3">
                      {(file || formData.fotoUrl) && (
                        <div className="w-10 h-10 rounded overflow-hidden bg-surface-container flex-shrink-0 border border-outline-variant/20">
                          <img src={file ? URL.createObjectURL(file) : formData.fotoUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <input 
                        type="file" accept="image/*"
                        onChange={(e) => { if (e.target.files?.[0]) setFile(e.target.files[0]); }}
                        className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-3 py-1.5 text-xs focus:border-primary focus:outline-none file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Block Editor Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Icon name="view_agenda" className="text-base text-primary" />
                    Konten Artikel
                  </label>
                  <span className="text-[10px] text-on-surface-variant/50 font-medium">{bloks.length} blok</span>
                </div>

                <div className="flex flex-col gap-3">
                  {bloks.map((blok, index) => (
                    <div key={blok.id} className="group border border-outline-variant/30 rounded-xl bg-surface-container-low/50 overflow-hidden transition-all hover:border-outline-variant/60">
                      {/* Block Header */}
                      <div className="flex items-center justify-between px-4 py-2 bg-surface-container-low/80 border-b border-outline-variant/20">
                        <div className="flex items-center gap-2">
                          <Icon 
                            name={blok.tipe === "teks" ? "text_fields" : "image"} 
                            className={`text-sm ${blok.tipe === "teks" ? "text-blue-600" : "text-green-600"}`} 
                          />
                          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                            {blok.tipe === "teks" ? "Teks" : "Gambar"}
                          </span>
                          <span className="text-[10px] text-on-surface-variant/40">#{index + 1}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <button type="button" onClick={() => moveBlok(index, "up")} disabled={index === 0}
                            className="p-1 rounded hover:bg-surface-container transition-colors disabled:opacity-20 text-on-surface-variant"
                            title="Pindah ke atas"
                          >
                            <Icon name="keyboard_arrow_up" className="text-base" />
                          </button>
                          <button type="button" onClick={() => moveBlok(index, "down")} disabled={index === bloks.length - 1}
                            className="p-1 rounded hover:bg-surface-container transition-colors disabled:opacity-20 text-on-surface-variant"
                            title="Pindah ke bawah"
                          >
                            <Icon name="keyboard_arrow_down" className="text-base" />
                          </button>
                          <button type="button" onClick={() => removeBlok(index)}
                            className="p-1 rounded hover:bg-error/10 hover:text-error transition-colors text-on-surface-variant/50 ml-1"
                            title="Hapus blok"
                          >
                            <Icon name="close" className="text-base" />
                          </button>
                        </div>
                      </div>

                      {/* Block Content */}
                      <div className="p-4">
                        {blok.tipe === "teks" ? (
                          <textarea
                            rows={4}
                            value={blok.konten}
                            onChange={(e) => updateBlok(index, "konten", e.target.value)}
                            className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-2.5 text-sm focus:border-primary focus:outline-none resize-y min-h-[80px]"
                            placeholder="Tulis paragraf konten di sini..."
                          />
                        ) : (
                          <div className="flex flex-col gap-3">
                            {/* Image preview */}
                            {(blok.file || blok.konten) && (
                              <div className="w-full max-h-48 rounded-lg overflow-hidden bg-surface-container border border-outline-variant/20">
                                <img 
                                  src={blok.file ? URL.createObjectURL(blok.file) : blok.konten} 
                                  alt="Preview" 
                                  className="w-full h-full object-contain max-h-48" 
                                />
                              </div>
                            )}
                            <input 
                              type="file" accept="image/*"
                              onChange={(e) => { 
                                if (e.target.files?.[0]) {
                                  updateBlok(index, "file", e.target.files[0]);
                                  updateBlok(index, "konten", ""); // clear old URL
                                }
                              }}
                              className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-3 py-2 text-xs focus:border-primary focus:outline-none file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" 
                            />
                            <input 
                              type="text"
                              value={blok.caption}
                              onChange={(e) => updateBlok(index, "caption", e.target.value)}
                              placeholder="Caption gambar (opsional)..."
                              className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-2 text-xs focus:border-primary focus:outline-none italic"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Block Buttons */}
                <div className="flex items-center gap-2 mt-4">
                  <div className="h-px bg-outline-variant/20 flex-grow" />
                  <button type="button" onClick={() => addBlok("teks")}
                    className="flex items-center gap-1.5 px-3.5 py-2 border border-dashed border-outline-variant/40 rounded-lg text-xs font-semibold text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    <Icon name="text_fields" className="text-sm" /> + Teks
                  </button>
                  <button type="button" onClick={() => addBlok("gambar")}
                    className="flex items-center gap-1.5 px-3.5 py-2 border border-dashed border-outline-variant/40 rounded-lg text-xs font-semibold text-on-surface-variant hover:border-green-600 hover:text-green-600 hover:bg-green-50 transition-all"
                  >
                    <Icon name="image" className="text-sm" /> + Gambar
                  </button>
                  <div className="h-px bg-outline-variant/20 flex-grow" />
                </div>
              </div>

              {/* Submit */}
              <div className="mt-2 flex justify-end gap-3 border-t border-outline-variant/20 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-on-surface-variant hover:bg-surface-container rounded-lg">
                  Batal
                </button>
                <button type="submit" disabled={isLoading} className="px-5 py-2.5 text-sm font-bold bg-primary text-on-primary rounded-lg hover:bg-surface-tint flex items-center gap-2 disabled:opacity-70">
                  {isLoading ? <Icon name="progress_activity" className="animate-spin text-lg" /> : <Icon name="save" className="text-lg" />}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirm Delete Modal */}
      {confirmState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-md p-4 md:p-6 border border-outline-variant/30 flex flex-col gap-4 animate-scale-up">
            <div className="flex items-center gap-3 text-error">
              <div className="w-10 h-10 rounded-full bg-error-container/20 flex items-center justify-center shrink-0">
                <Icon name="delete_forever" className="text-xl" />
              </div>
              <h3 className="font-serif text-lg font-bold text-on-surface">{confirmState.title}</h3>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {confirmState.message}
            </p>
            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
                className="px-4.5 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmState.onConfirm}
                className="px-4.5 py-2 text-xs font-bold bg-error text-on-error hover:bg-error/90 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
              >
                {isDeleting && <Icon name="progress_activity" className="animate-spin text-sm" />}
                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Toast Notification */}
      {toastState.isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in-right">
          <div className={`flex items-center gap-3 px-4.5 py-3 rounded-xl shadow-lg border text-sm font-semibold ${
            toastState.type === "success" 
              ? "bg-primary-container/90 text-primary border-primary/20" 
              : "bg-error-container/90 text-error border-error/20"
          } backdrop-blur-md`}>
            <Icon name={toastState.type === "success" ? "check_circle" : "error"} className="text-lg" />
            <span>{toastState.message}</span>
          </div>
        </div>
      )}
    </>
  );
}
