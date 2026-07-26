import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import Icon from "../components/Icon";
import AdminCharts from "./components/AdminCharts";
import { getStatistikPenduduk } from "@/app/actions/statistikPenduduk";

function timeAgo(date: Date) {
  const diff = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 172800) return "Kemarin";
  return `${Math.floor(diff / 86400)} hari lalu`;
}

export default async function AdminDashboard() {
  const session = await getSession();
  const displayName = session?.namaLengkap || session?.username || "Admin";
  const roleLabel = session?.role === "superadmin" ? "Superadmin" : "Admin Desa";

  const countBerita = await prisma.artikel.count();
  const countUmkm = await prisma.produkUMKM.count();
  const countPerangkat = await prisma.perangkatDesa.count();

  // Fetch population total
  const groupedStats = await getStatistikPenduduk();
  const genderStats = groupedStats["Jenis Kelamin"] || [];
  const totalPenduduk = genderStats.reduce((acc, item) => acc + item.jumlah, 0) || 3368;
  
  const ringkasanStats = groupedStats["Ringkasan Demografi"] || [];
  const totalKkItem = ringkasanStats.find(item => item.label.includes('KK'));
  const totalKK = totalKkItem ? totalKkItem.jumlah : 1168;

  // Get current date representation in Indonesian
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'short' };
  const formattedDate = today.toLocaleDateString('id-ID', options);

  const stats = [
    { label: "Warga Terdaftar", value: totalPenduduk.toLocaleString('id-ID'), change: "Jiwa", trend: "up", icon: "groups", bg: "bg-primary-container/10 text-primary", badgeBg: "bg-primary-fixed/30 text-primary" },
    { label: "Kepala Keluarga", value: totalKK.toLocaleString('id-ID'), change: "KK", trend: "up", icon: "family_restroom", bg: "bg-primary-container/10 text-primary", badgeBg: "bg-primary-fixed/30 text-primary" },
    { label: "Produk UMKM", value: countUmkm.toString(), change: "Aktif", trend: "store", icon: "storefront", bg: "bg-secondary-container/20 text-secondary", badgeBg: "bg-secondary-fixed/30 text-secondary" },
    { label: "Berita & Kegiatan", value: countBerita.toString(), change: "Publikasi", trend: "news", icon: "newspaper", bg: "bg-tertiary-container/10 text-tertiary", badgeBg: "bg-tertiary-fixed/30 text-tertiary" },
  ];

  // Fetch recent activities
  const recentArsip = await prisma.arsipDigital.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });
  const recentLayanan = await prisma.layananPublik.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });
  const recentArtikel = await prisma.artikel.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });

  type Activity = {
    id: string;
    type: 'arsip' | 'layanan' | 'artikel';
    title: string;
    subtitle: string;
    date: Date;
    status: string;
    statusColor: string;
    icon: string;
    iconColor: string;
  };

  const activities: Activity[] = [];

  recentArsip.forEach(item => {
    activities.push({
      id: `arsip-${item.id}`,
      type: 'arsip',
      title: `Arsip Baru: ${item.nomor}`,
      subtitle: `Kategori: ${item.kategori}`,
      date: item.createdAt,
      status: 'Selesai',
      statusColor: 'bg-secondary-container/50 text-secondary border-secondary-container',
      icon: 'folder',
      iconColor: 'bg-primary-fixed/20 text-primary',
    });
  });

  recentLayanan.forEach(item => {
    let statusColor = 'bg-primary-fixed/30 text-primary-fixed-variant border-primary-fixed/30';
    if (item.status === 'Belum Direspon') statusColor = 'bg-error-container/80 text-on-error-container border-error/20';
    if (item.status === 'Selesai') statusColor = 'bg-secondary-container/50 text-secondary border-secondary-container';

    activities.push({
      id: `layanan-${item.id}`,
      type: 'layanan',
      title: `Layanan: ${item.namaPemohon}`,
      subtitle: `Kategori: ${item.kategori}`,
      date: item.createdAt,
      status: item.status,
      statusColor,
      icon: 'support_agent',
      iconColor: 'bg-error-container/40 text-error',
    });
  });

  recentArtikel.forEach(item => {
    activities.push({
      id: `artikel-${item.id}`,
      type: 'artikel',
      title: `Publikasi: ${item.judul}`,
      subtitle: `Kategori: ${item.kategori}`,
      date: item.createdAt,
      status: 'Selesai',
      statusColor: 'bg-secondary-container/50 text-secondary border-secondary-container',
      icon: 'newspaper',
      iconColor: 'bg-tertiary-fixed/20 text-tertiary',
    });
  });

  activities.sort((a, b) => b.date.getTime() - a.date.getTime());
  const latestActivities = activities.slice(0, 5);

  return (
    <div className="space-y-10">
      {/* Asymmetric Grid: Welcome & Weather */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Welcome Banner */}
        <section className="xl:col-span-8 bg-white rounded-3xl p-4 md:p-8 md:p-4 md:p-10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] border border-outline-variant/20 relative overflow-hidden flex flex-col justify-center min-h-[260px]">
          <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none rounded-3xl">
            <div className="absolute -right-32 -top-32 w-96 h-96 bg-primary-fixed opacity-20 rounded-full blur-[80px]"></div>
            <div className="absolute right-10 bottom-10 w-64 h-64 bg-secondary-fixed opacity-15 rounded-full blur-[60px]"></div>
          </div>
          <div className="relative z-10 max-w-xl">
            <h2 className="text-2xl md:text-3xl md:text-2xl md:text-4xl font-serif font-bold text-on-surface mb-3 leading-tight">
              Sugeng Enjang,<br />
              <span className="text-primary italic">{displayName}</span>
            </h2>
            <p className="text-sm md:text-base text-on-surface-variant/80 leading-relaxed">
              Sistem Desa Digital Kedungdowo berjalan optimal hari ini. Seluruh layanan administrasi dan pengelolaan data publik aktif tanpa kendala.
            </p>
          </div>
        </section>

        {/* Weather/Date Widget */}
        <section className="xl:col-span-4 bg-white rounded-3xl p-4 md:p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] border border-outline-variant/20 flex flex-col justify-between relative overflow-hidden min-h-[260px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary-fixed opacity-15 rounded-bl-full blur-2xl"></div>
          <div>
            <p className="text-[10px] text-secondary font-sans uppercase tracking-widest font-bold mb-1">Status Hari Ini</p>
            <h3 className="text-xl font-serif font-bold text-on-surface capitalize">{formattedDate}</h3>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <Icon name="partly_cloudy_day" className="text-3xl md:text-5xl text-tertiary-container mb-1" />
            <div className="flex items-end w-full">
              <div>
                <p className="text-2xl md:text-3xl font-bold text-on-surface leading-none mb-1">
                  28<span className="text-lg text-on-surface-variant/50">°C</span>
                </p>
                <p className="text-xs text-on-surface-variant">Cerah Berawan, Boyolali</p>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Varied Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-outline-variant/20 hover:shadow-md transition-shadow duration-300 flex flex-col justify-between min-h-[140px]">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
                <Icon name={stat.icon} className="text-xl" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${stat.badgeBg}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold text-on-surface-variant mb-0.5">{stat.label}</p>
              <h4 className="text-2xl font-bold text-on-surface">{stat.value}</h4>
            </div>
          </div>
        ))}
      </section>

      {/* Custom Data Visualization */}
      <AdminCharts agamaStats={groupedStats["Agama"] || []} totalPenduduk={totalPenduduk} />

      {/* Timeline Activity List */}
      <section className="bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] border border-outline-variant/20 overflow-hidden">
        <div className="px-8 py-5 border-b border-outline-variant/20 flex items-center bg-white/50">
          <h3 className="text-lg font-serif font-bold text-on-surface">Aktivitas Terbaru</h3>
        </div>
        <div className="p-4 md:p-8">
          <div className="flex flex-col relative">
            
            {latestActivities.length === 0 ? (
              <p className="text-on-surface-variant text-sm">Belum ada aktivitas terbaru.</p>
            ) : latestActivities.map((act, index) => {
              const isLast = index === latestActivities.length - 1;
              return (
                <div key={act.id} className={`timeline-item flex gap-6 relative ${!isLast ? 'pb-8 timeline-line' : ''}`}>
                  <div className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center shrink-0 shadow-sm z-10 ${act.iconColor}`}>
                    <Icon name={act.icon} className="text-[18px]" />
                  </div>
                  <div className={`flex-1 flex flex-col sm:flex-col md:flex-row sm:justify-between sm:items-center gap-2 bg-surface-container-lowest p-4 rounded-2xl border hover:shadow-md transition-shadow ${act.type === 'layanan' && act.status === 'Belum Direspon' ? 'border-error-container/40' : 'border-outline-variant/10'}`}>
                    <div>
                      <p className="text-sm font-semibold text-on-surface mb-0.5">{act.title}</p>
                      <p className="text-xs text-on-surface-variant">{act.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <span className="text-[11px] text-on-surface-variant/70">
                        {timeAgo(act.date)}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${act.statusColor}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${act.type === 'layanan' && act.status === 'Belum Direspon' ? 'bg-error animate-pulse' : 'bg-current'}`}></span>
                        <span>{act.status}</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </section>
    </div>
  );
}
