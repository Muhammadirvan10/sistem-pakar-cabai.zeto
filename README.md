# CabaiCare – Sistem Pakar dan Deteksi Kondisi Tanaman Cabai

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?logo=next.js)](https://nextjs.org/)
[![Go](https://img.shields.io/badge/Backend-Golang%201.22-00ADD8?logo=go)](https://go.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-336791?logo=postgresql)](https://supabase.com/)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)

**CabaiCare** adalah platform web hibrida sistem pakar (*Expert System*) dan visi komputer (*Computer Vision*) yang dirancang untuk membantu petani, penyuluh pertanian, dan akademisi dalam mendeteksi dan mendiagnosis:
1. Penyakit pada tanaman cabai secara sistemik.
2. Penyakit pada daun cabai (*Cercospora, Gemini Virus, Phytophthora*).
3. Penyakit dan kebusukan buah cabai (*Antraknosa / Patek, Busuk Basah*).
4. Kerusakan buah cabai pascapanen vs pra-panen.
5. Tingkat kematangan buah cabai (mentah, mulai matang, matang sempurna, lewat matang) dan rekomendasi panen.

Platform ini mematuhi standar akademik dan etika AI yang ketat: **tidak menghasilkan diagnosis palsu atau acak**. Hasil diagnostik berasal dari kaidah deduktif Forward Chaining atau probabilitas model Computer Vision yang terhubung secara nyata.

---

## DAFTAR ISI
1. [Fitur Utama](#fitur-utama)
2. [Arsitektur & Teknologi](#arsitektur--teknologi)
3. [Struktur Folder](#struktur-folder)
4. [Instalasi & Menjalankan Lokal](#instalasi--menjalankan-lokal)
5. [Konfigurasi Database Supabase](#konfigurasi-database-supabase)
6. [Integrasi Model Computer Vision](#integrasi-model-computer-vision)
7. [Deployment ke Vercel](#deployment-ke-vercel)
8. [Akun Administrator Awal](#akun-administrator-awal)
9. [Skenario Pengujian Sistem](#skenario-pengujian-sistem)

---

## FITUR UTAMA

### 1. Diagnosis Gejala (Forward Chaining)
- Formulir dinamis berisi 18 fakta gejala lapangan yang diambil langsung dari database.
- Mesin inferensi Golang mengevaluasi premis secara bertingkat: membuktikan **kesimpulan antara** (K01 s.d K04) lalu mencapai kesimpulan akhir penyakit (P01 s.d P07).
- **Fasilitas Penjelasan (*Explanation Facility*):** Menampilkan tabel pelacakan iterasi, *Working Memory*, *Conflict Set*, aturan yang ditembakkan (*rules fired*), dan fakta baru.
- Rekomendasi penanganan organik hayati, kimiawi terukur, dan tindakan pencegahan sanitasi lahan.

### 2. Deteksi Penyakit Daun Cabai (Computer Vision)
- Drag-and-drop unggah foto daun cabai (validasi format JPG/PNG dan ukuran maksimal 5MB).
- Klasifikasi daun sehat, bercak daun Cercospora (mata katak), dan klorosis keriting virus kuning.
- Penampilan *confidence score* nyata dengan *disclaimer* laboratorium.

### 3. Deteksi Penyakit & Kebusukan Buah Cabai
- Identifikasi lesi nekrotik cekung antraknosa (patek buah) dan busuk basah berair phytophthora.
- Pembedaan tegas antara penyakit patogen pra-panen dengan kerusakan fisik pascapanen akibat benturan atau pengangkutan.

### 4. Deteksi Kematangan Buah Cabai
- Klasifikasi 4 fase: Mentah (Hijau), Mulai Matang (*Turning*), Matang Sempurna (Merah Cerah), dan Terlalu Matang.
- Rekomendasi waktu panen ideal berdasarkan tujuan distribusi (pasar lokal vs pengiriman jarak jauh).

### 5. Riwayat Pemeriksaan & Ekspor PDF
- Arsip sesi konsultasi dengan fitur pencarian instan, filter rentang tanggal, dan filter jenis layanan.
- Cetak resmi lembar laporan hasil pemeriksaan atau ekspor PDF.

### 6. Dashboard & Panel Admin
- Metrik statistik real-time dan visualisasi diagram grafik Recharts (Pie Chart & Bar Chart).
- CRUD lengkap: Basis Penyakit, Basis Gejala, Aturan IF-THEN, dan Metadata Model AI.
- Autentikasi aman berbasis HMAC token dan *salted password hashing*.

---

## ARSITEKTUR & TEKNOLOGI

| Lapisan | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14 (App Router) | Framework React dengan Server & Client Components |
| **Bahasa UI** | TypeScript (.tsx) | Type safety penuh, zero runtime type errors |
| **Styling** | Tailwind CSS | Desain responsif bertema pertanian modern |
| **Ikon** | Lucide React | Ikonografi modern dan konsisten |
| **Grafik** | Recharts | Visualisasi analitik data konsultasi |
| **Backend** | Golang 1.22 | REST API modular, cepat, dan hemat memori |
| **Inference Engine** | Go Package `internal/expert` | Forward Chaining dengan conflict resolution |
| **Database** | PostgreSQL / Supabase | Skema relasional 10 tabel dengan indeks pencarian |
| **Hosting** | Vercel Serverless | Deployment Go runtime `/api` dan Next.js |

---

## STRUKTUR FOLDER

```text
Sistem Pakar Cabai/
├── app/                              # Next.js 14 App Router Pages
│   ├── page.tsx                      # Landing Page Hero & Edukasi
│   ├── layout.tsx                    # Layout Utama & Navigasi
│   ├── globals.css                   # Tailwind Directives & Print Style
│   ├── pemeriksaan/page.tsx          # Pilihan 4 Menu Pemeriksaan
│   ├── diagnosis/page.tsx            # Sistem Pakar Gejala (Forward Chaining)
│   ├── deteksi-daun/page.tsx         # Deteksi Citra Daun (AI)
│   ├── deteksi-buah/page.tsx         # Deteksi Buah & Kebusukan (AI)
│   ├── kematangan/page.tsx           # Klasifikasi Kematangan Buah (AI)
│   ├── hasil/[id]/page.tsx           # Detail Lembar Hasil & Cetak PDF
│   ├── riwayat/page.tsx              # Arsip & Pencarian Riwayat
│   ├── login/page.tsx                # Autentikasi Masuk Administrator
│   └── admin/
│       ├── dashboard/page.tsx        # Dashboard Statistik & Grafik Recharts
│       ├── penyakit/page.tsx         # CRUD Basis Penyakit
│       ├── gejala/page.tsx           # CRUD Basis Gejala
│       ├── aturan/page.tsx           # CRUD Basis Aturan IF-THEN
│       └── model-ai/page.tsx         # Manajemen Model Computer Vision
├── components/                       # Komponen UI Reusable
│   ├── Navbar.tsx                    # Navigasi Responsif Desktop & Mobile
│   ├── Footer.tsx                    # Footer Informasi Akademis & Disclaimer
│   └── AdminSidebar.tsx              # Sidebar Menu Panel Admin
├── api/                              # Vercel Go Serverless Handlers
│   ├── index.go                      # Dispatcher Utama Rute /api/*
│   ├── health.go                     # GET /api/health
│   ├── gejala.go                     # CRUD /api/gejala
│   ├── penyakit.go                   # CRUD /api/penyakit
│   ├── aturan.go                     # CRUD /api/aturan
│   ├── diagnosis.go                  # POST /api/diagnosis (Forward Chaining)
│   ├── detect.go                     # POST /api/detect (AI Vision)
│   ├── history.go                    # GET/DELETE /api/history
│   ├── auth.go                       # POST /api/auth (Login & Token Verify)
│   └── admin.go                      # GET /api/admin (Stats, Models, Refs)
├── internal/                         # Logika Inti Backend Golang
│   ├── models/models.go              # Struct Model Data DTO & Entitas
│   ├── expert/engine.go              # Mesin Inferensi Forward Chaining
│   ├── database/store.go             # Data Store & Seeder In-Memory
│   ├── services/ai_vision.go         # Adapter External Inference & Demo Mode
│   └── utils/http_utils.go           # CORS & JSON Serialization Helper
├── migrations/                       # SQL Database Migrations
│   ├── 01_schema.sql                 # Skema 10 Tabel PostgreSQL
│   └── 02_seed_data.sql              # Data Awal 18 Gejala, 7 Penyakit, 18 Aturan
├── docs/                             # Dokumen Laporan Akademis UTS
│   └── LAPORAN_UTS_SISTEM_PAKAR.md   # Laporan Lengkap Format FTBS Unidha
├── lib/api.ts                        # Client API Fetcher Service
├── main.go                           # Server Lokal Golang (Port 8080)
├── go.mod                            # Go Modules
├── package.json                      # Node.js Dependencies
├── tsconfig.json                     # TypeScript Configuration
├── tailwind.config.ts                # Tailwind Palette Configuration
├── vercel.json                       # Konfigurasi Runtime Go Vercel
├── .env.example                      # Contoh Variabel Lingkungan
└── README.md                         # Dokumentasi Proyek
```

---

## INSTALASI & MENJALANKAN LOKAL

### Prasyarat
- **Node.js**: v18.0 atau lebih baru (v20+ disarankan)
- **Golang**: v1.21 atau v1.22
- **Git**

### Langkah 1: Clone Repository
```bash
git clone https://github.com/username/cabaicare.git
cd cabaicare
```

### Langkah 2: Instal Dependensi Frontend
```bash
npm install
```

### Langkah 3: Konfigurasi Lingkungan (.env)
Salin berkas `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

### Langkah 4: Menjalankan Backend Golang
Di terminal pertama, jalankan backend Go pada port 8080:
```bash
go run main.go
```
*Output sukses:*
```text
==================================================
  CABAI CARE - BACKEND REST API GOLANG RUNTIME    
  Sistem Pakar Forward Chaining & AI Vision       
==================================================
✓ Server aktif di port 8080 -> http://localhost:8080/api/health
✓ Menunggu permintaan dari Next.js frontend...
```

### Langkah 5: Menjalankan Frontend Next.js
Di terminal kedua, jalankan dev server Next.js:
```bash
npm run dev
```
Buka peramban Anda di: **`http://localhost:3000`**

---

## KONFIGURASI DATABASE SUPABASE

Aplikasi telah dilengkapi sistem *In-Memory Seed Store* sehingga langsung dapat dijalankan tanpa database eksternal. Namun untuk menyimpan data secara permanen di Supabase PostgreSQL:

1. Buat proyek baru di [Supabase Console](https://supabase.com).
2. Masuk ke menu **SQL Editor**.
3. Buka file `migrations/01_schema.sql`, salin seluruh kueri, dan klik **Run**.
4. Buka file `migrations/02_seed_data.sql`, salin seluruh kueri, dan klik **Run**.
5. Salin *Project URL* dan *anon public key* dari menu **Project Settings > API**, lalu masukkan ke dalam file `.env`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
   SUPABASE_SERVICE_ROLE_KEY=eyJh...
   ```

---

## INTEGRASI MODEL COMPUTER VISION

Modul AI CabaiCare mengadopsi arsitektur *Adapter Pattern* yang fleksibel. Jika Anda melatih model Convolutional Neural Network (CNN) menggunakan dataset citra cabai:

1. Deploy model Anda ke endpoint HTTP (misalnya menggunakan FastAPI / Flask / TorchServe / Roboflow).
2. Set variabel lingkungan di `.env`:
   ```env
   AI_INFERENCE_URL=https://api.model-anda.com/v1/predict
   AI_API_KEY=your-bearer-api-key
   AI_MODEL_VERSION=v1.2.0-resnet50
   ```
3. Backend Golang secara otomatis akan meneruskan file foto ke endpoint tersebut dan memvalidasi respons berupa format:
   ```json
   {
     "predicted_class": "Bercak Daun Cercospora",
     "confidence_score": 0.942,
     "probabilities": { "Bercak Daun": 0.94, "Daun Sehat": 0.06 }
   }
   ```
4. Jika `AI_INFERENCE_URL` dikosongkan, sistem beralih secara transparan ke **Mode Demonstrasi Terverifikasi** dengan label yang jelas untuk keperluan presentasi dan pengujian prototipe.

---

## DEPLOYMENT KE VERCEL

Proyek ini telah dikonfigurasi agar Next.js dan Golang Serverless Function berjalan serentak pada satu domain di Vercel:

1. Hubungkan repository GitHub Anda ke [Vercel Dashboard](https://vercel.com).
2. File `vercel.json` telah dikonfigurasi untuk menangani runtime Go:
   ```json
   {
     "version": 2,
     "functions": {
       "api/**/*.go": {
         "runtime": "go@1.22"
       }
     }
   }
   ```
3. Di pengaturan proyek Vercel (**Settings > Environment Variables**), tambahkan:
   - `NEXT_PUBLIC_API_URL` : Kosongkan atau isi `/api` (karena satu domain)
   - `ADMIN_USERNAME` : `admin@cabaicare.id`
   - `ADMIN_PASSWORD` : *(Kata sandi admin Anda)*
   - `JWT_SECRET` : *(String acak minimal 32 karakter)*
4. Klik **Deploy**. Vercel akan mengompilasi Next.js sekaligus serverless handler Golang di folder `/api`.

---

## AKUN ADMINISTRATOR AWAL

Untuk masuk ke Panel Admin (`/login`), gunakan kredensial awal berikut:
* **Email:** `admin@cabaicare.id`
* **Kata Sandi:** `AdminCabaiCare2026!`

> **Keamanan:** Kata sandi disimpan menggunakan enkripsi hashing SHA-256 / bcrypt dan tidak disimpan dalam bentuk teks biasa (*plain text*). Anda dapat mengganti kata sandi melalui menu konfigurasi database atau mengubah variabel lingkungan `ADMIN_PASSWORD`.

---

## SKENARIO PENGUJIAN SISTEM

Sistem telah diuji melalui 5 skenario inti sesuai rubrik penilaian UTS:

| Skenario | Gejala Masukan | Aturan Berjalan | Hasil Sistem | Evaluasi |
| :---: | :--- | :---: | :--- | :---: |
| **Kasus 1** | Klorosis (G01) + Keriting (G02) + Kutu Kebul (G03) + Kerdil (G14) | R01 → R02 | P01: Penyakit Virus Kuning (*Gemini*) | **Valid** |
| **Kasus 2** | Layu Siang Hari (G06) + Pembuluh Cokelat (G08) + Lendir Bakteri (G09) | R06 → R07 | P03: Layu Bakteri (*Ralstonia*) | **Valid** |
| **Kasus 3** | Lesi Buah Cekung (G10) + Spora Oranye (G11) + Buah Mengering (G17) | R11 → R12 | P05: Antraknosa / Patek Buah | **Valid** |
| **Kasus 4** | Bercak Bulat Mata Katak (G04) + Daun Gugur Berlubang (G05) | R04 | P02: Bercak Daun Cercospora | **Valid** |
| **Kasus 5** | Hawar Tangkai Batang (G13) *[Fakta parsial tak lengkap]* | Conflict Set Kosong | Status: Belum Dapat Ditentukan | **Valid** |

**Tingkat Kesesuaian Sistem:** $5/5 \times 100\% = \mathbf{100\%}$

---

## LISENSI & HAK CIPTA
Dikembangkan untuk Ujian Tengah Semester (UTS) Ganjil 2026/2027  
Mata Kuliah Sistem Pakar (TI22604) – Dosen: Haris Setiaji, M.T.I  
Fakultas Teknologi Bisnis dan Sains (FTBS), Universitas Dharma Wacana.

