"use client";

import { useEffect, useState } from "react";
import {
  Stethoscope,
  CheckSquare,
  Square,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Printer,
  ChevronDown,
  ChevronUp,
  Layers,
  BookOpen,
  Info,
  ExternalLink,
} from "lucide-react";
import { fetchGejala, runDiagnosis } from "@/lib/api";

interface Gejala {
  id: string;
  nama_gejala: string;
  deskripsi: string;
  bagian_tanaman: string;
  bobot_pakar: number;
}

interface IterasiTrace {
  iterasi: number;
  memori_kerja: string[];
  aturan_aktif: string[];
  aturan_dipilih: string;
  fakta_baru: string;
  keterangan: string;
}

interface DiagnosisResult {
  success: boolean;
  id_pemeriksaan: string;
  teridentifikasi: boolean;
  penyakit_terpilih: Array<{
    id: string;
    nama_penyakit: string;
    nama_ilmiah: string;
    kategori: string;
    deskripsi: string;
    penyebab: string;
    gejala_umum: string;
    penanganan_organik: string;
    penanganan_kimia: string;
    pencegahan: string;
    tingkat_bahaya: string;
    gambar_url: string;
  }>;
  pesan: string;
  jejak_inferensi: {
    fakta_awal: string[];
    iterasi: IterasiTrace[];
    aturan_tereksekusi: string[];
    kesimpulan_antara: string[];
    kesimpulan_akhir: string[];
    waktu_eksekusi_ms: number;
  };
  gejala_input: Gejala[];
  referensi: Array<{
    id: number;
    judul: string;
    penulis: string;
    tahun: number;
    penerbit_jurnal: string;
    doi_url: string;
  }>;
}

export default function DiagnosisPage() {
  const [gejalaList, setGejalaList] = useState<Gejala[]>([]);
  const [selectedGejala, setSelectedGejala] = useState<string[]>([]);
  const [namaPengguna, setNamaPengguna] = useState("Petani Cabai (Tamu)");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBagian, setFilterBagian] = useState("all");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [showTraceTable, setShowTraceTable] = useState(true);

  // Ambil daftar gejala dari database API Golang
  useEffect(() => {
    async function loadGejala() {
      try {
        setFetchLoading(true);
        const res = await fetchGejala();
        if (res.success && res.data) {
          setGejalaList(res.data);
        }
      } catch (err) {
        console.error("Gagal mengambil data gejala:", err);
      } finally {
        setFetchLoading(false);
      }
    }
    loadGejala();
  }, []);

  const toggleGejala = (id: string) => {
    setSelectedGejala((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = (filteredIds: string[]) => {
    const allSelected = filteredIds.every((id) => selectedGejala.includes(id));
    if (allSelected) {
      setSelectedGejala((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      const newSelected = Array.from(new Set([...selectedGejala, ...filteredIds]));
      setSelectedGejala(newSelected);
    }
  };

  const handleReset = () => {
    setSelectedGejala([]);
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitDiagnosis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGejala.length === 0) {
      alert("Harap pilih minimal satu gejala untuk melakukan pemeriksaan sistem pakar.");
      return;
    }

    try {
      setLoading(true);
      const res = await runDiagnosis(namaPengguna, selectedGejala);
      if (res.success) {
        setResult(res);
        // Scroll ke hasil
        setTimeout(() => {
          document.getElementById("hasil-diagnosis")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        alert("Terjadi kesalahan saat inferensi: " + (res.error || "Gagal memproses"));
      }
    } catch (err) {
      console.error(err);
      alert("Gagal terhubung ke API Golang backend.");
    } finally {
      setLoading(false);
    }
  };

  // Filter Gejala
  const filteredGejala = gejalaList.filter((g) => {
    const matchSearch =
      g.nama_gejala.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.deskripsi && g.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchBagian =
      filterBagian === "all" || g.bagian_tanaman.toLowerCase() === filterBagian.toLowerCase();
    return matchSearch && matchBagian;
  });

  // Helper bagian label
  const getBagianBadge = (bagian: string) => {
    switch (bagian.toLowerCase()) {
      case "daun":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">Daun</span>;
      case "batang":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Batang</span>;
      case "buah":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-brand-accent">Buah</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">Seluruh Tanaman</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-brand-dark text-xs font-bold uppercase tracking-wider">
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Sistem Pakar Forward Chaining</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Diagnosis Penyakit Melalui Gejala Tanaman
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Pilihlah fakta-fakta atau kondisi abnormal yang tampak pada tanaman cabai Anda. Mesin inferensi Golang akan mencocokkan fakta tersebut dengan aturan pengetahuan pakar.
        </p>
      </div>

      {/* Form Konsultasi */}
      <form onSubmit={handleSubmitDiagnosis} className="space-y-8">
        {/* Identitas Pengguna & Info Konsultasi */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Data Sesi Konsultasi
              </h2>
              <p className="text-xs text-slate-500">
                Nama petani atau kelompok tani yang melakukan pemeriksaan
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Status Gejala:</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-brand-dark">
                {selectedGejala.length} Gejala Dipilih
              </span>
            </div>
          </div>

          <div className="max-w-md">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Nama Pengguna / Pemilik Lahan
            </label>
            <input
              type="text"
              value={namaPengguna}
              onChange={(e) => setNamaPengguna(e.target.value)}
              placeholder="Contoh: Petani Cabai Metro / Bpk. Sutrisno"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-brand-primary focus:ring-2 focus:ring-emerald-200 outline-none text-sm transition-all"
            />
          </div>
        </div>

        {/* Toolbar Filter & Pencarian Gejala */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Cari nama gejala atau kata kunci (misal: kuning, bercak, layu, patek)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-primary focus:ring-2 focus:ring-emerald-200 outline-none text-sm"
              />
            </div>

            {/* Filter Bagian Tanaman */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mr-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Bagian:</span>
              </div>
              {["all", "daun", "batang", "buah", "seluruh_tanaman"].map((bagian) => (
                <button
                  type="button"
                  key={bagian}
                  onClick={() => setFilterBagian(bagian)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                    filterBagian === bagian
                      ? "bg-brand-primary text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {bagian === "all" ? "Semua" : bagian.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Select All in filter */}
          <div className="flex justify-between items-center pt-2 text-xs text-slate-500 border-t border-slate-100">
            <span>
              Menampilkan {filteredGejala.length} dari {gejalaList.length} gejala terdaftar dalam basis pengetahuan
            </span>
            <button
              type="button"
              onClick={() => handleSelectAllFiltered(filteredGejala.map((g) => g.id))}
              className="text-brand-primary font-bold hover:underline"
            >
              Pilih / Batal Semua Bagian Ini
            </button>
          </div>
        </div>

        {/* Daftar Pilihan Gejala (Checkbox Cards) */}
        {fetchLoading ? (
          <div className="bg-white rounded-3xl p-12 text-center text-slate-400 space-y-3 border border-slate-200">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm">Memuat basis pengetahuan gejala dari server Golang...</p>
          </div>
        ) : filteredGejala.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-slate-500 space-y-3 border border-slate-200">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700">Tidak ada gejala yang cocok</h3>
            <p className="text-xs text-slate-400">
              Coba ganti kata kunci pencarian atau ubah filter bagian tanaman.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGejala.map((g) => {
              const isChecked = selectedGejala.includes(g.id);
              return (
                <div
                  key={g.id}
                  onClick={() => toggleGejala(g.id)}
                  className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all duration-200 flex flex-col justify-between select-none ${
                    isChecked
                      ? "bg-emerald-50/80 border-brand-primary shadow-sm ring-1 ring-brand-primary"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {g.id}
                        </span>
                        {getBagianBadge(g.bagian_tanaman)}
                      </div>
                      <div className="text-brand-primary shrink-0">
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 fill-brand-primary text-white" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-300" />
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-800 leading-snug">
                        {g.nama_gejala}
                      </h3>
                      {g.deskripsi && (
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-3">
                          {g.deskripsi}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100/80 flex justify-between items-center text-[10px] text-slate-400">
                    <span>Bagian: {g.bagian_tanaman.replace("_", " ")}</span>
                    <span className="font-semibold text-emerald-700">
                      {isChecked ? "✓ Terpilih" : "Klik untuk memilih"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tombol Eksekusi Forward Chaining */}
        <div className="sticky bottom-6 z-40 bg-white/95 backdrop-blur-md p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-brand-primary flex items-center justify-center font-bold">
              {selectedGejala.length}
            </div>
            <div>
              <div className="font-bold text-slate-800">
                {selectedGejala.length} Gejala Ditandai
              </div>
              <p className="text-xs text-slate-500">
                {selectedGejala.length === 0
                  ? "Pilih minimal 1 gejala untuk menjalankan inferensi"
                  : "Siap diproses oleh Forward Chaining Engine"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {selectedGejala.length > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 font-semibold text-xs transition-colors"
              >
                Reset
              </button>
            )}

            <button
              type="submit"
              disabled={selectedGejala.length === 0 || loading}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all ${
                selectedGejala.length === 0 || loading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-brand-primary hover:bg-brand-dark shadow-brand-primary/25 active:scale-95"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Menjalankan Forward Chaining...</span>
                </>
              ) : (
                <>
                  <Stethoscope className="w-4 h-4" />
                  <span>Jalankan Diagnosis Sistem Pakar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* HASIL DIAGNOSIS SECTION */}
      {result && (
        <section
          id="hasil-diagnosis"
          className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-10 animate-in fade-in duration-300"
        >
          {/* Header Hasil */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-1">
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
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Laporan Hasil Diagnosis Sistem Pakar
              </h2>
              <p className="text-xs text-slate-500">
                Pemeriksaan atas nama: <strong className="text-slate-700">{namaPengguna}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 no-print">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / PDF</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-brand-primary text-xs font-bold transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Konsultasi Ulang</span>
              </button>
            </div>
          </div>

          {/* Kondisi 1: Berhasil Teridentifikasi */}
          {result.teridentifikasi && result.penyakit_terpilih.length > 0 ? (
            <div className="space-y-8">
              {result.penyakit_terpilih.map((penyakit, pIndex) => (
                <div
                  key={penyakit.id}
                  className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-white via-emerald-50/20 to-white p-6 sm:p-8 space-y-6 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-brand-primary text-white font-bold">
                          {penyakit.id}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold capitalize bg-emerald-100 text-emerald-800">
                          Kategori: {penyakit.kategori}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-brand-accent">
                          Tingkat Bahaya: {penyakit.tingkat_bahaya}
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        {penyakit.nama_penyakit}
                      </h3>
                      <p className="text-sm italic text-slate-500 font-serif">
                        Patogen Ilmiah: {penyakit.nama_ilmiah}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-100/80 border border-emerald-200 text-center shrink-0">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                        Metode Inferensi
                      </div>
                      <div className="text-xs font-extrabold text-brand-dark mt-0.5">
                        Forward Chaining
                      </div>
                      <div className="text-[10px] text-emerald-600 mt-0.5">
                        {result.jejak_inferensi.waktu_eksekusi_ms} ms waktu eksekusi
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-2xl border border-slate-100">
                    {penyakit.deskripsi}
                  </p>

                  {/* Detail Penanganan */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    {/* Organik */}
                    <div className="rounded-2xl p-5 bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                      <h4 className="text-xs font-extrabold text-brand-primary uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Penanganan Organik</span>
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {penyakit.penanganan_organik}
                      </p>
                    </div>

                    {/* Kimia */}
                    <div className="rounded-2xl p-5 bg-amber-50/60 border border-amber-200/80 space-y-2">
                      <h4 className="text-xs font-extrabold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Penanganan Kimiawi</span>
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {penyakit.penanganan_kimia}
                      </p>
                    </div>

                    {/* Pencegahan */}
                    <div className="rounded-2xl p-5 bg-blue-50/60 border border-blue-200/80 space-y-2">
                      <h4 className="text-xs font-extrabold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Info className="w-4 h-4" />
                        <span>Pencegahan Lahan</span>
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {penyakit.pencegahan}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Kondisi 2: Aturan Tidak Terpenuhi */
            <div className="rounded-3xl p-8 bg-amber-50 border border-amber-200 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Diagnosis Belum Dapat Disimpulkan Secara Pasti
              </h3>
              <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Kombinasi gejala yang Anda pilih belum memenuhi salah satu dari 18 aturan produksi pakar secara utuh. Hal ini dapat terjadi jika tanaman cabai berada pada fase infeksi awal atau terdapat komplikasi hama sekunder.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold"
                >
                  Pilih Ulang Gejala Tambahan
                </button>
              </div>
            </div>
          )}

          {/* FASILITAS PENJELASAN (EXPLANATION FACILITY) */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-brand-primary">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Fasilitas Penjelasan (Jejak Aturan Forward Chaining)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Trace log algoritma inferensi deduktif UTS Sistem Pakar FTBS Universitas Dharma Wacana
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTraceTable(!showTraceTable)}
                className="text-xs font-bold text-slate-600 hover:text-brand-primary flex items-center gap-1"
              >
                <span>{showTraceTable ? "Sembunyikan Tabel" : "Lihat Tabel"}</span>
                {showTraceTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* Gejala Fakta Awal yang Diinputkan */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Fakta Awal Masukan (Working Memory Awal):
              </div>
              <div className="flex flex-wrap gap-2">
                {result.gejala_input.map((g) => (
                  <span
                    key={g.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 shadow-sm"
                  >
                    <span className="font-mono font-bold text-emerald-700">{g.id}</span>
                    <span>{g.nama_gejala}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Tabel Iterasi Forward Chaining (Sesuai Format Akademis UTS) */}
            {showTraceTable && result.jejak_inferensi && (
              <div className="space-y-4 pt-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Tabel Pelacakan Iterasi Forward Chaining:
                </div>
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                        <th className="py-3 px-4">Iterasi</th>
                        <th className="py-3 px-4">Memori Kerja (Fakta Aktif)</th>
                        <th className="py-3 px-4">Aturan Aktif (Conflict Set)</th>
                        <th className="py-3 px-4">Aturan Dipilih (Fired)</th>
                        <th className="py-3 px-4">Fakta Baru</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      {result.jejak_inferensi.iterasi.map((it) => (
                        <tr key={it.iterasi} className="hover:bg-slate-50/80">
                          <td className="py-3 px-4 font-bold text-brand-primary">
                            {it.iterasi}
                          </td>
                          <td className="py-3 px-4 text-slate-700 max-w-xs truncate">
                            [{it.memori_kerja.join(", ")}]
                          </td>
                          <td className="py-3 px-4 text-amber-700 font-semibold">
                            [{it.aturan_aktif.join(", ")}]
                          </td>
                          <td className="py-3 px-4 font-bold text-emerald-800">
                            {it.aturan_dipilih}
                          </td>
                          <td className="py-3 px-4">
                            {it.fakta_baru !== "-" ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-brand-dark font-bold">
                                {it.fakta_baru}
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Ringkasan Pembuktian */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs space-y-1.5 text-slate-600">
                  <div>
                    <strong>Aturan Yang Tereksekusi: </strong>
                    <span className="font-mono text-emerald-800 font-bold">
                      {result.jejak_inferensi.aturan_tereksekusi.length > 0
                        ? result.jejak_inferensi.aturan_tereksekusi.join(" → ")
                        : "Tidak ada aturan yang memenuhi premis"}
                    </span>
                  </div>
                  {result.jejak_inferensi.kesimpulan_antara.length > 0 && (
                    <div>
                      <strong>Kesimpulan Antara Terbukti: </strong>
                      <span className="font-mono text-blue-700 font-semibold">
                        {result.jejak_inferensi.kesimpulan_antara.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Referensi Ilmiah Sumber Pengetahuan */}
          {result.referensi && result.referensi.length > 0 && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Referensi & Sumber Pengetahuan Ilmiah</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {result.referensi.map((ref) => (
                  <li key={ref.id} className="flex items-start gap-2">
                    <span className="font-bold text-slate-400">[{ref.id}]</span>
                    <div>
                      <span>
                        {ref.penulis} ({ref.tahun}). <em>{ref.judul}</em>. {ref.penerbit_jurnal}.
                      </span>
                      {ref.doi_url && (
                        <a
                          href={ref.doi_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-600 hover:underline ml-1.5"
                        >
                          <span>Tautan</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

