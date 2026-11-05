package api

import (
	"cabai-care/pkg/utils"
	"net/http"
	"strings"
)

// Handler adalah dispatcher utama Vercel Serverless Function untuk rute /api/*
func Handler(w http.ResponseWriter, r *http.Request) {
	if utils.EnableCORS(w, r) {
		return
	}

	path := strings.Trim(r.URL.Path, "/")
	// e.g. "api/gejala" or "gejala"
	parts := strings.Split(path, "/")
	if len(parts) > 0 && parts[0] == "api" {
		parts = parts[1:]
	}

	if len(parts) == 0 {
		HealthHandler(w, r)
		return
	}

	route := parts[0]
	switch route {
	case "health":
		HealthHandler(w, r)
	case "gejala":
		GejalaHandler(w, r)
	case "penyakit":
		PenyakitHandler(w, r)
	case "aturan":
		AturanHandler(w, r)
	case "diagnosis":
		DiagnosisHandler(w, r)
	case "detect":
		DetectHandler(w, r)
	case "history":
		HistoryHandler(w, r)
	case "auth":
		AuthHandler(w, r)
	case "admin":
		AdminHandler(w, r)
	default:
		utils.WriteError(w, http.StatusNotFound, "Rute API tidak ditemukan: /"+path)
	}
}

