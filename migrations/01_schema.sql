-- ================================================================
-- CABAI CARE DATABASE SCHEMA
-- Target Database: PostgreSQL 14+ / Supabase PostgreSQL
-- Mata Kuliah: Sistem Pakar (TI22604) - FTBS Universitas Dharma Wacana
-- ================================================================

-- Aktifkan ekstensi UUID jika belum ada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABEL USERS (Pengguna & Administrator)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nama_lengkap VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'pakar', 'petani', 'tamu')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pencarian email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. TABEL PENYAKIT (Basis Pengetahuan Diagnosa Penyakit & Kondisi Cabai)
CREATE TABLE IF NOT EXISTS penyakit (
    id VARCHAR(20) PRIMARY KEY, -- P01, P02, dst.
    nama_penyakit VARCHAR(255) NOT NULL,
    nama_ilmiah VARCHAR(255),
    kategori VARCHAR(50) NOT NULL CHECK (kategori IN ('virus', 'jamur', 'bakteri', 'hama', 'fisiologis')),
    deskripsi TEXT NOT NULL,
    penyebab TEXT NOT NULL,
    gejala_umum TEXT NOT NULL,
    penanganan_organik TEXT NOT NULL,
    penanganan_kimia TEXT NOT NULL,
    pencegahan TEXT NOT NULL,
    tingkat_bahaya VARCHAR(20) DEFAULT 'Sedang' CHECK (tingkat_bahaya IN ('Rendah', 'Sedang', 'Tinggi', 'Sangat Tinggi')),
    gambar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index kategori & nama
CREATE INDEX IF NOT EXISTS idx_penyakit_kategori ON penyakit(kategori);
CREATE INDEX IF NOT EXISTS idx_penyakit_nama ON penyakit(nama_penyakit);

-- 3. TABEL GEJALA (Fakta / Premis Masukan Sistem Pakar)
CREATE TABLE IF NOT EXISTS gejala (
    id VARCHAR(20) PRIMARY KEY, -- G01, G02, dst.
    nama_gejala VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    bagian_tanaman VARCHAR(50) NOT NULL CHECK (bagian_tanaman IN ('daun', 'batang', 'buah', 'akar', 'seluruh_tanaman')),
    bobot_pakar NUMERIC(3,2) DEFAULT 1.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index bagian tanaman
CREATE INDEX IF NOT EXISTS idx_gejala_bagian ON gejala(bagian_tanaman);

-- 4. TABEL ATURAN (Rule Basis Pengetahuan Forward Chaining)
CREATE TABLE IF NOT EXISTS aturan (
    id VARCHAR(20) PRIMARY KEY, -- R01, R02, dst.
    id_penyakit VARCHAR(20) REFERENCES penyakit(id) ON DELETE CASCADE,
    kesimpulan_antara VARCHAR(50), -- K01, K02 jika aturan menghasilkan fakta antara
    nama_aturan VARCHAR(255) NOT NULL,
    operator_logika VARCHAR(10) DEFAULT 'AND' CHECK (operator_logika IN ('AND', 'OR')),
    keterangan TEXT,
    aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index aturan
CREATE INDEX IF NOT EXISTS idx_aturan_penyakit ON aturan(id_penyakit);

-- 5. TABEL ATURAN_GEJALA (Relasi Many-to-Many Premis Gejala pada Aturan)
CREATE TABLE IF NOT EXISTS aturan_gejala (
    id SERIAL PRIMARY KEY,
    id_aturan VARCHAR(20) NOT NULL REFERENCES aturan(id) ON DELETE CASCADE,
    id_gejala VARCHAR(20) REFERENCES gejala(id) ON DELETE CASCADE,
    id_kesimpulan_antara VARCHAR(50), -- Jika premis aturan membutuhkan kesimpulan antara sebelumnya
    is_negasi BOOLEAN DEFAULT FALSE, -- NOT condition
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_premis CHECK (id_gejala IS NOT NULL OR id_kesimpulan_antara IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_aturan_gejala_rel ON aturan_gejala(id_aturan, id_gejala);

-- 6. TABEL MODEL_AI (Konfigurasi & Metrik Model Computer Vision)
CREATE TABLE IF NOT EXISTS model_ai (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_model VARCHAR(255) NOT NULL,
    versi VARCHAR(50) NOT NULL,
    tipe_deteksi VARCHAR(50) NOT NULL CHECK (tipe_deteksi IN ('daun', 'buah', 'kematangan')),
    arsitektur VARCHAR(100) NOT NULL, -- ResNet50, MobileNetV3, YOLOv8, EfficientNet
    daftar_kelas JSONB NOT NULL, -- Array kelas klasifikasi
    metrik_evaluasi JSONB, -- Accuracy, Precision, Recall, F1-Score
    status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif', 'evaluasi', 'demo')),
    url_endpoint TEXT,
    tanggal_pengujian DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. TABEL REFERENSI_PENGETAHUAN (Sumber Ilmiah & Jurnal Basis Pengetahuan)
CREATE TABLE IF NOT EXISTS referensi_pengetahuan (
    id SERIAL PRIMARY KEY,
    judul VARCHAR(500) NOT NULL,
    penulis VARCHAR(255) NOT NULL,
    tahun INT NOT NULL,
    penerbit_jurnal VARCHAR(255) NOT NULL,
    doi_url TEXT,
    keterangan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. TABEL PEMERIKSAAN (Sesi Konsultasi Sistem Pakar / Deteksi)
CREATE TABLE IF NOT EXISTS pemeriksaan (
    id VARCHAR(50) PRIMARY KEY, -- CHK-YYYYMMDD-XXXXX
    id_user UUID REFERENCES users(id) ON DELETE SET NULL,
    nama_pengguna VARCHAR(255) DEFAULT 'Petani Cabai (Tamu)',
    jenis_pemeriksaan VARCHAR(50) NOT NULL CHECK (jenis_pemeriksaan IN ('gejala', 'daun', 'buah', 'kematangan')),
    status_hasil VARCHAR(50) NOT NULL, -- Teridentifikasi, Tidak Teridentifikasi, Selesai
    kesimpulan_diagnosa TEXT NOT NULL,
    id_penyakit VARCHAR(20) REFERENCES penyakit(id) ON DELETE SET NULL,
    jejak_inferensi JSONB, -- Simpan log run Forward Chaining (working memory, conflict set, rules fired)
    foto_url TEXT,
    catatan_pengguna TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pemeriksaan_tgl ON pemeriksaan(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pemeriksaan_jenis ON pemeriksaan(jenis_pemeriksaan);

-- 9. TABEL DETAIL_PEMERIKSAAN (Fakta Gejala Masukan pada Sesi Konsultasi)
CREATE TABLE IF NOT EXISTS detail_pemeriksaan (
    id SERIAL PRIMARY KEY,
    id_pemeriksaan VARCHAR(50) NOT NULL REFERENCES pemeriksaan(id) ON DELETE CASCADE,
    id_gejala VARCHAR(20) NOT NULL REFERENCES gejala(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_detail_pemeriksaan_id ON detail_pemeriksaan(id_pemeriksaan);

-- 10. TABEL HASIL_DETEKSI_GAMBAR (Log Hasil Klasifikasi Computer Vision)
CREATE TABLE IF NOT EXISTS hasil_deteksi_gambar (
    id SERIAL PRIMARY KEY,
    id_pemeriksaan VARCHAR(50) NOT NULL REFERENCES pemeriksaan(id) ON DELETE CASCADE,
    id_model UUID REFERENCES model_ai(id) ON DELETE SET NULL,
    nama_kelas_terdeteksi VARCHAR(100) NOT NULL,
    confidence_score NUMERIC(5,4) NOT NULL, -- Nilai antara 0.0000 - 1.0000 (0 - 100%)
    semua_probabilitas JSONB, -- Distribusi kemungkinan per kelas
    waktu_inferensi_ms INT,
    is_demo_mode BOOLEAN DEFAULT FALSE,
    catatan_disclaimer TEXT DEFAULT 'Hasil deteksi visual adalah estimasi awal citra, bukan pengganti uji laboratorium mikrobiologi tanaman.',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_deteksi_pemeriksaan ON hasil_deteksi_gambar(id_pemeriksaan);

