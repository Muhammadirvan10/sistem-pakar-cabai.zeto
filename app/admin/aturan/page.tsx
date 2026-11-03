"use client";

import { useEffect, useState } from "react";
import {
  Network,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  Layers,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import { fetchAturan, fetchPenyakit, fetchGejala } from "@/lib/api";

export default function AdminAturanPage() {
  const [list, setList] = useState<any[]>([]);
  const [penyakitList, setPenyakitList] = useState<any[]>([]);
  const [gejalaList, setGejalaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: "",
    nama_aturan: "",
    id_penyakit: "",
    kesimpulan_antara: "",
    operator_logika: "AND",
    keterangan: "",
    premis_ids: [] as string[],
  });

  const loadAll = async () => {
    try {
      setLoading(true);
      const [rRes, pRes, gRes] = await Promise.all([
        fetchAturan(),
        fetchPenyakit(),
        fetchGejala(),
      ]);
      if (rRes.success && rRes.data) setList(rRes.data);
      if (pRes.success && pRes.data) setPenyakitList(pRes.data);
      if (gRes.success && gRes.data) setGejalaList(gRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const openAddModal = () => {
    setIsEdit(false);
    const nextNum = list.length + 1;
    const nextId = nextNum < 10 ? `R0${nextNum}` : `R${nextNum}`;
    setForm({
      id: nextId,
      nama_aturan: "",
      id_penyakit: "P01",
      kesimpulan_antara: "",
      operator_logika: "AND",
      keterangan: "",
      premis_ids: [],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setIsEdit(true);
    const premisIds = item.premis?.map((p: any) => p.id_gejala || p.id_kesimpulan_antara) || [];
    setForm({
      id: item.id,
      nama_aturan: item.nama_aturan,
      id_penyakit: item.id_penyakit || "",
      kesimpulan_antara: item.kesimpulan_antara || "",
      operator_logika: item.operator_logika || "AND",
      keterangan: item.keterangan || "",
      premis_ids: premisIds,
    });
    setIsModalOpen(true);
  };

  const togglePremis = (id: string) => {
    setForm((prev) => ({
      ...prev,
      premis_ids: prev.premis_ids.includes(id)
        ? prev.premis_ids.filter((item) => item !== id)
        : [...prev.premis_ids, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.premis_ids.length === 0) {
      alert("Harap pilih minimal 1 premis gejala untuk aturan ini.");
      return;
    }

    const payload = {
      id: form.id,
      nama_aturan: form.nama_aturan,
      id_penyakit: form.kesimpulan_antara ? "" : form.id_penyakit,
      kesimpulan_antara: form.kesimpulan_antara,
      operator_logika: form.operator_logika,
      keterangan: form.keterangan,
      premis: form.premis_ids.map((id) => {
        if (id.startsWith("K")) {
          return { id_kesimpulan_antara: id, is_negasi: false };
        }
        return { id_gejala: id, is_negasi: false };
      }),
    };

    const endpoint = "/api/aturan";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        loadAll();
      } else {
        alert("Gagal menyimpan aturan: " + data.error);
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Hapus aturan ${id}?`)) return;
    try {
      const res = await fetch(`/api/aturan?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        loadAll();
      } else {
        alert("Gagal menghapus: " + data.error);
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    }
  };

  const filtered = list.filter(
    (item) =>
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.nama_aturan.toLowerCase().includes(search.toLowerCase()) ||
      (item.keterangan && item.keterangan.toLowerCase().includes(search.toLowerCase()))
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
                <Network className="w-5 h-5 text-blue-600" />
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Manajemen Basis Aturan Produksi (IF-THEN)
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Kelola relasi penalaran kaidah pakar yang dieksekusi oleh mesin inferensi Forward Chaining
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Aturan Baru</span>
            </button>
          </div>

          {/* Search */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kode Rxx, nama aturan, atau formula JIKA-MAKA..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs outline-none text-slate-700 font-medium"
            />
          </div>

          {/* Table */}
          {loading ? (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400">
              Memuat data aturan inferensi...
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">Kode</th>
                    <th className="py-3.5 px-4">Nama Aturan</th>
                    <th className="py-3.5 px-4">Formula IF - THEN</th>
                    <th className="py-3.5 px-4">Kesimpulan Tujuan</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-dark">
                        {item.id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {item.nama_aturan}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-sm">
                        <div className="font-mono text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                          {item.keterangan || (
                            <span>
                              IF{" "}
                              {item.premis
                                ?.map((p: any) => (p.is_negasi ? "NOT " : "") + (p.id_gejala || p.id_kesimpulan_antara))
                                .join(` ${item.operator_logika} `)}{" "}
                              THEN {item.kesimpulan_antara || item.id_penyakit}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {item.kesimpulan_antara ? (
                          <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                            Antara: {item.kesimpulan_antara}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-100 text-brand-dark">
                            Penyakit: {item.id_penyakit}
                          </span>
                        )}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-4 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {isEdit ? "Edit Aturan Inferensi" : "Tambah Aturan Baru"}
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
                    Kode Aturan (Rxx)
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
                    Operator Logika Premis
                  </label>
                  <select
                    value={form.operator_logika}
                    onChange={(e) => setForm({ ...form, operator_logika: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  >
                    <option value="AND">AND (Semua Gejala Harus Terpenuhi)</option>
                    <option value="OR">OR (Salah Satu Gejala Terpenuhi)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Aturan
                </label>
                <input
                  type="text"
                  required
                  value={form.nama_aturan}
                  onChange={(e) => setForm({ ...form, nama_aturan: e.target.value })}
                  placeholder="Contoh: Aturan Diagnosis Virus Kuning Lanjutan"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              {/* Pilihan Kesimpulan: Akhir (Penyakit) atau Antara (Kxx) */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tujuan: Kesimpulan Akhir (Penyakit)
                  </label>
                  <select
                    disabled={!!form.kesimpulan_antara}
                    value={form.id_penyakit}
                    onChange={(e) => setForm({ ...form, id_penyakit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  >
                    {penyakitList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.id} - {p.nama_penyakit}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Atau Kesimpulan Antara (Kxx)
                  </label>
                  <select
                    value={form.kesimpulan_antara}
                    onChange={(e) => setForm({ ...form, kesimpulan_antara: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  >
                    <option value="">-- Bukan Kesimpulan Antara --</option>
                    <option value="K01">K01 - Klorosis & Malformasi Daun</option>
                    <option value="K02">K02 - Gangguan Vaskular Sistemik</option>
                    <option value="K03">K03 - Nekrosis Buah Cekung</option>
                    <option value="K04">K04 - Pembusukan Basah Phytophthora</option>
                  </select>
                </div>
              </div>

              {/* Checklist Premis Gejala */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Pilih Premis Gejala / Kesimpulan Antara ({form.premis_ids.length} Dipilih):
                </label>
                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-2xl p-3 space-y-1.5 bg-slate-50/50">
                  {/* Pilihan kesimpulan antara sebagai premis */}
                  <div className="pb-2 border-b border-slate-200 mb-2">
                    <span className="text-[10px] font-bold text-blue-700 uppercase">
                      Premis Kesimpulan Antara:
                    </span>
                    {["K01", "K02", "K03", "K04"].map((k) => (
                      <label key={k} className="flex items-center gap-2 text-xs py-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.premis_ids.includes(k)}
                          onChange={() => togglePremis(k)}
                          className="rounded text-brand-primary"
                        />
                        <span className="font-mono font-bold text-blue-800">{k}</span>
                      </label>
                    ))}
                  </div>

                  {gejalaList.map((g) => (
                    <label key={g.id} className="flex items-center gap-2 text-xs py-1 cursor-pointer hover:bg-slate-100 rounded px-1">
                      <input
                        type="checkbox"
                        checked={form.premis_ids.includes(g.id)}
                        onChange={() => togglePremis(g.id)}
                        className="rounded text-brand-primary"
                      />
                      <span className="font-mono font-bold text-slate-700">{g.id}</span>
                      <span className="text-slate-600 truncate">{g.nama_gejala}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Keterangan / Alasan Aturan
                </label>
                <textarea
                  rows={2}
                  value={form.keterangan}
                  onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
                  placeholder="Catatan sumber jurnal atau justifikasi pakar..."
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
                  {isEdit ? "Simpan Perubahan" : "Simpan Aturan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

