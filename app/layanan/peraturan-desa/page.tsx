import { prisma } from "@/lib/prisma";
import Icon from "@/app/components/Icon";
import Link from "next/link";
import SearchForm from "./SearchForm";

export const metadata = { title: "JDIH & Peraturan Desa - Desa Kedungdowo" };

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ page?: string, judul?: string, nomor?: string, tahun?: string, kategori?: string }>;
}

export default async function PeraturanDesaPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1;
  const itemsPerPage = 10;
  const skip = (page - 1) * itemsPerPage;

  const judul = resolvedParams.judul || "";
  const nomor = resolvedParams.nomor || "";
  const tahun = resolvedParams.tahun || "";
  const kategori = resolvedParams.kategori || "";

  const where: any = {
    judul: { contains: judul, mode: "insensitive" },
    nomor: { contains: nomor, mode: "insensitive" },
    tahun: { contains: tahun, mode: "insensitive" },
  };

  if (kategori) {
    where.kategori = kategori;
  }

  // @ts-ignore
  const totalCount = await (prisma as any).peraturanDesa.count({ where });
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // @ts-ignore
  const peraturanList = await (prisma as any).peraturanDesa.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip,
    take: itemsPerPage,
  });

  // @ts-ignore
  const groupedCategories = await (prisma as any).peraturanDesa.groupBy({
    by: ['kategori'],
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: 'desc'
      }
    }
  });

  return (
    <div className="relative min-h-screen bg-surface py-20 md:py-32">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#707a6c_1px,transparent_1px),radial-gradient(#707a6c_1px,transparent_1px)] bg-[size:40px_40px] bg-[position:0_0,20px_20px] opacity-[0.03] pointer-events-none" />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-6">
        
        {/* Page Header */}
        <div className="pt-8 md:pt-12 mb-12 text-center max-w-2xl mx-auto">
          <h1 className="font-serif text-2xl md:text-3xl md:text-3xl md:text-5xl font-bold text-on-surface mb-4 leading-tight">
            Produk Hukum <span className="italic font-light text-primary">Desa</span>
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
            Jaringan Dokumentasi dan Informasi Hukum resmi Pemerintah Desa Kedungdowo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Main Content (Kiri) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Search Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/20 p-4 md:p-6 md:p-4 md:p-8">
              <SearchForm 
                initialJudul={judul} 
                initialNomor={nomor} 
                initialTahun={tahun} 
                initialKategori={kategori} 
              />
            </div>

            {/* List Data JDIH */}
            <div className="flex flex-col gap-[16px]">
              {peraturanList.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/20 p-12 text-center text-on-surface-variant">
                  <Icon name="search_off" className="text-3xl md:text-5xl opacity-30 mb-3" />
                  <p className="font-bold text-lg text-on-surface">Dokumen Tidak Ditemukan</p>
                  <p className="text-sm mt-1 opacity-80">Coba gunakan kata kunci pencarian yang lain.</p>
                </div>
              ) : (
                peraturanList.map((item: any) => (
                  <div 
                    key={item.id} 
                    className="bg-white border border-outline-variant/50 rounded-2xl p-[24px] shadow-sm flex flex-col md:flex-row gap-[24px] items-start hover:shadow-md transition-shadow relative"
                  >
                    {/* Icon */}
                    <div className="shrink-0 pt-1 hidden md:block">
                      <div className="w-16 h-20 bg-red-50 rounded flex items-center justify-center border-2 border-red-500 text-red-600 relative overflow-hidden">
                        <div className="absolute top-0 bg-red-600 text-white text-[10px] font-bold w-full text-center py-0.5 tracking-wider">PDF</div>
                        <Icon name="folder" className="text-2xl md:text-3xl mt-3" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-3 flex-grow w-full">
                      <h2 className="font-serif text-[20px] md:text-[22px] font-bold text-primary leading-tight pr-12 md:pr-0">
                        {item.judul}
                      </h2>
                      
                      {/* Metadata Tags */}
                      <div className="flex flex-wrap items-center gap-3 text-on-surface-variant text-[13px] font-medium">
                        <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1 rounded-md border border-outline-variant/20">
                          <Icon name="description" className="text-[16px] text-primary" />
                          {item.kategori}
                        </div>
                        <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1 rounded-md border border-outline-variant/20">
                          <Icon name="tag" className="text-[16px] text-secondary" />
                          Nomor {item.nomor}
                        </div>
                        <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1 rounded-md border border-outline-variant/20">
                          <Icon name="calendar_today" className="text-[16px] text-tertiary" />
                          Tahun {item.tahun}
                        </div>
                        
                        {item.filePdfUrl ? (
                          <a 
                            href={`/api/dokumen?url=${Buffer.from(item.filePdfUrl).toString('base64')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-[#e74c3c]/10 text-[#e74c3c] hover:bg-[#e74c3c] hover:text-white px-4 py-1 rounded-md text-[13px] font-bold transition-colors inline-flex items-center gap-1.5"
                          >
                            <Icon name="download" className="text-[16px]" />
                            Download PDF
                          </a>
                        ) : (
                          <span className="bg-surface-variant text-on-surface-variant px-4 py-1 rounded-md text-[13px] font-bold inline-flex items-center gap-1.5 cursor-not-allowed">
                            <Icon name="draft" className="text-[16px]" />
                            Hanya Fisik
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-wrap justify-center items-center gap-2 pt-8 border-t border-outline-variant/15">
                {page > 1 ? (
                  <Link href={`/layanan/peraturan-desa?page=${page - 1}&judul=${judul}&nomor=${nomor}&tahun=${tahun}&kategori=${kategori}`} scroll={false} className="inline-flex items-center gap-1 px-4 h-10 rounded-xl border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all text-sm font-semibold">
                    <Icon name="chevron_left" className="text-lg" />
                  </Link>
                ) : (
                  <button disabled className="inline-flex items-center gap-1 px-4 h-10 rounded-xl border border-outline-variant/20 text-on-surface-variant/30 cursor-not-allowed text-sm font-semibold">
                    <Icon name="chevron_left" className="text-lg" />
                  </button>
                )}

                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Link
                      key={pageNum}
                      href={`/layanan/peraturan-desa?page=${pageNum}&judul=${judul}&nomor=${nomor}&tahun=${tahun}&kategori=${kategori}`}
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
                  <Link href={`/layanan/peraturan-desa?page=${page + 1}&judul=${judul}&nomor=${nomor}&tahun=${tahun}&kategori=${kategori}`} scroll={false} className="inline-flex items-center gap-1 px-4 h-10 rounded-xl border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all text-sm font-semibold">
                    <Icon name="chevron_right" className="text-lg" />
                  </Link>
                ) : (
                  <button disabled className="inline-flex items-center gap-1 px-4 h-10 rounded-xl border border-outline-variant/20 text-on-surface-variant/30 cursor-not-allowed text-sm font-semibold">
                    <Icon name="chevron_right" className="text-lg" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar (Kanan) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/20 p-4 md:p-6 sticky top-28">
              <h3 className="font-bold text-lg text-on-surface mb-5 pb-3 border-b border-outline-variant/20 font-serif">Jenis Peraturan</h3>
              <ul className="flex flex-col gap-1">
                <li>
                  <Link 
                    href={`/layanan/peraturan-desa?judul=${judul}&nomor=${nomor}&tahun=${tahun}`}
                    className={`flex justify-between items-center px-3 py-2.5 rounded-lg transition-colors ${!kategori ? 'bg-primary/5 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'}`}
                  >
                    <span className="text-[14px]">Semua Peraturan</span>
                  </Link>
                </li>
                {groupedCategories.map((c: any) => (
                  <li key={c.kategori}>
                    <Link 
                      href={`/layanan/peraturan-desa?kategori=${encodeURIComponent(c.kategori)}&judul=${judul}&nomor=${nomor}&tahun=${tahun}`} 
                      className={`flex justify-between items-center px-3 py-2.5 rounded-lg transition-colors ${kategori === c.kategori ? 'bg-primary/5 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'}`}
                    >
                      <span className="text-[14px] leading-tight pr-2">{c.kategori}</span>
                      <span className="bg-red-50 text-red-500 font-bold px-2 py-0.5 rounded-md text-[11px] shrink-0">{c._count.id}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
