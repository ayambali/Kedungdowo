"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Icon from "../../components/Icon";
import ConfirmModal from "../components/ConfirmModal";
import { createPerangkat, updatePerangkat, deletePerangkat } from "./actions";

export default function PerangkatClient({ initialData }: { initialData: any[] }) {
  const [activeTab, setActiveTab] = useState<"Perangkat Desa" | "BPD">("Perangkat Desa");

  const JABATAN_PERANGKAT = [
    { value: "Kepala Desa", label: "Kepala Desa" },
    { value: "Sekretaris Desa", label: "Sekretaris Desa" },
    { value: "Kasi Kesejahteraan & Pelayanan", label: "Kasi Kesejahteraan & Pelayanan" },
    { value: "Kasi Pemerintahan", label: "Kasi Pemerintahan" },
    { value: "Kaur Keuangan", label: "Kaur Keuangan" },
    { value: "Kaur Umum & Perencanaan", label: "Kaur Umum & Perencanaan" },
    { value: "Kepala Dusun I", label: "Kepala Dusun I (Kudus I)" },
    { value: "Kepala Dusun II", label: "Kepala Dusun II (Kudus II)" },
    { value: "Kepala Dusun III", label: "Kepala Dusun III (Kudus III)" },
    { value: "Kepala Dusun IV", label: "Kepala Dusun IV (Kudus IV)" },
  ];

  const JABATAN_BPD = [
    { value: "Ketua", label: "Ketua BPD" },
    { value: "Wakil Ketua", label: "Wakil Ketua BPD" },
    { value: "Sekretaris", label: "Sekretaris BPD" },
    { value: "Bendahara", label: "Bendahara BPD" },
    { value: "Anggota", label: "Anggota BPD" },
  ];

  const currentJabatanList = activeTab === "Perangkat Desa" ? JABATAN_PERANGKAT : JABATAN_BPD;

  const router = useRouter();
  const [data, setData] = useState(initialData);
  
  useEffect(() => {
    setData(initialData);
  }, [initialData]);
  
  const filteredData = data.filter(item => (item.tipe || "Perangkat Desa") === activeTab);
  
  // For Perangkat Desa, we usually want unique jabatans (except maybe Anggota BPD can be multiple)
  const existingJabatans = filteredData.map((item) => item.jabatan);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, id: number | null}>({ isOpen: false, id: null });

  const [formData, setFormData] = useState({
    nama: "",
    jabatan: "",
    fotoUrl: "",
    tipe: "Perangkat Desa",
  });
  const [file, setFile] = useState<File | null>(null);

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({ nama: "", jabatan: "", fotoUrl: "", tipe: activeTab });
    setFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      nama: item.nama,
      jabatan: item.jabatan,
      fotoUrl: item.fotoUrl || "",
      tipe: item.tipe || "Perangkat Desa",
    });
    setFile(null);
    setIsModalOpen(true);
  };

  const confirmDelete = (id: number) => {
    setConfirmModal({ isOpen: true, id });
  };

  const handleDelete = async () => {
    if (confirmModal.id !== null) {
      await deletePerangkat(confirmModal.id);
      setData(data.filter((item) => item.id !== confirmModal.id));
      setConfirmModal({ isOpen: false, id: null });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let finalFotoUrl = formData.fotoUrl;

      // Upload file if selected
      if (file) {
        const uploadData = new FormData();
        uploadData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: uploadData });
        const json = await res.json();
        if (json.url) {
          finalFotoUrl = json.url;
        }
      }

      const payload = { ...formData, fotoUrl: finalFotoUrl };

      if (editingId) {
        await updatePerangkat(editingId, payload);
      } else {
        await createPerangkat(payload);
      }
      
      router.refresh();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving data", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-outline-variant/20">
        <button 
          className={`pb-3 px-2 font-bold text-sm transition-colors border-b-2 ${activeTab === "Perangkat Desa" ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}
          onClick={() => setActiveTab("Perangkat Desa")}
        >
          Perangkat Desa
        </button>
        <button 
          className={`pb-3 px-2 font-bold text-sm transition-colors border-b-2 ${activeTab === "BPD" ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}
          onClick={() => setActiveTab("BPD")}
        >
          Badan Permusyawaratan Desa (BPD)
        </button>
      </div>

      <div className="mb-6 flex flex-col md:flex-row justify-between items-center bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 shadow-sm gap-4">
        <div className="relative w-full md:w-64">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
          <input 
            type="text" 
            placeholder={`Cari ${activeTab}...`} 
            className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <button onClick={handleOpenNew} className="min-h-[44px] py-2 px-4 bg-primary w-full md:w-auto text-on-primary px-4 py-2 rounded-lg text-sm font-bold flex justify-center items-center gap-2 hover:bg-surface-tint transition-colors shadow-sm"
        >
          <Icon name="add" className="text-lg" /> Tambah {activeTab}
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm text-on-surface min-w-[600px]">
          <thead className="bg-surface-container-low text-on-surface-variant border-b border-outline-variant/20">
            <tr>
              <th className="px-6 py-4 font-semibold w-24">Foto</th>
              <th className="px-6 py-4 font-semibold">Nama Lengkap</th>
              <th className="px-6 py-4 font-semibold">Jabatan</th>
              <th className="px-6 py-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-on-surface-variant">Belum ada data {activeTab}.</td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id} className="border-b border-outline-variant/10 hover:bg-surface-container-lowest/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-outline-variant/20 shrink-0">
                      {item.fotoUrl ? (
                        <img src={item.fotoUrl} alt={item.nama} className="w-full h-full object-cover" />
                      ) : (
                        <Icon name="person" className="text-primary/50 text-xl" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-on-background text-base">{item.nama}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-on-surface-variant bg-surface-variant/50 px-3 py-1 rounded inline-block">{item.jabatan}</p>
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

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 md:p-6 border-b border-outline-variant/20 flex justify-between items-center">
              <h2 className="font-serif text-xl font-bold">{editingId ? "Edit" : "Tambah"} {activeTab}</h2>
              <button onClick={() => setIsModalOpen(false)} className="min-h-[44px] py-2 px-4 text-on-surface-variant hover:bg-surface-container p-1 rounded-md">
                <Icon name="close" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 md:p-6 overflow-y-auto flex-grow flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Nama Lengkap</label>
                <input required type="text" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-1.5">Jabatan</label>
                <select required value={formData.jabatan} onChange={(e) => setFormData({...formData, jabatan: e.target.value})} className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none appearance-none">
                  <option value="" disabled>Pilih Jabatan</option>
                  {currentJabatanList.map((jab) => {
                    const isAnggotaBpd = formData.tipe === "BPD" && jab.value === "Anggota";
                    // Only restrict non-Anggota jabatan if they are already taken
                    const isAlreadyTaken = !isAnggotaBpd && existingJabatans.includes(jab.value);
                    const isCurrentlySelected = formData.jabatan === jab.value;
                    const disabled = isAlreadyTaken && !isCurrentlySelected;
                    
                    return (
                      <option key={jab.value} value={jab.value} disabled={disabled}>
                        {jab.label} {disabled ? "(Sudah Terisi)" : ""}
                      </option>
                    );
                  })}
                </select>
                <p className="text-xs text-on-surface-variant mt-1.5">Jabatan ini akan menentukan posisi dalam struktur organisasi desa.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5">Foto Profil (Opsional)</label>
                <div className="flex items-center gap-4">
                  {formData.fotoUrl && !file && (
                    <img src={formData.fotoUrl} alt="Preview" className="w-16 h-16 rounded-full object-cover border border-outline-variant/20" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setFile(e.target.files?.[0] || null)} 
                    className="block w-full text-sm text-on-surface-variant
                      file:mr-4 file:py-2.5 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary/10 file:text-primary
                      hover:file:bg-primary/20
                      cursor-pointer transition-colors"
                  />
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
        title={`Hapus Data ${activeTab}`}
        message={`Apakah Anda yakin ingin menghapus data ${activeTab} ini?`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmModal({ isOpen: false, id: null })}
      />
    </>
  );
}
