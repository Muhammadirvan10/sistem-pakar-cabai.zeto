"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Stethoscope,
  Eye,
  Flame,
  Sparkles,
  Printer,
  ArrowLeft,
  Calendar,
  User,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Layers,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { fetchHistoryByID } from "@/lib/api";

export default function DetailHasilPemeriksaanPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        setLoading(true);
        const res = await fetchHistoryByID(id);
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setError("Riwayat pemeriksaan tidak ditemukan.");
        }
      } catch (err: any) {
        setError("Gagal memuat detail pemeriksaan: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-500">Memuat hasil pemeriksaan {id}...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">
          Data Pemeriksaan Tidak Ditemukan
        </h2>
        <p className="text-sm text-slate-500">{error || "ID pemeriksaan tidak valid."}</p>
        <Link
          href="/riwayat"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Riwayat</span>
        </Link>
      </div>
    );
  }

  const isAI = data.jenis_pemeriksaan !== "gejala";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-8">
      {/* Top Bar / Navigation */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
          <Link
            href="/pemeriksaan"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-brand-primary text-xs font-bold transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Pemeriksaan Baru</span>
          </Link>
        </div>
      </div>

      {/* Main Document Card (Siap Cetak / Print) */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8 print-shadow-none">
        {/* Header Dokumen */}
        <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-extrabold px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                {data.id}
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase bg-emerald-100 text-brand-dark">
                {data.jenis_pemeriksaan === "gejala"
                  ? "Sistem Pakar Forward Chaining"
                  : `Deteksi AI: ${data.jenis_pemeriksaan}`}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Lembar Hasil Pemeriksaan Tanaman Cabai
            </h1>
            <p className="text-xs text-slate-500">
              Dokumen resmi hasil inferensi platform CabaiCare
            </p>
          </div>

          <div className="text-right sm:text-right space-y-1 text-xs text-slate-500">
            <div className="flex items-center sm:justify-end gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {new Date(data.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="flex items-center sm:justify-end gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>{data.nama_pengguna}</span>
            </div>
          </div>
        </div>

        {/* Foto Jika Ada */}
        {data.foto_url && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-center space-y-2">
            <img
              src={data.foto_url}
              alt="Foto yang Dianalisis"
              className="max-h-72 w-full object-contain rounded-xl mx-auto"
            />
            <p className="text-[11px] text-slate-400 font-mono">
              Foto spesimen yang diunggah pengguna
            </p>
          </div>
        )}

        {/* Ringkasan Kesimpulan */}
        <div
          className={`rounded-3xl p-6 sm:p-8 border space-y-4 ${
            data.status_hasil === "Teridentifikasi"
              ? "bg-gradient-to-br from-emerald-50/50 to-white border-emerald-200"
              : "bg-amber-50/70 border-amber-200"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Hasil Diagnosis / Klasifikasi
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {data.kesimpulan_diagnosa}
              </h2>
              {data.penyakit?.nama_ilmiah && (
                <p className="text-sm italic text-slate-600 font-serif mt-1">
                  Patogen: {data.penyakit.nama_ilmiah}
                </p>
              )}
            </div>

            {/* Jika AI: Tampilkan Confidence Score. Jika Sistem Pakar: Tampilkan Deterministik Tanpa Persentase Palsu! */}
            {isAI && data.hasil_deteksi?.confidence_score ? (
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-right shadow-sm shrink-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase">
                  Confidence Score (AI)
                </div>
                <div className="text-3xl font-extrabold text-emerald-700">
                  {(data.hasil_deteksi.confidence_score * 100).toFixed(1)}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Model: {data.hasil_deteksi.model_name}
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 text-right shadow-sm shrink-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase">
                  Metode Inferensi
                </div>
                <div className="text-sm font-extrabold text-brand-dark">
                  Forward Chaining
                </div>
                <div className="text-[10px] text-emerald-600 mt-0.5">
                  Aturan Ilmiah Deterministik
                </div>
              </div>
            )}
          </div>

          {data.penyakit?.deskripsi && (
            <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-2xl border border-slate-100">
              {data.penyakit.deskripsi}
            </p>
          )}
        </div>

        {/* Jika Sistem Pakar Gejala: Tampilkan Fakta Gejala & Jejak Aturan */}
        {data.gejala_terpilih && data.gejala_terpilih.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Fakta Gejala yang Dipilih Pengguna:</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {data.gejala_terpilih.map((g: any) => (
                <div
                  key={g.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-2"
                >
                  <span className="font-mono font-bold text-emerald-800">{g.id}</span>
                  <span>{g.nama_gejala}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saran Penanganan & Rekomendasi */}
        {data.penyakit && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <h4 className="text-xs font-extrabold text-brand-primary uppercase tracking-wider">
                Penanganan Organik
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {data.penyakit.penanganan_organik}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <h4 className="text-xs font-extrabold text-amber-800 uppercase tracking-wider">
                Penanganan Kimia
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {data.penyakit.penanganan_kimia}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
              <h4 className="text-xs font-extrabold text-blue-800 uppercase tracking-wider">
                Pencegahan Lahan
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {data.penyakit.pencegahan}
              </p>
            </div>
          </div>
        )}

        {/* Jika AI: Tampilkan Rekomendasi Tindakan AI */}
        {data.hasil_deteksi?.rekomendasi_tindakan && !data.penyakit && (
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Rekomendasi Tindakan Kebun & Sortasi:</span>
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              {data.hasil_deteksi.rekomendasi_tindakan}
            </p>
          </div>
        )}

        {/* Footer Dokumen Cetak */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500 gap-2">
          <span>CabaiCare System – Universitas Dharma Wacana</span>
          <span>Dicetak melalui platform digital pertanian CabaiCare</span>
        </div>
      </div>
    </div>
  );
}

