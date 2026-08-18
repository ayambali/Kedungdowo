import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full gap-6 relative overflow-hidden">
      {/* Decorative Background Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--color-primary-fixed)] rounded-full blur-[80px] opacity-30 z-0 animate-pulse"></div>

      {/* Main Loader Container */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Animated Icon & Rings */}
        <div className="relative flex items-center justify-center w-28 h-28">
          {/* Outer dashed spinning ring */}
          <div className="absolute w-full h-full border-4 border-dashed border-[var(--color-primary)] rounded-full animate-[spin_4s_linear_infinite] opacity-30"></div>
          
          {/* Middle solid spinning ring (opposite direction) */}
          <div className="absolute w-24 h-24 border-4 border-[var(--color-secondary)] border-t-transparent border-l-transparent rounded-full animate-[spin_2s_linear_infinite_reverse] opacity-70"></div>
          
          {/* Inner solid spinning ring */}
          <div className="absolute w-20 h-20 border-4 border-[var(--color-primary)] border-b-transparent border-r-transparent rounded-full animate-[spin_1.5s_linear_infinite]"></div>
          
          {/* Center Icon */}
          <div className="flex items-center justify-center w-12 h-12 bg-[var(--color-surface)] rounded-full shadow-md z-10">
            <span className="material-symbols-outlined text-[var(--color-primary)] text-2xl animate-pulse">
              spa
            </span>
          </div>
        </div>

        {/* Text Area */}
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-2xl font-bold text-[var(--color-on-background)] font-serif tracking-wide">
            Mohon Tunggu
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <p className="text-[var(--color-on-surface-variant)] text-sm font-medium tracking-wider uppercase">
              Menyiapkan Halaman
            </p>
            {/* Animated Dots */}
            <span className="flex gap-1 ml-1">
              <span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
