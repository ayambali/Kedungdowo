"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Icon from "./Icon";
import AnimateIn from "./AnimateIn";
import UmkmDetailModal, { ProdukDetail, slugify } from "./UmkmDetailModal";

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
  const formatted = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `Rp${formatted}`;
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

function ProductCard({
  produk,
  onOpenDetail,
}: {
  produk: any;
  onOpenDetail: (produk: any) => void;
}) {
  const urls = produk.fotoUrl
    ? produk.fotoUrl.split(",").map((u: string) => u.trim()).filter(Boolean)
    : [];
  const [activeIdx, setActiveIdx] = useState(0);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const nextImage = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveIdx((prev) => (prev + 1) % urls.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveIdx((prev) => (prev - 1 + urls.length) % urls.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || !touchEnd || urls.length <= 1) return;
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    if (Math.abs(distanceX) > Math.abs(distanceY) && Math.abs(distanceX) > 35) {
      e.stopPropagation();
      if (distanceX > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md border border-outline-variant/20 hover:border-outline-variant/50 transition-all duration-300 relative overflow-hidden group flex flex-col h-full">
      {/* Product Image (Clickable to open Detail, Swipeable to change image) */}
      <div
        onClick={() => onOpenDetail(produk)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="aspect-square overflow-hidden bg-surface-container relative shrink-0 cursor-pointer group/img select-none touch-pan-y"
        title="Klik untuk melihat detail"
      >
        {/* Category Badge overlay - Always in front with z-30 */}
        <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 z-30 bg-surface/95 backdrop-blur-md text-on-surface px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-bold rounded-full uppercase tracking-wider shadow-md border border-outline-variant/30 pointer-events-none">
          {produk.kategori}
        </div>

        {urls.length > 0 ? (
          <>
            {/* Background: Full photo filling frame with very subtle blur */}
            <img
              src={urls[activeIdx]}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-[3px] scale-105 opacity-85 brightness-85 select-none pointer-events-none"
            />
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />

            {/* Foreground: Full Uncropped Main Image with subtle shadow */}
            <img
              src={urls[activeIdx]}
              alt={`${produk.namaProduk} - foto ${activeIdx + 1}`}
              className="w-full h-full object-contain relative z-10 p-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.25)] transition-transform duration-500 group-hover/img:scale-105"
            />
            {urls.length > 1 && (
              <>
                {/* Navigation Arrows */}
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 min-w-[32px] min-h-[32px] bg-black/40 hover:bg-black/60 text-white p-1 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center"
                  aria-label="Foto sebelumnya"
                >
                  <Icon name="chevron_left" className="text-base sm:text-lg" />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[32px] min-h-[32px] bg-black/40 hover:bg-black/60 text-white p-1 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center"
                  aria-label="Foto selanjutnya"
                >
                  <Icon name="chevron_right" className="text-base sm:text-lg" />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-10 bg-black/25 backdrop-blur-sm px-2 py-0.5 rounded-full">
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
            <Icon
              name="storefront"
              filled
              className="text-7xl sm:text-8xl text-primary/10 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        )}

        {/* Hover Quick View Pill */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
          <span className="bg-surface/90 backdrop-blur-md text-on-surface text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 scale-90 group-hover/img:scale-100 transition-transform">
            <Icon name="visibility" className="text-sm text-primary" />
            Detail
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow">
        {/* Price Badge Above Title */}
        <div className="mb-2">
          <span className="inline-flex items-center font-sans text-xs sm:text-sm font-bold text-primary bg-primary/10 border border-primary/15 px-2.5 py-0.5 rounded-lg tracking-tight">
            {produk.harga}
          </span>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => onOpenDetail(produk)}
          className="font-serif text-base sm:text-lg text-on-surface font-bold leading-tight group-hover:text-primary transition-colors cursor-pointer mb-2.5 sm:mb-3"
          title="Klik untuk melihat detail"
        >
          {produk.namaProduk}
        </h3>

        <p className="text-xs sm:text-sm text-on-surface-variant line-clamp-3 mb-5 leading-relaxed flex-grow">
          {produk.deskripsiBersih}
        </p>

        {/* Owner and Actions Section */}
        <div className="mt-auto pt-3.5 sm:pt-4 border-t border-outline-variant/30 flex flex-col gap-3">
          <div className="flex items-center justify-between min-w-0">
            <h4 className="font-serif text-xs font-bold text-on-surface flex items-center gap-1.5 truncate">
              <Icon name="person" className="text-sm text-secondary shrink-0" filled />
              <span className="truncate">{produk.namaPemilik}</span>
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onOpenDetail(produk)}
              className="min-h-[44px] w-full py-2 px-2.5 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 border border-outline-variant/40"
            >
              <Icon name="visibility" className="text-base text-primary shrink-0" />
              Detail
            </button>

            <a
              href={`https://wa.me/${
                produk.kontakWa?.startsWith("0")
                  ? "62" + produk.kontakWa.substring(1)
                  : produk.kontakWa
              }?text=Halo%20${encodeURIComponent(
                produk.namaPemilik
              )},%20saya%20tertarik%20untuk%20memesan%20produk%20*${encodeURIComponent(
                produk.namaProduk
              )}*%20yang%20ada%20di%20website%20Desa%20Kedungdowo.`}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] w-full py-2 px-2.5 bg-on-surface text-surface rounded-xl font-semibold text-xs hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Icon name="chat" className="text-base text-[#25D366] shrink-0" />
              <span className="truncate">Pesan WA</span>
            </a>
          </div>
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

  // Detail Modal State
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProdukDetail | null>(null);
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);

  const processedProducts = useMemo(() => {
    return initialProducts.map((produk) => {
      const harga = formatRupiah(produk.kisaranHarga || "Hubungi Kontak");
      const deskripsiBersih = cleanDescription(produk.deskripsi);
      const slug = slugify(produk.namaProduk);
      return {
        ...produk,
        harga,
        deskripsiBersih,
        slug,
      };
    });
  }, [initialProducts]);

  // Open detail handler with clean slug in URL
  const handleOpenDetail = useCallback((produk: any) => {
    setSelectedProduct(produk);
    const slug = slugify(produk.namaProduk);
    setSelectedProductSlug(slug);
    setIsDetailModalOpen(true);

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("produk", slug);
      window.history.pushState({ modalOpen: true, produkSlug: slug }, "", url.toString());
    }
  }, []);

  // Close detail handler
  const handleCloseDetail = useCallback(() => {
    setIsDetailModalOpen(false);
    setSelectedProduct(null);
    setSelectedProductSlug(null);

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.searchParams.has("produk")) {
        url.searchParams.delete("produk");
        window.history.pushState({}, "", url.toString());
      }
    }
  }, []);

  // Check URL searchParams on mount for direct link / AJAX load
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const produkParam = params.get("produk");
    if (produkParam) {
      const decodedParam = decodeURIComponent(produkParam).trim();
      const found = processedProducts.find(
        (p) =>
          p.slug === decodedParam ||
          slugify(p.namaProduk) === decodedParam.toLowerCase() ||
          p.id.toString() === decodedParam
      );
      if (found) {
        setSelectedProduct(found);
      } else {
        // If not in current list or paginated, set slug so modal fetches via AJAX
        setSelectedProductSlug(decodedParam);
      }
      setIsDetailModalOpen(true);
    }

    const handlePopState = () => {
      const currentParams = new URLSearchParams(window.location.search);
      const currentProdukParam = currentParams.get("produk");
      if (currentProdukParam) {
        const decoded = decodeURIComponent(currentProdukParam).trim();
        const found = processedProducts.find(
          (p) =>
            p.slug === decoded ||
            slugify(p.namaProduk) === decoded.toLowerCase() ||
            p.id.toString() === decoded
        );
        setSelectedProduct(found || null);
        setSelectedProductSlug(decoded);
        setIsDetailModalOpen(true);
      } else {
        setIsDetailModalOpen(false);
        setSelectedProduct(null);
        setSelectedProductSlug(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [processedProducts]);

  const filteredProducts = processedProducts.filter((produk) => {
    const matchesCategory =
      selectedCategory === "SEMUA" ||
      produk.kategori.toLowerCase() === selectedCategory.toLowerCase();
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
      {/* Page Header */}
      <div className="mb-10 sm:mb-16 text-center max-w-2xl mx-auto">
        <AnimateIn delay={0.2} direction="up">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-on-surface mb-3 sm:mb-6 leading-tight">
            Pasar <span className="italic font-light text-primary">Desa</span>
          </h1>
        </AnimateIn>
        <AnimateIn delay={0.3} direction="up">
          <p className="text-sm sm:text-base md:text-lg text-on-surface-variant leading-relaxed px-2 sm:px-0">
            Karya tangan dan hasil bumi langsung dari warga Desa Kedungdowo. Setiap produk memiliki
            cerita, mendukung ekonomi lokal dengan gaya yang bersahaja.
          </p>
        </AnimateIn>

        {/* Search Input */}
        <AnimateIn delay={0.4} direction="up" className="mt-6 sm:mt-8 max-w-md mx-auto">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant/50">
              <Icon name="search" className="text-lg sm:text-xl" />
            </span>
            <input
              type="text"
              placeholder="Cari produk atau pemilik..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full min-h-[48px] pl-10 pr-4 py-2.5 sm:py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-full text-base sm:text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm text-on-surface placeholder:text-on-surface-variant/40"
            />
          </div>
        </AnimateIn>

        {/* Category Filters (Swipeable horizontal chips on mobile) */}
        <AnimateIn delay={0.5} direction="up" className="mt-6 sm:mt-8 flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center custom-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            const label = cat === "SEMUA" ? "Semua Produk" : cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`min-h-[40px] px-4 sm:px-5 py-1.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm whitespace-nowrap shrink-0 transition-all shadow-sm ${
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
          <div className="text-center py-16 sm:py-20 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm max-w-xl mx-auto px-4">
            <Icon name="inventory_2" className="text-5xl sm:text-6xl text-outline-variant mb-3 sm:mb-4" />
            <h3 className="font-serif text-lg sm:text-xl font-bold text-on-surface">Tidak Ada Produk</h3>
            <p className="text-on-surface-variant text-xs sm:text-sm mt-1.5 sm:mt-2">
              Tidak ada produk UMKM yang cocok dengan pencarian atau filter saat ini.
            </p>
          </div>
        </AnimateIn>
      ) : (
        <>
          {/* Info jumlah produk */}
          <div className="mb-4 sm:mb-6 flex items-center justify-between">
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Menampilkan{" "}
              <span className="font-semibold text-on-surface">
                {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)}
              </span>{" "}
              dari <span className="font-semibold text-on-surface">{filteredProducts.length}</span>{" "}
              produk
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {paginatedProducts.map((produk, idx) => (
              <AnimateIn
                key={produk.id}
                delay={0.08 * (idx % 3)}
                direction="up"
                className="h-full"
              >
                <ProductCard produk={produk} onOpenDetail={handleOpenDetail} />
              </AnimateIn>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-10 sm:mt-12 flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 border-t border-outline-variant/30 pt-6">
              {safePage > 1 ? (
                <button
                  onClick={() => goToPage(safePage - 1)}
                  className="min-h-[40px] px-3 sm:px-4 inline-flex items-center justify-center gap-1 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all text-xs sm:text-sm font-semibold"
                >
                  <Icon name="chevron_left" className="text-base sm:text-lg" />
                  Sebelumnya
                </button>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center justify-center gap-1 min-h-[40px] px-3 rounded-lg border border-outline-variant/30 text-on-surface-variant/30 cursor-not-allowed text-xs sm:text-sm font-semibold"
                >
                  <Icon name="chevron_left" className="text-base sm:text-lg" />
                  Sebelumnya
                </button>
              )}

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const isCurrent = pageNum === safePage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                      isCurrent
                        ? "bg-primary text-on-primary shadow-sm font-bold"
                        : "border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {safePage < totalPages ? (
                <button
                  onClick={() => goToPage(safePage + 1)}
                  className="min-h-[40px] px-3 sm:px-4 inline-flex items-center justify-center gap-1 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all text-xs sm:text-sm font-semibold"
                >
                  Selanjutnya
                  <Icon name="chevron_right" className="text-base sm:text-lg" />
                </button>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center justify-center gap-1 min-h-[40px] px-3 rounded-lg border border-outline-variant/30 text-on-surface-variant/30 cursor-not-allowed text-xs sm:text-sm font-semibold"
                >
                  Selanjutnya
                  <Icon name="chevron_right" className="text-base sm:text-lg" />
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Tonal CTA Card */}
      <AnimateIn delay={0.2} direction="up" className="mt-12 sm:mt-16">
        <div className="bg-surface-container rounded-2xl p-6 sm:p-8 flex flex-col justify-center items-center text-center min-h-[220px] sm:min-h-[250px] border border-outline-variant/20 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[radial-gradient(#707a6c_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.05] pointer-events-none" />
          <div className="relative z-10 max-w-xl">
            <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold mb-2.5 sm:mb-3 text-on-surface">
              Dukung UMKM Lokal
            </h3>
            <p className="text-xs sm:text-sm md:text-base mb-5 sm:mb-6 text-on-surface-variant leading-relaxed">
              Setiap pembelian Anda berkontribusi langsung pada kesejahteraan pengrajin dan petani
              Desa Kedungdowo. Ingin mendaftarkan usaha Anda? Silakan hubungi admin desa.
            </p>
            <a
              href="https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20warga%20Desa%20Kedungdowo%20ingin%20mendaftarkan%20produk%20UMKM%20saya%20ke%20website."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 sm:px-8 py-2.5 sm:py-3 border border-on-surface text-on-surface rounded-full font-semibold text-xs sm:text-sm hover:bg-on-surface hover:text-surface transition-all shadow-sm"
            >
              <Icon name="add_business" className="text-base sm:text-lg" />
              Hubungi Admin Desa
            </a>
          </div>
        </div>
      </AnimateIn>

      {/* AJAX Detail Modal */}
      <UmkmDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetail}
        product={selectedProduct}
        productSlug={selectedProductSlug}
      />
    </div>
  );
}
