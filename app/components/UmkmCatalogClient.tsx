"use client";

import { useState } from "react";
import Icon from "./Icon";
import AnimateIn from "./AnimateIn";

interface Produk {
  id: number;
  namaProduk: string;
  deskripsi: string;
  namaPemilik: string;
  kontakWa: string;
  fotoUrl: string | null;
  kategori: string;
  kisaranHarga: string;
}

interface Props {
  initialProducts: Produk[];
}

const CATEGORIES = [
  "SEMUA",
  "Makanan & Minuman",
  "Kelontong",
  "Agribisnis",
  "Jasa",
  "Kerajinan",
  "Pakaian",
  "Lainnya"
] as const;

type CategoryType = (typeof CATEGORIES)[number];

// Helper untuk membersihkan tulisan harga dari deskripsi jika ada
const cleanDescription = (deskripsi: string): string => {
  return deskripsi.replace(/(\(?\s?Rp\s?\d{1,3}(\.\d{3})+(\/\w+)?\s?\)?)/i, "").trim();
};

const formatSingleRupiah = (val: string) => {
  const cleanVal = val.trim();
  if (!cleanVal || cleanVal === "Hubungi Kontak") return "";
  const num = Number(cleanVal);
  if (isNaN(num)) return cleanVal;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
};

const formatRupiah = (value: string) => {
  if (!value || value === "Hubungi Kontak") return "Hubungi Kontak";
  if (value.includes("-")) {
    const parts = value.split("-");
    const minStr = formatSingleRupiah(parts[0]);
    const maxStr = formatSingleRupiah(parts[1]);
    if (minStr && maxStr) {
      return `${minStr} - ${maxStr}`;
    } else if (minStr) {
      return minStr;
    } else if (maxStr) {
      return maxStr;
    }
  }
  return formatSingleRupiah(value) || "Hubungi Kontak";
};

function ProductCard({ produk }: { produk: any }) {
  const urls = produk.fotoUrl ? produk.fotoUrl.split(",").map((u: string) => u.trim()).filter(Boolean) : [];
  const [activeIdx, setActiveIdx] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIdx((prev) => (prev + 1) % urls.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIdx((prev) => (prev - 1 + urls.length) % urls.length);
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md border border-outline-variant/20 hover:border-outline-variant/50 transition-all duration-300 relative overflow-hidden group flex flex-col h-full">
      {/* Category Badge overlay */}
      <div className="absolute top-4 left-4 z-10 bg-surface/90 backdrop-blur-sm text-on-surface px-3 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
        {produk.kategori}
      </div>

      {/* Product Image */}
      <div className="aspect-square overflow-hidden bg-surface-container relative shrink-0">
        {urls.length > 0 ? (
          <>
            <img
              src={urls[activeIdx]}
              alt={`${produk.namaProduk} - foto ${activeIdx + 1}`}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
            />
            {urls.length > 1 && (
              <>
                {/* Navigation Arrows */}
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center"
                >
                  <Icon name="chevron_left" className="text-lg" />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center"
                >
                  <Icon name="chevron_right" className="text-lg" />
                </button>
                
                {/* Dots Indicator */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/25 backdrop-blur-sm px-2 py-1 rounded-full">
                  {urls.map((_: string, idx: number) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveIdx(idx);
                      }}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        activeIdx === idx ? "bg-white scale-125" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
            <Icon name="storefront" filled className="text-8xl text-primary/10 group-hover:scale-105 transition-transform duration-700 ease-out" />
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 md:p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3 gap-2">
          <h3 className="font-serif text-lg text-on-surface font-bold leading-tight group-hover:text-primary transition-colors">
            {produk.namaProduk}
          </h3>
          <span className="font-sans text-sm font-bold text-secondary whitespace-nowrap bg-secondary-container/10 px-2 py-0.5 rounded">
            {produk.harga}
          </span>
        </div>

        <p className="text-sm text-on-surface-variant line-clamp-3 mb-6 leading-relaxed flex-grow">
          {produk.deskripsiBersih}
        </p>

        {/* Behind the Scenes / Story Section */}
        <div className="mt-auto pt-4 border-t border-outline-variant/30 flex flex-col gap-4">
          <div>
            <h4 className="font-serif text-xs font-bold text-on-surface flex items-center gap-1">
              <Icon name="person" className="text-sm text-secondary" filled />
              {produk.namaPemilik}
            </h4>
          </div>

          <a
            href={`https://wa.me/${produk.kontakWa?.startsWith("0") ? "62" + produk.kontakWa.substring(1) : produk.kontakWa}?text=Halo%20${encodeURIComponent(produk.namaPemilik)},%20saya%20tertarik%20untuk%20memesan%20produk%20*${encodeURIComponent(produk.namaProduk)}*%20yang%20ada%20di%20website%20Desa%20Kedungdowo.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-on-surface text-surface rounded-full font-semibold text-sm hover:bg-primary hover:text-on-primary transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
          >
            <Icon name="chat" className="text-lg" />
            Pesan via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export default function UmkmCatalogClient({ initialProducts }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("SEMUA");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const processedProducts = initialProducts.map((produk) => {
    const harga = formatRupiah(produk.kisaranHarga || "Hubungi Kontak");
    // Bersihkan deskripsi jika masih ada harga sisa penulisan lama di dalamnya
    const deskripsiBersih = cleanDescription(produk.deskripsi);
    return {
      ...produk,
      harga,
      deskripsiBersih,
    };
  });

  const filteredProducts = processedProducts.filter((produk) => {
    const matchesCategory = selectedCategory === "SEMUA" || produk.kategori.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      produk.namaProduk.toLowerCase().includes(searchQuery.toLowerCase()) ||
      produk.deskripsiBersih.toLowerCase().includes(searchQuery.toLowerCase()) ||
      produk.namaPemilik.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleCategoryChange = (cat: CategoryType) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll ke atas grid
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push("...");
      const start = Math.max(2, safePage - 1);
      const end = Math.min(totalPages - 1, safePage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (safePage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6">
      
      {/* Page Header */}
      <div className="mb-16 text-center max-w-2xl mx-auto">
        <AnimateIn delay={0.2} direction="up">
          <h1 className="font-serif text-2xl md:text-4xl md:text-3xl md:text-5xl font-bold text-on-surface mb-6 leading-tight">
            Pasar <span className="italic font-light text-primary">Desa</span>
          </h1>
        </AnimateIn>
        <AnimateIn delay={0.3} direction="up">
          <p className="text-lg text-on-surface-variant leading-relaxed">
            Karya tangan dan hasil bumi langsung dari warga Desa Kedungdowo. Setiap produk memiliki cerita, mendukung ekonomi lokal dengan gaya yang bersahaja.
          </p>
        </AnimateIn>

        {/* Search Input */}
        <AnimateIn delay={0.4} direction="up" className="mt-8 max-w-md mx-auto">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant/50">
              <Icon name="search" className="text-xl" />
            </span>
            <input
              type="text"
              placeholder="Cari produk atau pemilik..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-full text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm text-on-surface placeholder:text-on-surface-variant/40"
            />
          </div>
        </AnimateIn>

        {/* Category Filters */}
        <AnimateIn delay={0.5} direction="up" className="mt-8 flex justify-center gap-2 flex-wrap">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            const label = cat === "SEMUA" ? "Semua Produk" : cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-5 py-2 rounded-full font-semibold text-sm transition-all shadow-sm ${
                  isActive
                    ? "bg-on-surface text-surface"
                    : "bg-surface-container-lowest text-on-surface-variant border border-outline-variant/50 hover:border-on-surface hover:text-on-surface"
                }`}
              >
                {label}
              </button>
            );
          })}
        </AnimateIn>
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <AnimateIn delay={0.2} direction="up">
          <div className="text-center py-20 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm max-w-xl mx-auto">
            <Icon name="inventory_2" className="text-6xl text-outline-variant mb-4" />
            <h3 className="font-serif text-xl font-bold text-on-surface">Tidak Ada Produk</h3>
            <p className="text-on-surface-variant text-sm mt-2">
              Tidak ada produk UMKM yang cocok dengan pencarian atau filter saat ini.
            </p>
          </div>
        </AnimateIn>
      ) : (
        <>
          {/* Info jumlah produk */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-on-surface-variant">
              Menampilkan <span className="font-semibold text-on-surface">{startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)}</span> dari <span className="font-semibold text-on-surface">{filteredProducts.length}</span> produk
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedProducts.map((produk, idx) => (
              <AnimateIn key={produk.id} delay={0.1 * (idx % 3)} direction="up" className="h-full">
                <ProductCard produk={produk} />
              </AnimateIn>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex flex-wrap justify-center items-center gap-2 border-t border-outline-variant/30 pt-6">
              {/* Tombol Sebelumnya */}
              {safePage > 1 ? (
                <button onClick={() => goToPage(safePage - 1)} className="min-h-[44px] py-2 px-4 inline-flex items-center justify-center gap-1 min-w-[40px] h-10 px-3 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all text-sm font-semibold"
                >
                  <Icon name="chevron_left" className="text-lg" />
                  Sebelumnya
                </button>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center justify-center gap-1 min-w-[40px] h-10 px-3 rounded-lg border border-outline-variant/30 text-on-surface-variant/30 cursor-not-allowed text-sm font-semibold"
                >
                  <Icon name="chevron_left" className="text-lg" />
                  Sebelumnya
                </button>
              )}

              {/* Angka Halaman */}
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const isCurrent = pageNum === safePage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
                      isCurrent
                        ? "bg-primary text-on-primary shadow-sm font-bold"
                        : "border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Tombol Selanjutnya */}
              {safePage < totalPages ? (
                <button onClick={() => goToPage(safePage + 1)} className="min-h-[44px] py-2 px-4 inline-flex items-center justify-center gap-1 min-w-[40px] h-10 px-3 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all text-sm font-semibold"
                >
                  Selanjutnya
                  <Icon name="chevron_right" className="text-lg" />
                </button>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center justify-center gap-1 min-w-[40px] h-10 px-3 rounded-lg border border-outline-variant/30 text-on-surface-variant/30 cursor-not-allowed text-sm font-semibold"
                >
                  Selanjutnya
                  <Icon name="chevron_right" className="text-lg" />
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Tonal CTA Card */}
      <AnimateIn delay={0.2} direction="up" className="mt-16">
        <div className="bg-surface-container rounded-2xl p-4 md:p-8 flex flex-col justify-center items-center text-center min-h-[250px] border border-outline-variant/20 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[radial-gradient(#707a6c_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.05] pointer-events-none" />
          <div className="relative z-10 max-w-xl">
            <h3 className="font-serif text-2xl md:text-2xl md:text-3xl font-bold mb-3 text-on-surface">Dukung UMKM Lokal</h3>
            <p className="text-sm md:text-base mb-6 text-on-surface-variant leading-relaxed">
              Setiap pembelian Anda berkontribusi langsung pada kesejahteraan pengrajin dan petani Desa Kedungdowo. Ingin mendaftarkan usaha Anda? Silakan hubungi admin desa.
            </p>
            <a
              href="https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20warga%20Desa%20Kedungdowo%20ingin%20mendaftarkan%20produk%20UMKM%20saya%20ke%20website."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-on-surface text-on-surface rounded-full font-semibold text-sm hover:bg-on-surface hover:text-surface transition-all shadow-sm"
            >
              <Icon name="add_business" className="text-lg" />
              Hubungi Admin Desa
            </a>
          </div>
        </div>
      </AnimateIn>

    </div>
  );
}
