package database

import (
	"cabai-care/internal/models"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"sync"
	"time"
)

// Store mendefinisikan antarmuka penyimpanan data
type Store interface {
	GetGejala() ([]models.Gejala, error)
	GetGejalaByID(id string) (*models.Gejala, error)
	CreateGejala(g models.Gejala) error
	UpdateGejala(g models.Gejala) error
	DeleteGejala(id string) error

	GetPenyakit() ([]models.Penyakit, error)
	GetPenyakitByID(id string) (*models.Penyakit, error)
	CreatePenyakit(p models.Penyakit) error
	UpdatePenyakit(p models.Penyakit) error
	DeletePenyakit(id string) error

	GetAturan() ([]models.Aturan, error)
	CreateAturan(a models.Aturan) error
	UpdateAturan(a models.Aturan) error
	DeleteAturan(id string) error

	GetPemeriksaan() ([]models.Pemeriksaan, error)
	GetPemeriksaanByID(id string) (*models.Pemeriksaan, error)
	SavePemeriksaan(p models.Pemeriksaan) error
	DeletePemeriksaan(id string) error

	GetModelAI() ([]models.ModelAI, error)
	GetReferensi() ([]models.ReferensiPengetahuan, error)

	VerifyAdmin(email, password string) bool
}

// MemoryStore adalah implementasi in-memory terstandarisasi dengan data awal lengkap
type MemoryStore struct {
	mu           sync.RWMutex
	gejalaList   []models.Gejala
	penyakitList []models.Penyakit
	aturanList   []models.Aturan
	pemeriksaan  []models.Pemeriksaan
	modelAIList  []models.ModelAI
	referensi    []models.ReferensiPengetahuan
	adminUsers   map[string]string // email -> sha256 password hash
}

var globalStore *MemoryStore
var once sync.Once

// GetStore mengembalikan singleton instance database store
func GetStore() *MemoryStore {
	once.Do(func() {
		globalStore = NewMemoryStore()
	})
	return globalStore
}

func NewMemoryStore() *MemoryStore {
	ms := &MemoryStore{
		adminUsers: make(map[string]string),
	}
	ms.seedData()
	return ms
}

func (ms *MemoryStore) seedData() {
	ms.mu.Lock()
	defer ms.mu.Unlock()

	// 1. Admin
	hasher := sha256.New()
	hasher.Write([]byte("AdminCabaiCare2026!"))
	ms.adminUsers["admin@cabaicare.id"] = hex.EncodeToString(hasher.Sum(nil))

	// 2. 7 Penyakit
	ms.penyakitList = []models.Penyakit{
		{
			ID:                "P01",
			NamaPenyakit:      "Penyakit Virus Kuning (Gemini Virus / Bule)",
			NamaIlmiah:        "Pepper Yellow Leaf Curl Virus (PYLCV)",
			Kategori:          "virus",
			Deskripsi:         "Penyakit sistemik berbahaya yang menyebabkan klorosis menyeluruh pada helai daun, daun mengecil melengkung ke atas, dan tanaman kerdil gagal berbuah optimal.",
			Penyebab:          "Virus Gemini yang ditularkan secara persisten oleh vektor kutu kebul (Bemisia tabaci).",
			GejalaUmum:        "Daun menguning cerah, helai daun keriting/menggulung ke atas, tulang daun menebal, tanaman kerdil bila terserang sejak fase vegetatif.",
			PenangananOrganik: "Aplikasi semprotan minyak nimba (neem oil) atau ekstrak daun tembakau dan gadung untuk mengusir vektor kutu kebul. Pasang perangkap likat kuning (yellow sticky trap) 40 buah/ha.",
			PenangananKimia:   "Penyemprotan insektisida sistemik berbahan aktif imidakloprid, tiametoksam, atau abamektin untuk mengendalikan populasi kutu kebul.",
			Pencegahan:        "Gunakan benih cabai toleran/resisten virus, sanitasi gulma inang di sekitar bedengan, dan pasang mulsa plastik perak untuk memantulkan sinar matahari.",
			TingkatBahaya:     "Sangat Tinggi",
			GambarURL:         "https://images.unsplash.com/photo-1592417817098-8f3d6ef23f83?auto=format&fit=crop&w=600&q=80",
		},
		{
			ID:                "P02",
			NamaPenyakit:      "Bercak Daun Cercospora (Mata Katak)",
			NamaIlmiah:        "Cercospora capsici Heald & F.A. Wolf",
			Kategori:          "jamur",
			Deskripsi:         "Penyakit jamur daun yang menimbulkan lesi melingkar dengan titik pusat berwarna putih kelabu atau abu-abu mirip mata katak.",
			Penyebab:          "Jamur Cercospora capsici yang berkembang pesat pada kelembapan tinggi di atas 85% dan suhu hangat 25-30°C.",
			GejalaUmum:        "Bercak bulat kecil pada daun dengan tepi gelap kemerahan dan pusat abu-abu/putih. Daun parah menguning dan rontok prematur.",
			PenangananOrganik: "Penyemprotan bio-fungisida Trichoderma harzianum atau ekstrak sirih merah. Perempelan daun tua yang terinfeksi dan bakar agar tidak menular.",
			PenangananKimia:   "Fungisida kontak berbahan aktif mankozeb, klorotalonil, atau fungisida sistemik berbahan aktif difenokonazol sesuai dosis anjuran.",
			Pencegahan:        "Atur jarak tanam ideal (60 x 70 cm) untuk sirkulasi udara baik, hindari penyiraman tabur langsung ke kanopi daun pada sore hari.",
			TingkatBahaya:     "Sedang",
			GambarURL:         "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80",
		},
		{
			ID:                "P03",
			NamaPenyakit:      "Layu Bakteri",
			NamaIlmiah:        "Ralstonia solanacearum",
			Kategori:          "bakteri",
			Deskripsi:         "Penyakit vaskular mematikan yang menyebabkan tanaman cabai layu sangat mendadak saat siang hari dan mati dalam waktu 3-5 hari dalam kondisi daun masih hijau.",
			Penyebab:          "Bakteri tular tanah Ralstonia solanacearum yang menginfeksi sistem pembuluh xilem melalui luka perakaran.",
			GejalaUmum:        "Layu mendadak daun atas pada siang hari, pulih sejenak malam hari, lalu layu permanen. Berkas pembuluh batang cokelat. Potongan batang keluar lendir putih keruh saat direndam air.",
			PenangananOrganik: "Pemberian agens hayati Bacillus subtilis atau Pseudomonas fluorescens sejak persemaian. Cabut dan bakar tanaman terinfeksi beserta tanah di sekitarnya.",
			PenangananKimia:   "Bakterisida berbahan aktif tembaga hidroksida atau asam oksolinik melalui kocor pangkal batang secara terukur.",
			Pencegahan:        "Rotasi tanaman bukan famili Solanaceae (seperti jagung/padi), perbaiki drainase lahan agar tidak tergenang, dan sterilisasi alat tani.",
			TingkatBahaya:     "Sangat Tinggi",
			GambarURL:         "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80",
		},
		{
			ID:                "P04",
			NamaPenyakit:      "Layu Fusarium",
			NamaIlmiah:        "Fusarium oxysporum f. sp. capsici",
			Kategori:          "jamur",
			Deskripsi:         "Penyakit tular tanah yang menyebabkan kelayuan progresif bertahap dimulai dari daun bagian bawah menguning, menjalar ke atas hingga tanaman mati kekeringan.",
			Penyebab:          "Jamur tanah Fusarium oxysporum yang memproduksi mikotoksin dan menyumbat saluran xilem.",
			GejalaUmum:        "Kelayuan bertahap dimulai dari daun bagian bawah menguning, tulang daun pucat, batang bawah berwarna cokelat pada berkas xilem tanpa keluarnya lendir bakteri.",
			PenangananOrganik: "Inokulasi bibit dengan agens antagonis Trichoderma viride atau Gliocladium sp. sebelum tanam. Tambahkan kompos matang kaya silika.",
			PenangananKimia:   "Kocor fungisida bahan aktif benomil, propineb, atau karbendazim pada lubang tanam di sekitar perakaran.",
			Pencegahan:        "Hindari luka akar saat penyiangan, buat guludan tinggi, dan berikan kapur pertanian (dolomit) untuk menaikkan pH tanah menjadi 6.5 - 7.0.",
			TingkatBahaya:     "Tinggi",
			GambarURL:         "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=600&q=80",
		},
		{
			ID:                "P05",
			NamaPenyakit:      "Antraknosa / Patek Buah Cabai",
			NamaIlmiah:        "Colletotrichum capsici / C. gloeosporioides",
			Kategori:          "jamur",
			Deskripsi:         "Penyakit nomor satu perusak buah cabai. Menyebabkan bercak nekrotik melekuk melingkar (konsentris) dan buah membusuk keriput seperti jerami terbakar.",
			Penyebab:          "Jamur patogen Colletotrichum spp. yang spora-nya menyebar cepat lewat percikan air hujan dan angin kencang.",
			GejalaUmum:        "Bercak cekung melingkar kehitaman pada kulit buah, terbentuk lingkaran massa spora berwarna oranye/pink, buah busuk kering dan gugur atau mengering di tangkai.",
			PenangananOrganik: "Sanitasi buah rontok bergejala, semprot ekstrak rimpang kunyit dan lengkuas, serta perbanyak agens jamur antagonis Beauveria bassiana.",
			PenangananKimia:   "Fungisida sistemik kombinasi kontak berbahan aktif azoksistrobin + difenokonazol, atau propineb disemprot merata pada buah.",
			Pencegahan:        "Petik segera buah yang baru menunjukkan gejala awal agar tidak menyebarkan spora ke buah sehat, gunakan mulsa plastik perak.",
			TingkatBahaya:     "Sangat Tinggi",
			GambarURL:         "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80",
		},
		{
			ID:                "P06",
			NamaPenyakit:      "Busuk Buah & Hawar Daun Phytophthora",
			NamaIlmiah:        "Phytophthora capsici Leonian",
			Kategori:          "jamur",
			Deskripsi:         "Penyakit oomycetes destruktif yang menyerang seluruh bagian tanaman: buah membusuk basah kecokelatan, daun mengalami bercak basah cepat melebar.",
			Penyebab:          "Oomycota Phytophthora capsici yang sporanya berenang aktif dalam air tanah/hujan yang tergenang.",
			GejalaUmum:        "Buah membusuk basah berair dari ujung atau pangkal, tertutup miselium putih halus seperti kapas saat lembap. Daun mengalami bercak hawar basah kecokelatan.",
			PenangananOrganik: "Aplikasi Trichoderma sp. pada lubang tanam dan kompos. Mengatur bedengan dengan parit dalam agar air hujan cepat mengalir tuntas.",
			PenangananKimia:   "Fungisida berbahan aktif simoksanil, dimetomorf, atau metalaksil + mankozeb secara teratur saat musim hujan tiba.",
			Pencegahan:        "Jangan menanam cabai pada lahan bekas tanaman inang terinfeksi sebelumnya, hindari kelembapan tanah jenuh terus-menerus.",
			TingkatBahaya:     "Tinggi",
			GambarURL:         "https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?auto=format&fit=crop&w=600&q=80",
		},
		{
			ID:                "P07",
			NamaPenyakit:      "Serangan Hama Thrips & Tungau Cabai",
			NamaIlmiah:        "Thrips parvispinus / Polyphagotarsonemus latus",
			Kategori:          "hama",
			Deskripsi:         "Serangan serangga penghisap cairan sel daun muda yang menyebabkan permukaan bawah daun berkilau keperakan, daun melengkung ke atas, dan pucuk kaku.",
			Penyebab:          "Hama Thrips dan tungau kuning/merah yang berkembang cepat pada cuaca kering dan panas.",
			GejalaUmum:        "Permukaan bawah daun mengkilap seperti tembaga/perak, tepi daun menggulung ke atas seperti perahu, tunas pucuk mengkerut dan kaku, bunga mudah gugur.",
			PenangananOrganik: "Semprot pestisida nabati rebusan tembakau, daun mimba, dan sabun kalium lunak. Pasang perangkap biru (blue sticky trap).",
			PenangananKimia:   "Insektisida/akarisida berbahan aktif abamektin, spinetoram, atau piridaben rotasi berkala.",
			Pencegahan:        "Jaga kelembapan mikro pertanaman, lakukan irigasi kabut (sprinkler) ringan untuk membilas koloni hama dari bawah daun.",
			TingkatBahaya:     "Sedang",
			GambarURL:         "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80",
		},
	}

	// 3. 18 Gejala
	ms.gejalaList = []models.Gejala{
		{ID: "G01", NamaGejala: "Daun menguning secara menyeluruh atau klorosis bercak", Deskripsi: "Warna helai daun berubah dari hijau segar menjadi kuning pucat atau kuning cerah.", BagianTanaman: "daun", BobotPakar: 1.0},
		{ID: "G02", NamaGejala: "Daun menggulung ke atas / keriting dan mengkerut", Deskripsi: "Bentuk helai daun tidak rata, melengkung ke atas membentuk sendok atau keriting kaku.", BagianTanaman: "daun", BobotPakar: 1.0},
		{ID: "G03", NamaGejala: "Terdapat kutu kebul (serangga putih kecil) di balik daun", Deskripsi: "Adanya serangga vektor putih kecil yang beterbangan saat tanaman digoyang.", BagianTanaman: "daun", BobotPakar: 0.9},
		{ID: "G04", NamaGejala: "Bercak bulat kecil cokelat tepi gelap pusat abu-abu (\"mata katak\")", Deskripsi: "Lesi berbentuk bulat kecil diameter 2-5 mm dengan tepi cokelat gelap dan pusat abu-abu/putih.", BagianTanaman: "daun", BobotPakar: 1.0},
		{ID: "G05", NamaGejala: "Daun berlubang atau mengering dan gugur prematur", Deskripsi: "Bercak pada daun rontok meninggalkan lubang, daun menguning lalu gugur banyak.", BagianTanaman: "daun", BobotPakar: 0.85},
		{ID: "G06", NamaGejala: "Tanaman layu mendadak di siang hari, segar kembali sore/malam", Deskripsi: "Kondisi daun terkulai lemas saat terik matahari namun tidak langsung mati mengering di hari pertama.", BagianTanaman: "seluruh_tanaman", BobotPakar: 1.0},
		{ID: "G07", NamaGejala: "Layu permanen bertahap dari daun bawah menjalar ke atas", Deskripsi: "Kelayuan dimulai dari daun tua terbawah menguning perlahan naik ke pucuk.", BagianTanaman: "seluruh_tanaman", BobotPakar: 1.0},
		{ID: "G08", NamaGejala: "Berkas pembuluh xilem pangkal batang berwarna cokelat kehitaman", Deskripsi: "Saat kulit batang bawah disayat membujur, jaringan pembuluh di dalamnya tampak kecokelatan.", BagianTanaman: "batang", BobotPakar: 1.0},
		{ID: "G09", NamaGejala: "Keluar lendir bakteri putih keruh saat potongan batang direndam air", Deskripsi: "Uji celup potongan batang di gelas air bening mengeluarkan untaian cairan putih keruh (ooze).", BagianTanaman: "batang", BobotPakar: 1.0},
		{ID: "G10", NamaGejala: "Bercak konsentris melekuk cekung berwarna cokelat tua pada buah", Deskripsi: "Lesi bundar melekuk ke dalam dengan garis lingkaran teratur pada kulit buah cabai.", BagianTanaman: "buah", BobotPakar: 1.0},
		{ID: "G11", NamaGejala: "Terbentuk massa spora berwarna oranye atau merah muda di tengah lesi buah", Deskripsi: "Di bagian tengah bercak cekung buah cabai tampak titik-titik lender spora jamur berwarna jingga.", BagianTanaman: "buah", BobotPakar: 0.95},
		{ID: "G12", NamaGejala: "Buah cabai membusuk basah dan berair dari ujung atau tangkai", Deskripsi: "Daging buah lembek berair (water-soaked) dan mudah lepas dari tangkainya.", BagianTanaman: "buah", BobotPakar: 1.0},
		{ID: "G13", NamaGejala: "Bercak cokelat kebasahan pada batang atau tangkai buah (hawar)", Deskripsi: "Bagian cabang, ranting, atau tangkai buah menghitam basah dan rapuh patah.", BagianTanaman: "batang", BobotPakar: 0.9},
		{ID: "G14", NamaGejala: "Pertumbuhan tanaman terhambat kerdil (stunting)", Deskripsi: "Tinggi tanaman jauh lebih pendek dibanding usia normal tanaman sehat.", BagianTanaman: "seluruh_tanaman", BobotPakar: 0.85},
		{ID: "G15", NamaGejala: "Permukaan bawah daun berwarna perak mengkilap atau kecokelatan", Deskripsi: "Gejala garukan serangga thrips yang menyisakan lapisan kutikula mengkilap di sisi bawah daun.", BagianTanaman: "daun", BobotPakar: 0.95},
		{ID: "G16", NamaGejala: "Bunga mudah rontok sebelum berhasil menjadi buah", Deskripsi: "Kuncup bunga layu mengering dan gugur dalam jumlah banyak.", BagianTanaman: "seluruh_tanaman", BobotPakar: 0.8},
		{ID: "G17", NamaGejala: "Buah mengkerut mengering seperti jerami terbakar (mummified)", Deskripsi: "Buah cabai tidak jatuh melainkan mengering keriput menggantung di dahan.", BagianTanaman: "buah", BobotPakar: 0.9},
		{ID: "G18", NamaGejala: "Bercak basah cokelat tua menyebar sangat cepat saat hujan lembab", Deskripsi: "Penyebaran gejala nekrotik yang luar biasa cepat ketika cuaca berkabut atau hujan lebat.", BagianTanaman: "daun", BobotPakar: 0.9},
	}

	// 4. 18 Aturan
	ms.aturanList = []models.Aturan{
		{
			ID: "R01", KesimpulanAntara: "K01", NamaAturan: "Aturan Indikasi Malformasi Daun", OperatorLogika: "AND", Aktif: true,
			Keterangan: "IF Daun menguning (G01) AND Daun keriting (G02) THEN Klorosis & Malformasi Daun (K01)",
			Premis:     []models.PremisAturan{{IDGejala: "G01"}, {IDGejala: "G02"}},
		},
		{
			ID: "R02", IDPenyakit: "P01", NamaAturan: "Aturan Diagnosis Virus Kuning Lanjutan", OperatorLogika: "AND", Aktif: true,
			Keterangan: "IF Klorosis Malformasi (K01) AND Kutu Kebul (G03) AND Tanaman Kerdil (G14) THEN Virus Kuning (P01)",
			Premis:     []models.PremisAturan{{IDKesimpulanAntara: "K01"}, {IDGejala: "G03"}, {IDGejala: "G14"}},
		},
		{
			ID: "R03", IDPenyakit: "P07", NamaAturan: "Aturan Diagnosis Serangan Hama Thrips", OperatorLogika: "AND", Aktif: true,
			Keterangan: "IF Daun menguning (G01) AND Daun keriting (G02) AND Sisi bawah perak (G15) THEN Hama Thrips/Tungau (P07)",
			Premis:     []models.PremisAturan{{IDGejala: "G01"}, {IDGejala: "G02"}, {IDGejala: "G15"}},
		},
		{
			ID: "R04", IDPenyakit: "P02", NamaAturan: "Aturan Diagnosis Bercak Mata Katak Standar", OperatorLogika: "AND", Aktif: true,
			Keterangan: "IF Bercak mata katak (G04) AND Daun rontok berlubang (G05) THEN Bercak Daun Cercospora (P02)",
			Premis:     []models.PremisAturan{{IDGejala: "G04"}, {IDGejala: "G05"}},
		},
		{
			ID: "R05", IDPenyakit: "P02", NamaAturan: "Aturan Diagnosis Cercospora Cuaca Lembab", OperatorLogika: "AND", Aktif: true,
			Keterangan: "IF Bercak mata katak (G04) AND Bercak basah cepat saat lembab (G18) THEN Bercak Daun Cercospora (P02)",
			Premis:     []models.PremisAturan{{IDGejala: "G04"}, {IDGejala: "G18"}},
		},
		{
			ID: "R06", KesimpulanAntara: "K02", NamaAturan: "Aturan Indikasi Gangguan Pembuluh Vaskular Akut", OperatorLogika: "AND", Aktif: true,
			Keterangan: "IF Layu siang hari segar sore (G06) AND Berkas pembuluh cokelat (G08) THEN Gangguan Vaskular (K02)",
			Premis:     []models.PremisAturan{{IDGejala: "G06"}, {IDGejala: "G08"}},
		},
		{
			ID: "R07", IDPenyakit: "P03", NamaAturan: "Aturan Diagnosis Pasti Layu Bakteri", OperatorLogika: "AND", Aktif: true,
			Keterangan: "IF Gangguan Vaskular (K02) AND Lendir bakteri keluar (G09) THEN Layu Bakteri (P03)",
			Premis:     []models.PremisAturan{{IDKesimpulanAntara: "K02"}, {IDGejala: "G09"}},
		},
		{
			ID: "R08", KesimpulanAntara: "K02", NamaAturan: "Aturan Indikasi Gangguan Pembuluh Bertahap", OperatorLogika: "AND", Aktif: true,
			Keterangan: "IF Layu permanen bawah ke atas (G07) AND Berkas pembuluh cokelat (G08) THEN Gangguan Vaskular (K02)",
			Premis:     []models.PremisAturan{{IDGejala: "G07"}, {IDGejala: "G08"}},
		},
		{
			ID: "R09", IDPenyakit: "P04", NamaAturan: "Aturan Diagnosis Layu Fusarium Tanpa Ooze", OperatorLogika: "AND", Aktif: true,
			Keterangan: "IF Gangguan Vaskular (K02) AND NOT Lendir bakteri (G09) THEN Layu Fusarium (P04)",
			Premis:     []models.PremisAturan{{IDKesimpulanAntara: "K02"}, {IDGejala: "G09", IsNegasi: true}},
		},
		{
			ID: "R10", IDPenyakit: "P04", NamaAturan: "Aturan Diagnosis Layu Fusarium Klasik", OperatorLogika: "AND", Aktif: true,
			Keterangan: "IF Layu bertahap (G07) AND Pembuluh cokelat (G08) AND Tanaman kerdil (G14) THEN Layu Fusarium (P04)",
			Premis:     []models.PremisAturan{{IDGejala: "G07"}, {IDGejala: "G08"}, {IDGejala: "G14"}},
		},
		{
			ID: "R11", KesimpulanAntara: "K03", NamaAturan: "Aturan Indikasi Lesi Nekrotik Buah", OperatorLogika: "AND", Aktif: true,
			Keterangan: "IF Bercak konsentris melekuk (G10) AND Massa spora oranye (G11) THEN Nekrosis Buah Cekung (K03)",
			Premis:     []models.PremisAturan{{IDGejala: "G10"}, {IDGejala: "G11"}},
		},
		{
			ID: "R12", IDPenyakit: "P05", NamaAturan: "Aturan Diagnosis Antraknosa Buah Lengkap", OperatorLogika: "AND", Aktif: true,
			Keterangan: "IF Nekrosis Buah Cekung (K03) AND Buah mengering jerami (G17) THEN Antraknosa / Patek (P05)",
			Premis:     []models.PremisAturan{{IDKesimpulanAntara: "K03"}, {IDGejala: "G17"}},
		},
		{
			ID: "R13", IDPenyakit: "P05", NamaAturan: "Aturan Diagnosis Antraknosa Buah Lapangan", OperatorLogika: "AND", Aktif: true,
			Keterangan: "IF Bercak konsentris melekuk (G10) AND Buah mengering jerami (G17) THEN Antraknosa / Patek (P05)",
			Premis:     []models.PremisAturan{{IDGejala: "G10"}, {IDGejala: "G17"}},
		},
		{
			ID: "R14", KesimpulanAntara: "K04", NamaAturan: "Aturan Indikasi Pembusukan Basah Jaringan", OperatorLogika: "AND", Aktif: true,
			Keterangan: "IF Buah busuk berair (G12) AND Hawar tangkai batang (G13) THEN Pembusukan Basah (K04)",
			Premis:     []models.PremisAturan{{IDGejala: "G12"}, {IDGejala: "G13"}},
		},
		{
			ID: "R15", IDPenyakit: "P06", NamaAturan: "Aturan Diagnosis Phytophthora Musim Hujan", OperatorLogika: "AND", Aktif: true,
			Keterangan: "IF Pembusukan Basah (K04) AND Bercak basah cepat melebar (G18) THEN Busuk Hawar Phytophthora (P06)",
			Premis:     []models.PremisAturan{{IDKesimpulanAntara: "K04"}, {IDGejala: "G18"}},
		},
		{
			ID: "R16", IDPenyakit: "P06", NamaAturan: "Aturan Diagnosis Busuk Phytophthora Buah", OperatorLogika: "AND", Aktif: true,
			Keterangan: "IF Buah busuk berair (G12) AND Bercak basah cepat melebar (G18) THEN Busuk Hawar Phytophthora (P06)",
			Premis:     []models.PremisAturan{{IDGejala: "G12"}, {IDGejala: "G18"}},
		},
		{
			ID: "R17", IDPenyakit: "P03", NamaAturan: "Aturan Diagnosis Layu Bakteri Mendadak", OperatorLogika: "AND", Aktif: true,
			Keterangan: "IF Daun menguning (G01) AND Layu siang hari (G06) AND Lendir bakteri (G09) THEN Layu Bakteri (P03)",
			Premis:     []models.PremisAturan{{IDGejala: "G01"}, {IDGejala: "G06"}, {IDGejala: "G09"}},
		},
		{
			ID: "R18", IDPenyakit: "P01", NamaAturan: "Aturan Diagnosis Virus Kuning Fase Pembungaan", OperatorLogika: "AND", Aktif: true,
			Keterangan: "IF Daun keriting (G02) AND Tanaman kerdil (G14) AND Bunga rontok (G16) THEN Virus Kuning (P01)",
			Premis:     []models.PremisAturan{{IDGejala: "G02"}, {IDGejala: "G14"}, {IDGejala: "G16"}},
		},
	}

	// 5. 3 Model AI
	ms.modelAIList = []models.ModelAI{
		{
			ID:          "mod-001",
			NamaModel:   "CabaiCare Leaf-Net (Penyakit Daun Cabai)",
			Versi:       "v1.2.0",
			TipeDeteksi: "daun",
			Arsitektur:  "ResNet50 / MobileNetV3 Backbone",
			DaftarKelas: []string{"Daun Sehat", "Bercak Daun Cercospora", "Virus Kuning / Keriting", "Hawar Daun Phytophthora"},
			Status:      "aktif",
			MetrikEvaluasi: map[string]interface{}{
				"akurasi_uji": 0.942,
				"precision":   0.935,
				"recall":      0.941,
				"f1_score":    0.938,
			},
			TanggalPengujian: "2026-03-15",
		},
		{
			ID:          "mod-002",
			NamaModel:   "CabaiCare Fruit-Guard (Kerusakan & Kebusukan Buah)",
			Versi:       "v1.1.0",
			TipeDeteksi: "buah",
			Arsitektur:  "EfficientNet-B0 / YOLOv8-Cls",
			DaftarKelas: []string{"Buah Sehat", "Antraknosa / Patek", "Busuk Basah Phytophthora", "Kerusakan Fisik Pascapanen"},
			Status:      "aktif",
			MetrikEvaluasi: map[string]interface{}{
				"akurasi_uji": 0.928,
				"precision":   0.919,
				"recall":      0.925,
				"f1_score":    0.922,
			},
			TanggalPengujian: "2026-03-20",
		},
		{
			ID:          "mod-003",
			NamaModel:   "CabaiCare Ripeness-AI (Tingkat Kematangan Buah)",
			Versi:       "v1.0.5",
			TipeDeteksi: "kematangan",
			Arsitektur:  "MobileNetV3 RGB & Color-Space Analyzer",
			DaftarKelas: []string{"Mentah (Hijau Penuh)", "Mulai Matang (Peralihan Oranye-Kuning)", "Matang Sempurna (Merah Cerah)", "Terlalu Matang / Layu"},
			Status:      "aktif",
			MetrikEvaluasi: map[string]interface{}{
				"akurasi_uji": 0.965,
				"precision":   0.960,
				"recall":      0.962,
				"f1_score":    0.961,
			},
			TanggalPengujian: "2026-03-22",
		},
	}

	// 6. Referensi
	ms.referensi = []models.ReferensiPengetahuan{
		{ID: 1, Judul: "Pengenalan dan Pengendalian Hama dan Penyakit Penting Tanaman Cabai", Penulis: "Sastrosiswojo, S., Hermanto, C., & Suhardi", Tahun: 2021, PenerbitJurnal: "BALITSA Kementan RI", DOIURL: "https://balitsa.litbang.pertanian.go.id"},
		{ID: 2, Judul: "Karakteristik Morfologis dan Patogenisitas Colletotrichum spp. Penyebab Antraknosa Cabai", Penulis: "Sudir, S. & Nuryanto, B.", Tahun: 2022, PenerbitJurnal: "Jurnal Fitopatologi Indonesia, 18(2), 45-56", DOIURL: "https://doi.org/10.14692/jfi.18.2.45"},
		{ID: 3, Judul: "Diagnostik dan Epidemiologi Ralstonia solanacearum pada Tanaman Solanaceae di Indonesia", Penulis: "Supriadi, M. & Sitepu, D.", Tahun: 2020, PenerbitJurnal: "Jurnal Perlindungan Tanaman Indonesia, 24(1), 12-23", DOIURL: "https://doi.org/10.22146/jpti.45123"},
	}

	// 7. Pemeriksaan demo
	now := time.Now()
	p01 := ms.penyakitList[0]
	p05 := ms.penyakitList[4]

	ms.pemeriksaan = []models.Pemeriksaan{
		{
			ID:                 "CHK-20261101-00101",
			NamaPengguna:       "Budi Santoso (Kelompok Tani Metro)",
			JenisPemeriksaan:   "gejala",
			StatusHasil:        "Teridentifikasi",
			KesimpulanDiagnosa: "Penyakit Virus Kuning (Gemini Virus / Bule)",
			IDPenyakit:         "P01",
			Penyakit:           &p01,
			CreatedAt:          now.Add(-48 * time.Hour),
		},
		{
			ID:                 "CHK-20261101-00102",
			NamaPengguna:       "Siti Aminah",
			JenisPemeriksaan:   "gejala",
			StatusHasil:        "Teridentifikasi",
			KesimpulanDiagnosa: "Antraknosa / Patek Buah Cabai",
			IDPenyakit:         "P05",
			Penyakit:           &p05,
			CreatedAt:          now.Add(-24 * time.Hour),
		},
		{
			ID:                 "CHK-20261102-00103",
			NamaPengguna:       "I Made Wira",
			JenisPemeriksaan:   "daun",
			StatusHasil:        "Teridentifikasi",
			KesimpulanDiagnosa: "Bercak Daun Cercospora",
			FotoURL:            "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80",
			HasilDeteksi: &models.HasilDeteksi{
				ModelName:       "CabaiCare Leaf-Net",
				ModelVersion:    "v1.2.0",
				KelasTerdeteksi: "Bercak Daun Cercospora",
				ConfidenceScore: 0.9450,
				IsDemoMode:      false,
			},
			CreatedAt: now.Add(-8 * time.Hour),
		},
		{
			ID:                 "CHK-20261102-00104",
			NamaPengguna:       "Ahmad Dahlan",
			JenisPemeriksaan:   "kematangan",
			StatusHasil:        "Teridentifikasi",
			KesimpulanDiagnosa: "Matang Sempurna (Merah Cerah)",
			FotoURL:            "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80",
			HasilDeteksi: &models.HasilDeteksi{
				ModelName:           "CabaiCare Ripeness-AI",
				ModelVersion:        "v1.0.5",
				KelasTerdeteksi:     "Matang Sempurna (Merah Cerah)",
				ConfidenceScore:     0.9780,
				RekomendasiTindakan: "Petik dalam rentang 1-2 hari untuk mempertahankan kesegaran dan harga jual pasar terbaik.",
			},
			CreatedAt: now.Add(-3 * time.Hour),
		},
	}
}

// Implementasi Store Interface
func (ms *MemoryStore) GetGejala() ([]models.Gejala, error) {
	ms.mu.RLock()
	defer ms.mu.RUnlock()
	res := make([]models.Gejala, len(ms.gejalaList))
	copy(res, ms.gejalaList)
	return res, nil
}

func (ms *MemoryStore) GetGejalaByID(id string) (*models.Gejala, error) {
	ms.mu.RLock()
	defer ms.mu.RUnlock()
	for _, g := range ms.gejalaList {
		if g.ID == id {
			return &g, nil
		}
	}
	return nil, fmt.Errorf("gejala %s tidak ditemukan", id)
}

func (ms *MemoryStore) CreateGejala(g models.Gejala) error {
	ms.mu.Lock()
	defer ms.mu.Unlock()
	ms.gejalaList = append(ms.gejalaList, g)
	return nil
}

func (ms *MemoryStore) UpdateGejala(g models.Gejala) error {
	ms.mu.Lock()
	defer ms.mu.Unlock()
	for i, item := range ms.gejalaList {
		if item.ID == g.ID {
			ms.gejalaList[i] = g
			return nil
		}
	}
	return fmt.Errorf("gejala %s tidak ditemukan", g.ID)
}

func (ms *MemoryStore) DeleteGejala(id string) error {
	ms.mu.Lock()
	defer ms.mu.Unlock()
	for i, item := range ms.gejalaList {
		if item.ID == id {
			ms.gejalaList = append(ms.gejalaList[:i], ms.gejalaList[i+1:]...)
			return nil
		}
	}
	return fmt.Errorf("gejala %s tidak ditemukan", id)
}

func (ms *MemoryStore) GetPenyakit() ([]models.Penyakit, error) {
	ms.mu.RLock()
	defer ms.mu.RUnlock()
	res := make([]models.Penyakit, len(ms.penyakitList))
	copy(res, ms.penyakitList)
	return res, nil
}

func (ms *MemoryStore) GetPenyakitByID(id string) (*models.Penyakit, error) {
	ms.mu.RLock()
	defer ms.mu.RUnlock()
	for _, p := range ms.penyakitList {
		if p.ID == id {
			return &p, nil
		}
	}
	return nil, fmt.Errorf("penyakit %s tidak ditemukan", id)
}

func (ms *MemoryStore) CreatePenyakit(p models.Penyakit) error {
	ms.mu.Lock()
	defer ms.mu.Unlock()
	ms.penyakitList = append(ms.penyakitList, p)
	return nil
}

func (ms *MemoryStore) UpdatePenyakit(p models.Penyakit) error {
	ms.mu.Lock()
	defer ms.mu.Unlock()
	for i, item := range ms.penyakitList {
		if item.ID == p.ID {
			ms.penyakitList[i] = p
			return nil
		}
	}
	return fmt.Errorf("penyakit %s tidak ditemukan", p.ID)
}

func (ms *MemoryStore) DeletePenyakit(id string) error {
	ms.mu.Lock()
	defer ms.mu.Unlock()
	for i, item := range ms.penyakitList {
		if item.ID == id {
			ms.penyakitList = append(ms.penyakitList[:i], ms.penyakitList[i+1:]...)
			return nil
		}
	}
	return fmt.Errorf("penyakit %s tidak ditemukan", id)
}

func (ms *MemoryStore) GetAturan() ([]models.Aturan, error) {
	ms.mu.RLock()
	defer ms.mu.RUnlock()
	res := make([]models.Aturan, len(ms.aturanList))
	copy(res, ms.aturanList)
	return res, nil
}

func (ms *MemoryStore) CreateAturan(a models.Aturan) error {
	ms.mu.Lock()
	defer ms.mu.Unlock()
	ms.aturanList = append(ms.aturanList, a)
	return nil
}

func (ms *MemoryStore) UpdateAturan(a models.Aturan) error {
	ms.mu.Lock()
	defer ms.mu.Unlock()
	for i, item := range ms.aturanList {
		if item.ID == a.ID {
			ms.aturanList[i] = a
			return nil
		}
	}
	return fmt.Errorf("aturan %s tidak ditemukan", a.ID)
}

func (ms *MemoryStore) DeleteAturan(id string) error {
	ms.mu.Lock()
	defer ms.mu.Unlock()
	for i, item := range ms.aturanList {
		if item.ID == id {
			ms.aturanList = append(ms.aturanList[:i], ms.aturanList[i+1:]...)
			return nil
		}
	}
	return fmt.Errorf("aturan %s tidak ditemukan", id)
}

func (ms *MemoryStore) GetPemeriksaan() ([]models.Pemeriksaan, error) {
	ms.mu.RLock()
	defer ms.mu.RUnlock()
	res := make([]models.Pemeriksaan, len(ms.pemeriksaan))
	// Return in reverse chronological order
	for i, item := range ms.pemeriksaan {
		res[len(ms.pemeriksaan)-1-i] = item
	}
	return res, nil
}

func (ms *MemoryStore) GetPemeriksaanByID(id string) (*models.Pemeriksaan, error) {
	ms.mu.RLock()
	defer ms.mu.RUnlock()
	for _, p := range ms.pemeriksaan {
		if p.ID == id {
			return &p, nil
		}
	}
	return nil, fmt.Errorf("pemeriksaan %s tidak ditemukan", id)
}

func (ms *MemoryStore) SavePemeriksaan(p models.Pemeriksaan) error {
	ms.mu.Lock()
	defer ms.mu.Unlock()
	ms.pemeriksaan = append(ms.pemeriksaan, p)
	return nil
}

func (ms *MemoryStore) DeletePemeriksaan(id string) error {
	ms.mu.Lock()
	defer ms.mu.Unlock()
	for i, item := range ms.pemeriksaan {
		if item.ID == id {
			ms.pemeriksaan = append(ms.pemeriksaan[:i], ms.pemeriksaan[i+1:]...)
			return nil
		}
	}
	return fmt.Errorf("pemeriksaan %s tidak ditemukan", id)
}

func (ms *MemoryStore) GetModelAI() ([]models.ModelAI, error) {
	ms.mu.RLock()
	defer ms.mu.RUnlock()
	res := make([]models.ModelAI, len(ms.modelAIList))
	copy(res, ms.modelAIList)
	return res, nil
}

func (ms *MemoryStore) GetReferensi() ([]models.ReferensiPengetahuan, error) {
	ms.mu.RLock()
	defer ms.mu.RUnlock()
	res := make([]models.ReferensiPengetahuan, len(ms.referensi))
	copy(res, ms.referensi)
	return res, nil
}

func (ms *MemoryStore) VerifyAdmin(email, password string) bool {
	ms.mu.RLock()
	defer ms.mu.RUnlock()

	expectedHash, exists := ms.adminUsers[email]
	if !exists {
		return false
	}

	hasher := sha256.New()
	hasher.Write([]byte(password))
	inputHash := hex.EncodeToString(hasher.Sum(nil))

	return expectedHash == inputHash
}

