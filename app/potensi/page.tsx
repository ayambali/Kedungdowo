import Icon from "../components/Icon";

export const metadata = { title: "Desa Korporasi Sapi" };

const kttData = [
  { label: "Total Sapi Program DKS", value: "1.000 Ekor", icon: "pets" },
  { label: "Alokasi per KTT", value: "200 Ekor", icon: "groups" },
  { label: "Betina BX (Breeding)", value: "100 Ekor", icon: "female" },
  { label: "Jantan Lokal (Fattening)", value: "100 Ekor", icon: "male" },
];

export default function PotensiPage() {
  return (
    <>
      {/* Page Header - Dark */}
      <section className="bg-inverse-surface pt-28 pb-16 md:pt-32 md:pb-20">
        <div className="w-full max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-inverse-primary font-semibold text-xs uppercase tracking-[0.2em] mb-4">
            Potensi Unggulan
          </span>
          <h1 className="font-serif text-2xl md:text-3xl md:text-3xl md:text-5xl text-inverse-on-surface font-bold mb-4">Desa Korporasi Sapi</h1>
          <p className="text-inverse-on-surface/70 text-base md:text-lg max-w-3xl mx-auto">
            Kedungdowo bersama 4 desa lainnya di Kecamatan Andong merupakan episentrum
            program Desa Korporasi Sapi (DKS) oleh Kementerian Pertanian RI.
          </p>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-16 md:py-24 bg-inverse-surface">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {kttData.map((item) => (
              <div key={item.label} className="bg-white/5 backdrop-blur-sm rounded-xl p-5 text-center border border-white/10 hover:bg-white/10 transition-all">
                <Icon name={item.icon} filled className="text-2xl md:text-3xl text-inverse-primary mb-2" />
                <p className="font-serif text-xl md:text-2xl font-bold text-inverse-on-surface mb-1">{item.value}</p>
                <p className="text-inverse-on-surface/60 text-xs">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 md:p-6 md:p-4 md:p-8 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center">
                  <Icon name="business" filled className="text-on-primary-container text-2xl" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-inverse-on-surface">PT. Andong Jaga Ternak</h3>
                  <p className="text-inverse-on-surface/60 text-xs">Badan Usaha Milik Petani (BUMP)</p>
                </div>
              </div>
              <p className="text-inverse-on-surface/70 text-sm leading-relaxed">
                Entitas perseroan resmi yang mengintegrasikan manajemen peternakan dari hulu ke hilir.
                Diproyeksikan sebagai pilot project untuk 10 BUMP sejenis di Provinsi Jawa Tengah.
                Pengadaan sapi dilakukan melalui koordinasi intensif dengan Dinas Peternakan Provinsi.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 md:p-6 md:p-4 md:p-8 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center">
                  <Icon name="handshake" filled className="text-on-secondary-container text-2xl" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-inverse-on-surface">Kop. Lembu Subur Rukun Tentrem</h3>
                  <p className="text-inverse-on-surface/60 text-xs">Koperasi Produsen</p>
                </div>
              </div>
              <p className="text-inverse-on-surface/70 text-sm leading-relaxed">
                Koperasi yang memfasilitasi posisi tawar peternak, memangkas biaya transaksi, dan
                menyalurkan suplai daging sapi reguler ke pasar premium DKI Jakarta.
                Menjamin stabilitas harga dan kontinuitas pasokan.
              </p>
            </div>
          </div>

          {/* Desa Partisipan */}
          <div className="text-center mb-10">
            <p className="text-inverse-on-surface/50 text-sm mb-3">5 Desa Partisipan Program DKS Kecamatan Andong:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Kedungdowo", "Kunti", "Beji", "Kadipaten", "Pakang"].map((desa) => (
                <span key={desa} className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  desa === "Kedungdowo"
                    ? "bg-inverse-primary text-on-primary-fixed"
                    : "bg-white/10 text-inverse-on-surface/80"
                }`}>{desa}</span>
              ))}
            </div>
          </div>

          <div className="text-center">
            <a
              href="https://wa.me/6281234567890?text=Saya%20tertarik%20dengan%20program%20Desa%20Korporasi%20Sapi%20Kedungdowo"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-xl font-semibold hover:bg-surface-tint hover:shadow-lg transition-all duration-300 text-base"
            >
              <Icon name="handshake" /> Hubungi untuk Kerjasama B2B
            </a>
          </div>
        </div>
      </section>

      {/* Keunggulan Komparatif */}
      <section className="py-16 md:py-24 bg-background">
        <div className="w-full max-w-7xl mx-auto px-6">
          <h2 className="font-serif text-2xl md:text-2xl md:text-3xl text-primary font-bold mb-8 text-center">Keunggulan Komparatif</h2>
          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "eco", title: "Adaptasi Agroklimatologi", desc: "Tanah padas dan irigasi tadah hujan mendorong transformasi ke peternakan sapi komersial yang lebih menguntungkan." },
              { icon: "local_shipping", title: "Akses Pasar Premium", desc: "Rantai pasok daging sapi langsung ke pasar DKI Jakarta melalui Koperasi Produsen yang terorganisir." },
              { icon: "trending_up", title: "Skala Ekonomi Korporasi", desc: "Model bisnis korporasi dengan entitas hukum perseroan, bukan peternakan skala rumah tangga tradisional." },
            ].map((item) => (
              <div key={item.title} className="bg-surface-container-lowest rounded-xl p-4 md:p-6 shadow-sm border border-outline-variant/20 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon name={item.icon} filled className="text-primary text-xl" />
                </div>
                <h3 className="font-serif text-lg font-bold text-on-background mb-2">{item.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
