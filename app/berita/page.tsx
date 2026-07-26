import { prisma } from "@/lib/prisma";
import Icon from "../components/Icon";
import Link from "next/link";
import { getBeritaUrl } from "@/lib/slug";
import AnimateIn from "../components/AnimateIn";
import PengumumanWidgetClient from "../components/PengumumanWidgetClient";

export const metadata = { 
  title: "Berita & Informasi Desa - Desa Kedungdowo",
  description: "Portal berita resmi, laporan kegiatan masyarakat, dan kabar terbaru Desa Kedungdowo, Kecamatan Andong, Kabupaten Boyolali."
};

export const revalidate = 0;

const getChipColor = (kategori: string) => {
  const kat = kategori.toLowerCase();
  if (kat.includes("kegiatan")) return "bg-primary text-on-primary";
  if (kat.includes("berita")) return "bg-secondary text-on-secondary";
  if (kat.includes("pembangunan") || kat.includes("infrastruktur")) return "bg-tertiary text-on-tertiary";
  return "bg-primary text-on-primary";
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BeritaPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1;
  const itemsPerPage = 6;
  const skip = (page - 1) * itemsPerPage;

  let featured = await prisma.artikel.findFirst({
    where: { isSorotan: true, kategori: { not: "Pengumuman" } }
  });

  if (!featured) {
    featured = await prisma.artikel.findFirst({
      where: { kategori: { not: "Pengumuman" } },
      orderBy: { createdAt: "desc" }
    });
  }

  const totalOthersCount = await prisma.artikel.count({
    where: {
      kategori: { not: "Pengumuman" },
      id: featured ? { not: featured.id } : undefined
    }
  });

  const totalPages = Math.ceil(totalOthersCount / itemsPerPage);

  const others = await prisma.artikel.findMany({
    where: {
      kategori: { not: "Pengumuman" },
      id: featured ? { not: featured.id } : undefined
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: itemsPerPage
  });

  const pengumumanList = await prisma.artikel.findMany({
    where: { kategori: "Pengumuman" },
    orderBy: { createdAt: "desc" },
    take: 3
  });

  return (
    <div className="relative min-h-screen bg-background">
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-20 md:pb-32">
        
        {/* ===== PAGE HEADER ===== */}
        <div className="pt-20 md:pt-28 mb-12 text-center max-w-2xl mx-auto px-6">
          <AnimateIn delay={0.1} direction="up">
            <h1 className="font-serif text-2xl md:text-3xl md:text-3xl md:text-5xl font-bold text-on-surface mb-2 md:mb-4 leading-tight">
              Berita <span className="italic font-light text-primary">& Kegiatan</span>
            </h1>
            <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
              Pusat informasi resmi mengenai kegiatan, pembangunan, dan pengumuman terkini di lingkungan Desa Kedungdowo.
            </p>
          </AnimateIn>
        </div>

        {/* ===== FEATURED + PENGUMUMAN ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Featured Story */}
          <div className="lg:col-span-8">
            {featured && (
              <AnimateIn delay={0.2} direction="up" className="h-full">
                <Link href={getBeritaUrl(featured.judul, featured.id)} className="group block h-full">
                  <div className="relative rounded-2xl overflow-hidden h-full min-h-[420px] shadow-lg">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      {featured.fotoUrl ? (
                        <img 
                          src={featured.fotoUrl} 
                          alt={featured.judul} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-secondary" />
                      )}
                      {/* Dark gradient overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    </div>

                    {/* Content overlaid on image */}
                    <div className="relative z-10 flex flex-col justify-end h-full p-4 md:p-6 md:p-4 md:p-10">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${getChipColor(featured.kategori)}`}>
                          {featured.kategori}
                        </span>
                        <span className="text-white/70 text-xs font-medium flex items-center gap-1">
                          <Icon name="schedule" className="text-xs" />
                          {new Date(featured.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                      </div>
                      <h2 className="font-serif text-2xl md:text-2xl md:text-4xl font-bold text-white leading-snug mb-3 group-hover:text-[#a3f69c] transition-colors line-clamp-3">
                        {featured.judul}
                      </h2>
                      <p className="text-white/80 text-sm md:text-base line-clamp-2 leading-relaxed max-w-2xl mb-4">
                        {featured.konten}
                      </p>
                      <span className="inline-flex items-center gap-2 text-[#a3f69c] text-sm font-bold group-hover:gap-3 transition-all">
                        Baca Selengkapnya <Icon name="arrow_forward" className="text-base" />
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimateIn>
            )}
          </div>

          {/* Pengumuman Sidebar */}
          <aside className="lg:col-span-4">
            <AnimateIn delay={0.3} direction="left" className="w-full">
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-sm p-4 md:p-6 flex flex-col max-h-[500px] lg:max-h-[520px]">
                <div className="flex items-center gap-2 mb-5 pb-4 border-b border-outline-variant/15 shrink-0">
                  <Icon name="campaign" filled className="text-secondary text-xl" />
                  <h3 className="font-serif text-lg font-bold text-on-surface">Pengumuman</h3>
                </div>
                <PengumumanWidgetClient pengumumanList={pengumumanList} />
              </div>
            </AnimateIn>
          </aside>
        </div>

        {/* ===== BERITA TERKINI GRID ===== */}
        <div className="mb-12">
          <AnimateIn delay={0.1} direction="up">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-secondary font-semibold text-sm uppercase tracking-wider block mb-2">
                  Berita Lainnya
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-on-surface">
                  Kabar Terkini
                </h2>
              </div>
            </div>
          </AnimateIn>

          {others.length === 0 && !featured ? (
            <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant/20">
              <Icon name="article" className="text-3xl md:text-5xl text-on-surface-variant/30 mb-4" />
              <h3 className="font-serif text-lg font-bold text-on-background">Belum Ada Berita</h3>
              <p className="text-on-surface-variant text-sm mt-1">Nantikan informasi terbaru dari Desa Kedungdowo.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {others.map((berita, idx) => (
                <AnimateIn key={berita.id} delay={0.1 + 0.08 * (idx % 3)} direction="up" className="h-full">
                  <Link href={getBeritaUrl(berita.judul, berita.id)} className="group block h-full">
                    <article className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                      
                      {/* Image */}
                      <div className="h-52 w-full overflow-hidden relative bg-surface-container shrink-0">
                        {berita.fotoUrl ? (
                          <img 
                            src={berita.fotoUrl} 
                            alt={berita.judul} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                            <Icon name="article" className="text-3xl md:text-5xl text-primary/20" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${getChipColor(berita.kategori)}`}>
                            {berita.kategori}
                          </span>
                        </div>
                      </div>

                      {/* Text Content */}
                      <div className="p-5 flex flex-col flex-grow">
                        <time className="text-[11px] font-medium text-on-surface-variant/70 mb-2 block">
                          {new Date(berita.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                        </time>
                        <h3 className="font-serif text-base font-bold text-on-surface mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug flex-grow">
                          {berita.judul}
                        </h3>
                        <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed mb-4">
                          {berita.konten}
                        </p>
                        <span className="inline-flex items-center gap-1 text-primary text-xs font-bold mt-auto">
                          Baca Selengkapnya 
                          <Icon name="east" className="text-sm group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </article>
                  </Link>
                </AnimateIn>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex flex-wrap justify-center items-center gap-2 pt-8 border-t border-outline-variant/15">
              {page > 1 ? (
                <Link href={`/berita?page=${page - 1}`} scroll={false} className="inline-flex items-center gap-1 px-4 h-10 rounded-xl border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all text-sm font-semibold">
                  <Icon name="chevron_left" className="text-lg" /> Sebelumnya
                </Link>
              ) : (
                <button disabled className="inline-flex items-center gap-1 px-4 h-10 rounded-xl border border-outline-variant/20 text-on-surface-variant/30 cursor-not-allowed text-sm font-semibold">
                  <Icon name="chevron_left" className="text-lg" /> Sebelumnya
                </button>
              )}

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <Link
                    key={pageNum}
                    href={`/berita?page=${pageNum}`}
                    scroll={false}
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                      pageNum === page
                        ? "bg-primary text-on-primary shadow-sm"
                        : "border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container hover:text-primary"
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}

              {page < totalPages ? (
                <Link href={`/berita?page=${page + 1}`} scroll={false} className="inline-flex items-center gap-1 px-4 h-10 rounded-xl border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all text-sm font-semibold">
                  Selanjutnya <Icon name="chevron_right" className="text-lg" />
                </Link>
              ) : (
                <button disabled className="inline-flex items-center gap-1 px-4 h-10 rounded-xl border border-outline-variant/20 text-on-surface-variant/30 cursor-not-allowed text-sm font-semibold">
                  Selanjutnya <Icon name="chevron_right" className="text-lg" />
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
