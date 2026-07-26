import Image from "next/image";

export const metadata = { title: "Potensi Ketahanan Pangan - Desa Kedungdowo" };

export default function KetahananPanganPage() {
  return (
    <main className="w-full bg-surface pb-20">
      {/* 1. Hero Cover */}.
      <section className="relative w-full h-[60vh] min-h-[400px] md:h-[70vh] mt-20">
        <Image 
          src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=1920" 
          alt="Hamparan Pertanian Desa Kedungdowo" 
          fill 
          className="object-cover" 
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-7xl mx-auto px-6 pb-12 md:pb-16 w-full">
            <span className="inline-block px-3 py-1 mb-4 bg-primary text-on-primary text-xs font-bold uppercase tracking-wider rounded-sm">
              Potensi Desa
            </span>
            <h1 className="font-serif text-2xl md:text-3xl md:text-3xl md:text-5xl lg:text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Membangun Ekosistem Ketahanan Pangan Kedungdowo
            </h1>
            <p className="text-white/90 text-lg md:text-xl font-light italic border-l-4 border-primary pl-4">
              Dari Ketangguhan Lahan Tegalan hingga Kesejahteraan Gizi Keluarga
            </p>
          </div>
        </div>
      </section>

      {/* 2. Article Content */}
      <section className="w-full max-w-7xl mx-auto px-6 py-10 md:py-16 text-on-surface-variant text-lg leading-relaxed space-y-8">
        
        {/* Intro */}
        <div>
          <p className="mb-4">
            <strong className="text-on-surface text-xl font-bold">KEDUNGDOWO – </strong>
            Definisi ketahanan pangan sejati tidak hanya diukur dari seberapa penuh lumbung beras sebuah desa. Lebih dari itu, ketahanan pangan adalah tentang ekosistem kehidupan yang menyeluruh: kecerdasan petani beradaptasi dengan alam, kemandirian memproduksi lauk-pauk bernutrisi, hingga hadirnya jaminan kelayakan gizi bagi kelompok rentan seperti lansia dan ibu hamil.
          </p>
          <p className="mb-6">
            Di Desa Kedungdowo, ekosistem tersebut tidak sekadar menjadi wacana, melainkan telah berjalan secara organik dan berkesinambungan. Sinergi antarwarga dan kelembagaan desa menjadikan wilayah ini sebagai model ketangguhan pangan lokal yang patut dibanggakan.
          </p>
          <div className="border-l-4 border-outline pl-4 py-1 italic font-medium text-on-surface">
            Berikut adalah potret kekuatan sistem ketahanan pangan, ekonomi, dan jaring pengaman sosial yang menjadi roda penggerak kehidupan warga Desa Kedungdowo:
          </div>
        </div>

        {/* Section 1 */}
        <div className="pt-6">
          <h2 className="font-serif text-2xl md:text-2xl md:text-3xl font-bold text-on-surface mb-6">
            1. Adaptasi Cerdas Lahan Tegalan oleh Kelompok Tani
          </h2>
          <div className="space-y-4 text-justify">
            <p>
              Kondisi geografis berupa lahan tegalan kering justru melahirkan daya adaptasi yang tangguh dari para petani Kedungdowo. Bergerak di bawah naungan Kelompok Tani / Gabungan Kelompok Tani, lahan tersebut sukses dioptimalkan menjadi areal budidaya jagung dan berbagai komoditas palawija. Keberhasilan ini ditopang oleh kedisiplinan pengurus dalam mengelola sarana produksi, termasuk ketersediaan pupuk bersubsidi agar tepat sasaran.
            </p>
            <p>
              Kehebatan kelompok tani juga terlihat dari efisiensi manajemen rantai pasok pascapanen. Melalui sistem satu pintu (titik kumpul terpusat), hasil bumi warga dikumpulkan dan dijemput langsung oleh pengepul pada jadwal yang disepakati. Kolektivitas ini memastikan petani memiliki posisi tawar yang kuat, memangkas biaya transportasi, dan memberikan kepastian pasar yang memperkokoh ekonomi keluarga.
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <div className="pt-6">
          <h2 className="font-serif text-2xl md:text-2xl md:text-3xl font-bold text-on-surface mb-6">
            2. Kemandirian Gizi dan Ekonomi: Sinergi KTT, KWT, dan Pelaku UMKM
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="relative aspect-square sm:aspect-[4/3] rounded-lg overflow-hidden bg-surface-container shadow-sm border border-outline/10">
               <Image src="/umkm (1).jpeg" alt="Produk UMKM 1" fill className="object-cover" />
            </div>
            <div className="relative aspect-square sm:aspect-[4/3] rounded-lg overflow-hidden bg-surface-container shadow-sm border border-outline/10">
               <Image src="/umkm (2).jpeg" alt="Produk UMKM 2" fill className="object-cover" />
            </div>
            <div className="relative aspect-square sm:aspect-[4/3] rounded-lg overflow-hidden bg-surface-container shadow-sm border border-outline/10">
               <Image src="/umkm 3.jpg" alt="Produk UMKM 3" fill className="object-cover object-left" />
            </div>
          </div>
          <div className="space-y-4 text-justify">
            <p>
              Kebutuhan protein masyarakat Desa Kedungdowo disokong kuat oleh sektor peternakan mandiri. Melalui Kelompok Tani Ternak (KTT) Tani Subur dan peternak individu, warga menjadikan pekarangannya sebagai sentra penggemukan sapi pedaging, kambing, dan unggas. Peternakan ini berfungsi ganda: sebagai tabungan ekonomi masa depan sekaligus jaminan ketersediaan sumber protein hewani.
            </p>
            <p>
              Di ranah ekonomi kreatif, kolaborasi antara Kelompok Wanita Tani (KWT) dan para pelaku UMKM rumahan menunjukkan keuletan yang luar biasa. Tangan-tangan terampil ini menyulap hasil panen menjadi produk bernilai tambah tinggi, seperti tempe dan keripik singkong. Kehadiran produsen tempe memastikan akses harian warga terhadap protein nabati murah, sementara inovasi keripik singkong KWT sukses memperpanjang usia simpan bahan baku dan menjadi motor penggerak ekonomi perempuan desa.
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="pt-6">
          <h2 className="font-serif text-2xl md:text-2xl md:text-3xl font-bold text-on-surface mb-6">
            3. Jaring Pengaman Kesehatan Sosial: Peran Vital PKK, Dawis, dan Posyandu
          </h2>
          <div className="space-y-4 text-justify">
            <p>
              Ketahanan pangan tidak akan berarti jika tidak menyentuh kelompok yang paling membutuhkan. Desa Kedungdowo memiliki jaring pengaman kesehatan yang sangat proaktif dalam merawat kelompok rentan, khususnya lansia dan ibu hamil.
            </p>
            <p>
              Ujung tombak ketahanan gizi ini digerakkan oleh pahlawan akar rumput. Bersinergi dengan Bidan Desa, kelembagaan seperti Posyandu, Pemberdayaan Kesejahteraan Keluarga (PKK) yang rutin berkumpul setiap tanggal 16, hingga pergerakan di tingkat RT melalui Dasa Wisma (Dawis) menjalankan perannya dengan sangat efektif. Jejaring ini menjadi pusat edukasi gizi, pencegahan stunting sejak dini, dan distribusi Pemberian Makanan Tambahan (PMT), membuktikan bahwa kesehatan gizi warga selalu dikawal dengan kepedulian.
            </p>
          </div>
        </div>

        {/* Section 4 */}
        <div className="pt-6">
          <h2 className="font-serif text-2xl md:text-2xl md:text-3xl font-bold text-on-surface mb-6">
            4. Semangat Gotong Royong sebagai Fondasi Utama Desa
          </h2>
          <div className="space-y-4 text-justify">
            <p>
              Keberlanjutan ekosistem luar biasa ini tidak akan berdiri kokoh tanpa estafet kepemimpinan dan semangat gotong royong. Elemen pemuda melalui Karang Taruna yang rutin berkonsolidasi di awal bulan, terus hadir memberikan tenaga dan pemikiran inovatif untuk membantu kemajuan desa.
            </p>
            <p>
              Terintegrasinya dukungan penuh dari Pemerintah Desa, Gapoktan, KTT, KWT, Pelaku UMKM, PKK, Dawis, hingga Karang Taruna, menciptakan sebuah harmoni pembangunan yang inklusif. Dari lahan tegalan yang dirawat dengan keringat petani, hingga gizi keluarga yang dijaga oleh keuletan perempuan desa—inilah bukti nyata ketangguhan Desa Kedungdowo.
            </p>
          </div>
        </div>
      </section>

      {/* Footer/Conclusion */}
      <section className="w-full max-w-7xl mx-auto px-6 mt-4">
        <div className="bg-surface-container-low rounded-2xl p-4 md:p-8 md:p-4 md:p-10 border border-outline/10 shadow-sm text-center">
          <p className="font-serif text-xl md:text-2xl text-on-surface leading-relaxed mb-8 italic">
            "Dari lahan tegalan yang dirawat dengan keringat petani, diolah oleh keuletan perempuan desa, hingga dijaga oleh kepedulian sosial yang inklusif—inilah bukti nyata ketangguhan Desa Kedungdowo."
          </p>
          <span className="inline-block px-8 py-3 bg-primary text-on-primary font-bold rounded-lg text-sm tracking-wide">
            WUJUDKAN PANGAN MANDIRI, GIZI TERPENUHI, EKONOMI BERDIKARI
          </span>
        </div>
      </section>

    </main>
  );
}
