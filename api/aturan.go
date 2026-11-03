package api

import (
	"cabai-care/internal/database"
	"cabai-care/internal/models"
	"cabai-care/internal/utils"
	"encoding/json"
	"net/http"
	"strings"
)

// AturanHandler menangani endpoint /api/aturan
func AturanHandler(w http.ResponseWriter, r *http.Request) {
	if utils.EnableCORS(w, r) {
		return
	}

	store := database.GetStore()

	switch r.Method {
	case http.MethodGet:
		aturanList, err := store.GetAturan()
		if err != nil {
			utils.WriteError(w, http.StatusInternalServerError, "Gagal mengambil data aturan: "+err.Error())
			return
		}
		utils.WriteJSON(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"data":    aturanList,
			"total":   len(aturanList),
		})

	case http.MethodPost:
		var a models.Aturan
		if err := json.NewDecoder(r.Body).Decode(&a); err != nil {
			utils.WriteError(w, http.StatusBadRequest, "Format JSON tidak valid")
			return
		}
		if a.ID == "" || a.NamaAturan == "" || len(a.Premis) == 0 {
			utils.WriteError(w, http.StatusBadRequest, "ID aturan, nama aturan, dan premis gejala wajib diisi")
			return
		}
		if a.OperatorLogika == "" {
			a.OperatorLogika = "AND"
		}
		a.Aktif = true
		if err := store.CreateAturan(a); err != nil {
			utils.WriteError(w, http.StatusInternalServerError, err.Error())
			return
		}
		utils.WriteJSON(w, http.StatusCreated, map[string]interface{}{
			"success": true,
			"message": "Aturan berhasil ditambahkan",
			"data":    a,
		})

	case http.MethodPut:
		var a models.Aturan
		if err := json.NewDecoder(r.Body).Decode(&a); err != nil {
			utils.WriteError(w, http.StatusBadRequest, "Format JSON tidak valid")
			return
		}
		if err := store.UpdateAturan(a); err != nil {
			utils.WriteError(w, http.StatusNotFound, err.Error())
			return
		}
		utils.WriteJSON(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"message": "Aturan berhasil diperbarui",
			"data":    a,
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
			utils.WriteError(w, http.StatusBadRequest, "Parameter id aturan diperlukan")
			return
		}
		if err := store.DeleteAturan(id); err != nil {
			utils.WriteError(w, http.StatusNotFound, err.Error())
			return
		}
		utils.WriteJSON(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"message": "Aturan berhasil dihapus",
		})

	default:
		utils.WriteError(w, http.StatusMethodNotAllowed, "Metode HTTP tidak diizinkan")
	}
}
