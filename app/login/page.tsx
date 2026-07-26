"use client";

import { useActionState, useState } from "react";
import { login } from "./actions";
import Icon from "../components/Icon";
import Link from "next/link";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden font-sans">
      {/* Background Layer with Boyolali Rural Landscape */}
      <div className="fixed inset-0 -z-10 bg-surface-container">
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1c1c]/40 to-[#1a1c1c]/70 z-10" />
        <img
          alt="Boyolali Rural Landscape"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7k5Z2U1PZzJxGyq6cANjM0h0R9dCFrMH85eQrVndoz4UA4mbNUqalF0gFR2GR3BpziLfl4CGk_8WEBB4Nkyl317spmx1mFd6IiZEsXEvV1NZO1tLkTEzATb3p-ZA432ABEcD4bmBW60xkTTX1qa3U_oA4WVTF-s9E2aqOOUqA05p6NUY5Q6w5d-mJF0M_7CWIQSm1USpDin7bnYt9t0oQlEkh0Wu27dCZF7ADGm9h9yW-r54r8r6e4n_muYXw8BcMvVSNoKtLUKSF"
        />
      </div>

      {/* Main Content Canvas */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 relative z-20">
        
        {/* Back to Home Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white font-medium transition-all group py-1.5 px-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20"
          >
            <Icon name="arrow_back" className="text-sm transition-transform group-hover:-translate-x-1" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden relative border border-white/30">
            
            {/* Batik Decorative Top Border */}
            <div 
              className="absolute top-0 right-0 w-32 h-32 -z-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: "radial-gradient(var(--color-primary) 0.8px, transparent 0.8px)",
                backgroundSize: "12px 12px",
              }}
            />

            <div className="p-4 md:p-8 md:p-4 md:p-10 relative z-10">
              
              {/* Logo & Header */}
              <div className="text-center mb-8">
                <div className="mb-6 flex justify-center">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary/10 rounded-xl rotate-45 border border-primary/20"></div>
                    <Icon name="potted_plant" className="text-primary text-2xl md:text-3xl relative z-10" />
                  </div>
                </div>
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-on-surface mb-2 tracking-tight">
                  Kedungdowo
                </h1>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">
                  Admin Portal
                </p>
              </div>

              {/* Login Form */}
              <form action={formAction} className="space-y-6">
                
                {/* Username Field */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant/80" htmlFor="username">
                    Username / Email
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                      <Icon name="person" className="text-xl" />
                    </span>
                    <input
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-container-lowest/50 border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm text-on-surface placeholder:text-outline-variant"
                      id="username"
                      name="username"
                      placeholder="Masukkan username"
                      required
                      type="text"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant/80" htmlFor="password">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                      <Icon name="lock" className="text-xl" />
                    </span>
                    <input
                      className="w-full pl-11 pr-11 py-3 rounded-xl bg-surface-container-lowest/50 border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm text-on-surface placeholder:text-outline-variant"
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      required
                      type={showPassword ? "text" : "password"}
                    />
                    <button
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                    >
                      <Icon name={showPassword ? "visibility_off" : "visibility"} className="text-xl" />
                    </button>
                  </div>
                </div>

                {/* Error Alert */}
                {state?.error && (
                  <div className="bg-error/5 border border-error/20 text-error px-4 py-3 rounded-xl text-xs font-semibold flex items-start gap-2.5 animate-fadeIn">
                    <Icon name="error" className="text-error text-lg shrink-0 mt-0.5" />
                    <span>{state.error}</span>
                  </div>
                )}

                {/* Submit Action */}
                <button
                  disabled={pending}
                  className="w-full h-12 bg-[#0a4d15] text-on-primary font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-[#083d11] transition-all active:scale-[0.99] shadow-lg shadow-primary/20 disabled:opacity-75 disabled:cursor-not-allowed text-sm uppercase tracking-wider"
                  type="submit"
                >
                  {pending ? (
                    <>
                      <Icon name="progress_activity" className="animate-spin text-lg" />
                      <span>Mengautentikasi...</span>
                    </>
                  ) : (
                    <>
                      <span>Masuk ke Dashboard</span>
                      <Icon name="trending_flat" className="text-lg" />
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>

          {/* Simple footer/credits */}
          <div className="mt-8 text-center">
            <p className="text-[11px] text-white/60 font-sans tracking-wide">
              Pemerintah Desa Kedungdowo &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
