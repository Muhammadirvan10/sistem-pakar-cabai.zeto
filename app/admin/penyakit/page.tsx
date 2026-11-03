"use client";

import { useEffect, useState } from "react";
import {
  Bug,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import { fetchPenyakit } from "@/lib/api";

export default function AdminPenyakitPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // Form State
  const [form, setForm] = useState({
    id: "",
    nama_penyakit: "",
    nama_ilmiah: "",
    kategori: "jamur",
    tingkat_bahaya: "Sedang",
    deskripsi: "",
    penyebab: "",
    gejala_umum: "",
    penanganan_organik: "",
    penanganan_kimia: "",
    pencegahan: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchPenyakit();
      if (res.success && res.data) {
        setList(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setIsEdit(false);
    setForm({
      id: `P0${list.length + 1}`,
      nama_penyakit: "",
      nama_ilmiah: "",
      kategori: "jamur",
      tingkat_bahaya: "Sedang",
      deskripsi: "",
      penyebab: "",
      gejala_umum: "",
      penanganan_organik: "",
      penanganan_kimia: "",
      pencegahan: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setIsEdit(true);
    setForm({ ...item });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = "/api/penyakit";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        loadData();
      } else {
        alert("Gagal menyimpan: " + data.error);
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Hapus penyakit ${id}?`)) return;
    try {
      const res = await fetch(`/api/penyakit?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        loadData();
      } else {
        alert("Gagal menghapus: " + data.error);
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    }
  };

  const filtered = list.filter(
    (item) =>
      item.nama_penyakit.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.kategori.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <AdminSidebar />

        <div className="flex-1 space-y-6 w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Bug className="w-5 h-5 text-brand-accent" />
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Manajemen Data Penyakit Cabai
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Kelola basis pengetahuan kesimpulan akhir penyakit, patogen, dan panduan penanganan
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Penyakit Baru</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kode Pxx, nama penyakit, atau kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs outline-none text-slate-700 font-medium"
            />
          </div>

          {/* Table */}
          {loading ? (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400">
              Memuat data penyakit...
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">Kode</th>
                    <th className="py-3.5 px-4">Nama Penyakit</th>
                    <th className="py-3.5 px-4">Nama Ilmiah Patogen</th>
                    <th className="py-3.5 px-4">Kategori</th>
                    <th className="py-3.5 px-4">Tingkat Bahaya</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-dark">
                        {item.id}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {item.nama_penyakit}
                      </td>
                      <td className="py-3.5 px-4 italic text-slate-500 font-serif">
                        {item.nama_ilmiah}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="capitalize px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.tingkat_bahaya === "Sangat Tinggi"
                              ? "bg-rose-100 text-rose-800"
                              : item.tingkat_bahaya === "Tinggi"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {item.tingkat_bahaya}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-5 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {isEdit ? "Edit Data Penyakit" : "Tambah Penyakit Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kode Penyakit (Pxx)
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isEdit}
                    value={form.id}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={form.kategori}
                    onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 capitalize"
                  >
                    <option value="jamur">Jamur</option>
                    <option value="virus">Virus</option>
                    <option value="bakteri">Bakteri</option>
                    <option value="hama">Hama</option>
                    <option value="fisiologis">Fisiologis</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Penyakit
                  </label>
                  <input
                    type="text"
                    required
                    value={form.nama_penyakit}
                    onChange={(e) => setForm({ ...form, nama_penyakit: e.target.value })}
                    placeholder="Contoh: Antraknosa / Patek"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Ilmiah Patogen
                  </label>
                  <input
                    type="text"
                    value={form.nama_ilmiah}
                    onChange={(e) => setForm({ ...form, nama_ilmiah: e.target.value })}
                    placeholder="Colletotrichum capsici"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 italic font-serif"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Deskripsi Penyakit
                </label>
                <textarea
                  rows={2}
                  required
                  value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Penyebab & Cara Penularan
                </label>
                <textarea
                  rows={2}
                  required
                  value={form.penyebab}
                  onChange={(e) => setForm({ ...form, penyebab: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Penanganan Organik (Bio-Pestisida / Agens Hayati)
                </label>
                <textarea
                  rows={2}
                  value={form.penanganan_organik}
                  onChange={(e) => setForm({ ...form, penanganan_organik: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Penanganan Kimiawi
                </label>
                <textarea
                  rows={2}
                  value={form.penanganan_kimia}
                  onChange={(e) => setForm({ ...form, penanganan_kimia: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tindakan Pencegahan di Lahan
                </label>
                <textarea
                  rows={2}
                  value={form.pencegahan}
                  onChange={(e) => setForm({ ...form, pencegahan: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-primary text-white font-bold shadow"
                >
                  {isEdit ? "Simpan Perubahan" : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

