"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  History,
  Search,
  Filter,
  Calendar,
  Trash2,
  ExternalLink,
  Stethoscope,
  Eye,
  Flame,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { fetchHistory, deleteHistory } from "@/lib/api";

export default function RiwayatPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJenis, setSelectedJenis] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchHistory({
        search: searchTerm,
        jenis: selectedJenis,
        startDate,
        endDate,
      });
      if (res.success && res.data) {
        setItems(res.data);
      }
    } catch (err) {
      console.error("Gagal memuat riwayat:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedJenis, startDate, endDate]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteHistory(id);
      if (res.success) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        setDeleteConfirmId(null);
      } else {
        alert("Gagal menghapus: " + res.error);
      }
    } catch (err) {
      alert("Terjadi kesalahan saat menghapus data.");
    }
  };

  const getJenisBadge = (jenis: string) => {
    switch (jenis) {
      case "gejala":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-brand-dark">
            <Stethoscope className="w-3 h-3" />
            <span>Pakar Gejala</span>
          </span>
        );
      case "daun":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
            <Eye className="w-3 h-3" />
            <span>AI Daun</span>
          </span>
        );
      case "buah":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-brand-accent">
            <Flame className="w-3 h-3" />
            <span>AI Buah</span>
          </span>
        );
      case "kematangan":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <Sparkles className="w-3 h-3" />
            <span>Kematangan</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {jenis}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/80 text-slate-800 text-xs font-bold uppercase tracking-wider mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Arsip Pemeriksaan</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Riwayat Pemeriksaan Cabai
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Daftar lengkap konsultasi sistem pakar dan deteksi Computer Vision yang telah dilakukan.
          </p>
        </div>

        <Link
          href="/pemeriksaan"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold shadow-md transition-all self-start md:self-auto"
        >
          <Stethoscope className="w-4 h-4" />
          <span>Pemeriksaan Baru</span>
        </Link>
      </div>

      {/* Toolbar Filter */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Cari ID pemeriksaan, nama petani, penyakit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-primary focus:ring-2 focus:ring-emerald-200 outline-none text-sm"
            />
          </div>

          {/* Filter Jenis */}
          <div className="md:col-span-3">
            <select
              value={selectedJenis}
              onChange={(e) => setSelectedJenis(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-brand-primary focus:ring-2 focus:ring-emerald-200 outline-none text-sm text-slate-700 font-medium"
            >
              <option value="all">Semua Jenis Layanan</option>
              <option value="gejala">Sistem Pakar Gejala</option>
              <option value="daun">Deteksi AI Daun</option>
              <option value="buah">Deteksi AI Buah</option>
              <option value="kematangan">Deteksi Kematangan</option>
            </select>
          </div>

          {/* Tanggal Start & End */}
          <div className="md:col-span-4 flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-600 outline-none"
            />
            <span className="text-slate-400 text-xs">s/d</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-600 outline-none"
            />
          </div>
        </form>

        {(searchTerm || selectedJenis !== "all" || startDate || endDate) && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Filter aktif diterapkan</span>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedJenis("all");
                setStartDate("");
                setEndDate("");
              }}
              className="text-brand-accent font-bold hover:underline"
            >
              Hapus Semua Filter
            </button>
          </div>
        )}
      </div>

      {/* Tabel / Card List Riwayat */}
      {loading ? (
        <div className="bg-white rounded-3xl p-16 text-center text-slate-400 space-y-3 border border-slate-200">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm">Memuat data riwayat dari database...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center text-slate-500 space-y-4 border border-slate-200">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700">Belum Ada Riwayat Pemeriksaan</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Tidak ditemukan sesi pemeriksaan yang cocok dengan filter. Silakan lakukan pemeriksaan tanaman cabai terlebih dahulu.
          </p>
          <Link
            href="/pemeriksaan"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold"
          >
            Mulai Pemeriksaan Sekarang
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-4 px-6">ID & Tanggal</th>
                  <th className="py-4 px-6">Petani / Lahan</th>
                  <th className="py-4 px-6">Jenis Layanan</th>
                  <th className="py-4 px-6">Hasil Diagnosa / Prediksi</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-mono font-bold text-slate-800">{item.id}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(item.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>

                    <td className="py-4 px-6 font-semibold text-slate-700">
                      {item.nama_pengguna || "Tamu"}
                    </td>

                    <td className="py-4 px-6">
                      {getJenisBadge(item.jenis_pemeriksaan)}
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 line-clamp-1">
                        {item.kesimpulan_diagnosa}
                      </div>
                      {item.hasil_deteksi?.confidence_score && (
                        <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                          Confidence: {(item.hasil_deteksi.confidence_score * 100).toFixed(1)}%
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status_hasil === "Teridentifikasi"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.status_hasil}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <Link
                        href={`/hasil/${item.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-brand-primary font-bold text-xs transition-colors"
                      >
                        <span>Detail</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="inline-flex items-center p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-brand-accent transition-colors"
                        title="Hapus riwayat ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4 shadow-2xl border border-slate-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-brand-accent flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Hapus Riwayat Pemeriksaan?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Apakah Anda yakin ingin menghapus arsip riwayat{" "}
              <strong className="text-slate-800">{deleteConfirmId}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-semibold text-xs hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-brand-accent hover:bg-rose-700 text-white font-bold text-xs shadow-md"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

