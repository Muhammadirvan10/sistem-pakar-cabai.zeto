"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Stethoscope,
  Eye,
  History,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  Flame,
} from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [examDropdownOpen, setExamDropdownOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo CabaiCare */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary via-emerald-600 to-green-700 flex items-center justify-center shadow-md shadow-brand-primary/20 group-hover:scale-105 transition-transform">
              <span className="relative flex items-center justify-center">
                <Flame className="w-7 h-7 text-brand-accent fill-brand-accent drop-shadow" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl tracking-tight text-brand-dark">
                  Cabai<span className="text-brand-accent">Care</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 tracking-wide uppercase">
                  Pakar & AI
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Sistem Pakar & Deteksi Tanaman Cabai
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive("/")
                  ? "text-brand-primary bg-emerald-50"
                  : "text-slate-600 hover:text-brand-primary hover:bg-slate-50"
              }`}
            >
              Beranda
            </Link>

            {/* Dropdown Pemeriksaan */}
            <div className="relative">
              <button
                onClick={() => setExamDropdownOpen(!examDropdownOpen)}
                onMouseEnter={() => setExamDropdownOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  pathname.startsWith("/pemeriksaan") ||
                  pathname.startsWith("/diagnosis") ||
                  pathname.startsWith("/deteksi-") ||
                  pathname.startsWith("/kematangan")
                    ? "text-brand-primary bg-emerald-50"
                    : "text-slate-600 hover:text-brand-primary hover:bg-slate-50"
                }`}
              >
                <span>Layanan Periksa</span>
                <ChevronDown className="w-4 h-4 opacity-70" />
              </button>

              {examDropdownOpen && (
                <div
                  onMouseLeave={() => setExamDropdownOpen(false)}
                  className="absolute left-0 mt-1 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <Link
                    href="/diagnosis"
                    onClick={() => setExamDropdownOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-emerald-50 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-emerald-100 text-brand-primary group-hover:scale-110 transition-transform">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">
                        Sistem Pakar Gejala
                      </div>
                      <p className="text-xs text-slate-500">
                        Forward Chaining aturan pakar
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/deteksi-daun"
                    onClick={() => setExamDropdownOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-emerald-50 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-green-100 text-green-700 group-hover:scale-110 transition-transform">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">
                        Deteksi Penyakit Daun
                      </div>
                      <p className="text-xs text-slate-500">
                        Computer Vision citra daun
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/deteksi-buah"
                    onClick={() => setExamDropdownOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-rose-50 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-rose-100 text-brand-accent group-hover:scale-110 transition-transform">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">
                        Deteksi Penyakit Buah
                      </div>
                      <p className="text-xs text-slate-500">
                        Antraknosa & kebusukan buah
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/kematangan"
                    onClick={() => setExamDropdownOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-amber-100 text-amber-700 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">
                        Deteksi Kematangan
                      </div>
                      <p className="text-xs text-slate-500">
                        Klasifikasi kesiapan panen
                      </p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/riwayat"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive("/riwayat")
                  ? "text-brand-primary bg-emerald-50"
                  : "text-slate-600 hover:text-brand-primary hover:bg-slate-50"
              }`}
            >
              <History className="w-4 h-4" />
              <span>Riwayat</span>
            </Link>

            <Link
              href="/admin/dashboard"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                pathname.startsWith("/admin")
                  ? "text-brand-primary bg-emerald-50"
                  : "text-slate-600 hover:text-brand-primary hover:bg-slate-50"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Admin</span>
            </Link>
          </div>

          {/* Action CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/pemeriksaan"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-primary to-emerald-600 hover:from-brand-dark hover:to-emerald-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-brand-primary/20 transition-all active:scale-95"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Mulai Pemeriksaan</span>
            </Link>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-brand-primary hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl font-semibold text-slate-700 hover:bg-emerald-50 hover:text-brand-primary"
          >
            Beranda
          </Link>
          <Link
            href="/pemeriksaan"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl font-semibold text-slate-700 hover:bg-emerald-50 hover:text-brand-primary"
          >
            Pilihan Semua Layanan
          </Link>
          <div className="pl-4 border-l-2 border-emerald-300 space-y-1">
            <Link
              href="/diagnosis"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-emerald-50 hover:text-brand-primary"
            >
              1. Diagnosis Gejala (Forward Chaining)
            </Link>
            <Link
              href="/deteksi-daun"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-emerald-50 hover:text-brand-primary"
            >
              2. Deteksi Penyakit Daun (AI)
            </Link>
            <Link
              href="/deteksi-buah"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-emerald-50 hover:text-brand-primary"
            >
              3. Deteksi Penyakit Buah (AI)
            </Link>
            <Link
              href="/kematangan"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-emerald-50 hover:text-brand-primary"
            >
              4. Deteksi Kematangan Cabai (AI)
            </Link>
          </div>
          <Link
            href="/riwayat"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl font-semibold text-slate-700 hover:bg-emerald-50 hover:text-brand-primary"
          >
            Riwayat Pemeriksaan
          </Link>
          <Link
            href="/admin/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl font-semibold text-slate-700 hover:bg-emerald-50 hover:text-brand-primary"
          >
            Dashboard Admin
          </Link>
          <div className="pt-2">
            <Link
              href="/pemeriksaan"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold py-3 rounded-xl shadow"
            >
              <Stethoscope className="w-5 h-5" />
              <span>Mulai Pemeriksaan Sekarang</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

