import { prisma } from "@/lib/prisma";
import { extractIdFromSlug, getBeritaUrl, slugify } from "@/lib/slug";
import Icon from "../../components/Icon";
import Link from "next/link";
import { notFound } from "next/navigation";
import ShareButtons from "./ShareButtons";

export const revalidate = 0;

const getChipColor = (kategori: string) => {
  const kat = kategori.toLowerCase();
  if (kat.includes("kegiatan")) return "bg-primary text-on-primary";
  if (kat.includes("berita")) return "bg-secondary text-on-secondary";
  if (kat.includes("pembangunan") || kat.includes("infrastruktur")) return "bg-tertiary text-on-tertiary";
  return "bg-primary text-on-primary";
};

async function findArtikelBySlug(slug: string) {
  const all = await prisma.artikel.findMany({
    include: { bloks: { orderBy: { urutan: "asc" } } },
    orderBy: { createdAt: "desc" }
  });

  const matched = all.find((a) => slugify(a.judul) === slug);
  if (matched) return matched;

  const artikelId = extractIdFromSlug(slug);
  if (artikelId) {
    return all.find((a) => a.id === artikelId) || null;
  }

  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const artikel = await findArtikelBySlug(resolvedParams.slug);
  
  if (!artikel) return { title: "Berita Tidak Ditemukan - Desa Kedungdowo" };
  return { 
    title: `${artikel.judul} - Desa Kedungdowo`,
    description: artikel.konten.substring(0, 150) + "..."
  };
}

export default async function DetailBeritaPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const artikel = await findArtikelBySlug(resolvedParams.slug);
  
  if (!artikel) {
    return notFound();
  }

  const hasBloks = artikel.bloks && artikel.bloks.length > 0;

  const rekomendasiList = await prisma.artikel.findMany({
    where: {
      id: { not: artikel.id },
      kategori: { not: "Pengumuman" }
    },
    orderBy: { createdAt: "desc" },
    take: 3
  });

  const formattedDate = new Date(artikel.createdAt).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <div className="relative min-h-screen bg-background">
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-10 pb-20 md:pb-32">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant/60 mb-10 pt-8 md:pt-16">
          <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
          <Icon name="chevron_right" className="text-xs" />
          <Link href="/berita" className="hover:text-primary transition-colors">Berita</Link>
          <Icon name="chevron_right" className="text-xs" />
          <span className="text-on-surface-variant line-clamp-1 max-w-[200px]">{artikel.judul}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-10">
          {/* Category & Date */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${getChipColor(artikel.kategori)}`}>
              {artikel.kategori}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-2xl md:text-3xl md:text-[2.75rem] font-bold text-primary leading-[1.25] tracking-tight mb-6 drop-shadow-sm">
            {artikel.judul}
          </h1>

          {/* Author Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-5 border-y border-outline-variant/20 bg-surface-container-lowest/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold flex items-center justify-center text-sm shadow-sm">
                <Icon name="edit_document" className="text-xl" />
              </div>
              <div className="text-sm">
                <p className="font-bold text-on-surface leading-tight">Redaksi Desa</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{formattedDate}</p>
              </div>
            </div>
            <ShareButtons judul={artikel.judul} />
          </div>
        </header>

        {/* Hero Image */}
        {artikel.fotoUrl && (
          <figure className="mb-10 w-full flex justify-center">
            <img 
              src={artikel.fotoUrl} 
              alt={artikel.judul} 
              className="w-auto max-w-full h-auto max-h-[300px] md:max-h-[500px] object-contain rounded-2xl shadow-md border border-outline-variant/20" 
            />
          </figure>
        )}

        {/* Article Body */}
        <article className="mb-16">
          <div className="prose prose-lg md:prose-xl prose-headings:font-serif prose-headings:font-bold prose-headings:text-primary prose-p:text-[#334155] prose-p:leading-[1.9] prose-a:text-secondary max-w-none">
            {hasBloks ? (
              artikel.bloks.map((blok, index) => {
                if (blok.tipe === "teks") {
                  return blok.konten.split("\n").map((paragraph, pIndex) => {
                    if (!paragraph.trim()) return null;
                    const isFirst = index === 0 && pIndex === 0;
                    
                    return (
                      <p 
                        key={`${blok.id}-${pIndex}`} 
                        className={isFirst 
                          ? "mb-8 text-lg md:text-[19px] leading-[1.8] text-[#1e293b] font-medium" 
                          : "mb-6 text-base md:text-[17px] text-[#334155] font-normal tracking-wide"}
                      >
                        {paragraph}
                      </p>
                    );
                  });
                } else if (blok.tipe === "gambar") {
                  return (
                    <figure key={blok.id} className="my-10 w-full flex flex-col items-center">
                      <img 
                        src={blok.konten} 
                        alt={blok.caption || artikel.judul} 
                        className="w-auto max-w-full h-auto max-h-[400px] md:max-h-[500px] object-contain rounded-2xl shadow-sm border border-outline-variant/10 not-prose" 
                      />
                      {blok.caption && (
                        <figcaption className="mt-3 text-center text-sm italic text-on-surface-variant/70 not-prose font-serif">
                          {blok.caption}
                        </figcaption>
                      )}
                    </figure>
                  );
                }
                return null;
              })
            ) : (
              artikel.konten.split("\n").map((paragraph, index) => {
                if (!paragraph.trim()) return null;
                const isFirst = index === 0;
                return (
                  <p 
                    key={index} 
                    className={isFirst 
                      ? "mb-8 text-lg md:text-[19px] leading-[1.8] text-[#1e293b] font-medium" 
                      : "mb-6 text-base md:text-[17px] text-[#334155] font-normal tracking-wide"}
                  >
                    {paragraph}
                  </p>
                );
              })
            )}
          </div>
        </article>

        {/* Tags / Footer CTA */}
        <div className="flex items-center justify-between py-6 border-y border-outline-variant/15 mb-16">
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Icon name="verified" className="text-primary text-lg" />
            <span className="font-medium">Diterbitkan oleh Pemerintah Desa Kedungdowo</span>
          </div>
          <Link 
            href="/berita"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-surface-tint transition-colors"
          >
            <Icon name="arrow_back" className="text-base" /> Semua Berita
          </Link>
        </div>

        {/* Recommendations */}
        {rekomendasiList.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-secondary font-semibold text-sm uppercase tracking-wider block mb-2">
                  Baca Juga
                </span>
                <h3 className="font-serif text-2xl font-bold text-on-surface">
                  Berita Lainnya
                </h3>
              </div>
              <Link href="/berita" className="text-sm font-bold text-primary hover:underline">
                Lihat Semua
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rekomendasiList.map((rec) => (
                <Link 
                  href={getBeritaUrl(rec.judul, rec.id)} 
                  key={rec.id} 
                  className="group bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                >
                  {rec.fotoUrl && (
                    <div className="h-36 w-full overflow-hidden shrink-0 bg-surface-container">
                      <img src={rec.fotoUrl} alt={rec.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-4 flex flex-col flex-grow">
                    <time className="text-[11px] font-medium text-on-surface-variant/60 block mb-1.5">
                      {new Date(rec.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </time>
                    <h4 className="text-sm font-serif font-bold text-on-surface mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug flex-grow">
                      {rec.judul}
                    </h4>
                    <span className="text-xs font-bold text-primary flex items-center gap-1 mt-auto">
                      Baca <Icon name="east" className="text-xs group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
