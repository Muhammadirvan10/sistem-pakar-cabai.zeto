import Link from "next/link";
import {
  Stethoscope,
  Eye,
  Flame,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Activity,
  ChevronRight,
  BookOpen,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-20 lg:space-y-28 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-emerald-100/60">
        <div className="absolute inset-0 bg-[radial-gradient(#15803d_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Kolom Teks Hero */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-brand-dark text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Sistem Pakar Forward Chaining & AI Vision 2026</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Lindungi Tanaman Cabai Anda dengan{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-emerald-600 to-green-600">
                  Keputusan Pakar & AI
                </span>
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                CabaiCare menggabungkan ketelitian penalaran deduktif{" "}
                <strong className="text-brand-dark font-semibold">
                  Forward Chaining
                </strong>{" "}
                berbasis aturan fitopatologi ilmiah serta deteksi visual{" "}
                <strong className="text-brand-dark font-semibold">
                  Computer Vision
                </strong>{" "}
                untuk diagnosis penyakit daun, batang, kebusukan buah, dan kematangan panen.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/pemeriksaan"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-brand-primary hover:bg-brand-dark text-white font-bold text-base px-8 py-4 rounded-2xl shadow-lg shadow-brand-primary/25 transition-all transform hover:-translate-y-0.5 active:scale-95"
                >
                  <Stethoscope className="w-5 h-5" />
                  <span>Mulai Konsultasi Sekarang</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  href="#cara-kerja"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base px-6 py-4 rounded-2xl border border-slate-200 shadow-sm transition-all"
                >
                  <span>Pelajari Cara Kerja</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-200/60 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>18 Aturan Produksi Ilmiah</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Validasi Gejala Berkas Vaskular</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Rekomendasi Organik & Kimia</span>
                </div>
              </div>
            </div>

            {/* Kolom Visual Hero Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glow Background */}
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-green-600/20 rounded-3xl blur-2xl -z-10" />

                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-brand-primary flex items-center justify-center font-bold">
                        <Flame className="w-6 h-6 text-brand-accent fill-brand-accent" />
                      </div>
                      <div>
                        <h2 className="font-bold text-slate-800 text-sm">
                          Simulasi Mesin Inferensi
                        </h2>
                        <p className="text-xs text-slate-400">
                          Data-Driven Working Memory
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Aktif
                    </span>
                  </div>

                  {/* Visual Trace Flow */}
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Fakta Terpilih (Input)
                      </div>
                      <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                          G01: Klorosis Daun
                        </span>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                          G02: Daun Keriting
                        </span>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                          G03: Kutu Kebul
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-center text-emerald-600">
                      <ArrowRight className="w-4 h-4 rotate-90" />
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 text-xs space-y-1.5">
                      <div className="flex justify-between items-center text-[11px] font-bold text-emerald-800">
                        <span>Aturan Terpilih (Rule Fired)</span>
                        <span className="font-mono">R01 → R02</span>
                      </div>
                      <p className="text-slate-600 text-xs">
                        Membuktikan Kesimpulan Antara <strong>K01</strong>{" "}
                        lalu mengaktifkan aturan tujuan akhir.
                      </p>
                    </div>

                    <div className="flex justify-center text-emerald-600">
                      <ArrowRight className="w-4 h-4 rotate-90" />
                    </div>

                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 text-white text-xs shadow-md space-y-1">
                      <div className="text-[11px] font-medium text-emerald-200 uppercase tracking-wider">
                        Kesimpulan Diagnosis Akhir
                      </div>
                      <div className="text-sm font-extrabold">
                        P01: Penyakit Virus Kuning (Gemini)
                      </div>
                      <div className="text-[11px] text-emerald-100">
                        Didukung 100% fakta penalaran pakar
                      </div>
                    </div>
                  </div>

                  {/* Mini stats */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                    <div className="p-2 rounded-lg bg-slate-50">
                      <div className="font-extrabold text-brand-primary text-base">
                        18
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        Gejala
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50">
                      <div className="font-extrabold text-brand-accent text-base">
                        7
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        Penyakit
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50">
                      <div className="font-extrabold text-emerald-600 text-base">
                        18
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        Aturan
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FITUR UTAMA SISTEM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-primary bg-emerald-100/80 px-3 py-1 rounded-full">
            Fitur Komprehensif
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Empat Metode Pemeriksaan Terintegrasi
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Pilih cara diagnosis yang paling sesuai dengan kondisi di lapangan: melalui pemilihan fakta gejala atau pengunggahan foto tanaman cabai Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Diagnosis Gejala */}
          <div className="group bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-brand-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <Stethoscope className="w-7 h-7" />
              </div>
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-brand-dark uppercase">
                Metode Sistem Pakar
              </span>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-primary transition-colors">
                Diagnosis Gejala Tanaman
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pilih fakta visual yang terlihat pada daun, batang, dan akar. Mesin Forward Chaining akan mencocokkan fakta dengan 18 aturan produksi.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6">
              <Link
                href="/diagnosis"
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-primary hover:text-brand-dark group-hover:translate-x-1 transition-all"
              >
                <span>Mulai Diagnosis Gejala</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Deteksi Daun */}
          <div className="group bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Eye className="w-7 h-7" />
              </div>
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-800 uppercase">
                Computer Vision AI
              </span>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-green-700 transition-colors">
                Deteksi Penyakit Daun
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Unggah foto daun cabai bergejala. Model mengklasifikasikan bercak Cercospora (mata katak), virus bule klorosis, atau daun sehat.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6">
              <Link
                href="/deteksi-daun"
                className="inline-flex items-center gap-2 text-xs font-bold text-green-700 hover:text-green-900 group-hover:translate-x-1 transition-all"
              >
                <span>Analisis Foto Daun</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 3: Deteksi Buah */}
          <div className="group bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-rose-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-brand-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                <Flame className="w-7 h-7" />
              </div>
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 uppercase">
                Deteksi Kerusakan
              </span>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-accent transition-colors">
                Penyakit & Busuk Buah
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Identifikasi dini serangan antraknosa (patek), busuk basah phytophthora, dan pembedaan dengan kerusakan fisik pascapanen.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6">
              <Link
                href="/deteksi-buah"
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-accent hover:text-rose-900 group-hover:translate-x-1 transition-all"
              >
                <span>Analisis Buah Cabai</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 4: Kematangan */}
          <div className="group bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-amber-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7" />
              </div>
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">
                Estimasi Panen
              </span>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                Tingkat Kematangan Cabai
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluasi fase kematangan: mentah (hijau), peralihan, matang sempurna merah, hingga lewat matang beserta saran waktu petik terbaik.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6">
              <Link
                href="/kematangan"
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 hover:text-amber-900 group-hover:translate-x-1 transition-all"
              >
                <span>Deteksi Kematangan</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. METODOLOGI: FORWARD CHAINING VS AI COMPUTER VISION */}
      <section className="bg-slate-900 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-3 py-1 rounded-full">
              Fondasi Teknologi Akademis
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Kombinasi Logika Deduktif & Pengenalan Pola Visual
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Membedakan secara transparan antara mekanisme penalaran aturan sistem pakar dan probabilitas model citra.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {/* Box Forward Chaining */}
            <div className="bg-slate-800/80 rounded-3xl p-8 border border-slate-700 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Metode Forward Chaining
                    </h3>
                    <p className="text-xs text-emerald-400 font-semibold">
                      Data-Driven Reasoning (Dari Fakta ke Kesimpulan)
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Mesin inferensi bekerja dengan mengumpulkan fakta gejala yang dicentang oleh pengguna ke dalam <strong>Memori Kerja (Working Memory)</strong>. Sistem secara iteratif mengevaluasi aturan <code>IF premis THEN kesimpulan</code>.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span>
                      <strong>Jejak Eksekusi Transparan:</strong> Menampilkan langkah iterasi, conflict set, aturan aktif, dan fakta baru yang terbukti.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span>
                      <strong>Kesimpulan Antara:</strong> Mampu membuktikan kondisi patologis sekunder (seperti gangguan vaskular K02) sebelum menyimpulkan Layu Bakteri atau Fusarium.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span>
                      <strong>Tanpa Confidence Palsu:</strong> Hasil sistem pakar bersifat deterministik berbasis kepastian kaidah ilmiah pakar.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/60 font-mono text-[11px] text-emerald-300">
                IF K02 (Gangguan Vaskular) AND G09 (Lendir Bakteri) <br />
                THEN P03: Layu Bakteri (Ralstonia solanacearum)
              </div>
            </div>

            {/* Box Computer Vision */}
            <div className="bg-slate-800/80 rounded-3xl p-8 border border-slate-700 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      AI Computer Vision
                    </h3>
                    <p className="text-xs text-blue-400 font-semibold">
                      Deep Learning CNN Image Classification
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Modul analisis visual yang mengekstrak fitur spasial piksel gambar daun dan buah cabai menggunakan arsitektur <strong>ResNet50 / MobileNetV3</strong> untuk menghasilkan estimasi kelas dan derajat keyakinan (Confidence Score).
                </p>

                <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                    <span>
                      <strong>Confidence Score Nyata:</strong> Menghitung persentase probabilitas softmax hasil model inferensi terhubung.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                    <span>
                      <strong>Arsitektur Adapter Terisolasi:</strong> Terhubung fleksibel via konfigurasi <code>AI_INFERENCE_URL</code> dan <code>AI_API_KEY</code>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                    <span>
                      <strong>Label Demonstrasi Transparan:</strong> Jika model eksternal belum disetel, sistem memberikan indikasi simulasi yang berdisclaimer jelas.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/60 font-mono text-[11px] text-blue-300">
                P(Bercak Daun Cercospora | Image) = 0.942 <br />
                Softmax output dengan verifikasi mime & boundary box
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CARA KERJA SISTEM */}
      <section id="cara-kerja" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-primary bg-emerald-100/80 px-3 py-1 rounded-full">
            Alur Penggunaan
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tiga Langkah Mudah Mendapatkan Diagnosis
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Didesain intuitif agar dapat dioperasikan langsung oleh petani di kebun maupun akademisi pertanian.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm relative text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-brand-primary flex items-center justify-center font-extrabold text-xl mx-auto">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              Pilih Gejala atau Unggah Foto
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Beri tanda centang pada gejala tanaman cabai yang Anda temui di kebun, atau ambil foto daun/buah cabai langsung menggunakan kamera smartphone Anda.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm relative text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-brand-primary flex items-center justify-center font-extrabold text-xl mx-auto">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              Inferensi REST API Golang
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Backend memproses masukan secara modular: mengeksekusi mesin Forward Chaining atau memanggil adapter Computer Vision dengan validasi ketat.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm relative text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-brand-primary flex items-center justify-center font-extrabold text-xl mx-auto">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              Hasil Diagnosis & Solusi Terpadu
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dapatkan nama penyakit, penjelasan patogen, penanganan organik, penanganan kimia berimbang, tindakan pencegahan, serta cetak laporan PDF.
            </p>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-brand-primary via-emerald-700 to-green-800 p-8 sm:p-12 lg:p-16 text-white text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10">
            <Flame className="w-80 h-80 text-white" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold max-w-2xl mx-auto leading-tight">
            Periksa Kesehatan Tanaman Cabai Anda Sekarang
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Cegah kerugian gagal panen akibat serangan virus kuning, antraknosa, dan layu bakteri sejak dini dengan konsultasi sistem pakar terpercaya.
          </p>
          <div className="pt-2">
            <Link
              href="/pemeriksaan"
              className="inline-flex items-center gap-2 bg-white text-brand-dark hover:bg-emerald-50 font-bold px-8 py-4 rounded-2xl shadow-lg transition-all transform hover:scale-105"
            >
              <Stethoscope className="w-5 h-5 text-brand-primary" />
              <span>Buka Menu Pemeriksaan Lengkap</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

