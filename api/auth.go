package api

import (
	"cabai-care/internal/database"
	"cabai-care/internal/models"
	"cabai-care/internal/utils"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"
)

// AuthHandler menangani endpoint /api/auth
func AuthHandler(w http.ResponseWriter, r *http.Request) {
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

	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "cabaicare-academic-secure-key-2026"
	}

	switch action {
	case "login":
		if r.Method != http.MethodPost {
			utils.WriteError(w, http.StatusMethodNotAllowed, "Metode HTTP harus POST")
			return
		}

		var req models.LoginRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			utils.WriteError(w, http.StatusBadRequest, "Format JSON tidak valid")
			return
		}

		if req.Email == "" || req.Password == "" {
			utils.WriteError(w, http.StatusBadRequest, "Email dan password wajib diisi")
			return
		}

		if !store.VerifyAdmin(req.Email, req.Password) {
			utils.WriteError(w, http.StatusUnauthorized, "Email atau kata sandi tidak cocok")
			return
		}

		exp := time.Now().Add(24 * time.Hour).Unix()
		tokenPayload := fmt.Sprintf("%s|admin|%d", req.Email, exp)
		mac := hmac.New(sha256.New, []byte(secret))
		mac.Write([]byte(tokenPayload))
		signature := hex.EncodeToString(mac.Sum(nil))
		token := fmt.Sprintf("%s.%s", tokenPayload, signature)

		var resp models.LoginResponse
		resp.Success = true
		resp.Token = token
		resp.Message = "Autentikasi admin berhasil"
		resp.User.Email = req.Email
		resp.User.Nama = "Administrator Utama CabaiCare"
		resp.User.Role = "admin"

		utils.WriteJSON(w, http.StatusOK, resp)

	case "me":
		authHeader := r.Header.Get("Authorization")
		if !strings.HasPrefix(authHeader, "Bearer ") {
			utils.WriteError(w, http.StatusUnauthorized, "Header Authorization Bearer diperlukan")
			return
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")
		parts := strings.Split(token, ".")
		if len(parts) != 2 {
			utils.WriteError(w, http.StatusUnauthorized, "Format token tidak valid")
			return
		}

		payload := parts[0]
		sig := parts[1]

		mac := hmac.New(sha256.New, []byte(secret))
		mac.Write([]byte(payload))
		expectedSig := hex.EncodeToString(mac.Sum(nil))

		if sig != expectedSig {
			utils.WriteError(w, http.StatusUnauthorized, "Tanda tangan token tidak valid")
			return
		}

		subParts := strings.Split(payload, "|")
		if len(subParts) < 3 {
			utils.WriteError(w, http.StatusUnauthorized, "Payload token tidak lengkap")
			return
		}

		utils.WriteJSON(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"user": map[string]interface{}{
				"email": subParts[0],
				"nama":  "Administrator Utama CabaiCare",
				"role":  subParts[1],
			},
		})

	default:
		utils.WriteJSON(w, http.StatusOK, map[string]interface{}{
			"status":  "ready",
			"message": "Endpoint autentikasi CabaiCare",
		})
	}
}
