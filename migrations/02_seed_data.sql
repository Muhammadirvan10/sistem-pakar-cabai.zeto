-- ================================================================
-- CABAI CARE SEED DATA (DATA AWAL BASIS PENGETAHUAN & DEMONSTRASI)
-- Catatan Etika & Validasi: Data demonstrasi awal ini disusun dari
-- literatur fitopatologi tanaman cabai (Balai Penelitian Tanaman Sayuran,
-- Kementan RI). Untuk penerapan komersial, konfigurasi dapat diperbarui
-- oleh pakar agronomi melalui Dashboard Admin.
-- ================================================================

-- 1. SEED USER ADMINISTRATOR
-- Password plain: AdminCabaiCare2026!
-- Hash SHA-256 / bcrypt standard
INSERT INTO users (id, email, nama_lengkap, password_hash, role)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'admin@cabaicare.id',
    'Administrator Utama CabaiCare',
    'e7cf3ef4f17c3999a94f2c6f612e8a888e5b1026878e4e19398b23bd38ec221a', -- SHA256 of AdminCabaiCare2026!
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- 2. SEED REFERENSI PENGETAHUAN
INSERT INTO referensi_pengetahuan (id, judul, penulis, tahun, penerbit_jurnal, doi_url, keterangan)
VALUES
(1, 'Pengenalan dan Pengendalian Hama dan Penyakit Penting Tanaman Cabai', 'Sastrosiswojo, S., Hermanto, C., & Suhardi', 2021, 'Balai Penelitian Tanaman Sayuran (BALITSA) Kementan RI', 'https://balitsa.litbang.pertanian.go.id', 'Panduan teknis identifikasi patogen antraknosa, layu fusarium, dan virus gemini.'),
(2, 'Karakteristik Morfologis dan Patogenisitas Colletotrichum spp. Penyebab Antraknosa Cabai', 'Sudir, S. & Nuryanto, B.', 2022, 'Jurnal Fitopatologi Indonesia, 18(2), 45-56', 'https://doi.org/10.14692/jfi.18.2.45', 'Kajian lesi nekrosis melingkar dan sporulasi jingga pada buah cabai.'),
(3, 'Diagnostik dan Epidemiologi Ralstonia solanacearum pada Tanaman Solanaceae di Indonesia', 'Supriadi, M. & Sitepu, D.', 2020, 'Jurnal Perlindungan Tanaman Indonesia, 24(1), 12-23', 'https://doi.org/10.22146/jpti.45123', 'Metode uji lendir bakteri (bacterial streaming test) pada potongan batang cabai.'),
(4, 'Deep Learning for Chili Leaf Disease Classification Using Convolutional Neural Networks', 'Rahman, A., Arifin, Z., & Pratama, F.', 2023, 'International Journal of Agricultural Technology, 19(4), 1621-1634', 'https://doi.org/10.1016/j.ijat.2023.05.011', 'Dataset dan akurasi model MobileNet/ResNet pada daun cabai.')
ON CONFLICT (id) DO NOTHING;

-- 3. SEED PENYAKIT (7 Diagnosis Penyakit / Gangguan Utama)
INSERT INTO penyakit (id, nama_penyakit, nama_ilmiah, kategori, deskripsi, penyebab, gejala_umum, penanganan_organik, penanganan_kimia, pencegahan, tingkat_bahaya, gambar_url)
VALUES
(
    'P01',
    'Penyakit Virus Kuning (Gemini Virus / Bule)',
    'Pepper Yellow Leaf Curl Virus (PYLCV)',
    'virus',
    'Penyakit sistemik berbahaya yang menyebabkan klorosis menyeluruh pada helai daun, daun mengecil melengkung ke atas, dan tanaman kerdil gagal berbuah optimal.',
    'Virus Gemini yang ditularkan secara persisten oleh vektor kutu kebul (Bemisia tabaci).',
    'Daun menguning cerah, helai daun keriting/menggulung ke atas, tulang daun menebal, tanaman kerdil bila terserang sejak fase vegetatif.',
    'Aplikasi semprotan minyak nimba (neem oil) atau ekstrak daun tembakau dan gadung untuk mengusir vektor kutu kebul. Pasang perangkap likat kuning (yellow sticky trap) 40 buah/ha.',
    'Penyemprotan insektisida sistemik berbahan aktif imidakloprid, tiametoksam, atau abamektin untuk mengendalikan populasi kutu kebul.',
    'Gunakan benih cabai toleran/resisten virus, sanitasi gulma inang di sekitar bedengan, dan pasang mulsa plastik perak untuk memantulkan sinar matahari.',
    'Sangat Tinggi',
    'https://images.unsplash.com/photo-1592417817098-8f3d6ef23f83?auto=format&fit=crop&w=600&q=80'
),
(
    'P02',
    'Bercak Daun Cercospora (Mata Katak)',
    'Cercospora capsici Heald & F.A. Wolf',
    'jamur',
    'Penyakit jamur daun yang menimbulkan lesi melingkar dengan titik pusat berwarna putih kelabu atau abu-abu mirip mata katak.',
    'Jamur Cercospora capsici yang berkembang pesat pada kelembapan tinggi di atas 85% dan suhu hangat 25-30°C.',
    'Bercak bulat kecil pada daun dengan tepi gelap kemerahan dan pusat abu-abu/putih. Daun parah menguning dan rontok prematur.',
    'Penyemprotan bio-fungisida Trichoderma harzianum atau ekstrak sirih merah. Perempelan daun tua yang terinfeksi dan bakar agar tidak menular.',
    'Fungisida kontak berbahan aktif mankozeb, klorotalonil, atau fungisida sistemik berbahan aktif difenokonazol sesuai dosis anjuran.',
    'Atur jarak tanam ideal (60 x 70 cm) untuk sirkulasi udara baik, hindari penyiraman tabur langsung ke kanopi daun pada sore hari.',
    'Sedang',
    'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80'
),
(
    'P03',
    'Layu Bakteri',
    'Ralstonia solanacearum',
    'bakteri',
    'Penyakit vaskular mematikan yang menyebabkan tanaman cabai layu sangat mendadak saat siang hari dan mati dalam waktu 3-5 hari dalam kondisi daun masih hijau.',
    'Bakteri tular tanah Ralstonia solanacearum yang menginfeksi sistem pembuluh xilem melalui luka perakaran.',
    'Layu mendadak daun atas pada siang hari, pulih sejenak malam hari, lalu layu permanen. Berkas pembuluh batang cokelat. Potongan batang keluar lendir putih keruh saat direndam air.',
    'Pemberian agens hayati Bacillus subtilis atau Pseudomonas fluorescens sejak persemaian. Cabut dan bakar tanaman terinfeksi beserta tanah di sekitarnya.',
    'Bakterisida berbahan aktif tembaga hidroksida atau asam oksolinik melalui kocor pangkal batang secara terukur.',
    'Rotasi tanaman bukan famili Solanaceae (seperti jagung/padi), perbaiki drainase lahan agar tidak tergenang, dan sterilisasi alat tani.',
    'Sangat Tinggi',
    'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80'
),
(
    'P04',
    'Layu Fusarium',
    'Fusarium oxysporum f. sp. capsici',
    'jamur',
    'Penyakit tular tanah yang menyebabkan kelayuan progresif bertahap dimulai dari daun bagian bawah menguning, menjalar ke atas hingga tanaman mati kekeringan.',
    'Jamur tanah Fusarium oxysporum yang memproduksi mikotoksin dan menyumbat saluran xilem.',
    'Kelayuan bertahap dimulai dari daun bagian bawah menguning, tulang daun pucat, batang bawah berwarna cokelat pada berkas xilem tanpa keluarnya lendir bakteri.',
    'Inokulasi bibit dengan agens antagonis Trichoderma viride atau Gliocladium sp. sebelum tanam. Tambahkan kompos matang kaya silika.',
    'Kocor fungisida bahan aktif benomil, propineb, atau karbendazim pada lubang tanam di sekitar perakaran.',
    'Hindari luka akar saat penyiangan, buat guludan tinggi, dan berikan kapur pertanian (dolomit) untuk menaikkan pH tanah menjadi 6.5 - 7.0.',
    'Tinggi',
    'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=600&q=80'
),
(
    'P05',
    'Antraknosa / Patek Buah Cabai',
    'Colletotrichum capsici / C. gloeosporioides',
    'jamur',
    'Penyakit nomor satu perusak buah cabai. Menyebabkan bercak nekrotik melekuk melingkar (konsentris) dan buah membusuk keriput seperti jerami terbakar.',
    'Jamur patogen Colletotrichum spp. yang spora-nya menyebar cepat lewat percikan air hujan dan angin kencang.',
    'Bercak cekung melingkar kehitaman pada kulit buah, terbentuk lingkaran massa spora berwarna oranye/pink, buah busuk kering dan gugur atau mengering di tangkai.',
    'Sanitasi buah rontok bergejala, semprot ekstrak rimpang kunyit dan lengkuas, serta perbanyak agens jamur antagonis Beauveria bassiana.',
    'Fungisida sistemik kombinasi kontak berbahan aktif azoksistrobin + difenokonazol, atau propineb disemprot merata pada buah.',
    'Petik segera buah yang baru menunjukkan gejala awal agar tidak menyebarkan spora ke buah sehat, gunakan mulsa plastik perak.',
    'Sangat Tinggi',
    'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80'
),
(
    'P06',
    'Busuk Buah & Hawar Daun Phytophthora',
    'Phytophthora capsici Leonian',
    'jamur',
    'Penyakit oomycetes destruktif yang menyerang seluruh bagian tanaman: buah membusuk basah kecokelatan, daun mengalami bercak basah cepat melebar.',
    'Oomycota Phytophthora capsici yang sporanya berenang aktif dalam air tanah/hujan yang tergenang.',
    'Buah membusuk basah berair dari ujung atau pangkal, tertutup miselium putih halus seperti kapas saat lembap. Daun mengalami bercak hawar basah kecokelatan.',
    'Aplikasi Trichoderma sp. pada lubang tanam dan kompos. Mengatur bedengan dengan parit dalam agar air hujan cepat mengalir tuntas.',
    'Fungisida berbahan aktif simoksanil, dimetomorf, atau metalaksil + mankozeb secara teratur saat musim hujan tiba.',
    'Jangan menanam cabai pada lahan bekas tanaman inang terinfeksi sebelumnya, hindari kelembapan tanah jenuh terus-menerus.',
    'Tinggi',
    'https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?auto=format&fit=crop&w=600&q=80'
),
(
    'P07',
    'Serangan Hama Thrips & Tungau Cabai',
    'Thrips parvispinus / Polyphagotarsonemus latus',
    'hama',
    'Serangan serangga penghisap cairan sel daun muda yang menyebabkan permukaan bawah daun berkilau keperakan, daun melengkung ke atas, dan pucuk kaku.',
    'Hama Thrips dan tungau kuning/merah yang berkembang cepat pada cuaca kering dan panas.',
    'Permukaan bawah daun mengkilap seperti tembaga/perak, tepi daun menggulung ke atas seperti perahu, tunas pucuk mengkerut dan kaku, bunga mudah gugur.',
    'Semprot pestisida nabati rebusan tembakau, daun mimba, dan sabun kalium lunak. Pasang perangkap biru (blue sticky trap).',
    'Insektisida/akarisida berbahan aktif abamektin, spinetoram, atau piridaben rotasi berkala.',
    'Jaga kelembapan mikro pertanaman, lakukan irigasi kabut (sprinkler) ringan untuk membilas koloni hama dari bawah daun.',
    'Sedang',
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80'
)
ON CONFLICT (id) DO UPDATE SET
    nama_penyakit = EXCLUDED.nama_penyakit,
    deskripsi = EXCLUDED.deskripsi,
    penyebab = EXCLUDED.penyebab,
    gejala_umum = EXCLUDED.gejala_umum,
    penanganan_organik = EXCLUDED.penanganan_organik,
    penanganan_kimia = EXCLUDED.penanganan_kimia,
    pencegahan = EXCLUDED.pencegahan;

-- 4. SEED GEJALA (18 Fakta Masukan Gejala Sistem Pakar)
INSERT INTO gejala (id, nama_gejala, deskripsi, bagian_tanaman, bobot_pakar)
VALUES
('G01', 'Daun menguning secara menyeluruh atau klorosis bercak', 'Warna helai daun berubah dari hijau segar menjadi kuning pucat atau kuning cerah.', 'daun', 1.00),
('G02', 'Daun menggulung ke atas / keriting dan mengkerut', 'Bentuk helai daun tidak rata, melengkung ke atas membentuk sendok atau keriting kaku.', 'daun', 1.00),
('G03', 'Terdapat kutu kebul (serangga putih kecil) di balik daun', 'Adanya serangga vektor putih kecil yang beterbangan saat tanaman digoyang.', 'daun', 0.90),
('G04', 'Bercak bulat kecil cokelat dengan tepi gelap dan pusat abu-abu ("mata katak")', 'Lesi berbentuk bulat kecil diameter 2-5 mm dengan tepi cokelat gelap dan pusat abu-abu/putih.', 'daun', 1.00),
('G05', 'Daun berlubang atau mengering dan gugur prematur', 'Bercak pada daun rontok meninggalkan lubang, daun menguning lalu gugur banyak.', 'daun', 0.85),
('G06', 'Tanaman layu mendadak di siang hari, segar kembali sore/malam', 'Kondisi daun terkulai lemas saat terik matahari namun tidak langsung mati mengering di hari pertama.', 'seluruh_tanaman', 1.00),
('G07', 'Layu permanen bertahap dari daun bawah menjalar ke atas', 'Kelayuan dimulai dari daun tua terbawah menguning perlahan naik ke pucuk.', 'seluruh_tanaman', 1.00),
('G08', 'Berkas pembuluh xilem pangkal batang berwarna cokelat kehitaman', 'Saat kulit batang bawah disayat membujur, jaringan pembuluh di dalamnya tampak kecokelatan.', 'batang', 1.00),
('G09', 'Keluar lendir bakteri putih keruh saat potongan batang direndam air', 'Uji celup potongan batang di gelas air bening mengeluarkan untaian cairan putih keruh (ooze).', 'batang', 1.00),
('G10', 'Bercak konsentris melekuk cekung berwarna cokelat tua pada buah', 'Lesi bundar melekuk ke dalam dengan garis lingkaran teratur pada kulit buah cabai.', 'buah', 1.00),
('G11', 'Terbentuk massa spora berwarna oranye atau merah muda di tengah lesi buah', 'Di bagian tengah bercak cekung buah cabai tampak titik-titik lender spora jamur berwarna jingga.', 'buah', 0.95),
('G12', 'Buah cabai membusuk basah dan berair dari ujung atau tangkai', 'Daging buah lembek berair (water-soaked) dan mudah lepas dari tangkainya.', 'buah', 1.00),
('G13', 'Bercak cokelat kebasahan pada batang atau tangkai buah (hawar)', 'Bagian cabang, ranting, atau tangkai buah menghitam basah dan rapuh patah.', 'batang', 0.90),
('G14', 'Pertumbuhan tanaman terhambat kerdil (stunting)', 'Tinggi tanaman jauh lebih pendek dibanding usia normal tanaman sehat.', 'seluruh_tanaman', 0.85),
('G15', 'Permukaan bawah daun berwarna perak mengkilap atau kecokelatan', 'Gejala garukan serangga thrips yang menyisakan lapisan kutikula mengkilap di sisi bawah daun.', 'daun', 0.95),
('G16', 'Bunga mudah rontok sebelum berhasil menjadi buah', 'Kuncup bunga layu mengering dan gugur dalam jumlah banyak.', 'seluruh_tanaman', 0.80),
('G17', 'Buah mengkerut mengering seperti jerami terbakar (mummified)', 'Buah cabai tidak jatuh melainkan mengering keriput menggantung di dahan.', 'buah', 0.90),
('G18', 'Bercak basah cokelat tua menyebar sangat cepat saat hujan lembab', 'Penyebaran gejala nekrotik yang luar biasa cepat ketika cuaca berkabut atau hujan lebat.', 'daun', 0.90)
ON CONFLICT (id) DO UPDATE SET
    nama_gejala = EXCLUDED.nama_gejala,
    deskripsi = EXCLUDED.deskripsi,
    bagian_tanaman = EXCLUDED.bagian_tanaman;

-- 5. SEED ATURAN PRODUKSI (18 Aturan IF-THEN Forward Chaining)
-- Kesimpulan Antara:
-- K01: Kondisi Klorosis & Malformasi Daun
-- K02: Kondisi Gangguan Vaskular Sistemik
-- K03: Kondisi Nekrosis Buah & Lesi Cekung
-- K04: Kondisi Pembusukan Basah Phytophthora

INSERT INTO aturan (id, id_penyakit, kesimpulan_antara, nama_aturan, operator_logika, keterangan, aktif)
VALUES
('R01', NULL, 'K01', 'Aturan Indikasi Malformasi Daun', 'AND', 'IF Daun menguning (G01) AND Daun keriting (G02) THEN Klorosis & Malformasi Daun (K01)', TRUE),
('R02', 'P01', NULL, 'Aturan Diagnosis Virus Kuning Lanjutan', 'AND', 'IF Klorosis Malformasi (K01) AND Kutu Kebul (G03) AND Tanaman Kerdil (G14) THEN Virus Kuning (P01)', TRUE),
('R03', 'P07', NULL, 'Aturan Diagnosis Serangan Hama Thrips', 'AND', 'IF Daun menguning (G01) AND Daun keriting (G02) AND Sisi bawah perak (G15) THEN Hama Thrips/Tungau (P07)', TRUE),
('R04', 'P02', NULL, 'Aturan Diagnosis Bercak Mata Katak Standar', 'AND', 'IF Bercak mata katak (G04) AND Daun rontok berlubang (G05) THEN Bercak Daun Cercospora (P02)', TRUE),
('R05', 'P02', NULL, 'Aturan Diagnosis Cercospora Cuaca Lembab', 'AND', 'IF Bercak mata katak (G04) AND Bercak basah cepat saat lembab (G18) THEN Bercak Daun Cercospora (P02)', TRUE),
('R06', NULL, 'K02', 'Aturan Indikasi Gangguan Pembuluh Vaskular Akut', 'AND', 'IF Layu siang hari segar sore (G06) AND Berkas pembuluh cokelat (G08) THEN Gangguan Vaskular (K02)', TRUE),
('R07', 'P03', NULL, 'Aturan Diagnosis Pasti Layu Bakteri', 'AND', 'IF Gangguan Vaskular (K02) AND Lendir bakteri keluar (G09) THEN Layu Bakteri (P03)', TRUE),
('R08', NULL, 'K02', 'Aturan Indikasi Gangguan Pembuluh Bertahap', 'AND', 'IF Layu permanen bawah ke atas (G07) AND Berkas pembuluh cokelat (G08) THEN Gangguan Vaskular (K02)', TRUE),
('R09', 'P04', NULL, 'Aturan Diagnosis Layu Fusarium Tanpa Ooze', 'AND', 'IF Gangguan Vaskular (K02) AND NOT Lendir bakteri (G09) THEN Layu Fusarium (P04)', TRUE),
('R10', 'P04', NULL, 'Aturan Diagnosis Layu Fusarium Klasik', 'AND', 'IF Layu bertahap (G07) AND Pembuluh cokelat (G08) AND Tanaman kerdil (G14) THEN Layu Fusarium (P04)', TRUE),
('R11', NULL, 'K03', 'Aturan Indikasi Lesi Nekrotik Buah', 'AND', 'IF Bercak konsentris melekuk (G10) AND Massa spora oranye (G11) THEN Nekrosis Buah Cekung (K03)', TRUE),
('R12', 'P05', NULL, 'Aturan Diagnosis Antraknosa Buah Lengkap', 'AND', 'IF Nekrosis Buah Cekung (K03) AND Buah mengering jerami (G17) THEN Antraknosa / Patek (P05)', TRUE),
('R13', 'P05', NULL, 'Aturan Diagnosis Antraknosa Buah Lapangan', 'AND', 'IF Bercak konsentris melekuk (G10) AND Buah mengering jerami (G17) THEN Antraknosa / Patek (P05)', TRUE),
('R14', NULL, 'K04', 'Aturan Indikasi Pembusukan Basah Jaringan', 'AND', 'IF Buah busuk berair (G12) AND Hawar tangkai batang (G13) THEN Pembusukan Basah (K04)', TRUE),
('R15', 'P06', NULL, 'Aturan Diagnosis Phytophthora Musim Hujan', 'AND', 'IF Pembusukan Basah (K04) AND Bercak basah cepat melebar (G18) THEN Busuk Hawar Phytophthora (P06)', TRUE),
('R16', 'P06', NULL, 'Aturan Diagnosis Busuk Phytophthora Buah', 'AND', 'IF Buah busuk berair (G12) AND Bercak basah cepat melebar (G18) THEN Busuk Hawar Phytophthora (P06)', TRUE),
('R17', 'P03', NULL, 'Aturan Diagnosis Layu Bakteri Mendadak', 'AND', 'IF Daun menguning (G01) AND Layu siang hari (G06) AND Lendir bakteri (G09) THEN Layu Bakteri (P03)', TRUE),
('R18', 'P01', NULL, 'Aturan Diagnosis Virus Kuning Fase Pembungaan', 'AND', 'IF Daun keriting (G02) AND Tanaman kerdil (G14) AND Bunga rontok (G16) THEN Virus Kuning (P01)', TRUE)
ON CONFLICT (id) DO UPDATE SET
    id_penyakit = EXCLUDED.id_penyakit,
    kesimpulan_antara = EXCLUDED.kesimpulan_antara,
    nama_aturan = EXCLUDED.nama_aturan,
    operator_logika = EXCLUDED.operator_logika;

-- 6. SEED PREMIS ATURAN_GEJALA (Pemetaan Gejala / Kesimpulan Antara per Aturan)
DELETE FROM aturan_gejala;

-- R01: G01, G02
INSERT INTO aturan_gejala (id_aturan, id_gejala, id_kesimpulan_antara, is_negasi) VALUES
('R01', 'G01', NULL, FALSE),
('R01', 'G02', NULL, FALSE);

-- R02: K01, G03, G14
INSERT INTO aturan_gejala (id_aturan, id_gejala, id_kesimpulan_antara, is_negasi) VALUES
('R02', NULL, 'K01', FALSE),
('R02', 'G03', NULL, FALSE),
('R02', 'G14', NULL, FALSE);

-- R03: G01, G02, G15
INSERT INTO aturan_gejala (id_aturan, id_gejala, id_kesimpulan_antara, is_negasi) VALUES
('R03', 'G01', NULL, FALSE),
('R03', 'G02', NULL, FALSE),
('R03', 'G15', NULL, FALSE);

-- R04: G04, G05
INSERT INTO aturan_gejala (id_aturan, id_gejala, id_kesimpulan_antara, is_negasi) VALUES
('R04', 'G04', NULL, FALSE),
('R04', 'G05', NULL, FALSE);

-- R05: G04, G18
INSERT INTO aturan_gejala (id_aturan, id_gejala, id_kesimpulan_antara, is_negasi) VALUES
('R05', 'G04', NULL, FALSE),
('R05', 'G18', NULL, FALSE);

-- R06: G06, G08
INSERT INTO aturan_gejala (id_aturan, id_gejala, id_kesimpulan_antara, is_negasi) VALUES
('R06', 'G06', NULL, FALSE),
('R06', 'G08', NULL, FALSE);

-- R07: K02, G09
INSERT INTO aturan_gejala (id_aturan, id_gejala, id_kesimpulan_antara, is_negasi) VALUES
('R07', NULL, 'K02', FALSE),
('R07', 'G09', NULL, FALSE);

-- R08: G07, G08
INSERT INTO aturan_gejala (id_aturan, id_gejala, id_kesimpulan_antara, is_negasi) VALUES
('R08', 'G07', NULL, FALSE),
('R08', 'G08', NULL, FALSE);

-- R09: K02, NOT G09
INSERT INTO aturan_gejala (id_aturan, id_gejala, id_kesimpulan_antara, is_negasi) VALUES
('R09', NULL, 'K02', FALSE),
('R09', 'G09', NULL, TRUE);

-- R10: G07, G08, G14
INSERT INTO aturan_gejala (id_aturan, id_gejala, id_kesimpulan_antara, is_negasi) VALUES
('R10', 'G07', NULL, FALSE),
('R10', 'G08', NULL, FALSE),
('R10', 'G14', NULL, FALSE);

-- R11: G10, G11
INSERT INTO aturan_gejala (id_aturan, id_gejala, id_kesimpulan_antara, is_negasi) VALUES
('R11', 'G10', NULL, FALSE),
('R11', 'G11', NULL, FALSE);

-- R12: K03, G17
INSERT INTO aturan_gejala (id_aturan, id_gejala, id_kesimpulan_antara, is_negasi) VALUES
('R12', NULL, 'K03', FALSE),
('R12', 'G17', NULL, FALSE);

-- R13: G10, G17
INSERT INTO aturan_gejala (id_aturan, id_gejala, id_kesimpulan_antara, is_negasi) VALUES
('R13', 'G10', NULL, FALSE),
('R13', 'G17', NULL, FALSE);

-- R14: G12, G13
INSERT INTO aturan_gejala (id_aturan, id_gejala, id_kesimpulan_antara, is_negasi) VALUES
('R14', 'G12', NULL, FALSE),
('R14', 'G13', NULL, FALSE);

-- R15: K04, G18
INSERT INTO aturan_gejala (id_aturan, id_gejala, id_kesimpulan_antara, is_negasi) VALUES
('R15', NULL, 'K04', FALSE),
('R15', 'G18', NULL, FALSE);

-- R16: G12, G18
INSERT INTO aturan_gejala (id_aturan, id_gejala, id_kesimpulan_antara, is_negasi) VALUES
('R16', 'G12', NULL, FALSE),
('R16', 'G18', NULL, FALSE);

-- R17: G01, G06, G09
INSERT INTO aturan_gejala (id_aturan, id_gejala, id_kesimpulan_antara, is_negasi) VALUES
('R17', 'G01', NULL, FALSE),
('R17', 'G06', NULL, FALSE),
('R17', 'G09', NULL, FALSE);

-- R18: G02, G14, G16
INSERT INTO aturan_gejala (id_aturan, id_gejala, id_kesimpulan_antara, is_negasi) VALUES
('R18', 'G02', NULL, FALSE),
('R18', 'G14', NULL, FALSE),
('R18', 'G16', NULL, FALSE);

-- 7. SEED MODEL AI COMPUTER VISION (3 Konfigurasi Model)
INSERT INTO model_ai (id, nama_model, versi, tipe_deteksi, arsitektur, daftar_kelas, metrik_evaluasi, status, tanggal_pengujian)
VALUES
(
    'b0000000-0000-0000-0000-000000000001',
    'CabaiCare Leaf-Net (Penyakit Daun Cabai)',
    'v1.2.0',
    'daun',
    'ResNet50 / MobileNetV3 Backbone',
    '["Daun Sehat", "Bercak Daun Cercospora", "Virus Kuning / Keriting", "Hawar Daun Phytophthora"]'::jsonb,
    '{"akurasi_uji": 0.942, "precision": 0.935, "recall": 0.941, "f1_score": 0.938}'::jsonb,
    'aktif',
    '2026-03-15'
),
(
    'b0000000-0000-0000-0000-000000000002',
    'CabaiCare Fruit-Guard (Kerusakan & Kebusukan Buah)',
    'v1.1.0',
    'buah',
    'EfficientNet-B0 / YOLOv8-Cls',
    '["Buah Sehat", "Antraknosa / Patek", "Busuk Basah Phytophthora", "Kerusakan Fisik Pascapanen"]'::jsonb,
    '{"akurasi_uji": 0.928, "precision": 0.919, "recall": 0.925, "f1_score": 0.922}'::jsonb,
    'aktif',
    '2026-03-20'
),
(
    'b0000000-0000-0000-0000-000000000003',
    'CabaiCare Ripeness-AI (Tingkat Kematangan Buah)',
    'v1.0.5',
    'kematangan',
    'MobileNetV3 RGB & Color-Space Analyzer',
    '["Mentah (Hijau Penuh)", "Mulai Matang (Peralihan Oranye-Kuning)", "Matang Sempurna (Merah Cerah)", "Terlalu Matang / Layu"]'::jsonb,
    '{"akurasi_uji": 0.965, "precision": 0.960, "recall": 0.962, "f1_score": 0.961}'::jsonb,
    'aktif',
    '2026-03-22'
)
ON CONFLICT (id) DO NOTHING;

-- 8. SEED DATA RIWAYAT PEMERIKSAAN AWAL (Untuk Visualisasi Grafik & Demonstrasi)
INSERT INTO pemeriksaan (id, nama_pengguna, jenis_pemeriksaan, status_hasil, kesimpulan_diagnosa, id_penyakit, jejak_inferensi, foto_url, created_at)
VALUES
(
    'CHK-20261101-00101',
    'Budi Santoso (Kelompok Tani Metro)',
    'gejala',
    'Teridentifikasi',
    'Berdasarkan pelacakan Forward Chaining, teridentifikasi Penyakit Virus Kuning (Gemini Virus / Bule) dengan dukungan 3 fakta awal dan 1 fakta antara.',
    'P01',
    '{"iterasi_berjalan": 2, "aturan_terpilih": ["R01", "R02"], "kesimpulan_antara": ["K01"], "fakta_awal": ["G01", "G02", "G03", "G14"]}'::jsonb,
    NULL,
    NOW() - INTERVAL '2 days'
),
(
    'CHK-20261101-00102',
    'Siti Aminah',
    'gejala',
    'Teridentifikasi',
    'Teridentifikasi Penyakit Antraknosa / Patek Buah melalui pemenuhan aturan R11 dan R12.',
    'P05',
    '{"iterasi_berjalan": 2, "aturan_terpilih": ["R11", "R12"], "kesimpulan_antara": ["K03"], "fakta_awal": ["G10", "G11", "G17"]}'::jsonb,
    NULL,
    NOW() - INTERVAL '1 day'
),
(
    'CHK-20261102-00103',
    'I Made Wira',
    'daun',
    'Teridentifikasi',
    'Deteksi citra daun mendeteksi bercak daun Cercospora dengan keyakinan visual terverifikasi.',
    'P02',
    '{"model": "CabaiCare Leaf-Net v1.2.0", "waktu_ms": 142}'::jsonb,
    'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80',
    NOW() - INTERVAL '8 hours'
),
(
    'CHK-20261102-00104',
    'Ahmad Dahlan',
    'kematangan',
    'Teridentifikasi',
    'Klasifikasi tingkat kematangan mendeteksi cabai berada pada fase Matang Sempurna (Merah Cerah). Siap dipanen.',
    NULL,
    '{"model": "CabaiCare Ripeness-AI v1.0.5", "rekomendasi": "Panen dalam 1-2 hari untuk menjaga bobot segar dan kesegaran pasar."}'::jsonb,
    'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80',
    NOW() - INTERVAL '3 hours'
)
ON CONFLICT (id) DO NOTHING;

