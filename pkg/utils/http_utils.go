package utils

import (
	"bufio"
	"encoding/json"
	"net/http"
	"os"
	"strings"
)

// LoadEnv membaca file .env dan menyetel environment variables jika belum disetel
func LoadEnv(filenames ...string) {
	if len(filenames) == 0 {
		filenames = []string{".env", "../.env", "../../.env"}
	}
	for _, fn := range filenames {
		file, err := os.Open(fn)
		if err != nil {
			continue
		}
		defer file.Close()

		scanner := bufio.NewScanner(file)
		for scanner.Scan() {
			line := strings.TrimSpace(scanner.Text())
			if line == "" || strings.HasPrefix(line, "#") {
				continue
			}
			parts := strings.SplitN(line, "=", 2)
			if len(parts) == 2 {
				k := strings.TrimSpace(parts[0])
				v := strings.TrimSpace(parts[1])
				v = strings.Trim(v, `"'`)
				if os.Getenv(k) == "" {
					os.Setenv(k, v)
				}
			}
		}
		break
	}
}

// EnableCORS menyetel header CORS standar
func EnableCORS(w http.ResponseWriter, r *http.Request) bool {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return true
	}
	return false
}

// DecodeJSON mendecode body request ke struct target
func DecodeJSON(r *http.Request, target interface{}) error {
	return json.NewDecoder(r.Body).Decode(target)
}

// WriteJSON mengirimkan respon JSON dengan HTTP status code tertentu
func WriteJSON(w http.ResponseWriter, statusCode int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	_ = json.NewEncoder(w).Encode(data)
}

// WriteError mengirimkan pesan error JSON
func WriteError(w http.ResponseWriter, statusCode int, message string) {
	WriteJSON(w, statusCode, map[string]interface{}{
		"success": false,
		"error":   message,
	})
}
