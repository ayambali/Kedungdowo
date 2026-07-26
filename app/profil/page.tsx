import Icon from "../components/Icon";
import AnimateIn from "../components/AnimateIn";
import { getStatistikPenduduk } from "@/app/actions/statistikPenduduk";

export const metadata = { title: "Profil Desa - Desa Kedungdowo" };

export const revalidate = 0;

const KEPALA_DESA = [
  { nama: "Reso Wijoyo", periode: "1932 – 1959", ke: "I" },
  { nama: "Ramto Sastro", periode: "1959 – 1987", ke: "II" },
  { nama: "Marto Sutomo", periode: "1987 – 1992", ke: "III" },
  { nama: "Yuwaningsih", periode: "1992 – 1997", ke: "IV" },
  { nama: "Marno", periode: "1997 – 2007", ke: "V" },
  { nama: "Marno", periode: "2007 – 2013", ke: "VI" },
  { nama: "Suyadi", periode: "2013 – 2019", ke: "VII" },
  { nama: "Suyadi", periode: "2019 – sekarang", ke: "VIII" },
];

export default async function ProfilPage() {
  // Fetch dynamic data from database
  const groupedStats = await getStatistikPenduduk();

  // Extract categories
  const genderStats = groupedStats["Jenis Kelamin"] || [];
  const totalPenduduk = genderStats.reduce((acc, item) => acc + item.jumlah, 0);
  const lakiLaki = genderStats.find(i => i.label === "Laki-laki")?.jumlah || 0;
  const perempuan = genderStats.find(i => i.label === "Perempuan")?.jumlah || 0;

  const ringkasanStats = groupedStats["Ringkasan Demografi"] || [];
  const totalKK = ringkasanStats.find(i => i.label.includes("KK"))?.jumlah || 0;

  const agamaStats = groupedStats["Agama"] || [];
  const pendidikanStats = groupedStats["Tingkat Pendidikan"] || [];
  const pekerjaanStats = groupedStats["Pekerjaan"] || [];
  const kesejahteraanStats = groupedStats["Kesejahteraan Warga (KK)"] || [];
  const ketenagakerjaanStats = groupedStats["Ketenagakerjaan"] || [];

  const angkatanKerja = ketenagakerjaanStats.find(i => i.label.includes("Angkatan"))?.jumlah || 0;
  const pengangguran = ketenagakerjaanStats.find(i => i.label.includes("Belum Bekerja") || i.label.includes("Pengangguran"))?.jumlah || 0;

  const pendidikanFasilitas = groupedStats["Fasilitas Pendidikan"] || [];
  const kesehatanFasilitas = groupedStats["Fasilitas Kesehatan"] || [];
  const publikFasilitas = groupedStats["Fasilitas Publik"] || [];

  return (
    <main className="w-full">
      {/* 1. Hero Section */}
      <section className="py-16 md:py-32 bg-surface relative overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-6 relative z-10 text-center mt-12 md:mt-0">
          <AnimateIn delay={0.1} direction="up">
            <p className="text-xs font-medium text-primary tracking-[0.2em] uppercase mb-6 inline-block border-b-2 border-primary pb-2">
              Mengenal Lebih Dekat
            </p>
          </AnimateIn>
          <AnimateIn delay={0.2} direction="up">
            <h1 className="font-serif text-2xl md:text-4xl md:text-6xl font-bold text-on-surface mb-8 leading-tight tracking-tight">
              Profil <span className="italic font-light text-primary">Desa</span><br />Kedungdowo
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.3} direction="up">
            <p className="text-lg md:text-xl text-on-surface-variant max-w-3xl mx-auto font-light leading-relaxed">
              Menjaga tradisi warisan leluhur sambil terus melangkah maju dengan inovasi berkelanjutan demi kesejahteraan masyarakat di jantung Boyolali.
            </p>
          </AnimateIn>
        </div>
        {/* Subtle background decorative element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-surface-container-low to-transparent -z-10"></div>
      </section>

      {/* 2. Informasi Umum & Wilayah */}
      <section className="pb-16 md:pb-32 pt-12 relative bg-surface">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
            {/* Left Column: Lokasi */}
            <div className="lg:col-span-7">
              <AnimateIn delay={0.1} direction="right">
                <div className="pr-0 lg:pr-12">
                  <div className="flex items-center space-x-4 mb-8">
                    <span className="flex items-center justify-center w-12 h-12 rounded-full bg-surface-container text-primary">
                      <Icon name="location_on" />
                    </span>
                    <h2 className="font-serif text-2xl md:text-3xl md:text-2xl md:text-4xl font-semibold text-on-surface">Lokasi <span className="italic font-light text-on-surface-variant">&amp;</span> Wilayah</h2>
                  </div>
                  <p className="text-lg text-on-surface-variant mb-6 leading-relaxed">
                    Desa Kedungdowo merupakan salah satu dari 16 desa di Kecamatan Andong, Kabupaten Boyolali, yang terletak kurang lebih 2 km ke arah Timur dari pusat kecamatan. Desa ini memiliki wilayah seluas <strong className="text-on-surface font-semibold">295.569 Ha</strong> dengan iklim tropis khas Indonesia yang mendukung sektor pertanian.
                  </p>

                  {/* Batas Wilayah */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {[
                      { arah: "Utara", icon: "north", batas: "Desa Pranggong" },
                      { arah: "Timur", icon: "east", batas: "Kab. Sragen" },
                      { arah: "Selatan", icon: "south", batas: "Desa Senggrong" },
                      { arah: "Barat", icon: "west", batas: "Desa Kacangan" },
                    ].map((item) => (
                      <div key={item.arah} className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/20 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon name={item.icon} className="text-primary text-base group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-medium text-outline uppercase tracking-wider">Sebelah {item.arah}</span>
                        </div>
                        <span className="font-serif text-base font-semibold text-on-surface">{item.batas}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 border-t border-outline/20 pt-8">
                    <div className="col-span-2 md:col-span-1">
                      <span className="block text-xs font-medium text-outline mb-2 uppercase tracking-wider">Luas</span>
                      <span className="font-serif text-2xl font-semibold text-on-surface">295.569 <span className="text-base text-on-surface-variant font-sans font-normal">Ha</span></span>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <span className="block text-xs font-medium text-outline mb-2 uppercase tracking-wider">Ke Kec.</span>
                      <span className="font-serif text-2xl font-semibold text-on-surface">2 <span className="text-base text-on-surface-variant font-sans font-normal">km</span></span>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <span className="block text-xs font-medium text-outline mb-2 uppercase tracking-wider">Ke Kab.</span>
                      <span className="font-serif text-2xl font-semibold text-on-surface">35 <span className="text-base text-on-surface-variant font-sans font-normal">km</span></span>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <span className="block text-xs font-medium text-outline mb-2 uppercase tracking-wider">Ke Prov.</span>
                      <span className="font-serif text-2xl font-semibold text-on-surface">90 <span className="text-base text-on-surface-variant font-sans font-normal">km</span></span>
                    </div>
                  </div>

                </div>
              </AnimateIn>
            </div>

            {/* Right Column: Dusun */}
            <div className="lg:col-span-5 relative mt-8 lg:mt-0 z-20">
              <AnimateIn delay={0.2} direction="left" className="h-full">
                <div className="bg-surface-container-lowest rounded-3xl p-4 md:p-8 md:p-4 md:p-10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] border border-outline/20 relative overflow-hidden group hover:border-primary/30 transition-colors duration-500 h-full">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                  <div className="relative z-10">
                    <p className="text-xs font-medium text-secondary tracking-widest uppercase mb-4">Struktur Wilayah</p>
                    
                    <div className="flex gap-8 mb-8 pb-8 border-b border-outline/20">
                      <div>
                        <span className="block text-2xl md:text-4xl font-serif font-bold text-on-surface mb-1">20</span>
                        <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Rukun Tetangga (RT)</span>
                      </div>
                      <div className="w-px h-16 bg-outline/20"></div>
                      <div>
                        <span className="block text-2xl md:text-4xl font-serif font-bold text-on-surface mb-1">4</span>
                        <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Rukun Warga (RW)</span>
                      </div>
                    </div>

                    <h3 className="font-serif text-2xl font-semibold text-on-surface mb-8">Pembagian Dusun</h3>
                    <div className="space-y-6">
                      {[
                        "Kedungori, Banyurip",
                        "Kedung Lengkong, Tempursari, Kadirno",
                        "Jatisari",
                        "Kedungdowo, Wonosari, Tangkil, Belik"
                      ].map((dusun, idx) => (
                        <div key={idx} className={`group/item flex items-center justify-between ${idx !== 3 ? 'border-b border-outline/20 pb-4' : 'pb-2'} hover:border-secondary transition-colors cursor-default`}>
                          <div className="flex items-center">
                            <span className="font-serif text-xl font-semibold text-outline/30 mr-6 group-hover/item:text-secondary transition-colors italic shrink-0">0{idx + 1}</span>
                            <span className="text-base md:text-lg font-medium text-on-surface">{dusun}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimateIn>
            </div>
          </div>

          {/* Full-width Map */}
          <div className="mt-12 lg:mt-16">
            <AnimateIn delay={0.3} direction="up">
              <h3 className="font-serif text-2xl font-semibold text-on-surface mb-6 flex items-center justify-center gap-3">
                <Icon name="map" className="text-primary text-2xl md:text-3xl" />
                Peta Lokasi Balai Desa
              </h3>
              <div className="w-full h-[350px] md:h-[450px] rounded-3xl overflow-hidden border border-outline/20 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] relative group">
                <div className="absolute inset-0 bg-surface-container flex items-center justify-center -z-10">
                  <span className="flex flex-col items-center text-outline gap-2">
                    <Icon name="satellite_alt" className="text-2xl md:text-3xl animate-pulse" />
                    <span className="text-xs font-medium uppercase tracking-wider">Memuat Peta...</span>
                  </span>
                </div>
                <iframe 
                  src="https://maps.google.com/maps?q=Balai+Desa+Kedungdowo,+Andong,+Boyolali&t=&z=17&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="relative z-10 opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                ></iframe>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* 3. Visi & Misi */}
      <section className="py-16 md:py-24 bg-surface-container-low relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#707a6c_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.03] pointer-events-none" />
        <div className="w-full max-w-7xl mx-auto px-6 relative z-10">
          <AnimateIn delay={0.1} direction="up">
            <div className="text-center mb-12">
              <p className="text-xs font-medium text-primary tracking-[0.2em] uppercase mb-4">Arah Pembangunan</p>
              <h2 className="font-serif text-2xl md:text-4xl font-semibold text-on-surface">Visi <span className="italic font-light text-on-surface-variant">&amp;</span> Misi</h2>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Visi */}
            <div className="lg:col-span-5">
              <AnimateIn delay={0.2} direction="right" className="h-full">
                <div className="bg-surface-container-lowest rounded-3xl p-4 md:p-8 md:p-4 md:p-10 border border-outline/20 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] h-full relative overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary-container/20 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-container text-on-primary-container">
                        <Icon name="visibility" />
                      </span>
                      <h3 className="font-serif text-2xl font-semibold text-on-surface">Visi</h3>
                    </div>
                    <blockquote className="text-lg text-on-surface leading-relaxed italic border-l-4 border-primary pl-6">
                      &ldquo;Terwujudnya Desa Kedungdowo yang Maju, Mandiri, dan Sejahtera berbasis Pertanian dan Gotong Royong.&rdquo;
                    </blockquote>
                  </div>
                </div>
              </AnimateIn>
            </div>

            {/* Misi */}
            <div className="lg:col-span-7">
              <AnimateIn delay={0.3} direction="left" className="h-full">
                <div className="bg-surface-container-lowest rounded-3xl p-4 md:p-8 md:p-4 md:p-10 border border-outline/20 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container">
                      <Icon name="flag" />
                    </span>
                    <h3 className="font-serif text-2xl font-semibold text-on-surface">Misi</h3>
                  </div>
                  <ol className="space-y-4">
                    {[
                      "Meningkatkan kualitas pelayanan pemerintahan desa yang transparan dan akuntabel.",
                      "Membangun infrastruktur desa yang memadai untuk mendukung aktivitas ekonomi masyarakat.",
                      "Mengembangkan potensi pertanian dan UMKM sebagai pilar perekonomian desa.",
                      "Meningkatkan kualitas sumber daya manusia melalui pendidikan dan pelatihan.",
                      "Melestarikan nilai-nilai budaya, keagamaan, dan semangat gotong royong masyarakat.",
                    ].map((misi, idx) => (
                      <li key={idx} className="flex gap-4 group">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary-container/30 text-secondary font-serif font-bold text-sm shrink-0 group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                          {idx + 1}
                        </span>
                        <p className="text-base text-on-surface-variant leading-relaxed pt-1">{misi}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Sejarah Desa */}
      <section className="py-16 md:py-32 bg-surface relative">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            
            {/* Sejarah (Editorial Story) */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <AnimateIn delay={0.1} direction="right">
                <p className="text-xs font-medium text-primary tracking-[0.2em] uppercase mb-6">Warisan Leluhur</p>
                <h2 className="font-serif text-2xl md:text-4xl font-semibold text-on-surface mb-10 leading-tight">
                  Jejak Sejarah <span className="italic text-on-surface-variant font-light">Desa</span>
                </h2>
                <div className="text-base text-on-surface-variant space-y-6 mb-10">
                  <p className="leading-relaxed">
                    Berdirinya Desa Kedungdowo tidak terlepas dari Kraton Surakarta Hadiningrat pada masa Periode ke IV. Seorang penghulu kraton bernama <strong>Kyai Dul Jalal Awal</strong> mengembangkan misi dakwah Islamiyah dan menetap di sebuah hutan yang dinamakan <strong className="text-on-surface">Alas Jogo Paten</strong>.
                  </p>
                  <p className="leading-relaxed">
                    Pada suatu pagi hari, Kyai Dul Jalal Awal mengumandangkan adzan Subuh yang sampai terdengar oleh Ratu Samber Nyowo. Atas izin Allah SWT, Ratu Samber Nyowo mengijinkan beliau bertempat tinggal di Alas Jogo Paten, yang kemudian menjelma menjadi <strong className="text-on-surface">Dukuh Kalioso, Kabupaten Karanganyar</strong>.
                  </p>
                  <p className="leading-relaxed">
                    Putra beliau, <strong>Kyai Rusdi</strong>, melanjutkan syiar Islam ke wilayah utara dan menikah dengan <strong className="text-on-surface">Nyai Sahdilah</strong>, putri sesepuh Jatisari, Kyai Singgo Manggolo. Dari sinilah berkembang syiar Islam di Dukuh Jatisari dan sekitarnya.
                  </p>
                  <p className="leading-relaxed">
                    Warga dari beberapa dukuh — Kedungdowo, Kedungori Banyurip, Tempursari, Kadirno, Kedunglengkong, Banyurip, Tangkil, Belik, Wonosari — bermusyawarah membentuk sentral pemerintahan dan menunjuk <strong className="text-on-surface">Reso Wijoyo</strong> sebagai Lurah pertama pada tahun <strong className="text-on-surface">1932</strong>.
                  </p>
                  <p className="leading-relaxed">
                    Nama <span className="italic text-on-surface">&quot;Kedungdowo&quot;</span> berasal dari faktor geografis — desa ini dikelilingi oleh sungai (<em>kedung</em> yang <em>dowo</em> / panjang), memberikan identitas agraris yang kuat berkat ketersediaan air yang melimpah.
                  </p>
                </div>
              </AnimateIn>
            </div>

            {/* Tabel Kepala Desa */}
            <div className="lg:col-span-5">
              <AnimateIn delay={0.2} direction="left" className="h-full">
                <div className="bg-surface-container-lowest rounded-3xl p-4 md:p-8 md:p-4 md:p-10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-outline/20 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-serif text-2xl font-semibold text-on-surface">Kepala Desa</h3>
                    <Icon name="history" className="text-secondary text-2xl md:text-3xl" />
                  </div>
                  <div className="space-y-0 flex-grow">
                    {KEPALA_DESA.map((kd, idx) => (
                      <div key={idx} className={`flex items-center gap-4 py-3.5 ${idx !== KEPALA_DESA.length - 1 ? 'border-b border-outline/15' : ''} group hover:bg-surface-container/30 -mx-3 px-3 rounded-lg transition-colors`}>
                        <span className="font-serif text-xs font-bold text-outline/40 w-6 text-center group-hover:text-primary transition-colors">{kd.ke}</span>
                        <div className="w-px h-8 bg-outline/20 group-hover:bg-primary/40 transition-colors shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-on-surface text-sm truncate">{kd.nama}</p>
                          <p className="text-xs text-on-surface-variant">{kd.periode}</p>
                        </div>
                        {idx === KEPALA_DESA.length - 1 && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary-container/20 px-2 py-0.5 rounded-full shrink-0">Aktif</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>



      {/* 5. Demografi (Dinamis dari Database) */}
      <section className="py-16 md:py-32 bg-surface-container-low relative">
        <div className="w-full max-w-7xl mx-auto px-6">
          <AnimateIn delay={0.1} direction="up">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs font-medium text-secondary tracking-[0.2em] uppercase mb-4">Data Kependudukan</p>
              <h2 className="font-serif text-2xl md:text-4xl font-semibold text-on-surface mb-4">Demografi <span className="italic font-light text-on-surface-variant">Penduduk</span></h2>
              <p className="text-lg text-on-surface-variant">Data statistik penduduk yang selalu diperbarui secara berkala oleh pemerintah desa.</p>
            </div>
          </AnimateIn>

          {/* Top Stats: Total Penduduk, KK, L/P */}
          <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <AnimateIn delay={0.15} direction="up" className="col-span-2 md:col-span-1">
              <div className="bg-surface-container-lowest rounded-2xl p-4 md:p-6 border border-outline/20 shadow-sm text-center hover:shadow-md transition-shadow">
                <Icon name="groups" className="text-primary text-2xl md:text-3xl mb-3" />
                <p className="text-xs font-medium text-outline uppercase tracking-wider mb-1">Total Penduduk</p>
                <span className="font-serif text-2xl md:text-3xl font-bold text-primary">{totalPenduduk.toLocaleString('id-ID')}</span>
                <span className="text-sm text-on-surface-variant ml-1">Jiwa</span>
              </div>
            </AnimateIn>
            <AnimateIn delay={0.2} direction="up" className="col-span-2 md:col-span-1">
              <div className="bg-surface-container-lowest rounded-2xl p-4 md:p-6 border border-outline/20 shadow-sm text-center hover:shadow-md transition-shadow">
                <Icon name="family_restroom" className="text-secondary text-2xl md:text-3xl mb-3" />
                <p className="text-xs font-medium text-outline uppercase tracking-wider mb-1">Kepala Keluarga</p>
                <span className="font-serif text-2xl md:text-3xl font-bold text-on-surface">{totalKK.toLocaleString('id-ID')}</span>
                <span className="text-sm text-on-surface-variant ml-1">KK</span>
              </div>
            </AnimateIn>
            <AnimateIn delay={0.25} direction="up">
              <div className="bg-surface-container-lowest rounded-2xl p-4 md:p-6 border border-outline/20 shadow-sm text-center hover:shadow-md transition-shadow">
                <Icon name="male" className="text-blue-500 text-2xl md:text-3xl mb-3" />
                <p className="text-xs font-medium text-outline uppercase tracking-wider mb-1">Laki-laki</p>
                <span className="font-serif text-2xl md:text-3xl font-bold text-on-surface">{lakiLaki.toLocaleString('id-ID')}</span>
              </div>
            </AnimateIn>
            <AnimateIn delay={0.3} direction="up">
              <div className="bg-surface-container-lowest rounded-2xl p-4 md:p-6 border border-outline/20 shadow-sm text-center hover:shadow-md transition-shadow">
                <Icon name="female" className="text-pink-500 text-2xl md:text-3xl mb-3" />
                <p className="text-xs font-medium text-outline uppercase tracking-wider mb-1">Perempuan</p>
                <span className="font-serif text-2xl md:text-3xl font-bold text-on-surface">{perempuan.toLocaleString('id-ID')}</span>
              </div>
            </AnimateIn>
          </div>

          {/* Detail Grid: Agama, Pendidikan, Pekerjaan */}
          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Agama */}
            <AnimateIn delay={0.1} direction="up" className="h-full">
              <div className="bg-surface-container-lowest rounded-2xl p-4 md:p-8 border border-outline/20 shadow-sm h-full hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-container/30 text-primary">
                    <Icon name="mosque" />
                  </span>
                  <h4 className="text-sm font-semibold text-on-surface uppercase tracking-wider">Agama</h4>
                </div>
                <ul className="space-y-3 text-sm">
                  {agamaStats.filter(a => a.jumlah > 0).map((item, idx, arr) => (
                    <li key={item.id} className={`flex justify-between ${idx !== arr.length - 1 ? 'border-b border-outline/15 pb-2' : 'pb-1'}`}>
                      <span className="text-on-surface-variant">{item.label}</span>
                      <span className="font-medium text-on-surface">{item.jumlah.toLocaleString('id-ID')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIn>

            {/* Pendidikan */}
            <AnimateIn delay={0.2} direction="up" className="h-full">
              <div className="bg-surface-container-lowest rounded-2xl p-4 md:p-8 border border-outline/20 shadow-sm h-full hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary-container/30 text-secondary">
                    <Icon name="school" />
                  </span>
                  <h4 className="text-sm font-semibold text-on-surface uppercase tracking-wider">Tingkat Pendidikan</h4>
                </div>
                <ul className="space-y-3 text-sm">
                  {pendidikanStats.map((item, idx) => (
                    <li key={item.id} className={`flex justify-between ${idx !== pendidikanStats.length - 1 ? 'border-b border-outline/15 pb-2' : 'pb-1'}`}>
                      <span className="text-on-surface-variant">{item.label}</span>
                      <span className="font-medium text-on-surface">{item.jumlah.toLocaleString('id-ID')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIn>

            {/* Pekerjaan */}
            <AnimateIn delay={0.3} direction="up" className="h-full">
              <div className="bg-surface-container-lowest rounded-2xl p-4 md:p-8 border border-outline/20 shadow-sm h-full hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-tertiary-container/30 text-tertiary">
                    <Icon name="work" />
                  </span>
                  <h4 className="text-sm font-semibold text-on-surface uppercase tracking-wider">Mata Pencaharian</h4>
                </div>
                <ul className="space-y-3 text-sm">
                  {pekerjaanStats.slice(0, 6).map((item, idx, arr) => (
                    <li key={item.id} className={`flex justify-between ${idx !== arr.length - 1 ? 'border-b border-outline/15 pb-2' : 'pb-1'}`}>
                      <span className="text-on-surface-variant">{item.label}</span>
                      <span className="font-medium text-on-surface">{item.jumlah.toLocaleString('id-ID')}</span>
                    </li>
                  ))}
                  {pekerjaanStats.length > 6 && (
                    <li className="text-xs text-on-surface-variant italic pt-1">Dan {pekerjaanStats.length - 6} profesi lainnya...</li>
                  )}
                </ul>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* 6. Sosial & Ekonomi */}
      <section className="py-16 md:py-32 bg-surface">
        <div className="w-full max-w-7xl mx-auto px-6">
          <AnimateIn delay={0.1} direction="up">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs font-medium text-secondary tracking-[0.2em] uppercase mb-4">Pembangunan &amp; Kesejahteraan</p>
              <h2 className="font-serif text-2xl md:text-4xl font-semibold text-on-surface mb-6">Sosial <span className="italic font-light text-on-surface-variant">&amp;</span> Ekonomi</h2>
              <p className="text-lg text-on-surface-variant">Membangun kesejahteraan melalui pemberdayaan masyarakat dan pengelolaan sumber daya desa yang transparan.</p>
            </div>
          </AnimateIn>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
            {/* Basis Ekonomi */}
            <div className="md:col-span-12 lg:col-span-8">
              <AnimateIn delay={0.1} direction="right" className="h-full">
                <div className="bg-surface-container-lowest rounded-3xl p-4 md:p-8 md:p-4 md:p-10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-outline/20 flex flex-col sm:flex-col md:flex-row gap-8 items-center bg-gradient-to-br from-surface-container-lowest to-surface h-full">
                  <div className="w-24 h-24 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center shrink-0">
                    <Icon name="agriculture" className="text-2xl md:text-4xl" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-semibold text-on-surface mb-4">Basis Ekonomi Utama</h3>
                    <p className="text-base text-on-surface-variant mb-6 leading-relaxed">
                      Perekonomian didorong oleh hasil bumi sektor pertanian. Pembangunan desa didukung oleh kemandirian finansial melalui pilar utama:
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <span className="inline-flex items-center px-4 py-2 bg-surface-container rounded-full text-sm font-semibold text-on-surface">
                        <span className="w-2 h-2 rounded-full bg-tertiary mr-2"></span>
                        Pendapatan Asli Desa (PADes)
                      </span>
                      <span className="inline-flex items-center px-4 py-2 bg-surface-container rounded-full text-sm font-semibold text-on-surface">
                        <span className="w-2 h-2 rounded-full bg-tertiary mr-2"></span>
                        Alokasi Dana Desa (ADD)
                      </span>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            </div>

            {/* Kesejahteraan */}
            <div className="md:col-span-6 lg:col-span-4">
              <AnimateIn delay={0.2} direction="left" className="h-full">
                <div className="bg-surface-container-lowest rounded-3xl p-4 md:p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-outline/20 h-full">
                  <div className="flex items-center space-x-4 mb-8">
                    <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-container text-on-primary-container">
                      <Icon name="account_balance_wallet" />
                    </span>
                    <h3 className="font-serif text-xl font-semibold text-on-surface">Kesejahteraan KK</h3>
                  </div>
                  <div className="space-y-6">
                    {kesejahteraanStats.map((item, idx) => (
                      <div key={item.id} className={`group flex flex-col ${idx !== kesejahteraanStats.length - 1 ? 'border-b border-outline/20 pb-4' : ''} hover:border-primary transition-colors`}>
                        <span className="text-sm font-semibold text-on-surface-variant mb-1">{item.label}</span>
                        <div className="flex justify-between items-baseline">
                          <span className="font-serif text-2xl font-semibold text-on-surface">{item.jumlah.toLocaleString('id-ID')}</span>
                          <span className="text-xs text-outline font-medium">KK</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimateIn>
            </div>

            {/* Ketenagakerjaan */}
            <div className="md:col-span-6 lg:col-span-6">
              <AnimateIn delay={0.25} direction="up" className="h-full">
                <div className="bg-surface-container-lowest rounded-3xl p-4 md:p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-outline/20 h-full">
                  <div className="flex items-center space-x-4 mb-6">
                    <span className="flex items-center justify-center w-12 h-12 rounded-full bg-tertiary-container text-on-tertiary-container">
                      <Icon name="engineering" />
                    </span>
                    <h3 className="font-serif text-xl font-semibold text-on-surface">Ketenagakerjaan</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-surface-container/30 rounded-xl p-5 text-center">
                      <p className="text-xs font-medium text-outline uppercase tracking-wider mb-2">Angkatan Kerja</p>
                      <span className="font-serif text-2xl md:text-3xl font-bold text-on-surface">{angkatanKerja.toLocaleString('id-ID')}</span>
                      <p className="text-xs text-on-surface-variant mt-1">Usia 15–55 Tahun</p>
                    </div>
                    <div className="bg-surface-container/30 rounded-xl p-5 text-center">
                      <p className="text-xs font-medium text-outline uppercase tracking-wider mb-2">Belum Bekerja</p>
                      <span className="font-serif text-2xl md:text-3xl font-bold text-on-surface">{pengangguran.toLocaleString('id-ID')}</span>
                      <p className="text-xs text-on-surface-variant mt-1">Orang</p>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            </div>

            {/* Kelembagaan */}
            <div className="md:col-span-12 lg:col-span-6">
              <AnimateIn delay={0.3} direction="up" className="h-full">
                <div className="bg-secondary-container/10 rounded-3xl p-4 md:p-8 md:p-4 md:p-10 border border-secondary/20 h-full">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-on-secondary">
                          <Icon name="diversity_3" />
                        </span>
                        <h3 className="font-serif text-xl font-semibold text-on-surface">Kelembagaan Aktif</h3>
                      </div>
                      <p className="text-sm text-on-surface-variant max-w-md">Motor penggerak kegiatan sosial dan pemberdayaan masyarakat desa.</p>
                    </div>
                    <div className="flex flex-wrap gap-3 md:justify-end">
                      {["Karang Taruna", "PKK", "LPMD", "Kelompok Tani", "Remaja Masjid", "Posyandu"].map(item => (
                        <span key={item} className="px-4 py-2 bg-surface rounded-xl text-xs font-semibold text-on-surface shadow-sm border border-outline/30 hover:border-secondary transition-colors cursor-default">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Sarana & Prasarana */}
      <section className="py-16 md:py-32 bg-surface-container-low">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="bg-surface rounded-[2.5rem] p-4 md:p-10 md:p-16 relative overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] border border-outline/20">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-container/30 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-container/30 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div className="max-w-2xl">
                  <AnimateIn delay={0.1} direction="right">
                    <p className="text-xs font-medium text-outline tracking-[0.2em] uppercase mb-4">Infrastruktur</p>
                    <h2 className="font-serif text-2xl md:text-4xl font-semibold text-on-surface mb-4">Sarana <span className="italic font-light text-on-surface-variant">&amp;</span> Prasarana</h2>
                    <p className="text-lg text-on-surface-variant leading-relaxed">Fasilitas umum pendukung kualitas hidup masyarakat yang dibangun dan dirawat dengan semangat <strong className="text-on-surface font-semibold">swadaya dan gotong royong</strong>.</p>
                  </AnimateIn>
                </div>
                <AnimateIn delay={0.2} direction="left">
                  <div className="inline-flex items-center px-6 py-3 bg-surface-container rounded-full shadow-sm border border-outline/30">
                    <Icon name="handshake" className="text-primary mr-3" />
                    <span className="text-sm font-semibold text-on-surface uppercase tracking-wide">Fokus Swadaya</span>
                  </div>
                </AnimateIn>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Pendidikan */}
                <AnimateIn delay={0.3} direction="up" className="h-full">
                  <div className="bg-surface/50 backdrop-blur-md p-4 md:p-8 rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-shadow h-full">
                    <div className="w-12 h-12 rounded-xl bg-surface shadow-sm border border-outline/20 flex items-center justify-center mb-6">
                      <Icon name="school" className="text-primary" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-on-surface mb-6 border-b border-outline/20 pb-4">Pendidikan</h3>
                    <ul className="space-y-4 text-base">
                      {pendidikanFasilitas.map(item => (
                        <li key={item.id} className="flex justify-between items-center group">
                          <span className="text-on-surface-variant group-hover:text-on-surface transition-colors">{item.label}</span>
                          <span className="font-serif text-lg font-semibold text-on-surface">{item.jumlah}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimateIn>

                {/* Kesehatan */}
                <AnimateIn delay={0.4} direction="up" className="h-full">
                  <div className="bg-surface/50 backdrop-blur-md p-4 md:p-8 rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-shadow h-full">
                    <div className="w-12 h-12 rounded-xl bg-surface shadow-sm border border-outline/20 flex items-center justify-center mb-6">
                      <Icon name="health_and_safety" className="text-secondary" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-on-surface mb-6 border-b border-outline/20 pb-4">Kesehatan</h3>
                    <ul className="space-y-4 text-base">
                      {kesehatanFasilitas.map(item => (
                        <li key={item.id} className="flex justify-between items-center group">
                          <span className="text-on-surface-variant group-hover:text-on-surface transition-colors">{item.label}</span>
                          <span className="font-serif text-lg font-semibold text-on-surface">{item.jumlah}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimateIn>

                {/* Fasilitas Umum */}
                <AnimateIn delay={0.5} direction="up" className="h-full">
                  <div className="bg-surface/50 backdrop-blur-md p-4 md:p-8 rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-shadow h-full">
                    <div className="w-12 h-12 rounded-xl bg-surface shadow-sm border border-outline/20 flex items-center justify-center mb-6">
                      <Icon name="mosque" className="text-tertiary" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-on-surface mb-6 border-b border-outline/20 pb-4">Fasilitas Publik</h3>
                    <ul className="space-y-4 text-base">
                      {publikFasilitas.map(item => (
                        <li key={item.id} className="flex justify-between items-center group">
                          <span className="text-on-surface-variant group-hover:text-on-surface transition-colors">{item.label}</span>
                          <span className="font-serif text-lg font-semibold text-on-surface">{item.jumlah}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimateIn>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
