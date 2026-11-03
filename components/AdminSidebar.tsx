"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Bug,
  ListChecks,
  Network,
  Cpu,
  History,
  LogOut,
  Flame,
  ArrowLeft,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar dari sesi admin?")) {
      localStorage.removeItem("cabaicare_admin_token");
      localStorage.removeItem("cabaicare_admin_user");
      router.push("/login");
    }
  };

  const navItems = [
    {
      name: "Dashboard & Metrik",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Basis Penyakit (P)",
      href: "/admin/penyakit",
      icon: Bug,
    },
    {
      name: "Basis Gejala (G)",
      href: "/admin/gejala",
      icon: ListChecks,
    },
    {
      name: "Aturan Inferensi (R)",
      href: "/admin/aturan",
      icon: Network,
    },
    {
      name: "Model Computer Vision",
      href: "/admin/model-ai",
      icon: Cpu,
    },
    {
      name: "Arsip Pemeriksaan",
      href: "/riwayat",
      icon: History,
    },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-6 shrink-0 admin-sidebar">
      {/* Brand Mini */}
      <div className="flex items-center gap-3 px-2 border-b border-slate-100 pb-4">
        <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white">
          <Flame className="w-6 h-6 text-brand-accent fill-brand-accent" />
        </div>
        <div>
          <div className="font-bold text-slate-800 text-sm">Panel Pakar</div>
          <p className="text-[11px] text-slate-400">CabaiCare Admin</p>
        </div>
      </div>

      {/* Nav List */}
      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-brand-primary text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-brand-primary"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout & Back */}
      <div className="pt-4 border-t border-slate-100 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Lihat Website Utama</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-brand-accent hover:bg-rose-50 font-bold transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Sesi (Logout)</span>
        </button>
      </div>
    </aside>
  );
}

