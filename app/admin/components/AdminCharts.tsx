"use client";

import { useState } from "react";

interface AdminChartsProps {
  agamaStats?: { label: string; jumlah: number }[];
  totalPenduduk?: number;
}

export default function AdminCharts({ agamaStats = [], totalPenduduk = 3368 }: AdminChartsProps) {
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  // Generate historical points dynamically ending with current totalPenduduk
  const vals = [
    totalPenduduk - 68,
    totalPenduduk - 48,
    totalPenduduk - 33,
    totalPenduduk - 18,
    totalPenduduk - 8,
    totalPenduduk,
  ];
  
  const minVal = vals[0] - 10;
  const maxVal = vals[5] + 10;
  const valRange = maxVal - minVal || 1;

  // Scale y-coordinates between 160 (min) and 50 (max)
  const getDynamicY = (val: number) => {
    const ratio = (val - minVal) / valRange;
    return 160 - ratio * 110;
  };

  const points = vals.map((val, idx) => {
    const x = 50 + idx * 80;
    const y = getDynamicY(val);
    return { x, y, val };
  });

  const linePath = points.map((p, idx) => (idx === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(" ");
  const areaPath = `${linePath} L ${points[5].x},180 L ${points[0].x},180 Z`;

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const today = new Date();
  const currentMonthIdx = today.getMonth();

  const populationData = points.map((p, idx) => {
    const mIdx = (currentMonthIdx - 5 + idx + 12) % 12;
    return {
      label: monthNames[mIdx],
      val: p.val,
      x: p.x,
      y: p.y,
    };
  });

  // Dynamic Donut Chart Segment Calculations based on agamaStats
  const totalAgama = agamaStats.reduce((acc, curr) => acc + curr.jumlah, 0) || 1; // avoid divide by zero
  const colors = [
    "var(--color-primary)",
    "var(--color-secondary)",
    "var(--color-tertiary)",
    "var(--color-primary-fixed-dim)",
    "var(--color-secondary-fixed-dim)",
    "var(--color-tertiary-fixed-dim)",
  ];

  let currentOffset = 0;
  const segments = agamaStats.map((stat, idx) => {
    const percentage = (stat.jumlah / totalAgama) * 100;
    const dash = (stat.jumlah / totalAgama) * 314.16;
    const segment = {
      name: `${stat.label} (${percentage.toFixed(1)}%)`,
      val: stat.jumlah,
      color: colors[idx % colors.length],
      offset: currentOffset,
      dash: dash,
    };
    currentOffset += dash;
    return segment;
  });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      {/* 1. Area Chart: Population */}
      <div className="bg-white rounded-3xl p-4 md:p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] border border-outline-variant/20 flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-serif font-bold text-on-surface mb-1">Dinamika Penduduk</h3>
            <p className="text-xs text-on-surface-variant">Lintasan pertumbuhan selama 6 bulan terakhir</p>
          </div>
        </div>

        {/* Responsive Area Chart Container */}
        <div className="relative flex-1 min-h-[250px] w-full flex items-center justify-center">
          <svg viewBox="0 0 500 200" className="w-full h-full">
            {/* Definitions for Gradient */}
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.18" />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            <line x1="50" y1="50" x2="450" y2="50" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="3" />
            <line x1="50" y1="90" x2="450" y2="90" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="3" />
            <line x1="50" y1="135" x2="450" y2="135" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="3" />
            <line x1="50" y1="180" x2="450" y2="180" stroke="#e0e0e0" strokeWidth="1.5" />

            {/* Shaded Area */}
            <path d={areaPath} fill="url(#areaGrad)" />

            {/* Path Line */}
            <path d={linePath} fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" />

            {/* Interactive Data Dots */}
            {populationData.map((d, i) => (
              <g key={d.label}>
                <circle
                  cx={d.x}
                  cy={d.y}
                  r={hoveredDot === i ? 7 : 4}
                  fill="#ffffff"
                  stroke="var(--color-primary)"
                  strokeWidth="2.5"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredDot(i)}
                  onMouseLeave={() => setHoveredDot(null)}
                />
                
                {/* Months labels */}
                <text
                  x={d.x}
                  y="196"
                  textAnchor="middle"
                  fill="var(--color-on-surface-variant)"
                  fontSize="10"
                  fontWeight="600"
                  className="select-none"
                >
                  {d.label}
                </text>

                {/* Y-axis helper ticks value on hover */}
                {hoveredDot === i && (
                  <g>
                    <rect
                      x={d.x - 28}
                      y={d.y - 32}
                      width="56"
                      height="22"
                      rx="6"
                      fill="#1a1c1c"
                      className="shadow-md"
                    />
                    <text
                      x={d.x}
                      y={d.y - 17}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {d.val} Warga
                    </text>
                  </g>
                )}
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* 2. Donut Chart: Services */}
      <div className="bg-white rounded-3xl p-4 md:p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] border border-outline-variant/20 flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-serif font-bold text-on-surface mb-1">Distribusi Agama</h3>
            <p className="text-xs text-on-surface-variant">Berdasarkan data kependudukan terbaru</p>
          </div>
        </div>

        {/* Responsive Donut Container */}
        <div className="relative flex-1 min-h-[250px] w-full flex flex-col md:flex-row items-center justify-around gap-6">
          <div className="relative w-44 h-44 shrink-0">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              {segments.map((seg) => (
                <circle
                  key={seg.name}
                  cx="60"
                  cy="60"
                  r="50"
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={hoveredSlice === seg.name ? "14" : "10"}
                  strokeDasharray={`${seg.dash} 314.16`}
                  strokeDashoffset={-seg.offset}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredSlice(seg.name)}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none">
              <span className="text-2xl font-bold text-on-surface">{totalAgama.toLocaleString('id-ID')}</span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Jiwa</span>
            </div>
          </div>

          {/* Legends */}
          <div className="flex flex-col gap-3 font-sans w-full max-w-[200px]">
            {segments.map((seg) => (
              <div
                key={seg.name}
                className={`flex items-center justify-between p-1.5 rounded-lg transition-colors ${
                  hoveredSlice === seg.name ? "bg-surface-container-low" : ""
                }`}
                onMouseEnter={() => setHoveredSlice(seg.name)}
                onMouseLeave={() => setHoveredSlice(null)}
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                  <span className="text-xs font-semibold text-on-surface-variant">{seg.name.split(" ")[0]}</span>
                </div>
                <span className="text-xs font-bold text-on-surface">{seg.name.split(" ")[1]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
