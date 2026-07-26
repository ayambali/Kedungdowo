"use client";

import { useState } from "react";
import Icon from "../../components/Icon";
import ConfirmModal from "../components/ConfirmModal";
import { createKnowledge, updateKnowledge, deleteKnowledge } from "./actions";

export default function KnowledgeClient({ initialData }: { initialData: any[] }) {
  const [data, setData] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, id: number | null}>({ isOpen: false, id: null });

  // Form State
  const [formData, setFormData] = useState({
    judul: "",
    isi: "",
  });

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({
      judul: "",
      isi: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      judul: item.judul,
      isi: item.isi,
    });
    setIsModalOpen(true);
  };

  const confirmDelete = (id: number) => {
    setConfirmModal({ isOpen: true, id });
  };

  const handleDelete = async () => {
    if (confirmModal.id !== null) {
      await deleteKnowledge(confirmModal.id);
      setData(data.filter((item) => item.id !== confirmModal.id));
      setConfirmModal({ isOpen: false, id: null });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingId) {
        await updateKnowledge(editingId, formData);
        setData(data.map((item) => (item.id === editingId ? { ...item, ...formData } : item)));
      } else {
        await createKnowledge(formData);
        // Reload page to get new ID from server
        window.location.reload();
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = data.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      item.judul.toLowerCase().includes(q) ||
      item.isi.toLowerCase().includes(q)
    );
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row justify-between md:items-center gap-4 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 shadow-sm">
        <div className="relative w-full md:w-80">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
          <input 
            type="text" 
            placeholder="Cari topik pengetahuan..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <button onClick={handleOpenNew} className="min-h-[44px] py-2 px-4 bg-primary w-full md:w-auto text-on-primary px-4 py-2 rounded-lg text-sm font-bold flex justify-center items-center gap-2 hover:bg-surface-tint transition-colors shadow-sm"
        >
          <Icon name="add" className="text-lg" /> Tambah Pengetahuan
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm text-on-surface min-w-[600px]">
          <thead className="bg-surface-container-low text-on-surface-variant border-b border-outline-variant/20">
            <tr>
              <th className="px-6 py-4 font-semibold w-12">No</th>
              <th className="px-6 py-4 font-semibold w-64">Topik / Pertanyaan</th>
              <th className="px-6 py-4 font-semibold">Jawaban / Informasi</th>
              <th className="px-6 py-4 font-semibold text-right w-32">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-on-surface-variant">Belum ada data pengetahuan AI.</td>
              </tr>
            ) : (
              paginatedData.map((item, idx) => (
                <tr key={item.id} className="border-b border-outline-variant/10 hover:bg-surface-container-lowest/50 transition-colors">
                  <td className="px-6 py-4">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                  <td className="px-6 py-4 font-bold text-on-background">{item.judul}</td>
                  <td className="px-6 py-4 text-on-surface-variant line-clamp-3">
                    {item.isi}
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

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                currentPage === page 
                  ? "bg-primary text-on-primary" 
                  : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-surface rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="sticky top-0 bg-surface/80 backdrop-blur-md px-6 py-4 border-b border-outline-variant/20 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold font-serif text-on-background">
                {editingId ? "Edit Pengetahuan AI" : "Tambah Pengetahuan AI"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="min-h-[44px] py-2 px-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
                <Icon name="close" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 md:p-6">
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1.5">Topik / Pertanyaan <span className="text-error">*</span></label>
                <input required type="text" value={formData.judul} onChange={(e) => setFormData({...formData, judul: e.target.value})} className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none" placeholder="Contoh: Persyaratan Membuat KTP" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1.5">Jawaban / Informasi <span className="text-error">*</span></label>
                <textarea required value={formData.isi} onChange={(e) => setFormData({...formData, isi: e.target.value})} className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none min-h-[200px] resize-y" placeholder="Masukkan jawaban lengkap dari desa terkait pertanyaan/topik di atas..." />
              </div>

              <div className="mt-8 flex justify-end gap-3 border-t border-outline-variant/20 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-on-surface-variant hover:bg-surface-container rounded-lg">
                  Batal
                </button>
                <button type="submit" disabled={isLoading} className="px-5 py-2.5 text-sm font-bold bg-primary text-on-primary rounded-lg hover:bg-surface-tint flex items-center gap-2 disabled:opacity-70">
                  {isLoading ? <Icon name="progress_activity" className="animate-spin text-lg" /> : <Icon name="save" className="text-lg" />}
                  Simpan Pengetahuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        title="Hapus Pengetahuan AI"
        message="Apakah Anda yakin ingin menghapus data pengetahuan ini? Bot tidak akan lagi menggunakan informasi ini saat merespons pertanyaan warga."
        onConfirm={handleDelete}
        onCancel={() => setConfirmModal({ isOpen: false, id: null })}
      />
    </>
  );
}
