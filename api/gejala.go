package api

import (
	"cabai-care/pkg/database"
	"cabai-care/pkg/models"
	"cabai-care/pkg/utils"
	"encoding/json"
	"net/http"
	"strings"
)

// GejalaHandler menangani endpoint /api/gejala
func GejalaHandler(w http.ResponseWriter, r *http.Request) {
	if utils.EnableCORS(w, r) {
		return
	}

	store := database.GetStore()

	switch r.Method {
	case http.MethodGet:
		gejalaList, err := store.GetGejala()
		if err != nil {
			utils.WriteError(w, http.StatusInternalServerError, "Gagal mengambil data gejala: "+err.Error())
			return
		}
		utils.WriteJSON(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"data":    gejalaList,
			"total":   len(gejalaList),
		})

	case http.MethodPost:
		var g models.Gejala
		if err := json.NewDecoder(r.Body).Decode(&g); err != nil {
			utils.WriteError(w, http.StatusBadRequest, "Format JSON tidak valid")
			return
		}
		if g.ID == "" || g.NamaGejala == "" {
			utils.WriteError(w, http.StatusBadRequest, "ID (kode gejala) dan nama gejala wajib diisi")
			return
		}
		if err := store.CreateGejala(g); err != nil {
			utils.WriteError(w, http.StatusInternalServerError, err.Error())
			return
		}
		utils.WriteJSON(w, http.StatusCreated, map[string]interface{}{
			"success": true,
			"message": "Gejala berhasil ditambahkan",
			"data":    g,
		})

	case http.MethodPut:
		var g models.Gejala
		if err := json.NewDecoder(r.Body).Decode(&g); err != nil {
			utils.WriteError(w, http.StatusBadRequest, "Format JSON tidak valid")
			return
		}
		if err := store.UpdateGejala(g); err != nil {
			utils.WriteError(w, http.StatusNotFound, err.Error())
			return
		}
		utils.WriteJSON(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"message": "Gejala berhasil diperbarui",
			"data":    g,
		})

	case http.MethodDelete:
		id := r.URL.Query().Get("id")
		if id == "" {
			parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
			if len(parts) > 2 {
				id = parts[len(parts)-1]
			}
		}
		if id == "" {
			utils.WriteError(w, http.StatusBadRequest, "Parameter id gejala diperlukan")
			return
		}
		if err := store.DeleteGejala(id); err != nil {
			utils.WriteError(w, http.StatusNotFound, err.Error())
			return
		}
		utils.WriteJSON(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"message": "Gejala berhasil dihapus",
		})

	default:
		utils.WriteError(w, http.StatusMethodNotAllowed, "Metode HTTP tidak diizinkan")
	}
}
