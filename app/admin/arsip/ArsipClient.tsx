"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Icon from "../../components/Icon";
import ConfirmModal from "../components/ConfirmModal";
import { createArsip, editArsip, deleteArsip } from "@/app/actions/arsipDigital";

export default function ArsipClient({ initialData }: { initialData: any[] }) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: null as number | null,
    nomor: "",
    tahun: new Date().getFullYear(),
    perihal: "",
    isiDokumen: "",
    kategori: "Surat Masuk",
    lokasiSimpan: "",
    jumlah: 1,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, id: number | null}>({ isOpen: false, id: null });

  const filteredData = data.filter(item => 
    item.nomor.toLowerCase().includes(search.toLowerCase()) || 
    item.perihal.toLowerCase().includes(search.toLowerCase()) ||
    item.isiDokumen.toLowerCase().includes(search.toLowerCase()) ||
    (item.kategori || "").toLowerCase().includes(search.toLowerCase()) ||
    item.lokasiSimpan.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleOpenNew = () => {
    setFormData({
      id: null,
      nomor: "",
      tahun: new Date().getFullYear(),
      perihal: "",
      isiDokumen: "",
      kategori: "Surat Masuk",
      lokasiSimpan: "",
      jumlah: 1,
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setFormData({
      id: item.id,
      nomor: item.nomor,
      tahun: item.tahun,
      perihal: item.perihal,
      isiDokumen: item.isiDokumen,
      kategori: item.kategori || "Surat Masuk",
      lokasiSimpan: item.lokasiSimpan,
      jumlah: item.jumlah,
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const confirmDelete = (id: number) => {
    setConfirmModal({ isOpen: true, id });
  };

  const handleDelete = async () => {
    if (confirmModal.id !== null) {
      await deleteArsip(confirmModal.id);
      setData(data.filter((item) => item.id !== confirmModal.id));
      router.refresh();
      setConfirmModal({ isOpen: false, id: null });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const data = new FormData();
      data.append("nomor", formData.nomor);
      data.append("tahun", formData.tahun.toString());
      data.append("perihal", formData.perihal);
      data.append("isiDokumen", formData.isiDokumen);
      data.append("kategori", formData.kategori);
      data.append("lokasiSimpan", formData.lokasiSimpan);
      data.append("jumlah", formData.jumlah.toString());
      
      if (selectedFile) {
        data.append("file", selectedFile);
      }

      if (formData.id) {
        await editArsip(data, formData.id);
      } else {
        await createArsip(data);
      }
      
      router.refresh();
      setIsModalOpen(false);
      
      setTimeout(() => {
        window.location.reload(); 
      }, 500);
      
    } catch (error: any) {
      console.error("Error saving data", error);
      alert("Terjadi kesalahan: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 shadow-sm gap-4">
        <div className="relative w-full md:w-80">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
          <input 
            type="text" 
            placeholder="Cari nomor, perihal, isi..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <button onClick={handleOpenNew} className="min-h-[44px] py-2 px-4 bg-primary w-full md:w-auto text-on-primary px-4 py-2 rounded-lg text-sm font-bold flex justify-center items-center gap-2 hover:bg-surface-tint transition-colors shadow-sm"
        >
          <Icon name="add" className="text-lg" /> Tambah Arsip
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm text-on-surface min-w-[800px]">
          <thead className="bg-surface-container-low text-on-surface-variant border-b border-outline-variant/20">
            <tr>
              <th className="px-4 py-4 font-semibold w-12">No</th>
              <th className="px-4 py-4 font-semibold w-32">Nomor</th>
              <th className="px-4 py-4 font-semibold w-32">Kategori</th>
              <th className="px-4 py-4 font-semibold w-24">Tahun</th>
              <th className="px-4 py-4 font-semibold w-48">Perihal</th>
              <th className="px-4 py-4 font-semibold w-64">Isi Dokumen</th>
              <th className="px-4 py-4 font-semibold w-48">Lokasi & Keterangan</th>
              <th className="px-4 py-4 font-semibold w-24">Jumlah</th>
              <th className="px-4 py-4 font-semibold text-right w-24">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-on-surface-variant">Belum ada data arsip.</td>
              </tr>
            ) : (
              paginatedData.map((item, idx) => (
                <tr key={item.id} className="border-b border-outline-variant/10 hover:bg-surface-container-lowest/50 transition-colors">
                  <td className="px-4 py-4">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                  <td className="px-4 py-4 font-bold text-on-background">{item.nomor}</td>
                  <td className="px-4 py-4">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-semibold">{item.kategori || "Lainnya"}</span>
                  </td>
                  <td className="px-4 py-4 text-on-surface-variant">{item.tahun}</td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-on-surface">{item.perihal}</p>
                  </td>
                  <td className="px-4 py-4 text-on-surface-variant text-xs line-clamp-2">{item.isiDokumen}</td>
                  <td className="px-4 py-4 text-on-surface-variant text-xs">{item.lokasiSimpan}</td>
                  <td className="px-4 py-4 text-center">
                    <span className="bg-surface-variant/50 px-2 py-1 rounded text-xs font-medium">{item.jumlah}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {item.filePdfUrl && (
                        <a href={`/api/dokumen?url=${btoa(item.filePdfUrl)}`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Lihat PDF">
                          <Icon name="picture_as_pdf" className="text-lg" />
                        </a>
                      )}
                      <button onClick={() => handleEdit(item)} className="min-h-[44px] py-2 px-4 p-1.5 text-on-surface-variant hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors" title="Edit">
                        <Icon name="edit" className="text-lg" />
                      </button>
                      <button onClick={() => confirmDelete(item.id)} className="min-h-[44px] py-2 px-4 p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-md transition-colors" title="Hapus">
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-col md:flex-row justify-between items-center p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm mt-4 gap-4">
          <p className="text-sm text-on-surface-variant">
            Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredData.length)} dari {filteredData.length} arsip
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-outline-variant/50 text-sm font-medium hover:bg-surface-container disabled:opacity-50 transition-colors"
            >
              Sebelumnya
            </button>
            <div className="hidden sm:flex gap-1 items-center">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center transition-colors ${
                    currentPage === i + 1 
                      ? "bg-primary text-on-primary" 
                      : "text-on-surface-variant hover:bg-surface-container border border-transparent"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-outline-variant/50 text-sm font-medium hover:bg-surface-container disabled:opacity-50 transition-colors"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 md:p-6 border-b border-outline-variant/20 flex justify-between items-center">
              <h2 className="font-serif text-xl font-bold">{formData.id ? "Edit Arsip" : "Tambahkan Arsip Baru"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="min-h-[44px] py-2 px-4 text-on-surface-variant hover:bg-surface-container p-1 rounded-md">
                <Icon name="close" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 md:p-6 overflow-y-auto flex-grow grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold mb-1.5">Nomor Arsip <span className="text-error">*</span></label>
                <input required type="text" value={formData.nomor} onChange={(e) => setFormData({...formData, nomor: e.target.value})} className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none" placeholder="Contoh: 01/ARS/2026" />
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-semibold mb-1.5">Tahun <span className="text-error">*</span></label>
                <input required type="number" min="1900" max="2100" value={formData.tahun} onChange={(e) => setFormData({...formData, tahun: parseInt(e.target.value) || new Date().getFullYear()})} className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none" />
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-semibold mb-1.5">Kategori Arsip <span className="text-error">*</span></label>
                <select required value={formData.kategori} onChange={(e) => setFormData({...formData, kategori: e.target.value})} className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none">
                  <option value="Surat Masuk">Surat Masuk</option>
                  <option value="Surat Keluar">Surat Keluar</option>
                  <option value="Keuangan & APBDes">Keuangan & APBDes</option>
                  <option value="Perencanaan & Pembangunan">Perencanaan & Pembangunan</option>
                  <option value="Pertanahan & Aset">Pertanahan & Aset</option>
                  <option value="Kependudukan">Kependudukan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold mb-1.5">Perihal <span className="text-error">*</span></label>
                <input required type="text" value={formData.perihal} onChange={(e) => setFormData({...formData, perihal: e.target.value})} className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none" placeholder="Perihal arsip/surat..." />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1.5">Isi Dokumen <span className="text-error">*</span></label>
                <textarea required value={formData.isiDokumen} onChange={(e) => setFormData({...formData, isiDokumen: e.target.value})} className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none min-h-[80px] resize-y" placeholder="Penjelasan singkat mengenai isi dokumen..." />
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-semibold mb-1.5">Lokasi Simpan & Keterangan <span className="text-error">*</span></label>
                <textarea required value={formData.lokasiSimpan} onChange={(e) => setFormData({...formData, lokasiSimpan: e.target.value})} className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none min-h-[80px] resize-y" placeholder="Contoh: Lemari A, Rak 2" />
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-semibold mb-1.5">Jumlah <span className="text-error">*</span></label>
                <input required type="number" min="1" value={formData.jumlah} onChange={(e) => setFormData({...formData, jumlah: parseInt(e.target.value) || 1})} className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1.5">File PDF {formData.id ? "(Opsional)" : ""}</label>
                <input type="file" accept="application/pdf" onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)} className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2 focus:border-primary focus:outline-none text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
              </div>

              <div className="md:col-span-2 mt-2 flex justify-end gap-3 border-t border-outline-variant/20 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-on-surface-variant hover:bg-surface-container rounded-lg">
                  Batal
                </button>
                <button type="submit" disabled={isLoading} className="px-5 py-2.5 text-sm font-bold bg-primary text-on-primary rounded-lg hover:bg-surface-tint flex items-center gap-2 disabled:opacity-70">
                  {isLoading ? <Icon name="progress_activity" className="animate-spin text-lg" /> : <Icon name="save" className="text-lg" />}
                  Simpan Arsip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        title="Hapus Arsip"
        message="Apakah Anda yakin ingin menghapus arsip ini? Data yang sudah dihapus tidak dapat dikembalikan."
        onConfirm={handleDelete}
        onCancel={() => setConfirmModal({ isOpen: false, id: null })}
      />
    </>
  );
}
