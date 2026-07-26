import { prisma } from "@/lib/prisma";
import PerangkatClient from "./PerangkatClient";

export const metadata = { title: "Manajemen Perangkat Desa | Admin Desa Kedungdowo" };

export default async function AdminPerangkatPage() {
  const data = await prisma.perangkatDesa.findMany({
    orderBy: { id: "asc" }, // Usually sorted by some priority, asc ID works for now
  });

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-on-background mb-2">Manajemen Perangkat Desa</h1>
      <p className="text-on-surface-variant text-sm mb-8">Kelola struktur organisasi dan perangkat pemerintah Desa Kedungdowo.</p>
      
      <PerangkatClient initialData={data} />
    </div>
  );
}
