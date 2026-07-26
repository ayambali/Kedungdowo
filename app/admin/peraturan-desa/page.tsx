import { prisma } from "@/lib/prisma";
import Icon from "@/app/components/Icon";
import PeraturanForm from "./PeraturanForm";
import { hapusPeraturan } from "@/app/actions/peraturan";

export const metadata = { title: "Admin JDIH - Peraturan Desa" };

export const revalidate = 0; // Disable static rendering

export default async function AdminPeraturanPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const q = resolvedParams?.q || "";

  const peraturanList = await prisma.peraturanDesa.findMany({
    where: {
      OR: [
        { judul: { contains: q, mode: "insensitive" } },
        { nomor: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  const handleDelete = async (formData: FormData) => {
    "use server";
    const id = formData.get("id") as string;
    if (id) {
      await hapusPeraturan(id);
    }
  };

  return (
    <div className="p-4 md:p-6 md:p-4 md:p-10 max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-on-surface">JDIH / Peraturan Desa</h1>
          <p className="text-on-surface-variant mt-1 text-sm md:text-base">
            Kelola dokumen peraturan, keputusan, dan arsip hukum desa
          </p>
        </div>
        
        {/* Tombol & Modal Tambah Peraturan */}
        <PeraturanForm />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="p-4 md:p-6 md:px-8 md:py-6 border-b border-outline-variant/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-on-surface">Daftar Dokumen Hukum</h2>
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <form method="GET" action="/admin/peraturan-desa" className="relative">
              <input 
                type="text" 
                name="q"
                defaultValue={q}
                placeholder="Cari judul atau nomor..." 
                className="pl-9 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-sm w-full md:w-[250px] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 flex items-center">
                <Icon name="search" className="text-[18px]" />
              </span>
            </form>
            <span className="px-3 py-1 bg-surface-variant text-on-surface-variant text-xs font-bold rounded-full whitespace-nowrap">
              Total: {peraturanList.length} Dokumen
            </span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-outline-variant/20">
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">No / Tahun</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Judul & Kategori</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Lokasi Fisik</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {peraturanList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant">
                    <Icon name="folder_off" className="text-2xl md:text-4xl opacity-50 mb-2" />
                    <p>Belum ada dokumen peraturan yang diunggah.</p>
                  </td>
                </tr>
              ) : (
                peraturanList.map((item) => (
                  <tr key={item.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-bold text-sm text-on-surface">{item.nomor}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">Tahun {item.tahun}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-sm text-on-surface line-clamp-1">{item.judul}</p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded-md">
                        {item.kategori}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-on-surface">{item.lokasiSimpan}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{item.jumlah} Rangkap</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      {item.filePdfUrl && (
                        <a 
                          href={`/api/dokumen?url=${Buffer.from(item.filePdfUrl).toString('base64')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          title="Lihat PDF"
                        >
                          <Icon name="picture_as_pdf" className="text-[18px]" />
                        </a>
                      )}
                      
                      <PeraturanForm initialData={item} />
                      
                      <form action={handleDelete} className="inline-block">
                        <input type="hidden" name="id" value={item.id} />
                        <button 
                          type="submit"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Hapus Langsung"
                        >
                          <Icon name="delete" className="text-[18px]" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
