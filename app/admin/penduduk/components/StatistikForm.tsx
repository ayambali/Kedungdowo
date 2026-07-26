"use client";

import { useState, useEffect } from "react";
import Icon from "../../../components/Icon";
import { updateStatistikPenduduk } from "@/app/actions/statistikPenduduk";

interface StatItem {
  id: number;
  label: string;
  jumlah: number;
}

interface StatistikFormProps {
  kategori: string;
  items: StatItem[];
  benchmarkTotal?: number;
}

// Helper to get beautiful context-appropriate icons for each category
const getCategoryIcon = (category: string): string => {
  const cat = category.toLowerCase();
  if (cat.includes("kelamin")) return "wc";
  if (cat.includes("agama")) return "diversity_1";
  if (cat.includes("kerja")) return "work";
  if (cat.includes("umur")) return "cake";
  if (cat.includes("sejahtera") || cat.includes("kk")) return "home_work";
  if (cat.includes("dusun")) return "map";
  if (cat.includes("didik") || cat.includes("sekolah")) return "school";
  if (cat.includes("tenaga")) return "engineering";
  return "analytics";
};

export default function StatistikForm({ kategori, items, benchmarkTotal }: StatistikFormProps) {
  const [formData, setFormData] = useState<StatItem[]>(items);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Keep state in sync with server components data (e.g. after revalidation)
  useEffect(() => {
    setFormData(items);
  }, [items]);

  const handleJumlahChange = (id: number, newJumlah: string) => {
    setFormData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, jumlah: parseInt(newJumlah) || 0 } : item
      )
    );
  };

  // Check if any value has changed from the original props
  const isDirty = JSON.stringify(formData) !== JSON.stringify(items);

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMsg("");
    try {
      // Save all modified items in parallel for snappy performance
      await Promise.all(
        formData.map(async (item) => {
          const form = new FormData();
          form.append("jumlah", item.jumlah.toString());
          await updateStatistikPenduduk(item.id, form);
        })
      );
      setSuccessMsg("Perubahan data berhasil disimpan!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data.");
    } finally {
      setIsSaving(false);
    }
  };

  const total = formData.reduce((acc, item) => acc + item.jumlah, 0);
  const isKK = kategori.includes("KK") || kategori.toLowerCase().includes("sejahtera");
  const isFasilitas = kategori.toLowerCase().includes("fasilitas");
  const unitLabel = isFasilitas ? "Unit" : isKK ? "KK" : "Jiwa";

  // Check if this category represents the full population of individual citizens
  const isIndividualLevel = ["agama", "tingkat pendidikan", "kelompok umur", "sebaran dusun"].includes(kategori.toLowerCase());
  const showValidation = isIndividualLevel && benchmarkTotal !== undefined;
  const diff = showValidation ? total - benchmarkTotal! : 0;

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-outline-variant/20 overflow-hidden mb-6 transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.04)]">
      {/* Card Header */}
      <div className="px-6 py-4 border-b border-outline-variant/15 bg-surface-container-lowest flex justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-container/10 text-primary flex items-center justify-center shrink-0">
            <Icon name={getCategoryIcon(kategori)} className="text-xl" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-serif font-bold text-on-surface leading-tight">
                {kategori}
              </h3>
              {showValidation && (
                diff === 0 ? (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-primary-container/20 text-primary border border-primary/20 shrink-0">
                    <Icon name="check" className="text-[10px]" />
                    Sinkron
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-error-container text-on-error-container border border-error/20 shrink-0 animate-pulse">
                    <Icon name="warning" className="text-[10px] text-error" />
                    Selisih {diff > 0 ? `+${diff}` : diff}
                  </span>
                )
              )}
            </div>
            <p className="text-xs text-on-surface-variant font-medium mt-0.5">
              Total: {total.toLocaleString('id-ID')} {unitLabel}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isDirty && !isSaving && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-secondary-fixed text-on-secondary-fixed border border-secondary-fixed/30 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              Belum Disimpan
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving || (!isDirty && !isSaving)}
            className={`text-xs font-bold px-4 py-2 rounded-full transition-all duration-300 shadow-sm flex items-center gap-1.5 disabled:cursor-not-allowed ${
              isDirty 
                ? "bg-primary hover:bg-surface-tint text-on-primary shadow-primary/20 scale-[1.02] hover:scale-[1.05]" 
                : "bg-surface-container text-on-surface-variant/50 border border-outline-variant/20 opacity-60"
            }`}
          >
            <Icon name={isSaving ? "sync" : "save"} className={`text-[16px] ${isSaving ? 'animate-spin' : ''}`} />
            <span>{isSaving ? "Menyimpan..." : "Simpan"}</span>
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 md:p-6">
        {successMsg && (
          <div className="mb-5 p-3 bg-primary-container/20 text-primary rounded-xl text-xs font-semibold border border-primary/20 flex items-center gap-2 animate-fade-in">
            <Icon name="check_circle" className="text-base text-primary" />
            {successMsg}
          </div>
        )}
        
        {/* Horizontal Form Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1 md:grid-cols-2 gap-3.5">
          {formData.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/15 hover:border-primary/30 hover:bg-primary-container/[0.01] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-200 min-h-[58px]"
            >
              <label className="text-xs font-semibold text-on-surface/90 leading-tight text-left pr-2 break-words max-w-[55%]">
                {item.label}
              </label>
              
              <div className="relative flex items-center shrink-0 w-28">
                <input
                  type="number"
                  min="0"
                  value={item.jumlah}
                  onChange={(e) => handleJumlahChange(item.id, e.target.value)}
                  className="w-full bg-white border border-outline-variant/30 text-on-surface text-xs font-bold rounded-lg pl-3 pr-10 py-1.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-3 text-[9px] text-on-surface-variant/80 font-bold uppercase pointer-events-none">
                  {unitLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
