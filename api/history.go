package api

import (
	"cabai-care/pkg/database"
	"cabai-care/pkg/utils"
	"net/http"
	"strings"
	"time"
)

// HistoryHandler menangani endpoint /api/history
func HistoryHandler(w http.ResponseWriter, r *http.Request) {
	if utils.EnableCORS(w, r) {
		return
	}

	store := database.GetStore()

	switch r.Method {
	case http.MethodGet:
		id := r.URL.Query().Get("id")
		if id == "" {
			parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
			if len(parts) > 2 && parts[len(parts)-1] != "history" {
				id = parts[len(parts)-1]
			}
		}

		if id != "" {
			item, err := store.GetPemeriksaanByID(id)
			if err != nil {
				utils.WriteError(w, http.StatusNotFound, "Riwayat pemeriksaan tidak ditemukan")
				return
			}
			utils.WriteJSON(w, http.StatusOK, map[string]interface{}{
				"success": true,
				"data":    item,
			})
			return
		}

		list, err := store.GetPemeriksaan()
		if err != nil {
			utils.WriteError(w, http.StatusInternalServerError, err.Error())
			return
		}

		search := strings.ToLower(strings.TrimSpace(r.URL.Query().Get("search")))
		jenis := strings.ToLower(strings.TrimSpace(r.URL.Query().Get("jenis")))
		tglStart := r.URL.Query().Get("start_date")
		tglEnd := r.URL.Query().Get("end_date")

		var filtered []interface{}
		for _, item := range list {
			if jenis != "" && jenis != "all" && strings.ToLower(item.JenisPemeriksaan) != jenis {
				continue
			}

			if search != "" {
				inID := strings.Contains(strings.ToLower(item.ID), search)
				inUser := strings.Contains(strings.ToLower(item.NamaPengguna), search)
				inDiagnosa := strings.Contains(strings.ToLower(item.KesimpulanDiagnosa), search)
				if !inID && !inUser && !inDiagnosa {
					continue
				}
			}

			if tglStart != "" {
				if t, err := time.Parse("2006-01-02", tglStart); err == nil {
					if item.CreatedAt.Before(t) {
						continue
					}
				}
			}
			if tglEnd != "" {
				if t, err := time.Parse("2006-01-02", tglEnd); err == nil {
					if item.CreatedAt.After(t.Add(24 * time.Hour)) {
						continue
					}
				}
			}

			filtered = append(filtered, item)
		}

		utils.WriteJSON(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"data":    filtered,
			"total":   len(filtered),
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
			utils.WriteError(w, http.StatusBadRequest, "ID pemeriksaan diperlukan untuk menghapus riwayat")
			return
		}

		if err := store.DeletePemeriksaan(id); err != nil {
			utils.WriteError(w, http.StatusNotFound, err.Error())
			return
		}

		utils.WriteJSON(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"message": "Riwayat pemeriksaan berhasil dihapus",
		})

	default:
		utils.WriteError(w, http.StatusMethodNotAllowed, "Metode HTTP tidak diizinkan")
	}
}
