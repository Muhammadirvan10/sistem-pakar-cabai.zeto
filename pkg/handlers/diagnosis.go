package handlers

import (
	"cabai-care/pkg/database"
	"cabai-care/pkg/expert"
	"cabai-care/pkg/models"
	"cabai-care/pkg/utils"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"time"
)

// DiagnosisHandler menangani endpoint /api/diagnosis
func DiagnosisHandler(w http.ResponseWriter, r *http.Request) {
	if utils.EnableCORS(w, r) {
		return
	}

	if r.Method != http.MethodPost {
		utils.WriteError(w, http.StatusMethodNotAllowed, "Metode HTTP tidak diizinkan")
		return
	}

	var req models.DiagnosisRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.WriteError(w, http.StatusBadRequest, "Format JSON tidak valid: "+err.Error())
		return
	}

	if len(req.GejalaIDs) == 0 {
		utils.WriteError(w, http.StatusBadRequest, "Harap pilih minimal 1 gejala untuk melakukan pemeriksaan sistem pakar")
		return
	}

	if req.NamaPengguna == "" {
		req.NamaPengguna = "Petani Cabai (Tamu)"
	}

	store := database.GetStore()
	aturanList, err := store.GetAturan()
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "Gagal memuat aturan: "+err.Error())
		return
	}

	penyakitList, err := store.GetPenyakit()
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "Gagal memuat penyakit: "+err.Error())
		return
	}

	gejalaList, err := store.GetGejala()
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "Gagal memuat gejala: "+err.Error())
		return
	}

	// Buat engine Forward Chaining
	engine := expert.NewEngine(aturanList, penyakitList, gejalaList)

	// Jalankan Forward Chaining
	hasilPenyakit, jejak := engine.ForwardChain(req.GejalaIDs)

	// Kumpulkan objek gejala input untuk fasilitas penjelasan
	var gejalaInput []models.Gejala
	for _, gID := range req.GejalaIDs {
		if g, err := store.GetGejalaByID(gID); err == nil {
			gejalaInput = append(gejalaInput, *g)
		}
	}

	// Generate ID Pemeriksaan unik CHK-YYYYMMDD-XXXXX
	rand.Seed(time.Now().UnixNano())
	idPemeriksaan := fmt.Sprintf("CHK-%s-%05d", time.Now().Format("20060102"), rand.Intn(100000))

	teridentifikasi := len(hasilPenyakit) > 0
	pesan := ""
	kesimpulanDiagnosa := ""
	var idPrimaryPenyakit string
	var primaryPenyakit *models.Penyakit

	if teridentifikasi {
		primaryPenyakit = &hasilPenyakit[0]
		idPrimaryPenyakit = primaryPenyakit.ID
		kesimpulanDiagnosa = primaryPenyakit.NamaPenyakit
		if len(hasilPenyakit) == 1 {
			pesan = fmt.Sprintf("Berdasarkan penalaran Forward Chaining, tanaman cabai Anda terindikasi kuat mengalami: %s (%s).", primaryPenyakit.NamaPenyakit, primaryPenyakit.NamaIlmiah)
		} else {
			pesan = fmt.Sprintf("Berdasarkan penalaran Forward Chaining, teridentifikasi %d kemungkinan penyakit karena memenuhi premis aturan.", len(hasilPenyakit))
		}
	} else {
		kesimpulanDiagnosa = "Diagnosis Belum Dapat Ditentukan"
		pesan = "Kombinasi gejala yang Anda masukkan belum cocok dengan aturan basis pengetahuan saat ini. Disarankan melakukan pengamatan tambahan pada bagian tanaman lain atau berkonsultasi dengan penyuluh pertanian lapangan."
	}

	// Simpan ke Riwayat Pemeriksaan
	pemeriksaanRecord := models.Pemeriksaan{
		ID:                 idPemeriksaan,
		NamaPengguna:       req.NamaPengguna,
		JenisPemeriksaan:   "gejala",
		StatusHasil:        teridentifikasiStatus(teridentifikasi),
		KesimpulanDiagnosa: kesimpulanDiagnosa,
		IDPenyakit:         idPrimaryPenyakit,
		Penyakit:           primaryPenyakit,
		GejalaTerpilih:     gejalaInput,
		JejakInferensi:     jejak,
		CreatedAt:          time.Now(),
	}

	_ = store.SavePemeriksaan(pemeriksaanRecord)

	referensiList, _ := store.GetReferensi()

	resp := models.DiagnosisResponse{
		Success:          true,
		IDPemeriksaan:    idPemeriksaan,
		Teridentifikasi:  teridentifikasi,
		PenyakitTerpilih: hasilPenyakit,
		Pesan:            pesan,
		JejakInferensi:   jejak,
		GejalaInput:      gejalaInput,
		Referensi:        referensiList,
	}

	utils.WriteJSON(w, http.StatusOK, resp)
}

func teridentifikasiStatus(ok bool) string {
	if ok {
		return "Teridentifikasi"
	}
	return "Belum Dapat Ditentukan"
}
