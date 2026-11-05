package handler

import (
	"cabai-care/pkg/handlers"
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
	// Contoh: "api/gejala" atau "gejala"
	parts := strings.Split(path, "/")
	if len(parts) > 0 && parts[0] == "api" {
		parts = parts[1:]
	}

	if len(parts) == 0 {
		handlers.HealthHandler(w, r)
		return
	}

	route := parts[0]
	switch route {
	case "health":
		handlers.HealthHandler(w, r)
	case "gejala":
		handlers.GejalaHandler(w, r)
	case "penyakit":
		handlers.PenyakitHandler(w, r)
	case "aturan":
		handlers.AturanHandler(w, r)
	case "diagnosis":
		handlers.DiagnosisHandler(w, r)
	case "detect":
		handlers.DetectHandler(w, r)
	case "history":
		handlers.HistoryHandler(w, r)
	case "auth":
		handlers.AuthHandler(w, r)
	case "admin":
		handlers.AdminHandler(w, r)
	default:
		utils.WriteError(w, http.StatusNotFound, "Rute API tidak ditemukan: /"+path)
	}
}
