import { getSemuaArsip } from "@/app/actions/arsipDigital";
import ArsipClient from "./ArsipClient";

export const metadata = { title: "Arsip Digital | Admin Desa Kedungdowo" };

export default async function ArsipPage() {
  const initialData = await getSemuaArsip();
  
  // Format dates so they can be serialized properly to Client Component
  const formattedData = initialData.map((item: any) => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
  }));

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-on-background mb-2">
        Arsip Digital
      </h1>
      <p className="text-on-surface-variant text-sm mb-8">
        Kelola dan simpan dokumen, surat, serta inventaris arsip desa secara digital.
      </p>

      <ArsipClient initialData={formattedData} />
    </div>
  );
}
