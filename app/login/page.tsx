"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Flame,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { loginAdmin } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await loginAdmin(email, password);
      if (res.success && res.token) {
        // Simpan token di localStorage untuk sesi admin
        localStorage.setItem("cabaicare_admin_token", res.token);
        localStorage.setItem("cabaicare_admin_user", JSON.stringify(res.user));
        router.push("/admin/dashboard");
      } else {
        setErrorMsg(res.error || "Email atau kata sandi tidak cocok.");
      }
    } catch (err: any) {
      setErrorMsg("Gagal menghubungi server autentikasi: " + (err.message || "Network Error"));
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail("admin@cabaicare.id");
    setPassword("AdminCabaiCare2026!");
    setErrorMsg(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl relative">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center mx-auto shadow-md shadow-emerald-900/10">
            <Flame className="w-8 h-8 text-brand-accent fill-brand-accent" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Login Panel Admin
          </h1>
          <p className="text-xs text-slate-500">
            Masuk untuk mengelola basis aturan, data penyakit, dan model AI
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Administrator
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cabaicare.id"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-brand-primary focus:ring-2 focus:ring-emerald-200 outline-none text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Kata Sandi
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 focus:border-brand-primary focus:ring-2 focus:ring-emerald-200 outline-none text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-brand-primary hover:bg-brand-dark text-white font-bold text-sm shadow-md shadow-brand-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Masuk ke Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Helper Box */}
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 space-y-2">
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Akun Demonstrasi Awal:</span>
            </span>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-brand-dark font-extrabold underline hover:text-emerald-700"
            >
              Gunakan Akun Ini
            </button>
          </div>
          <p className="text-[11px] text-emerald-800 font-mono">
            Email: admin@cabaicare.id <br />
            Password: AdminCabaiCare2026!
          </p>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-brand-primary font-medium"
          >
            ← Kembali ke Halaman Utama
          </Link>
        </div>
      </div>
    </div>
  );
}

