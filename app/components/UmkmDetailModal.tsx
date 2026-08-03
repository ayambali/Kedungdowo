"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "./Icon";

export interface ProdukDetail {
  id: number;
  namaProduk: string;
  deskripsi: string;
  namaPemilik: string;
  kontakWa: string;
  fotoUrl: string | null;
  kategori: string;
  kisaranHarga: string;
}

interface UmkmDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: ProdukDetail | null;
  productId?: number | null;
  productSlug?: string | null;
}

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

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
    if (minStr && maxStr) return `${minStr} - ${maxStr}`;
    if (minStr) return minStr;
    if (maxStr) return maxStr;
  }
  return formatSingleRupiah(value) || "Hubungi Kontak";
};

export default function UmkmDetailModal({
  isOpen,
  onClose,
  product: initialProduct,
  productId,
  productSlug,
}: UmkmDetailModalProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [product, setProduct] = useState<ProdukDetail | null>(initialProduct || null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);

  const galleryScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch product via AJAX by slug or ID
  const fetchProductDetail = useCallback(async (identifier: string | number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/umkm/${encodeURIComponent(identifier)}`);
      const json = await res.json();
      if (!res.ok || !json.data) {
        throw new Error(json.error || "Gagal memuat detail produk.");
      }
      setProduct(json.data);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    if (initialProduct) {
      setProduct(initialProduct);
      setIsLoading(false);
      setError(null);
      setActiveImageIdx(0);
    } else if (productSlug) {
      fetchProductDetail(productSlug);
      setActiveImageIdx(0);
    } else if (productId) {
      fetchProductDetail(productId);
      setActiveImageIdx(0);
    }

    if (galleryScrollRef.current) {
      galleryScrollRef.current.scrollTo({ left: 0 });
    }
  }, [isOpen, initialProduct?.id, productId, productSlug, fetchProductDetail]);

  const images = product?.fotoUrl
    ? product.fotoUrl.split(",").map((u) => u.trim()).filter(Boolean)
    : [];

  const activeImageIdxRef = useRef<number>(0);
  activeImageIdxRef.current = activeImageIdx;
  const imagesLengthRef = useRef<number>(images.length);
  imagesLengthRef.current = images.length;

  // Scroll smoothly to specific image index
  const scrollToImage = (index: number) => {
    setActiveImageIdx(index);
    if (galleryScrollRef.current) {
      const width = galleryScrollRef.current.clientWidth;
      galleryScrollRef.current.scrollTo({
        left: index * width,
        behavior: "smooth",
      });
    }
  };

  // Synchronize active indicator when user performs native swipe on mobile
  const handleGalleryScroll = () => {
    if (!galleryScrollRef.current) return;
    const container = galleryScrollRef.current;
    const width = container.clientWidth;
    if (width > 0) {
      const newIndex = Math.round(container.scrollLeft / width);
      setActiveImageIdx((prev) => {
        if (newIndex >= 0 && newIndex < imagesLengthRef.current && newIndex !== prev) {
          return newIndex;
        }
        return prev;
      });
    }
  };

  // Lock body scroll and handle Keyboard Arrow & Escape keys
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      const len = imagesLengthRef.current;
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && len > 1) {
        scrollToImage((activeImageIdxRef.current - 1 + len) % len);
      } else if (e.key === "ArrowRight" && len > 1) {
        scrollToImage((activeImageIdxRef.current + 1) % len);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const formattedPrice = product ? formatRupiah(product.kisaranHarga || "Hubungi Kontak") : "";
  const cleanedDesc = product ? cleanDescription(product.deskripsi) : "";

  const getWaUrl = () => {
    if (!product) return "#";
    const rawNumber = product.kontakWa || "";
    const cleanNumber = rawNumber.replace(/\D/g, "");
    const formattedWa = cleanNumber.startsWith("0") ? "62" + cleanNumber.substring(1) : cleanNumber;
    const message = `Halo ${product.namaPemilik}, saya tertarik dengan produk *${product.namaProduk}* di Website Profil Desa Kedungdowo. Apakah produk ini masih tersedia?`;
    return `https://wa.me/${formattedWa}?text=${encodeURIComponent(message)}`;
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 md:p-6 lg:p-8 overflow-hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="umkm-detail-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="bg-surface w-full max-w-lg sm:max-w-xl md:max-w-4xl lg:max-w-5xl h-[88dvh] md:h-[580px] lg:h-[620px] rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative border border-outline-variant/30 text-on-surface"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1. MOBILE ONLY TOP HEADER (< md) */}
            <div className="md:hidden px-3.5 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between shrink-0 border-b border-outline-variant/20 bg-surface/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-primary/10 text-primary shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {product ? product.kategori : "UMKM"}
                </span>
                <span className="text-[11px] sm:text-xs text-on-surface-variant truncate font-medium">
                  Desa Kedungdowo
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup Detail"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-high/70 hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-all cursor-pointer shrink-0 active:scale-90"
              >
                <Icon name="close" className="text-lg" />
              </button>
            </div>

            {/* Modal Body: Loading State */}
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center text-center flex-grow w-full">
                <div className="w-9 h-9 border-3 border-primary/20 border-t-primary rounded-full animate-spin mb-3" />
                <h4 className="font-serif font-bold text-sm text-on-surface">
                  Memuat Produk...
                </h4>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Mengambil data UMKM Kedungdowo
                </p>
              </div>
            ) : error ? (
              /* Modal Body: Error State */
              <div className="py-16 flex flex-col items-center justify-center text-center max-w-md mx-auto p-4 flex-grow w-full">
                <div className="w-11 h-11 rounded-2xl bg-error/10 text-error flex items-center justify-center mb-2.5">
                  <Icon name="error" className="text-2xl" />
                </div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-on-surface mb-1">
                  Gagal Memuat Produk
                </h4>
                <p className="text-xs text-on-surface-variant mb-3">{error}</p>
                <button
                  type="button"
                  onClick={() => {
                    const idToFetch = productSlug || productId;
                    if (idToFetch) fetchProductDetail(idToFetch);
                  }}
                  className="px-4 py-2 bg-primary text-on-primary rounded-xl font-semibold text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5 mx-auto"
                >
                  <Icon name="refresh" className="text-base" />
                  Coba Lagi
                </button>
              </div>
            ) : product ? (
              <>
                {/* 2. LEFT SIDE: Image Gallery & Thumbnails (Desktop 54%, Mobile shrink-0 stack) */}
                <div className="shrink-0 md:shrink md:w-[52%] lg:w-[54%] px-3.5 sm:px-5 md:p-6 pt-2.5 pb-2 md:pt-6 md:pb-6 bg-surface md:bg-surface-container-lowest/60 md:border-r border-outline-variant/20 flex flex-col justify-between">
                  <div className="flex flex-col gap-1.5 md:gap-3 h-full">
                    {/* Gallery Viewport with Native Hardware Touch Scroll-Snap */}
                    <div className="w-full h-40 xs:h-44 sm:h-56 md:h-[380px] lg:h-[420px] rounded-2xl overflow-hidden bg-surface-container relative border border-outline-variant/30 shadow-inner group/gallery flex items-center justify-center">
                      {images.length > 0 ? (
                        <>
                          {/* Native CSS Scroll-Snap Container */}
                          <div
                            ref={galleryScrollRef}
                            onScroll={handleGalleryScroll}
                            className="w-full h-full flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing"
                            style={{
                              scrollSnapType: "x mandatory",
                              WebkitOverflowScrolling: "touch",
                            }}
                          >
                            {images.map((img, idx) => (
                              <div
                                key={idx}
                                className="w-full h-full shrink-0 snap-center flex items-center justify-center overflow-hidden relative bg-black/30"
                                style={{ scrollSnapAlign: "center", scrollSnapStop: "always" }}
                              >
                                {/* Background: Full photo filling frame with very subtle blur */}
                                <img
                                  src={img}
                                  alt=""
                                  aria-hidden="true"
                                  className="absolute inset-0 w-full h-full object-cover blur-[3px] scale-105 opacity-85 brightness-85 select-none pointer-events-none"
                                  draggable={false}
                                />
                                <div className="absolute inset-0 bg-black/10 pointer-events-none" />

                                {/* Foreground: Full Uncropped photo */}
                                <img
                                  src={img}
                                  alt={`${product.namaProduk} - foto ${idx + 1}`}
                                  className="w-full h-full object-contain relative z-10 select-none pointer-events-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.35)] p-1.5"
                                  draggable={false}
                                />
                              </div>
                            ))}
                          </div>

                          {images.length > 1 && (
                            <>
                              {/* Left Arrow Button */}
                              <button
                                type="button"
                                onClick={() =>
                                  scrollToImage(
                                    (activeImageIdx - 1 + images.length) % images.length
                                  )
                                }
                                className="absolute left-2.5 top-0 bottom-0 my-auto w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-black/50 hover:bg-black/75 text-white rounded-full backdrop-blur-md transition-all z-20 flex items-center justify-center shadow-lg active:scale-90 cursor-pointer"
                                aria-label="Foto sebelumnya"
                              >
                                <Icon name="chevron_left" className="text-lg sm:text-xl md:text-2xl" />
                              </button>

                              {/* Right Arrow Button */}
                              <button
                                type="button"
                                onClick={() =>
                                  scrollToImage((activeImageIdx + 1) % images.length)
                                }
                                className="absolute right-2.5 top-0 bottom-0 my-auto w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-black/50 hover:bg-black/75 text-white rounded-full backdrop-blur-md transition-all z-20 flex items-center justify-center shadow-lg active:scale-90 cursor-pointer"
                                aria-label="Foto selanjutnya"
                              >
                                <Icon name="chevron_right" className="text-lg sm:text-xl md:text-2xl" />
                              </button>

                              {/* Counter Badge */}
                              <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white text-[9px] sm:text-[10px] md:text-xs font-semibold px-2.5 py-0.5 rounded-full pointer-events-none z-20 tracking-wider">
                                {activeImageIdx + 1} / {images.length}
                              </div>

                              {/* Indicator Dots */}
                              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full pointer-events-none">
                                {images.map((_, idx) => (
                                  <div
                                    key={idx}
                                    className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-200 ${
                                      activeImageIdx === idx
                                        ? "bg-white scale-125 shadow-sm"
                                        : "bg-white/40"
                                    }`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-on-surface-variant/40 p-4 text-center h-full">
                          <Icon name="storefront" filled className="text-4xl md:text-5xl mb-1 text-primary/25" />
                          <span className="text-[11px] md:text-xs font-medium">Foto produk belum tersedia</span>
                        </div>
                      )}
                    </div>

                    {/* Thumbnail Strip (Compact on Mobile, Roomier on Desktop) */}
                    {images.length > 1 && (
                      <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-0.5 custom-scrollbar">
                        {images.map((img, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => scrollToImage(idx)}
                            className={`w-9 h-9 sm:w-11 sm:h-11 md:w-14 md:h-14 rounded-lg md:rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                              activeImageIdx === idx
                                ? "border-primary ring-2 ring-primary/20 scale-95 shadow-sm"
                                : "border-outline-variant/30 hover:border-outline-variant opacity-70 hover:opacity-100"
                            }`}
                          >
                            <img
                              src={img}
                              alt={`Thumbnail ${idx + 1}`}
                              className="w-full h-full object-cover select-none pointer-events-none"
                              draggable={false}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. RIGHT SIDE: Product Info, Seller, Description & WhatsApp CTA (Desktop 46%) */}
                <div className="flex flex-col flex-grow md:w-[48%] lg:w-[46%] min-h-0 md:h-full bg-surface">
                  {/* DESKTOP ONLY TOP BAR (Category & Close Button) */}
                  <div className="hidden md:flex items-center justify-between px-6 py-4 border-b border-outline-variant/20 bg-surface shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {product.kategori}
                      </span>
                      <span className="text-xs text-on-surface-variant font-medium">
                        Desa Kedungdowo
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={onClose}
                      aria-label="Tutup Detail"
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-all cursor-pointer shrink-0 active:scale-95 shadow-sm"
                    >
                      <Icon name="close" className="text-xl" />
                    </button>
                  </div>

                  {/* Price, Title & Seller Card */}
                  <div className="shrink-0 px-3.5 sm:px-5 md:px-6 pt-1 pb-2.5 md:py-4 bg-surface border-b border-outline-variant/20">
                    {/* Price & Title */}
                    <div className="mb-2.5 md:mb-3.5">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-sans text-base sm:text-lg md:text-2xl font-black tracking-tight text-primary">
                          {formattedPrice}
                        </span>
                        {product.kisaranHarga && product.kisaranHarga !== "Hubungi Kontak" && (
                          <span className="text-[10px] md:text-xs text-on-surface-variant/80 font-medium bg-surface-container-low border border-outline-variant/40 px-2 py-0.5 rounded-md">
                            Kisaran Harga
                          </span>
                        )}
                      </div>
                      <h2
                        id="umkm-detail-title"
                        className="font-serif text-sm sm:text-base md:text-lg lg:text-xl font-bold text-on-surface leading-snug line-clamp-2"
                      >
                        {product.namaProduk}
                      </h2>
                    </div>

                    {/* Seller Profile Card */}
                    <div className="bg-surface-container-low/80 border border-outline-variant/30 px-3 py-1.5 sm:py-2 md:px-3.5 md:py-2 rounded-xl flex items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 flex items-center justify-center font-bold text-xs md:text-sm shrink-0 ring-1 ring-emerald-500/20 shadow-sm">
                          {product.namaPemilik.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[9px] md:text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">
                            Pemilik Usaha
                          </div>
                          <div className="font-semibold text-xs md:text-sm text-on-surface truncate">
                            {product.namaPemilik}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-outline-variant/30 text-[10px] sm:text-[11px] md:text-xs font-semibold text-on-surface-variant shrink-0">
                        <Icon name="phone" className="text-xs md:text-sm text-primary" />
                        <span>{product.kontakWa}</span>
                      </div>
                    </div>
                  </div>

                  {/* Scrollable Description */}
                  <div className="flex-grow overflow-y-auto px-3.5 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-4 bg-surface-container-lowest custom-scrollbar min-h-0">
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-on-surface-variant/80 mb-1.5 md:mb-2">
                      <Icon name="description" className="text-sm md:text-base text-primary" />
                      <span>Deskripsi Produk</span>
                    </div>
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed whitespace-pre-line pb-1 md:pb-2">
                      {cleanedDesc || "Tidak ada deskripsi tambahan untuk produk ini."}
                    </p>
                  </div>

                  {/* WhatsApp CTA Footer */}
                  <div className="bg-surface/95 backdrop-blur-md border-t border-outline-variant/20 px-3.5 py-2.5 sm:px-5 md:px-6 md:py-4 shrink-0">
                    <a
                      href={getWaUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-10 sm:h-11 md:h-12 px-4 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm md:text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg shadow-[#25D366]/20 cursor-pointer"
                    >
                      <Icon name="chat" className="text-base sm:text-lg md:text-xl" />
                      <span>Hubungi via WhatsApp</span>
                    </a>
                  </div>
                </div>
              </>
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
