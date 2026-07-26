"use client";

import { useState } from "react";
import Icon from "../../components/Icon";
import ConfirmModal from "../components/ConfirmModal";
import { createUmkm, updateUmkm, deleteUmkm } from "./actions";

export default function UmkmClient({ initialData }: { initialData: any[] }) {
  const [data, setData] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, id: number | null}>({ isOpen: false, id: null });

  // Form State
  const [formData, setFormData] = useState({
    namaProduk: "",
    deskripsi: "",
    namaPemilik: "",
    kontakWa: "",
    fotoUrl: "",
    kategori: "Lainnya",
    hargaMin: "",
    hargaMax: "",
  });
  const [existingUrls, setExistingUrls] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({
      namaProduk: "",
      deskripsi: "",
      namaPemilik: "",
      kontakWa: "",
      fotoUrl: "",
      kategori: "Makanan & Minuman",
      hargaMin: "",
      hargaMax: "",
    });
    setExistingUrls([]);
    setNewFiles([]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item.id);
    let hMin = "";
    let hMax = "";
    if (item.kisaranHarga && item.kisaranHarga !== "Hubungi Kontak") {
      if (item.kisaranHarga.includes("-")) {
        const parts = item.kisaranHarga.split("-");
        hMin = parts[0] ? parts[0].replace(/\D/g, "") : "";
        hMax = parts[1] ? parts[1].replace(/\D/g, "") : "";
      } else {
        hMin = item.kisaranHarga.replace(/\D/g, "");
      }
    }
    const urls = item.fotoUrl ? item.fotoUrl.split(",").map((u: string) => u.trim()).filter(Boolean) : [];
    setExistingUrls(urls);
    setNewFiles([]);
    setFormData({
      namaProduk: item.namaProduk,
      deskripsi: item.deskripsi,
      namaPemilik: item.namaPemilik,
      kontakWa: item.kontakWa,
      fotoUrl: item.fotoUrl || "",
      kategori: item.kategori || "Makanan & Minuman",
      hargaMin: hMin,
      hargaMax: hMax,
    });
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (existingUrls.length + newFiles.length + selectedFiles.length > 3) {
      alert("Maksimal upload adalah 3 foto produk!");
      e.target.value = "";
      return;
    }

    const maxSize = 3 * 1024 * 1024; // 3MB
    for (const f of selectedFiles) {
      if (f.size > maxSize) {
        alert(`Ukuran berkas "${f.name}" melebihi 3 MB!`);
        e.target.value = "";
        return;
      }
    }

    setNewFiles((prev) => [...prev, ...selectedFiles]);
    e.target.value = "";
  };

  const confirmDelete = (id: number) => {
    setConfirmModal({ isOpen: true, id });
  };

  const handleDelete = async () => {
    if (confirmModal.id !== null) {
      await deleteUmkm(confirmModal.id);
      setData(data.filter((item) => item.id !== confirmModal.id));
      setConfirmModal({ isOpen: false, id: null });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const uploadedUrls: string[] = [];

      // Upload new files if selected
      for (const file of newFiles) {
        const uploadData = new FormData();
        uploadData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: uploadData });
        const json = await res.json();
        if (json.url) {
          uploadedUrls.push(json.url);
        }
      }

      const combinedUrls = [...existingUrls, ...uploadedUrls];
      const finalFotoUrl = combinedUrls.join(",");

      let kisaranHarga = "Hubungi Kontak";
      const minVal = formData.hargaMin.trim();
      const maxVal = formData.hargaMax.trim();

      if (minVal && maxVal) {
        kisaranHarga = `${minVal}-${maxVal}`;
      } else if (minVal) {
        kisaranHarga = minVal;
      } else if (maxVal) {
        kisaranHarga = maxVal;
      }

      const payload = {
        namaProduk: formData.namaProduk,
        deskripsi: formData.deskripsi,
        namaPemilik: formData.namaPemilik,
        kontakWa: formData.kontakWa,
        fotoUrl: finalFotoUrl,
        kategori: formData.kategori,
        kisaranHarga: kisaranHarga,
      };

      if (editingId) {
        await updateUmkm(editingId, payload);
        setData(data.map((item) => (item.id === editingId ? { ...item, ...payload } : item)));
      } else {
        await createUmkm(payload);
        // Refresh data ideally, but for now we just reload page or optimistic update
        window.location.reload();
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving data", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsLoading(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const filteredData = data.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      item.namaProduk.toLowerCase().includes(q) ||
      item.namaPemilik.toLowerCase().includes(q) ||
      item.deskripsi.toLowerCase().includes(q) ||
      (item.kategori || "").toLowerCase().includes(q) ||
      (item.kontakWa || "").includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 shadow-sm">
        <div className="relative w-full md:w-64">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
          <input 
            type="text" 
            placeholder="Cari UMKM..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <button onClick={handleOpenNew} className="min-h-[44px] py-2 px-4 bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-surface-tint transition-colors shadow-sm"
        >
          <Icon name="add" className="text-lg" /> Tambah UMKM
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden overflow-x-auto whitespace-nowrap scrollbar-hide">
        <table className="w-full text-left text-sm text-on-surface">
          <thead className="bg-surface-container-low text-on-surface-variant border-b border-outline-variant/20">
            <tr>
              <th className="px-6 py-4 font-semibold">Produk</th>
              <th className="px-6 py-4 font-semibold">Kategori</th>
              <th className="px-6 py-4 font-semibold">Pemilik</th>
              <th className="px-6 py-4 font-semibold">Kontak WA</th>
              <th className="px-6 py-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">Belum ada data UMKM.</td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr key={item.id} className="border-b border-outline-variant/10 hover:bg-surface-container-lowest/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.fotoUrl ? (
                          <img src={item.fotoUrl} alt={item.namaProduk} className="w-full h-full object-cover" />
                        ) : (
                          <Icon name="inventory_2" className="text-primary/50 text-xl" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-on-background">{item.namaProduk}</p>
                        <p className="text-xs text-on-surface-variant truncate max-w-[200px]">{item.deskripsi}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-md text-xs font-semibold">{item.kategori || "Lainnya"}</span>
                  </td>
                  <td className="px-6 py-4 font-medium">{item.namaPemilik}</td>
                  <td className="px-6 py-4">
                    <span className="bg-secondary/10 text-secondary px-2.5 py-1 rounded-md text-xs font-semibold">{item.kontakWa}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpenEdit(item)} className="min-h-[44px] py-2 px-4 p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-md transition-colors">
                        <Icon name="edit" className="text-lg" />
                      </button>
                      <button onClick={() => confirmDelete(item.id)} className="min-h-[44px] py-2 px-4 p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-md transition-colors">
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
      {data.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-col md:flex-row justify-between items-center bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 shadow-sm gap-4 text-xs font-semibold text-on-surface-variant">
          <div>
            Menampilkan <span className="font-bold text-on-surface">{startIndex + 1}</span> - <span className="font-bold text-on-surface">{Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)}</span> dari <span className="font-bold text-on-surface">{filteredData.length}</span> UMKM
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

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 md:p-6 border-b border-outline-variant/20 flex justify-between items-center">
              <h2 className="font-serif text-xl font-bold">{editingId ? "Edit UMKM" : "Tambah UMKM"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="min-h-[44px] py-2 px-4 text-on-surface-variant hover:bg-surface-container p-1 rounded-md">
                <Icon name="close" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 md:p-6 overflow-y-auto flex-grow flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Nama Produk</label>
                <input required type="text" value={formData.namaProduk} onChange={(e) => setFormData({...formData, namaProduk: e.target.value})} className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-1.5">Nama Pemilik/Nama Toko</label>
                <input required type="text" value={formData.namaPemilik} onChange={(e) => setFormData({...formData, namaPemilik: e.target.value})} className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5">Kategori</label>
                <select 
                  required 
                  value={formData.kategori} 
                  onChange={(e) => setFormData({...formData, kategori: e.target.value})} 
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none"
                >
                  <option value="Makanan & Minuman">Makanan & Minuman</option>
                  <option value="Kelontong">Kelontong</option>
                  <option value="Agribisnis">Agribisnis</option>
                  <option value="Jasa">Jasa</option>
                  <option value="Kerajinan">Kerajinan</option>
                  <option value="Pakaian">Pakaian</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5">Kisaran Harga (Rupiah, Angka saja)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-on-surface-variant/70 mb-1">Harga Terendah</label>
                    <input 
                      type="text" 
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={formData.hargaMin} 
                      onChange={(e) => setFormData({...formData, hargaMin: e.target.value.replace(/\D/g, "")})} 
                      placeholder="Contoh: 10000"
                      className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-on-surface-variant/70 mb-1">Harga Tertinggi</label>
                    <input 
                      type="text" 
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={formData.hargaMax} 
                      onChange={(e) => setFormData({...formData, hargaMax: e.target.value.replace(/\D/g, "")})} 
                      placeholder="Contoh: 50000"
                      className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none" 
                    />
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant/60 mt-1.5">Kosongkan kedua kolom jika ingin menampilkan "Hubungi Kontak".</p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Nomor WhatsApp</label>
                <input required type="text" value={formData.kontakWa} onChange={(e) => setFormData({...formData, kontakWa: e.target.value})} className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5">Deskripsi</label>
                <textarea required rows={3} value={formData.deskripsi} onChange={(e) => setFormData({...formData, deskripsi: e.target.value})} className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none resize-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5">Foto Produk (Maksimal 3 Foto)</label>
                <div className="flex flex-col gap-4 w-full">
                  {/* Photo Preview Grid */}
                  {(existingUrls.length > 0 || newFiles.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {existingUrls.map((url, idx) => (
                        <div key={`existing-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-outline-variant/30 group shadow-sm bg-surface-container-low">
                          <img src={url} alt={`Existing preview ${idx}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setExistingUrls(existingUrls.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 bg-error/95 hover:bg-error text-on-error p-1 rounded-full opacity-90 hover:opacity-100 transition-opacity shadow-sm"
                            title="Hapus foto ini"
                          >
                            <Icon name="close" className="text-xs scale-75" />
                          </button>
                        </div>
                      ))}
                      {newFiles.map((file, idx) => {
                        const previewUrl = URL.createObjectURL(file);
                        return (
                          <div key={`new-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-outline-variant/35 group shadow-sm bg-surface-container-low">
                            <img src={previewUrl} alt={`New preview ${idx}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                setNewFiles(newFiles.filter((_, i) => i !== idx));
                                URL.revokeObjectURL(previewUrl);
                              }}
                              className="absolute top-1 right-1 bg-error/95 hover:bg-error text-on-error p-1 rounded-full opacity-90 hover:opacity-100 transition-opacity shadow-sm"
                              title="Hapus foto ini"
                            >
                              <Icon name="close" className="text-xs scale-75" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {existingUrls.length + newFiles.length < 3 ? (
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple
                      onChange={handleFileChange} 
                      className="block w-full text-sm text-on-surface-variant file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" 
                    />
                  ) : (
                    <div className="text-xs font-semibold text-primary/80 bg-primary/5 p-3 rounded-lg border border-primary/20 text-center">
                      Maksimal 3 foto tercapai. Hapus beberapa foto untuk mengunggah yang baru.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-3 border-t border-outline-variant/20 pt-6">
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

      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        title="Hapus Data UMKM"
        message="Apakah Anda yakin ingin menghapus data UMKM ini? Data yang sudah dihapus tidak dapat dikembalikan."
        onConfirm={handleDelete}
        onCancel={() => setConfirmModal({ isOpen: false, id: null })}
      />
    </>
  );
}
