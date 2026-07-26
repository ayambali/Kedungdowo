import { prisma } from "@/lib/prisma";
import BeritaClient from "./BeritaClient";

export const metadata = { title: "Manajemen Berita | Admin Desa Kedungdowo" };

export default async function AdminBeritaPage() {
  const data = await prisma.artikel.findMany({
    orderBy: { createdAt: "desc" },
    include: { bloks: { orderBy: { urutan: "asc" } } },
  });

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-on-background mb-2">Manajemen Berita</h1>
      <p className="text-on-surface-variant text-sm mb-8">Kelola artikel berita dan kegiatan Desa Kedungdowo.</p>
      
      <BeritaClient initialData={data} />
    </div>
  );
}
