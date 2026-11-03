// lib/api.ts - Client API Service untuk CabaiCare

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchGejala() {
  const res = await fetch(`${API_BASE}/gejala`);
  return res.json();
}

export async function fetchPenyakit(id?: string) {
  const url = id ? `${API_BASE}/penyakit?id=${id}` : `${API_BASE}/penyakit`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchAturan() {
  const res = await fetch(`${API_BASE}/aturan`);
  return res.json();
}

export async function runDiagnosis(namaPengguna: string, gejalaIDs: string[]) {
  const res = await fetch(`${API_BASE}/diagnosis`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nama_pengguna: namaPengguna,
      gejala_ids: gejalaIDs,
    }),
  });
  return res.json();
}

export async function runDetection(type: "leaf" | "fruit" | "ripeness", file: File, namaPengguna?: string) {
  const formData = new FormData();
  formData.append("image", file);
  if (namaPengguna) {
    formData.append("nama_pengguna", namaPengguna);
  }

  const res = await fetch(`${API_BASE}/detect?type=${type}`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function fetchHistory(params?: { search?: string; jenis?: string; startDate?: string; endDate?: string }) {
  const query = new URLSearchParams();
  if (params?.search) query.append("search", params.search);
  if (params?.jenis) query.append("jenis", params.jenis);
  if (params?.startDate) query.append("start_date", params.startDate);
  if (params?.endDate) query.append("end_date", params.endDate);

  const res = await fetch(`${API_BASE}/history?${query.toString()}`);
  return res.json();
}

export async function fetchHistoryByID(id: string) {
  const res = await fetch(`${API_BASE}/history?id=${id}`);
  return res.json();
}

export async function deleteHistory(id: string) {
  const res = await fetch(`${API_BASE}/history?id=${id}`, {
    method: "DELETE",
  });
  return res.json();
}

export async function loginAdmin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth?action=login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function fetchAdminStats() {
  const res = await fetch(`${API_BASE}/admin?action=stats`);
  return res.json();
}

export async function fetchAIModels() {
  const res = await fetch(`${API_BASE}/admin?action=models`);
  return res.json();
}

export async function fetchReferensi() {
  const res = await fetch(`${API_BASE}/admin?action=referensi`);
  return res.json();
}

