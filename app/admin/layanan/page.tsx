import { prisma } from "@/lib/prisma";
import LayananClient from "./LayananClient";

export const metadata = {
  title: "Manajemen Layanan Publik | Admin Desa Kedungdowo",
};

export default async function AdminLayananPage() {
  const data = await prisma.layananPublik.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-on-background mb-2">
        Layanan Publik
      </h1>
      <p className="text-on-surface-variant text-sm mb-8">
        Kelola permohonan surat dan pengaduan warga Desa Kedungdowo.
      </p>

      <LayananClient initialData={data} />
    </div>
  );
}
