import { getStatistikPenduduk, seedStatistikPenduduk } from "@/app/actions/statistikPenduduk";
import StatistikForm from "./components/StatistikForm";
import Icon from "../../components/Icon";

export const metadata = { title: "Manajemen Statistik & Fasilitas Desa | Admin Desa Kedungdowo" };

export default async function DataPendudukPage() {
  // Try to fetch data
  let groupedStats = await getStatistikPenduduk();

  // Calculate overall total from "Jenis Kelamin" category
  const genderStats = groupedStats["Jenis Kelamin"] || [];
  const totalPenduduk = genderStats.reduce((acc, item) => acc + item.jumlah, 0);

  // Split data into Demografi and Fasilitas
  const demografiStats = Object.entries(groupedStats).filter(([k]) => !k.startsWith("Fasilitas"));
  const fasilitasStats = Object.entries(groupedStats).filter(([k]) => k.startsWith("Fasilitas"));

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-on-background mb-2">
        Statistik & Fasilitas Desa
      </h1>
      <p className="text-on-surface-variant text-sm mb-8">
        Kelola data statistik kependudukan dan sarana prasarana yang akan ditampilkan pada halaman Profil Desa secara dinamis.
      </p>

      {/* Stats Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-outline-variant/20 flex items-center gap-4 hover:shadow-md transition-shadow duration-300">
          <div className="w-12 h-12 rounded-xl bg-primary-container/10 text-primary flex items-center justify-center shrink-0">
            <Icon name="groups" className="text-2xl" />
          </div>
          <div>
            <p className="text-xs font-semibold text-on-surface-variant mb-0.5">Total Populasi</p>
            <h4 className="text-2xl font-bold text-on-surface leading-none">
              {totalPenduduk.toLocaleString('id-ID')} <span className="text-sm font-medium text-on-surface-variant">Jiwa</span>
            </h4>
          </div>
        </div>
      </div>

      {/* Information Alert Box */}
      <div className="bg-primary-container/10 border border-primary/20 rounded-2xl p-5 flex gap-4 text-xs leading-relaxed text-on-surface-variant/90 mb-8">
        <Icon name="info" className="text-primary text-xl shrink-0 mt-0.5" />
        <div>
          <strong className="text-on-surface font-semibold block mb-1">Panduan Sinkronisasi Data:</strong>
          Total Populasi (<strong className="text-primary font-bold">{totalPenduduk.toLocaleString('id-ID')} Jiwa</strong>) saat ini didasarkan dari penjumlahan kategori <strong className="text-on-surface font-semibold">Jenis Kelamin</strong> (Laki-laki + Perempuan). Kategori demografi tingkat individu lainnya (seperti Agama, Pendidikan, Umur, dan Dusun) disarankan untuk disesuaikan agar jumlah totalnya sinkron dan tidak memicu selisih data.
        </div>
      </div>

      {/* Demografi Section */}
      <div className="mb-4 mt-8 flex items-center gap-3 border-b border-outline-variant/30 pb-3">
        <Icon name="groups" className="text-primary text-2xl" />
        <h2 className="font-serif text-2xl font-bold text-on-surface">Data Demografi</h2>
      </div>
      <section className="columns-1 xl:columns-2 gap-6 space-y-6">
        {demografiStats.map(([kategori, items]) => (
          <div key={kategori} className="break-inside-avoid">
            <StatistikForm kategori={kategori} items={items} benchmarkTotal={totalPenduduk} />
          </div>
        ))}
      </section>

      {/* Fasilitas Section */}
      <div className="mb-4 mt-12 flex items-center gap-3 border-b border-outline-variant/30 pb-3">
        <Icon name="business" className="text-secondary text-2xl" />
        <h2 className="font-serif text-2xl font-bold text-on-surface">Sarana & Prasarana</h2>
      </div>
      <section className="columns-1 xl:columns-2 gap-6 space-y-6">
        {fasilitasStats.map(([kategori, items]) => (
          <div key={kategori} className="break-inside-avoid">
            <StatistikForm kategori={kategori} items={items} />
          </div>
        ))}
      </section>
    </div>
  );
}
