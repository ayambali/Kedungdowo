"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { 
    href: "/profil", 
    label: "Profil Desa",
    subLinks: [
      { href: "/profil", label: "Tentang Desa / Sejarah" },
      { href: "/potensi/ketahanan-pangan", label: "Potensi Ketahanan Pangan" },
    ]
  },
  { href: "/perangkat", label: "Perangkat Desa" },
  { href: "/umkm", label: "UMKM" },
  { href: "/berita", label: "Berita" },
  { 
    href: "/layanan", 
    label: "Layanan Publik",
    subLinks: [
      { href: "/layanan", label: "Pengaduan & Informasi" },
      { href: "/layanan/peraturan-desa", label: "JDIH / Peraturan Desa" },
    ]
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const isLogin = pathname === "/login";
  const isAdmin = pathname.startsWith("/admin");
  const isHome = pathname === "/";

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) setMobileOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenMobileDropdown(null);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  if (isLogin || isAdmin) return null;

  // On non-home pages, always show solid bg
  const showSolid = scrolled || !isHome;

  return (
    <nav
      className={`fixed top-0 w-full z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ease-in-out ${
        showSolid
          ? "bg-surface/95 border-outline-variant/20 shadow-sm backdrop-blur-md"
          : "bg-surface/0 border-outline-variant/0"
      }`}
    >
      <div className="w-full flex justify-between items-center px-4 md:px-8 h-20">
        {/* Logo */}
        <Link
          href="/"
          onClick={(e) => {
            if (isHome) {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className={`font-serif text-xl font-bold transition-colors duration-300 ${
            showSolid ? "text-primary" : "text-white"
          }`}
        >
          Desa Kedungdowo
        </Link>

        {/* Desktop Nav Links (Centered) */}
        <div className="hidden md:flex gap-1 items-center absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.subLinks && link.subLinks.some(s => pathname === s.href));
            
            if (link.subLinks) {
              return (
                <div key={link.href} className="relative group">
                  <button
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1 ${
                      showSolid
                        ? isActive
                          ? "text-primary bg-primary/10"
                          : "text-on-surface-variant hover:text-primary hover:bg-primary/5"
                        : isActive
                          ? "text-white bg-white/15"
                          : "text-white/90 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {link.label}
                    <span className="material-symbols-outlined text-[16px] transition-transform duration-200 group-hover:rotate-180">
                      expand_more
                    </span>
                  </button>
                  {/* Dropdown Menu */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 w-56 z-50">
                    <div className="bg-white rounded-xl shadow-xl border border-outline-variant/20 py-2 overflow-hidden flex flex-col">
                      {link.subLinks.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={`px-4 py-2.5 text-sm transition-colors hover:bg-primary/5 hover:text-primary ${
                            pathname === sub.href ? "text-primary font-semibold bg-primary/5" : "text-on-surface-variant"
                          }`}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  showSolid
                    ? isActive
                      ? "text-primary bg-primary/10"
                      : "text-on-surface-variant hover:text-primary hover:bg-primary/5"
                    : isActive
                      ? "text-white bg-white/15"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Section (Toggle on Mobile) */}
        <div className="flex items-center">
          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              showSolid
                ? "text-on-surface hover:bg-surface-container"
                : "text-white hover:bg-white/10"
            }`}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-surface/95 backdrop-blur-md border-t border-outline-variant/20 px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link) => {
            if (link.subLinks) {
              return (
                <div key={link.href} className="flex flex-col gap-1">
                  <button 
                    onClick={() => setOpenMobileDropdown(openMobileDropdown === link.href ? null : link.href)}
                    className={`px-4 py-3 rounded-lg font-semibold text-sm transition-all flex justify-between items-center w-full ${
                      openMobileDropdown === link.href || link.subLinks.some(s => pathname === s.href)
                        ? "text-primary bg-primary/10"
                        : "text-on-surface-variant hover:bg-surface-container"
                    }`}
                  >
                    {link.label}
                    <span className={`material-symbols-outlined transition-transform duration-300 ${openMobileDropdown === link.href ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openMobileDropdown === link.href ? 'max-h-64 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                    <div className="flex flex-col gap-1 pl-4 border-l-2 border-outline-variant/30 ml-6 py-1">
                      {link.subLinks.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                              isSubActive
                                ? "text-primary bg-primary/5"
                                : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
                            }`}
                          >
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-on-surface-variant hover:text-primary hover:bg-primary/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
