import { prisma } from "@/lib/prisma";
import UmkmClient from "./UmkmClient";

export const metadata = { title: "Manajemen UMKM | Admin Desa Kedungdowo" };

export default async function AdminUmkmPage() {
  const data = await prisma.produkUMKM.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-on-background mb-2">Manajemen UMKM</h1>
      <p className="text-on-surface-variant text-sm mb-8">Kelola data direktori UMKM Desa Kedungdowo.</p>
      
      {/* Client Component for Interactions */}
      <UmkmClient initialData={data} />
    </div>
  );
}
