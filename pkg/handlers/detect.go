package handlers

import (
	"cabai-care/pkg/database"
	"cabai-care/pkg/models"
	"cabai-care/pkg/services"
	"cabai-care/pkg/utils"
	"encoding/base64"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"strings"
	"time"
)

// DetectHandler menangani endpoint /api/detect (leaf, fruit, ripeness)
func DetectHandler(w http.ResponseWriter, r *http.Request) {
	if utils.EnableCORS(w, r) {
		return
	}

	if r.Method != http.MethodPost {
		utils.WriteError(w, http.StatusMethodNotAllowed, "Metode HTTP tidak diizinkan")
		return
	}

	detType := r.URL.Query().Get("type")
	if detType == "" {
		parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
		if len(parts) > 2 {
			detType = parts[len(parts)-1]
		}
	}

	if detType != "leaf" && detType != "fruit" && detType != "ripeness" {
		detType = "leaf"
	}

	visionSvc := services.NewVisionService()
	store := database.GetStore()

	var fileBytes []byte
	var filename string
	var namaPengguna string = "Petani Cabai (Tamu)"

	contentType := r.Header.Get("Content-Type")
	if strings.HasPrefix(contentType, "multipart/form-data") {
		if err := r.ParseMultipartForm(10 * 1024 * 1024); err != nil {
			utils.WriteError(w, http.StatusBadRequest, "Gagal memproses form unggahan: "+err.Error())
			return
		}

		if val := r.FormValue("nama_pengguna"); val != "" {
			namaPengguna = val
		}

		file, header, err := r.FormFile("image")
		if err != nil {
			utils.WriteError(w, http.StatusBadRequest, "File gambar wajib diunggah pada field 'image'")
			return
		}
		defer file.Close()

		filename = header.Filename
		fileBytes, err = io.ReadAll(file)
		if err != nil {
			utils.WriteError(w, http.StatusInternalServerError, "Gagal membaca konten file")
			return
		}

		if err := visionSvc.ValidateImage(fileBytes[:512], int64(len(fileBytes))); err != nil {
			utils.WriteError(w, http.StatusBadRequest, err.Error())
			return
		}
	} else {
		var jsonBody struct {
			ImageBase64  string `json:"image_base64"`
			Filename     string `json:"filename"`
			NamaPengguna string `json:"nama_pengguna"`
		}
		if err := utils.DecodeJSON(r, &jsonBody); err != nil {
			utils.WriteError(w, http.StatusBadRequest, "Request harus berupa multipart/form-data atau JSON valid")
			return
		}

		if jsonBody.NamaPengguna != "" {
			namaPengguna = jsonBody.NamaPengguna
		}

		filename = jsonBody.Filename
		if filename == "" {
			filename = "upload.jpg"
		}

		cleanB64 := jsonBody.ImageBase64
		if idx := strings.Index(cleanB64, ","); idx != -1 {
			cleanB64 = cleanB64[idx+1:]
		}

		var err error
		fileBytes, err = base64.StdEncoding.DecodeString(cleanB64)
		if err != nil || len(fileBytes) == 0 {
			utils.WriteError(w, http.StatusBadRequest, "Data base64 gambar tidak valid")
			return
		}

		if err := visionSvc.ValidateImage(fileBytes[:512], int64(len(fileBytes))); err != nil {
			utils.WriteError(w, http.StatusBadRequest, err.Error())
			return
		}
	}

	var hasil *models.HasilDeteksi
	var err error

	switch detType {
	case "leaf":
		hasil, err = visionSvc.AnalyzeLeaf(fileBytes, filename)
	case "fruit":
		hasil, err = visionSvc.AnalyzeFruit(fileBytes, filename)
	case "ripeness":
		hasil, err = visionSvc.AnalyzeRipeness(fileBytes, filename)
	}

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "Gagal menganalisis citra: "+err.Error())
		return
	}

	rand.Seed(time.Now().UnixNano())
	idPemeriksaan := fmt.Sprintf("CHK-%s-%05d", time.Now().Format("20060102"), rand.Intn(100000))
	hasil.IDPemeriksaan = idPemeriksaan

	mime := http.DetectContentType(fileBytes[:512])
	fotoURL := fmt.Sprintf("data:%s;base64,%s", mime, base64.StdEncoding.EncodeToString(fileBytes))

	pemeriksaanRecord := models.Pemeriksaan{
		ID:                 idPemeriksaan,
		NamaPengguna:       namaPengguna,
		JenisPemeriksaan:   detType,
		StatusHasil:        "Teridentifikasi",
		KesimpulanDiagnosa: hasil.KelasTerdeteksi,
		FotoURL:            fotoURL,
		HasilDeteksi:       hasil,
		CreatedAt:          time.Now(),
	}

	_ = store.SavePemeriksaan(pemeriksaanRecord)

	resp := models.DetectionResponse{
		Success:       true,
		IDPemeriksaan: idPemeriksaan,
		HasilDeteksi:  hasil,
		FotoURL:       fotoURL,
		Pesan:         fmt.Sprintf("Analisis Computer Vision selesai. Terdeteksi kelas: %s (Confidence: %.1f%%)", hasil.KelasTerdeteksi, hasil.ConfidenceScore*100),
	}

	utils.WriteJSON(w, http.StatusOK, resp)
}
