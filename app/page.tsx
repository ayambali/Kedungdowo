import Image from "next/image";
import Link from "next/link";
import Icon from "./components/Icon";
import { prisma } from "@/lib/prisma";
import { getBeritaUrl } from "@/lib/slug";
import AnimateIn from "./components/AnimateIn";

const stats = [
  { icon: "groups", value: "~2.400", label: "Penduduk", color: "primary" },
  { icon: "landscape", value: "293,8 Ha", label: "Luas Wilayah", color: "secondary" },
  { icon: "holiday_village", value: "10", label: "Dukuh", color: "tertiary" },
  { icon: "agriculture", value: "1.000", label: "Ekor Sapi", color: "primary" },
];

const colorMap: Record<string, { border: string; icon: string; label: string; blob: string }> = {
  primary: { border: "border-primary", icon: "text-primary", label: "text-secondary", blob: "bg-primary/5" },
  secondary: { border: "border-secondary", icon: "text-secondary", label: "text-primary", blob: "bg-secondary/5" },
  tertiary: { border: "border-tertiary", icon: "text-tertiary", label: "text-secondary", blob: "bg-tertiary-container/5" },
};

const getChipColor = (kategori: string) => {
  switch (kategori) {
    case "Peternakan": return "bg-primary-container text-on-primary-container";
    case "Pemerintahan": return "bg-secondary-container text-on-secondary-container";
    case "Ekonomi": return "bg-tertiary-container text-on-tertiary-container";
    case "Infrastruktur": return "bg-primary-fixed text-on-primary-fixed";
    case "Pendidikan": return "bg-secondary-fixed text-on-secondary-fixed";
    case "Kesehatan": return "bg-tertiary-fixed text-on-tertiary-fixed";
    default: return "bg-surface-variant text-on-surface-variant";
  }
};

export default async function Home() {
  const beritaList = await prisma.artikel.findMany({
    where: {
      kategori: {
        not: "Pengumuman",
      },
    },
    orderBy: [
      { isSorotan: "desc" },
      { createdAt: "desc" }
    ],
    take: 3,
  });

  return (
    <>
      {/* ====== HERO ====== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/gambar.jpg" alt="Pemandangan Desa Kedungdowo" fill className="object-cover" priority />
          <div className="hero-gradient absolute inset-0" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center gap-6 mt-16">
          <AnimateIn delay={0.1}>
            <span className="font-serif text-2xl md:text-2xl md:text-3xl text-white font-bold drop-shadow-lg uppercase tracking-[0.2em] block">
              Selamat Datang di
            </span>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <h1 className="font-serif text-2xl md:text-4xl md:text-6xl text-white font-bold drop-shadow-lg leading-tight">
              Desa Kedungdowo
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.3}>
            <p className="text-lg md:text-xl text-white/90 font-serif font-semibold tracking-wide">
              Harmonis · Mandiri · Berkelanjutan
            </p>
          </AnimateIn>
          <AnimateIn delay={0.4}>
            <p className="text-base md:text-lg text-white/80 max-w-2xl leading-relaxed">
Kecamatan Andong, Kabupaten Boyolali, Jawa Tengah — Desa dengan potensi unggulan di bidang pertanian dan peternakan, serta semangat pemberdayaan UMKM lokal.
            </p>
          </AnimateIn>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <Icon name="expand_more" className="text-white/60 text-2xl md:text-3xl" />
        </div>
      </section>

      {/* ====== PROFIL VIDEO & INTRO ====== */}
      <section className="py-16 md:py-24 bg-background">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Introduction */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <AnimateIn delay={0.1} direction="right">
                <span className="text-secondary font-semibold text-sm uppercase tracking-wider block mb-3">
                  Selayang Pandang
                </span>
                <h2 className="font-serif text-2xl md:text-3xl md:text-2xl md:text-4xl text-primary font-bold mb-6">
                  Mengenal Lebih Dekat Desa Kedungdowo
                </h2>
                <p className="text-on-surface-variant text-base md:text-lg leading-relaxed mb-4">
                  Terletak di Kecamatan Andong, Kabupaten Boyolali, Jawa Tengah, <strong>Desa Kedungdowo</strong> merupakan wilayah yang berkembang pesat dengan perpaduan harmoni alam pedesaan dan sumber daya manusia yang produktif.
                </p>
                <p className="text-on-surface-variant text-base leading-relaxed mb-6">
                  Perekonomian desa kami ditopang oleh sektor pertanian, peternakan rakyat, serta geliat kewirausahaan UMKM yang digerakkan secara aktif oleh masyarakat. Bersama-sama, seluruh elemen warga di Desa Kedungdowo terus berkolaborasi untuk menciptakan lingkungan yang mandiri, sejahtera, dan berdaya saing.
                </p>
                


                <div>
                  <Link
                    href="/profil"
                    className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3.5 rounded-xl font-semibold text-sm hover:bg-surface-tint hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Selengkapnya Tentang Desa <Icon name="arrow_forward" />
                  </Link>
                </div>
              </AnimateIn>
            </div>

            {/* Right Column: Video Container */}
            <div className="lg:col-span-7">
              <AnimateIn delay={0.2} direction="left">
                <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-xl bg-surface-container-high border-2 border-outline-variant/30 relative group cursor-pointer">
                  <Image
                    src="/video-placeholder.png"
                    alt="Video Profil Desa Kedungdowo"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Icon name="play_arrow" className="text-2xl md:text-4xl text-white" filled />
                    </div>
                  </div>

                  {/* Video Title Card Overlay */}
                  <div className="absolute bottom-5 left-5 right-5 z-10 bg-black/60 backdrop-blur-md px-5 py-4 rounded-xl border border-white/10 flex items-center justify-between text-white">
                    <div>
                      <p className="font-semibold text-base">Tonton Video Profil Desa Kedungdowo</p>
                      <p className="text-xs text-white/80">Dokumentasi KKN UNDIP TIM II 2026</p>
                    </div>
                    <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full font-medium">5:00</span>
                  </div>
                </div>
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>


      {/* ====== BERITA TERKINI ====== */}
      <div className="batik-divider w-full" />
      <section className="py-16 md:py-24 bg-background">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <AnimateIn delay={0.1} direction="up">
              <span className="text-secondary font-semibold text-sm uppercase tracking-wider block mb-3">
                Kabar Desa
              </span>
              <h2 className="font-serif text-2xl md:text-3xl md:text-2xl md:text-4xl text-primary font-bold">
                Berita & Kegiatan Terbaru
              </h2>
            </AnimateIn>
            <Link
              href="/berita"
              className="inline-flex items-center gap-2 text-primary hover:text-surface-tint font-semibold group transition-colors"
            >
              Lihat Semua Berita 
              <Icon name="arrow_forward" className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {beritaList.length === 0 ? (
            <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-sm">
              <Icon name="newspaper" className="text-3xl md:text-5xl text-on-surface-variant/30 mb-4" />
              <h3 className="font-serif text-lg font-bold text-on-background">Belum Ada Berita</h3>
              <p className="text-on-surface-variant text-sm mt-1">Nantikan informasi kegiatan menarik dari desa kami segera.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {beritaList.map((berita, index) => (
                <AnimateIn key={berita.id} delay={0.2 + (index * 0.1)} direction="up" className="h-full">
                  <article className="h-full bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/20 hover:shadow-md hover:shadow-secondary/5 transition-all group flex flex-col">
                    {/* Image placeholder / icon */}
                    <div className="h-48 overflow-hidden relative bg-gradient-to-br from-surface-container to-surface-variant flex items-center justify-center">
                      {berita.fotoUrl ? (
                        <img src={berita.fotoUrl} alt={berita.judul} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <Icon name="campaign" filled className="text-6xl text-primary/30 group-hover:scale-110 transition-transform duration-500" />
                      )}
                      <div className={`absolute top-4 left-4 ${getChipColor(berita.kategori)} px-3 py-1 rounded-full text-xs font-bold`}>
                        {berita.kategori}
                      </div>
                    </div>

                    <div className="p-4 md:p-6 flex flex-col flex-grow">
                      <time className="text-xs font-medium text-on-surface-variant mb-3 flex items-center gap-1.5">
                        <Icon name="schedule" className="text-sm" />
                        {new Date(berita.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </time>
                      <h3 className="font-serif text-lg font-bold text-on-background mb-3 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        <Link href={getBeritaUrl(berita.judul, berita.id)}>
                          {berita.judul}
                        </Link>
                      </h3>
                      <p className="text-on-surface-variant text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                        {berita.konten}
                      </p>

                      <div className="pt-4 border-t border-outline-variant/10">
                        <Link href={getBeritaUrl(berita.judul, berita.id)} className="text-secondary font-bold text-sm hover:text-primary transition-colors flex items-center gap-1.5">
                          Baca Selengkapnya
                          <Icon name="arrow_forward" className="text-sm" />
                        </Link>
                      </div>
                    </div>
                  </article>
                </AnimateIn>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
