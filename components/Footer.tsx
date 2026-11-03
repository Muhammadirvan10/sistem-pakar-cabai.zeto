import Link from "next/link";
import { Flame, ShieldCheck, BookOpen, ExternalLink, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Kolom 1: Profil CabaiCare */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center shadow-lg">
                <Flame className="w-6 h-6 text-brand-accent fill-brand-accent" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Cabai<span className="text-brand-accent">Care</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Platform sistem pakar berbasis Forward Chaining dan kecerdasan buatan Computer Vision untuk diagnosis dini kesehatan tanaman, daun, buah, dan kematangan cabai Indonesia.
            </p>
            <div className="text-xs text-slate-500 pt-2 border-t border-slate-800">
              Proyek Akademik Sistem Pakar (TI22604) <br />
              Fakultas Teknologi Bisnis dan Sains (FTBS) <br />
              Universitas Dharma Wacana
            </div>
          </div>

          {/* Kolom 2: Layanan Pemeriksaan */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Layanan Pemeriksaan
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/diagnosis" className="hover:text-emerald-400 transition-colors">
                  Diagnosis Sistem Pakar (Gejala)
                </Link>
              </li>
              <li>
                <Link href="/deteksi-daun" className="hover:text-emerald-400 transition-colors">
                  Deteksi Penyakit Daun (AI)
                </Link>
              </li>
              <li>
                <Link href="/deteksi-buah" className="hover:text-emerald-400 transition-colors">
                  Deteksi Penyakit & Buah Busuk
                </Link>
              </li>
              <li>
                <Link href="/kematangan" className="hover:text-emerald-400 transition-colors">
                  Klasifikasi Kematangan Cabai
                </Link>
              </li>
              <li>
                <Link href="/riwayat" className="hover:text-emerald-400 transition-colors">
                  Riwayat Konsultasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Basis Pengetahuan & Pustaka */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Sumber Pengetahuan</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="leading-relaxed">
                Balai Penelitian Tanaman Sayuran (BALITSA) - Kementan RI
              </li>
              <li className="leading-relaxed">
                Jurnal Fitopatologi Indonesia (Penyakit Antraknosa & Layu Cabai)
              </li>
              <li className="leading-relaxed">
                Jurnal Perlindungan Tanaman Indonesia (Ralstonia solanacearum)
              </li>
              <li>
                <a
                  href="https://balitsa.litbang.pertanian.go.id"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-400 hover:underline mt-1"
                >
                  <span>Portal Litbang Pertanian</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Keamanan & Admin */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Administrasi</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Dashboard pakar untuk manajemen basis aturan IF-THEN, pemutakhiran data penyakit, dan evaluasi model AI.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Login Panel Admin</span>
            </Link>
          </div>
        </div>

        {/* Disclaimer Etika */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500 max-w-4xl mx-auto leading-relaxed">
            <strong className="text-slate-400">Disclaimer Akademis:</strong> CabaiCare dikembangkan sebagai sistem pendukung keputusan (Decision Support System) berbasis pengetahuan pakar pertanian dan Computer Vision. Hasil diagnosa visual dan penalaran aturan merupakan indikasi awal untuk pencegahan dini dan bukan merupakan pengganti pengujian laboratorium mikrobiologi tanaman resmi.
          </p>
          <div className="mt-4 text-xs text-slate-600 flex items-center justify-center gap-1">
            <span>© 2026 CabaiCare System. Dikembangkan dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>untuk Pertanian Cabai Berkelanjutan.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

