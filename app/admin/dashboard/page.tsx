"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  Bug,
  ListChecks,
  Network,
  Cpu,
  History,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  Flame,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import AdminSidebar from "@/components/AdminSidebar";
import { fetchAdminStats } from "@/lib/api";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const res = await fetchAdminStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error("Gagal memuat statistik admin:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const barData = [
    { name: "P01 Gemini", total: 14 },
    { name: "P02 Cercospora", total: 8 },
    { name: "P03 Layu Bakteri", total: 11 },
    { name: "P04 Fusarium", total: 6 },
    { name: "P05 Antraknosa", total: 19 },
    { name: "P06 Phytophthora", total: 7 },
    { name: "P07 Thrips", total: 5 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Nav */}
        <AdminSidebar />

        {/* Content Area */}
        <div className="flex-1 space-y-8 w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Dashboard & Manajemen Pakar
              </h1>
              <p className="text-xs text-slate-500">
                Pemantauan real-time inferensi sistem pakar dan deteksi visual tanaman cabai
              </p>
            </div>
            <Link
              href="/pemeriksaan"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold shadow-sm"
            >
              <span>Uji Coba Inferensi</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Total Periksa
                </span>
                <Activity className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {loading ? "..." : stats?.total_pemeriksaan ?? 0}
              </div>
              <p className="text-[10px] text-slate-400">Seluruh sesi konsultasi</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Basis Penyakit
                </span>
                <Bug className="w-4 h-4 text-brand-accent" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {loading ? "..." : stats?.total_penyakit ?? 7}
              </div>
              <p className="text-[10px] text-slate-400">P01 s.d P07 terdaftar</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Basis Gejala
                </span>
                <ListChecks className="w-4 h-4 text-brand-primary" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {loading ? "..." : stats?.total_gejala ?? 18}
              </div>
              <p className="text-[10px] text-slate-400">Fakta premis lapangan</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Aturan IF-THEN
                </span>
                <Network className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {loading ? "..." : stats?.total_aturan ?? 18}
              </div>
              <p className="text-[10px] text-slate-400">Mesin inferensi forward</p>
            </div>
          </div>

          {/* Recharts Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Pie Chart: Distribusi Metode Pemeriksaan */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  Distribusi Metode Pemeriksaan
                </h3>
                <p className="text-xs text-slate-400">
                  Proporsi penggunaan Sistem Pakar vs Deteksi Citra AI
                </p>
              </div>

              <div className="h-64 w-full">
                {stats?.distribusi_jenis ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.distribusi_jenis}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {stats.distribusi_jenis.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    Memuat grafik distribusi...
                  </div>
                )}
              </div>
            </div>

            {/* Bar Chart: Frekuensi Diagnosis Penyakit */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  Frekuensi Diagnosis Penyakit Terbanyak
                </h3>
                <p className="text-xs text-slate-400">
                  Total insiden patogen terdeteksi pada tanaman cabai
                </p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-25} textAnchor="end" height={45} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip wrapperStyle={{ fontSize: "11px" }} />
                    <Bar dataKey="total" fill="#15803d" radius={[6, 6, 0, 0]} name="Kasus Terdeteksi" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Tabel Riwayat Terbaru */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  Pemeriksaan Terbaru
                </h3>
                <p className="text-xs text-slate-400">
                  Aktivitas diagnostik terkini dari petani dan tamu
                </p>
              </div>
              <Link
                href="/riwayat"
                className="text-xs font-bold text-brand-primary hover:underline"
              >
                Lihat Semua Riwayat →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">ID Sesi</th>
                    <th className="py-2.5 px-3">Pengguna</th>
                    <th className="py-2.5 px-3">Layanan</th>
                    <th className="py-2.5 px-3">Hasil</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats?.riwayat_terbaru?.map((r: any) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-slate-700">
                        {r.id}
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-medium">
                        {r.nama_pengguna}
                      </td>
                      <td className="py-3 px-3">
                        <span className="capitalize px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                          {r.jenis_pemeriksaan}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {r.kesimpulan_diagnosa}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href={`/hasil/${r.id}`}
                          className="text-xs font-bold text-brand-primary hover:underline"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

