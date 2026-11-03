package api

import (
	"cabai-care/internal/utils"
	"net/http"
	"time"
)

// HealthHandler menangani endpoint /api/health
func HealthHandler(w http.ResponseWriter, r *http.Request) {
	if utils.EnableCORS(w, r) {
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]interface{}{
		"status":      "ok",
		"service":     "CabaiCare API",
		"version":     "1.0.0",
		"runtime":     "Go 1.22 Vercel Serverless",
		"timestamp":   time.Now().Format(time.RFC3339),
		"environment": "production",
	})
}
