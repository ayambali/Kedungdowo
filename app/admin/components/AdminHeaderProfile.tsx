"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Icon from "../../components/Icon";
import Link from "next/link";

export default function AdminHeaderProfile({
  logoutAction,
  username,
  role,
  namaLengkap,
}: {
  logoutAction: () => Promise<void>;
  username: string;
  role: string;
  namaLengkap: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName = namaLengkap || username;
  const roleLabel = role === "superadmin" ? "Superadmin" : "Admin Desa";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    setIsLogoutModalOpen(false);
    await logoutAction();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="min-h-[44px] py-2 px-4 flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full border border-outline-variant/20 shadow-sm ml-2 cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-primary/40 transition-all focus:outline-none bg-white/40 hover:bg-white/60"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-on-primary font-bold text-xs uppercase">
            {(displayName[0] || "A")}
          </span>
        </div>
        <div className="hidden lg:flex flex-col items-start">
          <span className="text-xs font-semibold text-on-surface leading-tight">{displayName}</span>
          <span className={`text-[9px] font-bold uppercase tracking-wider leading-tight ${
            role === "superadmin" ? "text-tertiary" : "text-secondary"
          }`}>
            {roleLabel}
          </span>
        </div>
        <Icon name="expand_more" className="text-on-surface-variant/60 text-base hidden lg:block" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl border border-outline-variant/20 rounded-2xl shadow-xl py-3 z-50 animate-fadeIn">
          {/* User Profile Header */}
          <div className="px-4 py-3 border-b border-outline-variant/20 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                <span className="text-on-primary font-bold text-sm uppercase">
                  {(displayName[0] || "A")}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-on-surface truncate">{displayName}</p>
                <p className="text-xs text-on-surface-variant/70 font-medium truncate">@{username}</p>
              </div>
            </div>
            <div className="mt-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                role === "superadmin" 
                  ? "bg-tertiary/10 text-tertiary border border-tertiary/20" 
                  : "bg-primary/10 text-primary border border-primary/20"
              }`}>
                <Icon name={role === "superadmin" ? "shield" : "person"} className="text-xs" />
                {roleLabel}
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-0.5 px-2">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors"
            >
              <Icon name="arrow_back" className="text-lg" />
              <span>Ke Web Publik</span>
            </Link>
          </div>

          <div className="border-t border-outline-variant/10 my-2" />

          {/* Logout Action */}
          <div className="px-2">
            <button onClick={handleLogout} className="min-h-[44px] py-2 px-4 flex w-full items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-error hover:bg-error/5 transition-colors text-left"
            >
              <Icon name="logout" className="text-lg" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && typeof document !== 'undefined'
        ? createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white rounded-2xl p-4 md:p-6 w-full max-w-sm shadow-2xl border border-outline-variant/20 animate-slideUpAndFade">
                <h3 className="text-xl font-bold text-on-surface mb-2">Konfirmasi Keluar</h3>
                <p className="text-on-surface-variant/80 mb-6 font-medium">Apakah Anda yakin ingin keluar dari halaman admin?</p>
                <div className="flex justify-end gap-3 mt-8">
                  <button onClick={() => setIsLogoutModalOpen(false)} className="min-h-[44px] py-2 px-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-on-surface-variant hover:bg-on-surface-variant/10 transition-colors"
                  >
                    Batal
                  </button>
                  <button onClick={confirmLogout} className="min-h-[44px] py-2 px-4 px-5 py-2.5 rounded-xl text-sm font-semibold bg-error text-white hover:bg-error/90 transition-colors shadow-sm shadow-error/20"
                  >
                    Ya, Keluar
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
