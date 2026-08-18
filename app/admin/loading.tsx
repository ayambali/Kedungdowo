import React from "react";

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full gap-6">
      {/* Main Loader Container */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Animated Icon & Rings */}
        <div className="relative flex items-center justify-center w-20 h-20">
          {/* Outer dashed spinning ring */}
          <div className="absolute w-full h-full border-[3px] border-dashed border-[var(--color-primary)] rounded-full animate-[spin_4s_linear_infinite] opacity-30"></div>
          
          {/* Middle solid spinning ring (opposite direction) */}
          <div className="absolute w-16 h-16 border-[3px] border-[var(--color-secondary)] border-t-transparent border-l-transparent rounded-full animate-[spin_2s_linear_infinite_reverse] opacity-70"></div>
          
          {/* Inner solid spinning ring */}
          <div className="absolute w-12 h-12 border-[3px] border-[var(--color-primary)] border-b-transparent border-r-transparent rounded-full animate-[spin_1.5s_linear_infinite]"></div>
          
          {/* Center Icon */}
          <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-sm z-10">
            <span className="material-symbols-outlined text-[var(--color-primary)] text-lg animate-pulse">
              spa
            </span>
          </div>
        </div>

        {/* Text Area */}
        <div className="flex flex-col items-center gap-1">
          <h3 className="text-lg font-bold text-[var(--color-on-background)] font-sans">
            Memuat Data Panel...
          </h3>
          <div className="flex items-center gap-1 mt-0.5">
            <p className="text-[var(--color-on-surface-variant)] text-xs font-medium uppercase tracking-wider">
              Harap Tunggu
            </p>
            {/* Animated Dots */}
            <span className="flex gap-1 ml-1">
              <span className="w-1 h-1 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1 h-1 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1 h-1 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
