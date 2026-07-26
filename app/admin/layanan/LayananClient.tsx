"use client";

import { useState, useEffect } from "react";
import Icon from "../../components/Icon";
import { updateStatusLayanan, deleteLayanan, updateTanggapanLayanan } from "./actions";

interface LayananItem {
  id: string;
  kategori: string;
  namaPemohon: string;
  kontak: string;
  perihal: string;
  tanggapan: string | null;
  status: string;
  createdAt: Date;
}

export default function LayananClient({
  initialData,
}: {
  initialData: LayananItem[];
}) {
  const [data, setData] = useState(initialData);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("semua");

  // State untuk modal detail & reply
  const [selectedItem, setSelectedItem] = useState<LayananItem | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isEditingReply, setIsEditingReply] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, data.length]);

  const filtered =
    filterStatus === "semua"
      ? data
      : data.filter((d) => d.status.toLowerCase() === filterStatus);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentData = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const countBelum = data.filter((d) =>
    d.status.toLowerCase().includes("belum")
  ).length;
  const countSudah = data.filter((d) =>
    d.status.toLowerCase().includes("sudah")
  ).length;

  // ========== HANDLER ==========
  async function handleToggleStatus(item: LayananItem) {
    const newStatus =
      item.status.toLowerCase().includes("belum")
        ? "Sudah Direspon"
        : "Belum Direspon";

    setLoadingId(item.id);
    try {
      await updateStatusLayanan(item.id, newStatus);
      setData((prev) =>
        prev.map((d) => (d.id === item.id ? { ...d, status: newStatus } : d))
      );
      if (selectedItem?.id === item.id) {
        setSelectedItem({ ...selectedItem, status: newStatus });
      }
    } catch {
      alert("Gagal mengubah status. Silakan coba lagi.");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(id: string) {
    setLoadingId(id);
    try {
      await deleteLayanan(id);
      setData((prev) => prev.filter((d) => d.id !== id));
      setDeleteConfirmId(null);
      if (selectedItem?.id === id) setSelectedItem(null);
    } catch {
      alert("Gagal menghapus data.");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleSendReply() {
    if (!selectedItem || !replyText.trim()) return;
    setLoadingId(selectedItem.id);
    try {
      await updateTanggapanLayanan(selectedItem.id, replyText);
      const updatedItem = { ...selectedItem, tanggapan: replyText, status: "Sudah Direspon" };
      setData((prev) =>
        prev.map((d) => (d.id === selectedItem.id ? updatedItem : d))
      );
      setSelectedItem(updatedItem);
      setIsEditingReply(false);
    } catch {
      alert("Gagal mengirim tanggapan. Silakan coba lagi.");
    } finally {
      setLoadingId(null);
    }
  }

  function openModal(item: LayananItem) {
    setSelectedItem(item);
    setReplyText(item.tanggapan || "");
    setIsEditingReply(!item.tanggapan); // Langsung edit mode jika belum ada tanggapan
  }

  // ========== RENDER ==========
  return (
    <div className="space-y-6">
      {/* Statistik Ringkas */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-outline-variant/20 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon name="inbox" className="text-primary text-xl" />
            </div>
            <span className="text-sm font-medium text-on-surface-variant">
              Total Masuk
            </span>
          </div>
          <p className="font-serif text-2xl md:text-3xl font-bold text-on-surface">
            {data.length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-outline-variant/20 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Icon name="pending" className="text-orange-500 text-xl" />
            </div>
            <span className="text-sm font-medium text-on-surface-variant">
              Belum Direspon
            </span>
          </div>
          <p className="font-serif text-2xl md:text-3xl font-bold text-orange-500">
            {countBelum}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-outline-variant/20 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon name="check_circle" className="text-primary text-xl" />
            </div>
            <span className="text-sm font-medium text-on-surface-variant">
              Sudah Direspon
            </span>
          </div>
          <p className="font-serif text-2xl md:text-3xl font-bold text-primary">
            {countSudah}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 flex-wrap">
        {["semua", "belum direspon", "sudah direspon"].map((f) => (
          <button
            key={f}
            onClick={() => setFilterStatus(f)}
            className={`px-4 py-2 rounded-full text-xs font-semibold capitalize transition-all ${
              filterStatus === f
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-white text-on-surface-variant border border-outline-variant/30 hover:border-primary/30"
            }`}
          >
            {f === "semua" ? `Semua (${data.length})` : f}
          </button>
        ))}
      </div>

      {/* Tabel Data */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-outline-variant/20 p-16 text-center">
          <Icon name="inbox" className="text-3xl md:text-5xl text-outline/30 mb-4" />
          <p className="text-sm text-on-surface-variant">
            Tidak ada data untuk filter ini.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-container-low/50 border-b border-outline-variant/20">
                  <th className="text-left py-3.5 px-5 text-xs font-semibold text-outline uppercase tracking-wider w-32">
                    Tanggal
                  </th>
                  <th className="text-left py-3.5 px-5 text-xs font-semibold text-outline uppercase tracking-wider max-w-[200px]">
                    Nama / Kontak
                  </th>
                  <th className="text-left py-3.5 px-5 text-xs font-semibold text-outline uppercase tracking-wider max-w-[300px]">
                    Perihal
                  </th>
                  <th className="text-center py-3.5 px-5 text-xs font-semibold text-outline uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-center py-3.5 px-5 text-xs font-semibold text-outline uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {currentData.map((item, idx) => {
                  const isBelum = item.status.toLowerCase().includes("belum");
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-surface-container/20 transition-colors ${
                        idx % 2 === 0 ? "" : "bg-surface-container-low/20"
                      }`}
                    >
                      <td className="py-4 px-5 text-on-surface-variant whitespace-nowrap align-top w-32">
                        {new Date(item.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-4 px-5 align-top max-w-[200px]">
                        <p className="font-medium text-on-surface mb-1 break-all">
                          {item.namaPemohon}
                        </p>
                        <a
                          href={`https://wa.me/${item.kontak.replace(/^0/, "62")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline text-xs font-medium"
                        >
                          <Icon name="chat" className="text-[14px]" />
                          {item.kontak}
                        </a>
                      </td>
                      <td className="py-4 px-5 align-top max-w-[300px]">
                        <span className="inline-block text-[10px] uppercase font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded mb-1.5">
                          {item.kategori}
                        </span>
                        <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2">
                          {item.perihal}
                        </p>
                        {item.tanggapan && (
                          <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            <Icon name="check" className="text-[12px]" /> Sudah ditanggapi
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-5 text-center align-top">
                        <span
                          className={`inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap ${
                            isBelum
                              ? "bg-orange-500 text-white"
                              : "bg-primary text-on-primary"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 align-top">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {/* Tombol Detail/Balas */}
                          <button onClick={() => openModal(item)} className="min-h-[44px] py-2 px-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all text-xs font-semibold"
                            title="Detail & Balas"
                          >
                            <Icon name="visibility" className="text-[14px]" /> Detail
                          </button>

                          {/* Tombol Hapus */}
                          {deleteConfirmId === item.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(item.id)}
                                disabled={loadingId === item.id}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-error/10 text-error hover:bg-error/20 transition-all disabled:opacity-50"
                                title="Konfirmasi Hapus"
                              >
                                <Icon name="check" className="text-base" />
                              </button>
                              <button onClick={() => setDeleteConfirmId(null)} className="min-h-[44px] py-2 px-4 w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all"
                                title="Batal"
                              >
                                <Icon name="close" className="text-base" />
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteConfirmId(item.id)} className="min-h-[44px] py-2 px-4 w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container text-on-surface-variant hover:bg-error/10 hover:text-error transition-all"
                              title="Hapus"
                            >
                              <Icon name="delete" className="text-base" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden divide-y divide-outline-variant/15">
            {currentData.map((item) => {
              const isBelum = item.status.toLowerCase().includes("belum");
              return (
                <div key={item.id} className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <p className="font-semibold text-on-surface text-sm truncate">
                        {item.namaPemohon}
                      </p>
                      <p className="text-xs text-outline">
                        {new Date(item.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        isBelum
                          ? "bg-orange-500 text-white"
                          : "bg-primary text-on-primary"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                      {item.kategori}
                    </span>
                    <a
                      href={`https://wa.me/${item.kontak.replace(/^0/, "62")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary text-xs font-medium"
                    >
                      <Icon name="chat" className="text-[14px]" />
                      {item.kontak}
                    </a>
                  </div>

                  <div>
                    <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2">
                      {item.perihal}
                    </p>
                    {item.tanggapan && (
                      <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        <Icon name="check" className="text-[12px]" /> Sudah ditanggapi
                      </div>
                    )}
                  </div>

                  {/* Aksi Mobile */}
                  <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/10">
                    <button onClick={() => openModal(item)} className="min-h-[44px] py-2 px-4 flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
                    >
                      <Icon name="visibility" className="text-sm" /> Detail / Balas
                    </button>
                    
                    <button
                      onClick={() =>
                        deleteConfirmId === item.id
                          ? handleDelete(item.id)
                          : setDeleteConfirmId(item.id)
                      }
                      disabled={loadingId === item.id}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container text-on-surface-variant hover:bg-error/10 hover:text-error transition-all disabled:opacity-50 shrink-0"
                    >
                      <Icon
                        name={deleteConfirmId === item.id ? "check" : "delete"}
                        className="text-base"
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls (Selalu Tampil) */}
          <div className="flex items-center justify-center gap-2 p-5 border-t border-outline-variant/20 bg-surface-container-lowest overflow-x-auto">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container disabled:opacity-50 transition-colors shrink-0"
              >
                <Icon name="chevron_left" className="text-lg" /> Sebelumnya
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all shrink-0 ${
                    currentPage === page
                      ? "bg-primary text-on-primary shadow-sm"
                      : "border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container disabled:opacity-50 transition-colors shrink-0"
              >
                Selanjutnya <Icon name="chevron_right" className="text-lg" />
              </button>
            </div>
        </div>
      )}

      {/* ========== MODAL POPUP ========== */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="px-6 py-5 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-lowest">
              <h3 className="font-serif text-xl font-bold text-on-surface flex items-center gap-2">
                <Icon name="info" className="text-primary" /> Detail Permohonan
              </h3>
              <button onClick={() => setSelectedItem(null)} className="min-h-[44px] py-2 px-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"
              >
                <Icon name="close" className="text-xl" />
              </button>
            </div>

            {/* Body Modal (Scrollable) */}
            <div className="p-4 md:p-6 overflow-y-auto space-y-6 bg-surface-container-lowest flex-1">
              {/* Info Pengaju */}
              <div className="bg-surface-container/30 rounded-2xl p-5 border border-outline-variant/20">
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-outline mb-1">Nama Pemohon</p>
                    <p className="font-medium text-on-surface">{selectedItem.namaPemohon}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-outline mb-1">Kontak WA</p>
                    <a
                      href={`https://wa.me/${selectedItem.kontak.replace(/^0/, "62")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                    >
                      <Icon name="chat" className="text-[14px]" />
                      {selectedItem.kontak}
                    </a>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-outline mb-1">Kategori</p>
                    <span className="inline-block text-[11px] font-bold uppercase text-on-surface-variant bg-white px-2 py-0.5 rounded shadow-sm border border-outline-variant/10">
                      {selectedItem.kategori}
                    </span>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-outline mb-1">Tanggal</p>
                    <p className="text-sm text-on-surface-variant">
                      {new Date(selectedItem.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Perihal */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-outline mb-2 ml-1">Perihal / Keterangan</p>
                <div className="bg-white rounded-2xl p-5 border border-outline-variant/20 shadow-sm text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
                  {selectedItem.perihal}
                </div>
              </div>

              {/* Tanggapan */}
              <div>
                <div className="flex items-center justify-between mb-2 ml-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                    <Icon name="reply" className="text-[14px]" /> Tanggapan Admin
                  </p>
                  {!isEditingReply && selectedItem.tanggapan && (
                    <button onClick={() => setIsEditingReply(true)} className="min-h-[44px] py-2 px-4 text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      <Icon name="edit" className="text-[14px]" /> Edit Tanggapan
                    </button>
                  )}
                </div>

                {isEditingReply ? (
                  <div className="bg-primary/5 rounded-2xl p-1 border border-primary/20">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Ketik tanggapan atau jawaban di sini..."
                      rows={5}
                      className="w-full bg-white border-none rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none shadow-sm"
                      autoFocus
                    />
                  </div>
                ) : (
                  <div className="bg-primary/5 rounded-2xl p-5 border border-primary/20 shadow-sm text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
                    {selectedItem.tanggapan || <span className="text-outline italic">Belum ada tanggapan.</span>}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Modal (Actions) */}
            <div className="px-6 py-4 border-t border-outline-variant/20 bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-outline">Status:</span>
                <button
                  onClick={() => handleToggleStatus(selectedItem)}
                  disabled={loadingId === selectedItem.id}
                  className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
                    selectedItem.status.toLowerCase().includes("belum")
                      ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                      : "bg-primary/10 text-primary hover:bg-primary/20"
                  }`}
                  title="Klik untuk ubah status manual"
                >
                  <Icon name={selectedItem.status.toLowerCase().includes("belum") ? "pending" : "check_circle"} className="text-[14px]" />
                  {selectedItem.status}
                </button>
              </div>

              <div className="flex gap-2">
                {isEditingReply ? (
                  <>
                    <button
                      onClick={() => {
                        setIsEditingReply(false);
                        setReplyText(selectedItem.tanggapan || "");
                      }}
                      className="px-4 py-2 rounded-xl text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSendReply}
                      disabled={loadingId === selectedItem.id || !replyText.trim()}
                      className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                    >
                      <Icon name="send" className="text-[16px]" />
                      Simpan Tanggapan
                    </button>
                  </>
                ) : (
                  <button onClick={() => setSelectedItem(null)} className="min-h-[44px] py-2 px-4 px-6 py-2 rounded-xl text-sm font-semibold bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
                  >
                    Tutup
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
