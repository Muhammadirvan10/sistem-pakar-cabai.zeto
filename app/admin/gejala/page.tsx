"use client";

import { useEffect, useState } from "react";
import {
  ListChecks,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import { fetchGejala } from "@/lib/api";

export default function AdminGejalaPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: "",
    nama_gejala: "",
    deskripsi: "",
    bagian_tanaman: "daun",
    bobot_pakar: 1.0,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchGejala();
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
    const nextNum = list.length + 1;
    const nextId = nextNum < 10 ? `G0${nextNum}` : `G${nextNum}`;
    setForm({
      id: nextId,
      nama_gejala: "",
      deskripsi: "",
      bagian_tanaman: "daun",
      bobot_pakar: 1.0,
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
    const endpoint = "/api/gejala";
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
    if (!confirm(`Hapus gejala ${id}?`)) return;
    try {
      const res = await fetch(`/api/gejala?id=${id}`, { method: "DELETE" });
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
      item.nama_gejala.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.bagian_tanaman.toLowerCase().includes(search.toLowerCase())
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
                <ListChecks className="w-5 h-5 text-brand-primary" />
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Manajemen Data Gejala Cabai
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Kelola premis fakta gejala pada daun, batang, buah, dan akar
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Gejala Baru</span>
            </button>
          </div>

          {/* Search */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kode Gxx, nama gejala, atau bagian tanaman..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs outline-none text-slate-700 font-medium"
            />
          </div>

          {/* Table */}
          {loading ? (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400">
              Memuat data gejala...
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">Kode</th>
                    <th className="py-3.5 px-4">Nama Gejala</th>
                    <th className="py-3.5 px-4">Bagian Tanaman</th>
                    <th className="py-3.5 px-4">Bobot Pakar</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-dark">
                        {item.id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-md">
                        <div>{item.nama_gejala}</div>
                        {item.deskripsi && (
                          <div className="text-[11px] text-slate-400 font-normal line-clamp-1 mt-0.5">
                            {item.deskripsi}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 capitalize">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {item.bagian_tanaman.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">
                        {item.bobot_pakar.toFixed(2)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {isEdit ? "Edit Data Gejala" : "Tambah Gejala Baru"}
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
                    Kode Gejala (Gxx)
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
                    Bagian Tanaman
                  </label>
                  <select
                    value={form.bagian_tanaman}
                    onChange={(e) => setForm({ ...form, bagian_tanaman: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 capitalize"
                  >
                    <option value="daun">Daun</option>
                    <option value="batang">Batang</option>
                    <option value="buah">Buah</option>
                    <option value="akar">Akar</option>
                    <option value="seluruh_tanaman">Seluruh Tanaman</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Gejala
                </label>
                <input
                  type="text"
                  required
                  value={form.nama_gejala}
                  onChange={(e) => setForm({ ...form, nama_gejala: e.target.value })}
                  placeholder="Contoh: Daun menguning bercak"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Deskripsi / Ciri Khas Gejala
                </label>
                <textarea
                  rows={3}
                  value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                  placeholder="Karakteristik morfologis yang tampak saat diamati langsung di lapangan..."
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
                  {isEdit ? "Simpan Perubahan" : "Simpan Gejala"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

