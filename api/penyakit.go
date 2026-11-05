package api

import (
	"cabai-care/pkg/database"
	"cabai-care/pkg/models"
	"cabai-care/pkg/utils"
	"encoding/json"
	"net/http"
	"strings"
)

// PenyakitHandler menangani endpoint /api/penyakit
func PenyakitHandler(w http.ResponseWriter, r *http.Request) {
	if utils.EnableCORS(w, r) {
		return
	}

	store := database.GetStore()

	switch r.Method {
	case http.MethodGet:
		id := r.URL.Query().Get("id")
		if id != "" {
			p, err := store.GetPenyakitByID(id)
			if err != nil {
				utils.WriteError(w, http.StatusNotFound, err.Error())
				return
			}
			utils.WriteJSON(w, http.StatusOK, map[string]interface{}{
				"success": true,
				"data":    p,
			})
			return
		}

		list, err := store.GetPenyakit()
		if err != nil {
			utils.WriteError(w, http.StatusInternalServerError, "Gagal mengambil data penyakit: "+err.Error())
			return
		}
		utils.WriteJSON(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"data":    list,
			"total":   len(list),
		})

	case http.MethodPost:
		var p models.Penyakit
		if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
			utils.WriteError(w, http.StatusBadRequest, "Format JSON tidak valid")
			return
		}
		if p.ID == "" || p.NamaPenyakit == "" {
			utils.WriteError(w, http.StatusBadRequest, "ID dan nama penyakit wajib diisi")
			return
		}
		if err := store.CreatePenyakit(p); err != nil {
			utils.WriteError(w, http.StatusInternalServerError, err.Error())
			return
		}
		utils.WriteJSON(w, http.StatusCreated, map[string]interface{}{
			"success": true,
			"message": "Data penyakit berhasil disimpan",
			"data":    p,
		})

	case http.MethodPut:
		var p models.Penyakit
		if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
			utils.WriteError(w, http.StatusBadRequest, "Format JSON tidak valid")
			return
		}
		if err := store.UpdatePenyakit(p); err != nil {
			utils.WriteError(w, http.StatusNotFound, err.Error())
			return
		}
		utils.WriteJSON(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"message": "Data penyakit berhasil diperbarui",
			"data":    p,
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
			utils.WriteError(w, http.StatusBadRequest, "Parameter id penyakit diperlukan")
			return
		}
		if err := store.DeletePenyakit(id); err != nil {
			utils.WriteError(w, http.StatusNotFound, err.Error())
			return
		}
		utils.WriteJSON(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"message": "Penyakit berhasil dihapus",
		})

	default:
		utils.WriteError(w, http.StatusMethodNotAllowed, "Metode HTTP tidak diizinkan")
	}
}
