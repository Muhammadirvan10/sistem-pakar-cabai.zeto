package main

import (
	"cabai-care/api"
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	mux := http.NewServeMux()

	// Dispatch semua request /api/* ke handler Vercel
	mux.HandleFunc("/api/", api.Handler)
	mux.HandleFunc("/api", api.Handler)

	fmt.Println("==================================================")
	fmt.Println("  CABAI CARE - BACKEND REST API GOLANG RUNTIME    ")
	fmt.Println("  Sistem Pakar Forward Chaining & AI Vision       ")
	fmt.Println("==================================================")
	fmt.Printf("✓ Server aktif di port %s -> http://localhost:%s/api/health\n", port, port)
	fmt.Println("✓ Menunggu permintaan dari Next.js frontend...")

	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatalf("Gagal menjalankan server: %v", err)
	}
}

