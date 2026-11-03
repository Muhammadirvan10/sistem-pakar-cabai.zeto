package api

import (
	"cabai-care/internal/database"
	"cabai-care/internal/utils"
	"net/http"
	"strings"
)

// AdminHandler menangani endpoint /api/admin
func AdminHandler(w http.ResponseWriter, r *http.Request) {
	if utils.EnableCORS(w, r) {
		return
	}

	store := database.GetStore()
	action := r.URL.Query().Get("action")
	if action == "" {
		parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
		if len(parts) > 2 {
			action = parts[len(parts)-1]
		}
	}

	switch action {
	case "stats":
		pemeriksaanList, _ := store.GetPemeriksaan()
		penyakitList, _ := store.GetPenyakit()
		gejalaList, _ := store.GetGejala()
		aturanList, _ := store.GetAturan()
		modelList, _ := store.GetModelAI()

		totalPemeriksaan := len(pemeriksaanList)
		totalPenyakit := len(penyakitList)
		totalGejala := len(gejalaList)
		totalAturan := len(aturanList)

		totalGejalaExam := 0
		totalDaunExam := 0
		totalBuahExam := 0
		totalKematanganExam := 0

		for _, p := range pemeriksaanList {
			switch p.JenisPemeriksaan {
			case "gejala":
				totalGejalaExam++
			case "daun":
				totalDaunExam++
			case "buah":
				totalBuahExam++
			case "kematangan":
				totalKematanganExam++
			}
		}

		var latest []interface{}
		limit := 5
		if len(pemeriksaanList) < limit {
			limit = len(pemeriksaanList)
		}
		for i := 0; i < limit; i++ {
			latest = append(latest, pemeriksaanList[i])
		}

		utils.WriteJSON(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"data": map[string]interface{}{
				"total_pemeriksaan":      totalPemeriksaan,
				"total_penyakit":         totalPenyakit,
				"total_gejala":           totalGejala,
				"total_aturan":           totalAturan,
				"total_model_ai":         len(modelList),
				"total_diagnosis_gejala": totalGejalaExam,
				"total_deteksi_daun":     totalDaunExam,
				"total_deteksi_buah":     totalBuahExam,
				"total_kematangan":       totalKematanganExam,
				"distribusi_jenis": []map[string]interface{}{
					{"name": "Sistem Pakar Gejala", "value": totalGejalaExam, "color": "#15803d"},
					{"name": "Deteksi Daun (AI)", "value": totalDaunExam, "color": "#22c55e"},
					{"name": "Deteksi Buah (AI)", "value": totalBuahExam, "color": "#dc2626"},
					{"name": "Kematangan Cabai", "value": totalKematanganExam, "color": "#f97316"},
				},
				"riwayat_terbaru": latest,
			},
		})

	case "models":
		models, err := store.GetModelAI()
		if err != nil {
			utils.WriteError(w, http.StatusInternalServerError, err.Error())
			return
		}
		utils.WriteJSON(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"data":    models,
		})

	case "referensi":
		ref, err := store.GetReferensi()
		if err != nil {
			utils.WriteError(w, http.StatusInternalServerError, err.Error())
			return
		}
		utils.WriteJSON(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"data":    ref,
		})

	default:
		utils.WriteJSON(w, http.StatusOK, map[string]interface{}{
			"service": "CabaiCare Admin Module",
			"status":  "authorized",
		})
	}
}
