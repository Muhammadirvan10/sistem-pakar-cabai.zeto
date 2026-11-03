package models

import "time"

// Gejala merepresentasikan fakta atau gejala pada tanaman cabai
type Gejala struct {
	ID            string    `json:"id"`
	NamaGejala    string    `json:"nama_gejala"`
	Deskripsi     string    `json:"deskripsi"`
	BagianTanaman string    `json:"bagian_tanaman"` // daun, batang, buah, akar, seluruh_tanaman
	BobotPakar    float64   `json:"bobot_pakar"`
	CreatedAt     time.Time `json:"created_at,omitempty"`
}

// Penyakit merepresentasikan kesimpulan diagnosa penyakit atau gangguan
type Penyakit struct {
	ID                string    `json:"id"`
	NamaPenyakit      string    `json:"nama_penyakit"`
	NamaIlmiah        string    `json:"nama_ilmiah"`
	Kategori          string    `json:"kategori"` // virus, jamur, bakteri, hama, fisiologis
	Deskripsi         string    `json:"deskripsi"`
	Penyebab          string    `json:"penyebab"`
	GejalaUmum        string    `json:"gejala_umum"`
	PenangananOrganik string    `json:"penanganan_organik"`
	PenangananKimia   string    `json:"penanganan_kimia"`
	Pencegahan        string    `json:"pencegahan"`
	TingkatBahaya     string    `json:"tingkat_bahaya"` // Rendah, Sedang, Tinggi, Sangat Tinggi
	GambarURL         string    `json:"gambar_url"`
	CreatedAt         time.Time `json:"created_at,omitempty"`
}

// PremisAturan merepresentasikan kondisi prasyarat aturan (IF)
type PremisAturan struct {
	IDGejala             string `json:"id_gejala,omitempty"`
	IDKesimpulanAntara   string `json:"id_kesimpulan_antara,omitempty"`
	IsNegasi             bool   `json:"is_negasi"`
}

// Aturan merepresentasikan aturan produksi (IF premis THEN kesimpulan)
type Aturan struct {
	ID               string         `json:"id"`
	IDPenyakit       string         `json:"id_penyakit,omitempty"`
	KesimpulanAntara string         `json:"kesimpulan_antara,omitempty"` // K01, K02, dst.
	NamaAturan       string         `json:"nama_aturan"`
	OperatorLogika   string         `json:"operator_logika"` // AND / OR
	Keterangan       string         `json:"keterangan"`
	Aktif            bool           `json:"aktif"`
	Premis           []PremisAturan `json:"premis"`
}

// IterasiTrace merepresentasikan satu langkah pelacakan dalam Forward Chaining
// Sesuai format standar akademis UTS FTBS Universitas Dharma Wacana:
// Iterasi | Memori Kerja | Aturan Aktif (Conflict Set) | Aturan Dipilih | Fakta Baru
type IterasiTrace struct {
	Iterasi       int      `json:"iterasi"`
	MemoriKerja   []string `json:"memori_kerja"`
	AturanAktif   []string `json:"aturan_aktif"`
	AturanDipilih string   `json:"aturan_dipilih"`
	FaktaBaru     string   `json:"fakta_baru"`
	Keterangan    string   `json:"keterangan"`
}

// JejakInferensi menyimpan riwayat lengkap pembuktian sistem pakar
type JejakInferensi struct {
	FaktaAwal        []string       `json:"fakta_awal"`
	Iterasi          []IterasiTrace `json:"iterasi"`
	AturanTereksekusi []string       `json:"aturan_tereksekusi"`
	KesimpulanAntara []string       `json:"kesimpulan_antara"`
	KesimpulanAkhir  []string       `json:"kesimpulan_akhir"`
	WaktuEksekusiMs  int64          `json:"waktu_eksekusi_ms"`
}

// Pemeriksaan merepresentasikan sesi riwayat konsultasi pengguna
type Pemeriksaan struct {
	ID                  string          `json:"id"`
	IDUser              string          `json:"id_user,omitempty"`
	NamaPengguna        string          `json:"nama_pengguna"`
	JenisPemeriksaan    string          `json:"jenis_pemeriksaan"` // gejala, daun, buah, kematangan
	StatusHasil         string          `json:"status_hasil"`      // Teridentifikasi, Belum Dapat Ditentukan, Selesai
	KesimpulanDiagnosa  string          `json:"kesimpulan_diagnosa"`
	IDPenyakit          string          `json:"id_penyakit,omitempty"`
	Penyakit            *Penyakit       `json:"penyakit,omitempty"`
	GejalaTerpilih      []Gejala        `json:"gejala_terpilih,omitempty"`
	JejakInferensi      *JejakInferensi `json:"jejak_inferensi,omitempty"`
	FotoURL             string          `json:"foto_url,omitempty"`
	HasilDeteksi        *HasilDeteksi   `json:"hasil_deteksi,omitempty"`
	CatatanPengguna     string          `json:"catatan_pengguna,omitempty"`
	CreatedAt           time.Time       `json:"created_at"`
}

// HasilDeteksi merepresentasikan keluaran model Computer Vision
type HasilDeteksi struct {
	ID                  int                `json:"id,omitempty"`
	IDPemeriksaan       string             `json:"id_pemeriksaan"`
	ModelName           string             `json:"model_name"`
	ModelVersion        string             `json:"model_version"`
	KelasTerdeteksi     string             `json:"kelas_terdeteksi"`
	ConfidenceScore     float64            `json:"confidence_score"`
	DistribusiKelas     map[string]float64 `json:"distribusi_kelas,omitempty"`
	WaktuInferensiMs    int64              `json:"waktu_inferensi_ms"`
	IsDemoMode          bool               `json:"is_demo_mode"`
	CatatanDisclaimer   string             `json:"catatan_disclaimer"`
	RekomendasiTindakan string             `json:"rekomendasi_tindakan"`
}

// ModelAI merepresentasikan metadata model klasifikasi citra
type ModelAI struct {
	ID              string                 `json:"id"`
	NamaModel       string                 `json:"nama_model"`
	Versi           string                 `json:"versi"`
	TipeDeteksi     string                 `json:"tipe_deteksi"` // daun, buah, kematangan
	Arsitektur      string                 `json:"arsitektur"`
	DaftarKelas     []string               `json:"daftar_kelas"`
	MetrikEvaluasi  map[string]interface{} `json:"metrik_evaluasi"`
	Status          string                 `json:"status"` // aktif, nonaktif, evaluasi, demo
	URLEndpoint     string                 `json:"url_endpoint,omitempty"`
	TanggalPengujian string                `json:"tanggal_pengujian,omitempty"`
}

// ReferensiPengetahuan merepresentasikan sumber pustaka ilmiah
type ReferensiPengetahuan struct {
	ID             int    `json:"id"`
	Judul          string `json:"judul"`
	Penulis        string `json:"penulis"`
	Tahun          int    `json:"tahun"`
	PenerbitJurnal string `json:"penerbit_jurnal"`
	DOIURL         string `json:"doi_url"`
	Keterangan     string `json:"keterangan"`
}

// Request & Response DTOs
type DiagnosisRequest struct {
	NamaPengguna string   `json:"nama_pengguna"`
	GejalaIDs    []string `json:"gejala_ids"`
}

type DiagnosisResponse struct {
	Success            bool            `json:"success"`
	IDPemeriksaan      string          `json:"id_pemeriksaan"`
	Teridentifikasi    bool            `json:"teridentifikasi"`
	PenyakitTerpilih   []Penyakit      `json:"penyakit_terpilih"`
	Pesan              string          `json:"pesan"`
	JejakInferensi     *JejakInferensi `json:"jejak_inferensi"`
	GejalaInput        []Gejala        `json:"gejala_input"`
	Referensi          []ReferensiPengetahuan `json:"referensi"`
}

type DetectionResponse struct {
	Success       bool          `json:"success"`
	IDPemeriksaan string        `json:"id_pemeriksaan"`
	HasilDeteksi  *HasilDeteksi `json:"hasil_deteksi"`
	FotoURL       string        `json:"foto_url"`
	Pesan         string        `json:"pesan"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Success bool   `json:"success"`
	Token   string `json:"token"`
	User    struct {
		Email string `json:"email"`
		Nama  string `json:"nama"`
		Role  string `json:"role"`
	} `json:"user"`
	Message string `json:"message"`
}

