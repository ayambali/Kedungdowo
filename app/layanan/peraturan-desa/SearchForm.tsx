"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import Icon from "@/app/components/Icon";
import Link from "next/link";

export default function SearchForm({ 
  initialJudul, 
  initialNomor, 
  initialTahun, 
  initialKategori 
}: { 
  initialJudul: string;
  initialNomor: string;
  initialTahun: string;
  initialKategori: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [judul, setJudul] = useState(initialJudul);
  const [nomor, setNomor] = useState(initialNomor);
  const [tahun, setTahun] = useState(initialTahun);

  // Sinkronisasi state lokal jika URL berubah dari luar (misal: klik kategori di sidebar)
  useEffect(() => {
    setJudul(searchParams.get("judul") || "");
    setNomor(searchParams.get("nomor") || "");
    setTahun(searchParams.get("tahun") || "");
  }, [searchParams]);

  const updateSearch = useCallback((newJudul: string, newNomor: string, newTahun: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newJudul) params.set("judul", newJudul);
    else params.delete("judul");
    
    if (newNomor) params.set("nomor", newNomor);
    else params.delete("nomor");
    
    if (newTahun) params.set("tahun", newTahun);
    else params.delete("tahun");

    // Kembalikan ke halaman pertama setiap kali melakukan pencarian baru
    params.delete("page");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  // Efek Debounce: Tunggu 500ms setelah user berhenti mengetik baru lakukan pencarian
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        judul !== (searchParams.get("judul") || "") || 
        nomor !== (searchParams.get("nomor") || "") || 
        tahun !== (searchParams.get("tahun") || "")
      ) {
        updateSearch(judul, nomor, tahun);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [judul, nomor, tahun, updateSearch, searchParams]);

  const hasSearch = judul || nomor || tahun || initialKategori;

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="md:col-span-2">
        <input 
          type="text" 
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          placeholder="Judul Peraturan" 
          className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
        />
      </div>
      <div className="md:col-span-1">
        <input 
          type="text" 
          value={nomor}
          onChange={(e) => setNomor(e.target.value)}
          placeholder="Nomor" 
          className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
        />
      </div>
      <div className="md:col-span-1 flex items-center gap-2">
        <input 
          type="text" 
          value={tahun}
          onChange={(e) => setTahun(e.target.value)}
          placeholder="Tahun" 
          className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
        />
        <button disabled className="bg-[#2ecc71]/90 text-white p-2.5 rounded-xl transition-colors shadow-sm flex-shrink-0 flex items-center justify-center cursor-default" title="Pencarian Otomatis Aktif">
          <Icon name="search" className="text-[20px]" />
        </button>
        {hasSearch && (
          <Link 
            href="/layanan/peraturan-desa" 
            onClick={() => { setJudul(""); setNomor(""); setTahun(""); }} 
            className="bg-surface-variant text-on-surface-variant hover:bg-outline-variant/20 p-2.5 rounded-xl transition-colors shadow-sm flex-shrink-0 flex items-center justify-center" 
            title="Reset"
          >
            <Icon name="close" className="text-[20px]" />
          </Link>
        )}
      </div>
    </div>
  );
}
