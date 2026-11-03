"use client";

import { useEffect, useState } from "react";
import {
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Code2,
  Sparkles,
  ShieldCheck,
  Server,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import { fetchAIModels } from "@/lib/api";

export default function AdminModelAIPage() {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadModels() {
      try {
        setLoading(true);
        const res = await fetchAIModels();
        if (res.success && res.data) {
          setModels(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadModels();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <AdminSidebar />

        <div className="flex-1 space-y-8 w-full">
          {/* Header */}
          <div className="border-b border-slate-200/80 pb-5">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-600" />
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Manajemen Model AI Computer Vision
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Metadata, kelas klasifikasi citra, metrik performansi uji, dan konfigurasi endpoint eksternal
            </p>
          </div>

          {/* AI Model Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map((mod) => (
              <div
                key={mod.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      Tipe: {mod.tipe_deteksi}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 font-mono">
                      {mod.versi}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {mod.nama_model}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Arsitektur: <strong className="text-slate-700">{mod.arsitektur}</strong>
                    </p>
                  </div>

                  {/* Metrik Evaluasi */}
                  {mod.metrik_evaluasi && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Hasil Evaluasi Pengujian:
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-center text-xs">
                        <div className="bg-white p-2 rounded-xl border border-slate-100">
                          <div className="text-[10px] text-slate-400">Akurasi</div>
                          <div className="font-extrabold text-emerald-700">
                            {(mod.metrik_evaluasi.akurasi_uji * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-slate-100">
                          <div className="text-[10px] text-slate-400">F1-Score</div>
                          <div className="font-extrabold text-emerald-700">
                            {(mod.metrik_evaluasi.f1_score * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Daftar Kelas */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Daftar Kelas Prediksi ({mod.daftar_kelas.length}):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {mod.daftar_kelas.map((cls: string, cIdx: number) => (
                        <span
                          key={cIdx}
                          className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200"
                        >
                          {cls}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Uji: {mod.tanggal_pengujian || "2026"}</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span>Status: {mod.status}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Panduan Integrasi Model External */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-600" />
              <span>Panduan Menghubungkan Model Hasil Training Mandiri</span>
            </h2>

            <p className="text-xs text-slate-600 leading-relaxed">
              Jika Anda telah melatih model klasifikasi citra cabai menggunakan PyTorch / TensorFlow / Roboflow / FastAPI, Anda dapat menghubungkan endpoint REST API model tersebut ke backend CabaiCare melalui variabel lingkungan:
            </p>

            <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs space-y-2 overflow-x-auto">
              <div className="text-slate-400"># Konfigurasi di file .env atau Vercel Environment Variables:</div>
              <div className="text-emerald-400">AI_INFERENCE_URL=https://api.model-kamu.com/v1/predict</div>
              <div className="text-emerald-400">AI_API_KEY=sk_production_cabaicare_2026</div>
              <div className="text-emerald-400">AI_MODEL_VERSION=v1.2.0-resnet50</div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <div className="font-bold">Format Kontrak Payload Eksternal:</div>
              <p className="text-[11px] leading-relaxed">
                Backend CabaiCare akan mengirimkan POST JSON berisikan <code>image_base64</code>, <code>image_type</code> (leaf/fruit/ripeness), dan <code>model_version</code>. Model cukup mengembalikan JSON: <code>{`{ "predicted_class": "...", "confidence_score": 0.94 }`}</code>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

