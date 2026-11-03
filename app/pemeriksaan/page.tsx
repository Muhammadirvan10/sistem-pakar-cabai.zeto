import Link from "next/link";
import {
  Stethoscope,
  Eye,
  Flame,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

export default function PilihanPemeriksaanPage() {
  const menus = [
    {
      id: "gejala",
      title: "Diagnosis Penyakit Berdasarkan Gejala",
      badge: "Sistem Pakar Forward Chaining",
      badgeColor: "bg-emerald-100 text-brand-dark border-emerald-300",
      description:
        "Metode penalaran deduktif dengan memilih daftar gejala visual pada daun, batang, dan akar. Sistem mencocokkan fakta dengan basis aturan IF-THEN untuk menghasilkan kesimpulan penyakit dan pelacakan inferensi.",
      features: [
        "18 Gejala lapangan terstandarisasi",
        "Pohon keputusan dengan kesimpulan antara",
        "Penjelasan aturan yang ditembakkan (Rule Trace)",
        "Saran pengendalian organik & kimia",
      ],
      icon: Stethoscope,
      iconBg: "bg-emerald-100 text-brand-primary",
      cta: "Mulai Diagnosis Gejala",
      href: "/diagnosis",
      highlight: true,
    },
    {
      id: "daun",
      title: "Deteksi Penyakit Daun Melalui Foto",
      badge: "AI Computer Vision",
      badgeColor: "bg-green-100 text-green-800 border-green-300",
      description:
        "Analisis citra digital daun cabai berbasis Convolutional Neural Network (CNN). Mengidentifikasi bercak daun Cercospora (mata katak), gejala klorosis virus kuning, dan membedakannya dari daun sehat.",
      features: [
        "Unggah foto via kamera / galeri",
        "Validasi format JPG/PNG & preview citra",
        "Confidence score probabilitas kelas",
        "Rekomendasi penanganan daun terinfeksi",
      ],
      icon: Eye,
      iconBg: "bg-green-100 text-green-700",
      cta: "Unggah Foto Daun Cabai",
      href: "/deteksi-daun",
      highlight: false,
    },
    {
      id: "buah",
      title: "Deteksi Penyakit & Kebusukan Buah",
      badge: "AI Computer Vision",
      badgeColor: "bg-rose-100 text-brand-accent border-rose-300",
      description:
        "Pemeriksaan visual kondisi buah cabai untuk mengenali lesi nekrotik antraknosa (patek), busuk basah phytophthora, dan membedakan kerusakan penyakit pra-panen dengan kerusakan fisik pascapanen.",
      features: [
        "Deteksi lesi cekung konsentris antraknosa",
        "Deteksi busuk basah berair phytophthora",
        "Pembedaan kerusakan pascapanen vs penyakit",
        "Saran sanitasi buah busuk di kebun",
      ],
      icon: Flame,
      iconBg: "bg-rose-100 text-brand-accent",
      cta: "Unggah Foto Buah Cabai",
      href: "/deteksi-buah",
      highlight: false,
    },
    {
      id: "kematangan",
      title: "Deteksi Tingkat Kematangan Cabai",
      badge: "AI Computer Vision",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      description:
        "Klasifikasi tingkat kematangan buah cabai berdasarkan analisis fitur warna dan tekstur untuk menentukan estimasi waktu panen yang paling menguntungkan secara ekonomis bagi petani.",
      features: [
        "4 Kelas: Mentah, Mulai Matang, Matang, Lewat Matang",
        "Estimasi waktu petik (hari menuju panen)",
        "Rekomendasi panen pasar lokal vs antar pulau",
        "Confidence score berbasis model warna HSV",
      ],
      icon: Sparkles,
      iconBg: "bg-amber-100 text-amber-700",
      cta: "Periksa Kematangan Cabai",
      href: "/kematangan",
      highlight: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-brand-dark text-xs font-bold uppercase tracking-wider">
          Pusat Pemeriksaan Tanaman
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Pilih Metode Pemeriksaan Cabai
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Tersedia metode Sistem Pakar berbasis penalaran gejala dan modul Computer Vision berbasis citra digital. Silakan pilih layanan yang ingin Anda jalankan.
        </p>
      </div>

      {/* Grid Menu Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {menus.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between ${
                item.highlight
                  ? "bg-gradient-to-br from-white via-emerald-50/40 to-white border-brand-primary/40 shadow-xl shadow-emerald-900/5 ring-1 ring-emerald-500/20"
                  : "bg-white border-slate-200/80 shadow-md hover:shadow-xl hover:border-slate-300"
              }`}
            >
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${item.iconBg}`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {item.title}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="pt-2 space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Keunggulan Layanan:
                  </div>
                  <ul className="space-y-2">
                    {item.features.map((feat, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2.5 text-xs text-slate-700"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action CTA */}
              <div className="pt-8 border-t border-slate-100 mt-6">
                <Link
                  href={item.href}
                  className={`w-full inline-flex items-center justify-center gap-2.5 font-bold text-sm px-6 py-3.5 rounded-2xl shadow-md transition-all active:scale-95 ${
                    item.highlight
                      ? "bg-brand-primary hover:bg-brand-dark text-white shadow-brand-primary/20"
                      : "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/10"
                  }`}
                >
                  <span>{item.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="p-6 rounded-3xl bg-slate-100 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="p-3 rounded-2xl bg-white shadow-sm text-brand-primary">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Apakah Anda telah melakukan pemeriksaan sebelumnya?
            </h3>
            <p className="text-xs text-slate-500">
              Seluruh konsultasi Anda tersimpan secara otomatis dan dapat diakses kembali di menu riwayat.
            </p>
          </div>
        </div>
        <Link
          href="/riwayat"
          className="whitespace-nowrap px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-bold text-slate-700 shadow-sm"
        >
          Lihat Riwayat Pemeriksaan
        </Link>
      </div>
    </div>
  );
}

