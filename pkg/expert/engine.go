package expert

import (
	"cabai-care/pkg/models"
	"sort"
	"time"
)

// Engine merepresentasikan mesin inferensi Forward Chaining
type Engine struct {
	AturanList   []models.Aturan
	PenyakitMap  map[string]models.Penyakit
	GejalaMap    map[string]models.Gejala
}

// NewEngine menginisialisasi Forward Chaining Engine
func NewEngine(aturan []models.Aturan, penyakit []models.Penyakit, gejala []models.Gejala) *Engine {
	pMap := make(map[string]models.Penyakit)
	for _, p := range penyakit {
		pMap[p.ID] = p
	}

	gMap := make(map[string]models.Gejala)
	for _, g := range gejala {
		gMap[g.ID] = g
	}

	return &Engine{
		AturanList:  aturan,
		PenyakitMap: pMap,
		GejalaMap:   gMap,
	}
}

// ForwardChain menjalankan algoritma pelacakan maju dari fakta-fakta awal
func (e *Engine) ForwardChain(faktaAwal []string) ([]models.Penyakit, *models.JejakInferensi) {
	start := time.Now()

	// 1. Inisialisasi Memori Kerja (Working Memory)
	memoriKerjaMap := make(map[string]bool)
	for _, f := range faktaAwal {
		memoriKerjaMap[f] = true
	}

	// Salinan aturan yang aktif
	var aturanTersedia []models.Aturan
	for _, r := range e.AturanList {
		if r.Aktif {
			aturanTersedia = append(aturanTersedia, r)
		}
	}

	aturanTereksekusiMap := make(map[string]bool)
	var jejakIterasi []models.IterasiTrace
	var aturanTereksekusi []string
	var kesimpulanAntara []string
	kesimpulanAkhirMap := make(map[string]bool)

	iterasi := 0
	maxIterasi := 20 // Guardrail loop tak terhingga

	// Simpan keadaan awal (Iterasi 0)
	var initialFacts []string
	for f := range memoriKerjaMap {
		initialFacts = append(initialFacts, f)
	}
	sort.Strings(initialFacts)

	for iterasi < maxIterasi {
		iterasi++

		// A. Bentuk Conflict Set (Aturan Aktif yang premisnya terpenuhi tapi belum dieksekusi)
		var conflictSet []string
		var aturanKandidat *models.Aturan

		for i := range aturanTersedia {
			r := &aturanTersedia[i]
			if aturanTereksekusiMap[r.ID] {
				continue
			}

			// Evaluasi premis aturan
			if e.evaluasiPremis(r, memoriKerjaMap) {
				conflictSet = append(conflictSet, r.ID)
				if aturanKandidat == nil {
					// Strategi Resolusi Konflik: First-Come First-Served berdasarkan prioritas kesimpulan antara dahulu
					aturanKandidat = r
				}
			}
		}

		// List current working memory untuk trace
		var currentWM []string
		for f := range memoriKerjaMap {
			currentWM = append(currentWM, f)
		}
		sort.Strings(currentWM)

		// B. Kondisi Berhenti: Conflict Set kosong (tidak ada aturan aktif)
		if len(conflictSet) == 0 {
			jejakIterasi = append(jejakIterasi, models.IterasiTrace{
				Iterasi:       iterasi,
				MemoriKerja:   currentWM,
				AturanAktif:   []string{"-"},
				AturanDipilih: "-",
				FaktaBaru:     "-",
				Keterangan:    "Kondisi berhenti: Tidak ada lagi aturan aktif yang memenuhi premis.",
			})
			break
		}

		// C. Pilih satu aturan dari conflict set untuk ditembakkan (Fired)
		// Prioritaskan aturan yang menghasilkan kesimpulan antara terlebih dahulu
		for _, rID := range conflictSet {
			for i := range aturanTersedia {
				if aturanTersedia[i].ID == rID && aturanTersedia[i].KesimpulanAntara != "" {
					aturanKandidat = &aturanTersedia[i]
					break
				}
			}
		}

		aturanTereksekusiMap[aturanKandidat.ID] = true
		aturanTereksekusi = append(aturanTereksekusi, aturanKandidat.ID)

		// D. Tembakkan aturan (Fired) & Tambahkan fakta baru ke Memori Kerja
		faktaBaru := ""
		if aturanKandidat.KesimpulanAntara != "" {
			faktaBaru = aturanKandidat.KesimpulanAntara
			if !memoriKerjaMap[faktaBaru] {
				memoriKerjaMap[faktaBaru] = true
				kesimpulanAntara = append(kesimpulanAntara, faktaBaru)
			}
		} else if aturanKandidat.IDPenyakit != "" {
			faktaBaru = aturanKandidat.IDPenyakit
			kesimpulanAkhirMap[aturanKandidat.IDPenyakit] = true
		}

		jejakIterasi = append(jejakIterasi, models.IterasiTrace{
			Iterasi:       iterasi,
			MemoriKerja:   currentWM,
			AturanAktif:   conflictSet,
			AturanDipilih: aturanKandidat.ID,
			FaktaBaru:     faktaBaru,
			Keterangan:    aturanKandidat.NamaAturan,
		})
	}

	// Kumpulkan objek penyakit hasil kesimpulan akhir
	var hasilPenyakit []models.Penyakit
	var listKesimpulanAkhir []string
	for pID := range kesimpulanAkhirMap {
		listKesimpulanAkhir = append(listKesimpulanAkhir, pID)
		if p, exists := e.PenyakitMap[pID]; exists {
			hasilPenyakit = append(hasilPenyakit, p)
		}
	}

	sort.Strings(listKesimpulanAkhir)

	// Urutkan penyakit berdasarkan ID
	sort.Slice(hasilPenyakit, func(i, j int) bool {
		return hasilPenyakit[i].ID < hasilPenyakit[j].ID
	})

	jejak := &models.JejakInferensi{
		FaktaAwal:         initialFacts,
		Iterasi:           jejakIterasi,
		AturanTereksekusi: aturanTereksekusi,
		KesimpulanAntara:  kesimpulanAntara,
		KesimpulanAkhir:   listKesimpulanAkhir,
		WaktuEksekusiMs:   time.Since(start).Milliseconds(),
	}

	return hasilPenyakit, jejak
}

// evaluasiPremis memeriksa apakah premis aturan terpenuhi oleh memori kerja
func (e *Engine) evaluasiPremis(r *models.Aturan, wm map[string]bool) bool {
	if len(r.Premis) == 0 {
		return false
	}

	if r.OperatorLogika == "OR" {
		for _, p := range r.Premis {
			if e.cekKondisiTunggal(p, wm) {
				return true
			}
		}
		return false
	}

	// Default AND: seluruh premis harus terpenuhi
	for _, p := range r.Premis {
		if !e.cekKondisiTunggal(p, wm) {
			return false
		}
	}
	return true
}

func (e *Engine) cekKondisiTunggal(p models.PremisAturan, wm map[string]bool) bool {
	target := p.IDGejala
	if target == "" {
		target = p.IDKesimpulanAntara
	}

	ada := wm[target]
	if p.IsNegasi {
		return !ada
	}
	return ada
}

