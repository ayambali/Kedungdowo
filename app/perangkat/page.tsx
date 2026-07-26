import Image from "next/image";
import Icon from "../components/Icon";
import { prisma } from "@/lib/prisma";
import BpdBox from "./BpdBox";

/* ───────────── OrgCard: foto di atas, jabatan & nama di bawah ───────────── */
const OrgCard = ({
  title,
  name,
  photoUrl,
  colorScheme = "red",
  size = "normal",
}: {
  title: string;
  name?: string;
  photoUrl?: string | null;
  colorScheme?: "red" | "blue" | "green" | "kades";
  size?: "large" | "normal";
}) => {
  const bg: Record<string, string> = {
    red: "bg-[#9B2242]", // Maroon gelap untuk Kasi/Kaur
    kades: "bg-[#e11d48]", // Merah cerah (Rose-600) untuk Kades
    blue: "bg-[#1E5B94]",
    green: "bg-[#6B8E23]",
  };
  const bdr: Record<string, string> = {
    red: "border-[#9B2242]",
    kades: "border-[#e11d48]",
    blue: "border-[#1E5B94]",
    green: "border-[#6B8E23]",
  };

  const w = size === "large" ? "w-[180px]" : "w-[150px]";

  return (
    <div className={`${w} flex flex-col overflow-hidden rounded-lg border-2 ${bdr[colorScheme]} shadow-md bg-white`}>
      <div className="w-full aspect-[3/4] bg-gray-100 flex items-center justify-center overflow-hidden">
        {photoUrl ? (
          <img src={photoUrl} alt={name || title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-300">
            <Icon name="person" filled className="text-2xl md:text-4xl" />
          </div>
        )}
      </div>
      <div className={`${bg[colorScheme]} text-white text-[11px] font-bold text-center px-2 py-1.5 leading-tight uppercase`}>
        {title}
      </div>
      <div className="text-xs font-semibold text-center text-gray-800 px-2 py-2 leading-snug bg-white min-h-[32px] flex items-center justify-center">
        {name || "—"}
      </div>
    </div>
  );
};

/* ───────────── Page ───────────── */
export const metadata = { title: "Pemerintahan Desa" };
export const revalidate = 0;

export default async function PemerintahanPage() {
  const perangkatList = await prisma.perangkatDesa.findMany({
    orderBy: { id: "asc" },
  });

  const bpdMembers = perangkatList.filter((p) => p.tipe === "BPD");
  const perangkatDesaList = perangkatList.filter((p) => p.tipe !== "BPD");

  const find = (kw: string) =>
    perangkatDesaList.find((p) => p.jabatan.toLowerCase().includes(kw.toLowerCase()));

  const kades = find("kepala desa");
  const sekdes = find("sekretaris");
  const kasiKes = find("kesejahteraan");
  const kasiPem = find("pemerintahan");
  const kaurKeu = find("keuangan");
  const kaurUmum = find("umum");
  const kadus1 = find("kudus i") || find("dusun i");
  const kadus2 = find("kudus ii") || find("dusun ii");
  const kadus3 = find("kudus iii") || find("dusun iii");
  const kadus4 = find("kudus iv") || find("dusun iv");

  /*
   * ┌─────────────────── LAYOUT GEOMETRY ───────────────────┐
   * │ 4 columns, card=170px wide, spaced 120px apart        │
   * │ COL: [0, 290, 580, 870]  Centers: [85, 375, 665, 955] │
   * │                                                        │
   * │ ROW 0 (y=0)   : BPD(200w) & KADES(200w)               │
   * │ ROW 1 (y=210)  : SEKDES(170w) at col3                  │
   * │ ROW 2 (y=430)  : Kasi×2(col0,1) & Kaur×2(col2,3)      │
   * │ ROW 3 (y=630)  : Kudus×4                               │
   * └────────────────────────────────────────────────────────┘
   */
  const W = 900;

  const COL = [0, 250, 500, 750];
  const CX  = [75, 325, 575, 825];   // card centers (width 150 / 2)

  const LG_W = 180, LG_H = 306;     // large card (180w, 3:4 img ~240 + 66 for text)
  const SM_H = 266;                  // normal card (150w, 3:4 img ~200 + 66 for text)

  const R0 = 0, R1 = 350, R2 = 660, R3 = 970; // Tighter vertical spacing

  const KADES_X  = 360;              // Centered (900/2 - 180/2 = 360)
  const KADES_CX = 450;

  const BPD_X = 80;                  // Geser BPD agar pas

  const SEKDES_X  = COL[3];          // 750
  const SEKDES_CX = CX[3];           // 825

  // Y anchors for branch lines
  const KASI_BRANCH_Y  = R2 - 30;    // 630 — horizontal for Kasi & Kaur drops
  const KUDUS_BRANCH_Y = R3 - 30;    // 940 — horizontal for Kudus drops

  const CHART_H = R3 + SM_H + 110;   // ≈ 1346

  return (
    <div className="relative min-h-screen bg-surface py-20 md:py-32">
      {/* Styles for dynamic layout footprint scaling */}
      <style>{`
        .chart-container {
          --scale: 0.35;
          width: calc(${W}px * var(--scale));
          height: calc(${CHART_H}px * var(--scale));
          margin: 0 auto;
        }
        .chart-scaler {
          transform: scale(var(--scale));
          transform-origin: top left;
        }
        @media (min-width: 640px) { .chart-container { --scale: 0.5; } }
        @media (min-width: 768px) { .chart-container { --scale: 0.6; } }
        @media (min-width: 1024px) { .chart-container { --scale: 0.75; } }
        @media (min-width: 1280px) { .chart-container { --scale: 0.9; } }
        @media (min-width: 1536px) { .chart-container { --scale: 1; } }
      `}</style>

      {/* Ambient Background Pattern */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#707a6c_1px,transparent_1px),radial-gradient(#707a6c_1px,transparent_1px)] bg-[size:40px_40px] bg-[position:0_0,20px_20px] opacity-[0.03] pointer-events-none" />

      <main className="relative z-10 w-full">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto px-6 mb-12">
          <h1 className="font-serif text-2xl md:text-3xl md:text-3xl md:text-5xl font-bold text-on-surface mb-2 md:mb-4 leading-tight">
            Pemerintahan <span className="italic font-light text-primary">Desa</span>
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
            Struktur Organisasi Pemerintahan Desa Kedungdowo, Kec. Andong, Kab. Boyolali
          </p>
        </div>

        {/* ══════════════ Struktur Organisasi ══════════════ */}
        <div className="w-full px-2 overflow-x-auto overflow-y-hidden pb-8 scrollbar-hide">
          <div className="chart-container transition-all duration-300">
            <div className="chart-scaler">
              <div className="relative" style={{ width: W, height: CHART_H }}>

              {/* ─── SVG overlay: pixel-perfect lines ─── */}
              <svg
                className="absolute inset-0 pointer-events-none"
                width={W} height={CHART_H}
                fill="none" xmlns="http://www.w3.org/2000/svg"
                style={{ overflow: 'visible' }}
              >
                {/*
                 * KOORDINASI (dashed, gray-400)
                 * ─────────────────────────────
                 */}

                {/* A) BPD ←---→ Kades (horizontal dashed) */}
                <line
                  x1={BPD_X + LG_W} y1={R0 + LG_H / 2}
                  x2={KADES_X}      y2={R0 + LG_H / 2}
                  stroke="#9ca3af" strokeWidth={3} strokeDasharray="10 6"
                />

                {/* B) Garis Koordinasi Sekdes: 
                     2 putaran (lingkaran): 
                     - Box 1 mengelilingi Kasi & Kaur (Baris 2)
                     - Box 2 mengelilingi Kudus (Baris 3) */}
                     
                {/* Box 1 (Kasi & Kaur) */}
                <rect
                  x={COL[0] - 16} y={R2 - 16}
                  width={(COL[3] + 170 + 32) - COL[0]}
                  height={SM_H + 32}
                  rx={16} stroke="#9ca3af" strokeWidth={2} strokeDasharray="8 6" fill="none"
                />

                {/* Box 2 (Kudus) */}
                <rect
                  x={COL[0] - 16} y={R3 - 16}
                  width={(COL[3] + 170 + 32) - COL[0]}
                  height={SM_H + 32}
                  rx={16} stroke="#9ca3af" strokeWidth={2} strokeDasharray="8 6" fill="none"
                />

                {/* Garis turun dari Sekdes ke Box 1 (Kasi & Kaur) */}
                {/* Mulai dari bawah kiri kartu Sekdes, turun sedikit, lalu belok ke X=810 (celah antara Kaur Keu dan Kaur Umum), lalu turun ke Box 1 */}
                <path
                  d={`
                    M ${SEKDES_X + 20},${R1 + SM_H}
                    L ${SEKDES_X + 20},${R1 + SM_H + 20}
                    L 810,${R1 + SM_H + 20}
                    L 810,${R2 - 16}
                  `}
                  stroke="#9ca3af" strokeWidth={2} strokeDasharray="8 6" fill="none" strokeLinejoin="round"
                />

                {/* Garis turun dari Box 1 (Kasi & Kaur) ke Box 2 (Kudus) */}
                <line
                  x1={810} y1={R2 + SM_H + 16}
                  x2={810} y2={R3 - 16}
                  stroke="#9ca3af" strokeWidth={2} strokeDasharray="8 6"
                />

                {/*
                 * KOMANDO (solid, gray-600)
                 * ─────────────────────────
                 */}

                {/* 1) MAIN TRUNK: Kades bottom → down to KUDUS branch */}
                <line
                  x1={KADES_CX} y1={R0 + LG_H}
                  x2={KADES_CX} y2={KUDUS_BRANCH_Y}
                  stroke="#4b5563" strokeWidth={3}
                />

                {/* 2) Trunk → Sekdes horizontal */}
                <line
                  x1={KADES_CX}  y1={R1 + SM_H / 2}
                  x2={SEKDES_X}  y2={R1 + SM_H / 2}
                  stroke="#4b5563" strokeWidth={3}
                />

                {/* 3) KASI branch: trunk → left to col0 & col1 */}
                <line
                  x1={CX[0]}     y1={KASI_BRANCH_Y}
                  x2={KADES_CX}  y2={KASI_BRANCH_Y}
                  stroke="#4b5563" strokeWidth={3}
                />
                {/* Drop col0 */}
                <line x1={CX[0]} y1={KASI_BRANCH_Y} x2={CX[0]} y2={R2} stroke="#4b5563" strokeWidth={3} />
                {/* Drop col1 */}
                <line x1={CX[1]} y1={KASI_BRANCH_Y} x2={CX[1]} y2={R2} stroke="#4b5563" strokeWidth={3} />

                {/* 4) SEKDES TRUNK down → Kaur branch */}
                <line
                  x1={SEKDES_CX} y1={R1 + SM_H}
                  x2={SEKDES_CX} y2={KASI_BRANCH_Y}
                  stroke="#4b5563" strokeWidth={3}
                />

                {/* 5) KAUR branch: Sekdes trunk → left to col2 & col3 */}
                <line
                  x1={CX[2]}      y1={KASI_BRANCH_Y}
                  x2={SEKDES_CX}  y2={KASI_BRANCH_Y}
                  stroke="#4b5563" strokeWidth={3}
                />
                {/* Drop col2 */}
                <line x1={CX[2]} y1={KASI_BRANCH_Y} x2={CX[2]} y2={R2} stroke="#4b5563" strokeWidth={3} />
                {/* Drop col3 */}
                <line x1={CX[3]} y1={KASI_BRANCH_Y} x2={CX[3]} y2={R2} stroke="#4b5563" strokeWidth={3} />

                {/* 6) KUDUS branch: trunk → horizontal across all 4 cols */}
                <line
                  x1={CX[0]}  y1={KUDUS_BRANCH_Y}
                  x2={CX[3]}  y2={KUDUS_BRANCH_Y}
                  stroke="#4b5563" strokeWidth={3}
                />
                {/* Drop to each KUDUS */}
                <line x1={CX[0]} y1={KUDUS_BRANCH_Y} x2={CX[0]} y2={R3} stroke="#4b5563" strokeWidth={3} />
                <line x1={CX[1]} y1={KUDUS_BRANCH_Y} x2={CX[1]} y2={R3} stroke="#4b5563" strokeWidth={3} />
                <line x1={CX[2]} y1={KUDUS_BRANCH_Y} x2={CX[2]} y2={R3} stroke="#4b5563" strokeWidth={3} />
                <line x1={CX[3]} y1={KUDUS_BRANCH_Y} x2={CX[3]} y2={R3} stroke="#4b5563" strokeWidth={3} />
              </svg>

              {/* ─── Cards ─── */}
              {/* ROW 0 */}
              <div className="absolute" style={{ top: R0, left: BPD_X }}>
                <BpdBox bpdMembers={bpdMembers} />
              </div>
              <div className="absolute" style={{ top: R0, left: KADES_X }}>
                <OrgCard title="KEPALA DESA" name={kades?.nama} photoUrl={kades?.fotoUrl} colorScheme="kades" size="large" />
              </div>

              {/* ROW 1 */}
              <div className="absolute" style={{ top: R1, left: SEKDES_X }}>
                <OrgCard title="SEKRETARIS DESA" name={sekdes?.nama} photoUrl={sekdes?.fotoUrl} colorScheme="blue" />
              </div>

              {/* ROW 2 */}
              <div className="absolute" style={{ top: R2, left: COL[0] }}>
                <OrgCard title="Kasi Kesejahteraan & Pelayanan" name={kasiKes?.nama} photoUrl={kasiKes?.fotoUrl} colorScheme="red" />
              </div>
              <div className="absolute" style={{ top: R2, left: COL[1] }}>
                <OrgCard title="Kepala Seksi Pemerintahan" name={kasiPem?.nama} photoUrl={kasiPem?.fotoUrl} colorScheme="red" />
              </div>
              <div className="absolute" style={{ top: R2, left: COL[2] }}>
                <OrgCard title="Kaur Keuangan" name={kaurKeu?.nama} photoUrl={kaurKeu?.fotoUrl} colorScheme="red" />
              </div>
              <div className="absolute" style={{ top: R2, left: COL[3] }}>
                <OrgCard title="Kaur Umum & Perencanaan" name={kaurUmum?.nama} photoUrl={kaurUmum?.fotoUrl} colorScheme="red" />
              </div>

              {/* ROW 3 */}
              <div className="absolute" style={{ top: R3, left: COL[0] }}>
                <OrgCard title="KADUS I" name={kadus1?.nama} photoUrl={kadus1?.fotoUrl} colorScheme="green" />
              </div>
              <div className="absolute" style={{ top: R3, left: COL[1] }}>
                <OrgCard title="KADUS II" name={kadus2?.nama} photoUrl={kadus2?.fotoUrl} colorScheme="green" />
              </div>
              <div className="absolute" style={{ top: R3, left: COL[2] }}>
                <OrgCard title="KADUS III" name={kadus3?.nama} photoUrl={kadus3?.fotoUrl} colorScheme="green" />
              </div>
              <div className="absolute" style={{ top: R3, left: COL[3] }}>
                <OrgCard title="KADUS IV" name={kadus4?.nama} photoUrl={kadus4?.fotoUrl} colorScheme="green" />
              </div>

              {/* ─── Keterangan ─── */}
              <div
                className="absolute text-sm text-on-surface-variant border border-outline-variant/30 p-5 rounded-xl bg-surface-container"
                style={{ top: R3 + SM_H + 30, left: 0, width: 420 }}
              >
                <p className="font-bold mb-3 text-on-background text-base">Keterangan:</p>
                <div className="flex items-center gap-4 mb-2.5">
                  <svg width="40" height="6" className="flex-shrink-0"><line x1="0" y1="3" x2="40" y2="3" stroke="#4b5563" strokeWidth="3" /></svg>
                  <span>: Garis Komando</span>
                </div>
                <div className="flex items-center gap-4">
                  <svg width="40" height="6" className="flex-shrink-0"><line x1="0" y1="3" x2="40" y2="3" stroke="#9ca3af" strokeWidth="3" strokeDasharray="6 4" /></svg>
                  <span>: Garis Koordinasi</span>
                </div>
              </div>

            </div>
          </div>
        </div>
        </div>


      </main>
    </div>
  );
}
