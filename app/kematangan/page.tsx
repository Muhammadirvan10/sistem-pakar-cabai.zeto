"use client";

import { useState, useRef } from "react";
import {
  Sparkles,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Printer,
  Info,
  ShieldAlert,
  Clock,
  TrendingUp,
} from "lucide-react";
import { runDetection } from "@/lib/api";

interface RipenessDetectionOutput {
  success: boolean;
  id_pemeriksaan: string;
  hasil_deteksi: {
    model_name: string;
    model_version: string;
    kelas_terdeteksi: string;
    confidence_score: number;
    distribusi_kelas?: Record<string, number>;
    waktu_inferensi_ms: number;
    is_demo_mode: boolean;
    catatan_disclaimer: string;
    rekomendasi_tindakan: string;
  };
  foto_url: string;
  pesan: string;
}

export default function KematanganPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [namaPengguna, setNamaPengguna] = useState("Petani Cabai (Tamu)");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<RipenessDetectionOutput | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    setErrorMsg(null);
    setResult(null);

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setErrorMsg("Format file tidak didukung. Harap unggah foto berekstensi .jpg, .jpeg, atau .png.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Ukuran file melebihi 5MB. Silakan pilih foto dengan resolusi lebih ringan.");
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewURL(url);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmitAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg("Silakan pilih foto cabai terlebih dahulu.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await runDetection("ripeness", selectedFile, namaPengguna);
      if (res.success) {
        setResult(res);
        setTimeout(() => {
          document.getElementById("hasil-kematangan")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        setErrorMsg(res.error || "Gagal melakukan estimasi kematangan");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Gagal menghubungi server deteksi: " + (err.message || "Network Error"));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewURL(null);
    setResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Computer Vision & Color-Space Analisis</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Deteksi Tingkat Kematangan Buah Cabai
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Unggah foto buah cabai untuk mengklasifikasikan fase kematangan: mentah (hijau), mulai matang (turning), matang optimal (merah cerah), atau lewat matang guna menentukan waktu panen terbaik.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Kiri: Form Upload */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <form onSubmit={handleSubmitAnalysis} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Nama Pengguna / Pemilik Lahan
              </label>
              <input
                type="text"
                value={namaPengguna}
                onChange={(e) => setNamaPengguna(e.target.value)}
                placeholder="Masukkan nama pengguna..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-200 outline-none text-sm transition-all"
                required
              />
            </div>

            {/* Drag & Drop Box */}
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-4 ${
                isDragging
                  ? "border-amber-600 bg-amber-50/70"
                  : previewURL
                  ? "border-amber-500/80 bg-amber-50/20"
                  : "border-slate-300 hover:border-amber-500 hover:bg-slate-50"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                accept="image/jpeg,image/jpg,image/png"
                className="hidden"
              />

              {previewURL ? (
                <div className="space-y-3 w-full">
                  <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img
                      src={previewURL}
                      alt="Preview Cabai"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 px-2">
                    <span className="font-semibold text-slate-700 truncate max-w-[200px]">
                      {selectedFile?.name}
                    </span>
                    <span>
                      {selectedFile && (selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                  <p className="text-xs text-amber-700 font-bold">
                    Klik untuk mengganti foto cabai
                  </p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-slate-800 text-sm">
                      Seret & Lepas foto buah cabai di sini
                    </div>
                    <p className="text-xs text-slate-500">
                      atau <span className="text-amber-700 font-bold underline">pilih file foto dari galeri</span>
                    </p>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Format file JPG, JPEG, PNG (Maksimal 5MB)
                  </div>
                </>
              )}
            </div>

            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedFile || loading}
              className={`w-full py-4 rounded-2xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                !selectedFile || loading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-amber-600 hover:bg-amber-700 shadow-amber-900/20 active:scale-95"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memeriksa Kematangan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Estimasi Kematangan & Rekomendasi Panen</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Kolom Kanan: Panduan 4 Fase Kematangan Cabai */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span>4 Kategori Kematangan Buah Cabai</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-green-50 border border-green-200 space-y-1">
                <div className="text-xs font-bold text-green-800">
                  1. Mentah (Hijau Penuh)
                </div>
                <p className="text-[11px] text-slate-600">
                  Daging buah padat, klorofil tinggi. Masih membutuhkan 7-14 hari di pohon sebelum matang merah.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                <div className="text-xs font-bold text-amber-800">
                  2. Mulai Matang (Turning)
                </div>
                <p className="text-[11px] text-slate-600">
                  Peralihan hijau ke oranye/kekuningan. Sangat ideal untuk distribusi jarak jauh antar pulau.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
                <div className="text-xs font-bold text-rose-800">
                  3. Matang Sempurna (Merah)
                </div>
                <p className="text-[11px] text-slate-600">
                  Pigmen likopen & kapsaisin maksimal. Waktu panen terbaik untuk harga pasar lokal tertinggi.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
                <div className="text-xs font-bold text-purple-800">
                  4. Terlalu Matang / Layu
                </div>
                <p className="text-[11px] text-slate-600">
                  Kulit buah mulai keriput, kadar air berkurang drastis, rentan terkena infeksi jamur saprofit.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 text-slate-500 mt-0.5" />
              <span>
                <strong>Catatan Varietas & Pencahayaan:</strong> Warna visual dipengaruhi oleh varietas cabai (cabai rawit, merah keriting, besar) dan intensitas bayangan cahaya. Konfirmasikan selalu dengan perabaan kelenturan buah.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* HASIL DETEKSI KEMATANGAN */}
      {result && (
        <section
          id="hasil-kematangan"
          className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8 animate-in fade-in duration-300"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                  {result.id_pemeriksaan}
                </span>
                <span className="text-xs text-slate-500">
                  {new Date().toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Hasil Klasifikasi Kematangan Cabai
              </h2>
            </div>

            <div className="flex items-center gap-2 no-print">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Hasil</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Periksa Cabai Lain</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 relative">
                <img
                  src={result.foto_url}
                  alt="Citra Cabai yang Dianalisis"
                  className="w-full h-80 object-contain"
                />
                <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg text-white text-[11px] font-mono">
                  {result.hasil_deteksi.model_name}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
                      Tingkat Kematangan Terdeteksi
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                      {result.hasil_deteksi.kelas_terdeteksi}
                    </h3>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase text-slate-400">
                      Confidence Score
                    </div>
                    <div className="text-3xl font-extrabold text-amber-700">
                      {(result.hasil_deteksi.confidence_score * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${result.hasil_deteksi.confidence_score * 100}%` }}
                  />
                </div>

                <div className="flex items-center gap-2 pt-1 text-xs">
                  <span className="font-semibold text-slate-600">Arsitektur:</span>
                  <span className="font-mono text-slate-800">{result.hasil_deteksi.model_name}</span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-600">Durasi: {result.hasil_deteksi.waktu_inferensi_ms} ms</span>
                </div>
              </div>

              {/* Rekomendasi Waktu Panen */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Rekomendasi Waktu Panen & Penanganan Distribusi</span>
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {result.hasil_deteksi.rekomendasi_tindakan}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-slate-500" />
                  <span>Keterbatasan Model & Catatan Pengetahuan:</span>
                </div>
                <p className="leading-relaxed">
                  {result.hasil_deteksi.catatan_disclaimer}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

