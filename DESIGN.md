# Dokumen Desain Website (Design Specification)
## Proyek: Website Landing Page Sogogi Shabu & Grill Buaran

Dokumen ini berisi panduan desain lengkap, struktur website, sistem visual, serta materi *copywriting* untuk pembuatan website **Sogogi Shabu & Grill Buaran**. Dokumen ini dirancang sebagai acuan bagi UI/UX Designer, Web Developer, dan Content Creator.

---

## 1. Ringkasan Proyek & Tujuan

* **Nama Bisnis:** Sogogi Shabu & Grill Buaran
* **Kategori:** Restoran All You Can Eat (AYCE) Korea
* **Tipe Website:** Landing Page Berhalaman Tunggal (*Single-Page Website*)
* **Tujuan Utama:** * Membangun kehadiran digital yang profesional dan menarik bagi cabang Buaran.
    * Menonjolkan nilai jual utama: AYCE murah meriah (cocok untuk mahasiswa) dengan tempat yang luas dan adem.
    * Memudahkan calon pelanggan menemukan lokasi, melihat menu, dan melakukan reservasi langsung guna menghindari antrean panjang.

---

## 2. Analisis Target Audiens (Target Audience)

1.  **Mahasiswa & Pelajar (Primary):**
    * *Karakteristik:* Berusia 17–25 tahun, tinggal atau berkuliah di sekitar area Duren Sawit / Jakarta Timur, mencari tempat nongkrong kelompok dengan budget terbatas.
    * *Kebutuhan:* Info harga paket yang transparan, promo, dan penegasan bahwa tempatnya ramah di kantong ("budget anak kampus").
2.  **Keluarga & Pekerja Muda (Secondary):**
    * *Karakteristik:* Berusia 25–45 tahun, mencari tempat makan bersama keluarga atau rekan kerja yang nyaman, adem, dan tidak berhimpitan.
    * *Kebutuhan:* Informasi kenyamanan tempat (AC, jarak antar meja luas), variasi menu, serta kemudahan reservasi.

---

## 3. Arsitektur Informasi (Sitemap)

Website menggunakan struktur *Single-Page Landing Page* dengan menu navigasi *scroll-to-section*:

* **Header / Navigation Bar**
    * Logo Sogogi Buaran
    * Link Navigasi: Home | Keunggulan | Menu | Testimoni | Kontak
    * Tombol CTA Utama: "Booking Tempat"
* **Section 1: Hero Section** (Daya tarik visual pertama)
* **Section 2: Brand Perks / Keunggulan** (Kenapa harus makan di cabang Buaran?)
* **Section 3: Menu Highlights** (Daftar menu populer beserta harga)
* **Section 4: Social Proof / Testimoni** (Ulasan positif dari pelanggan)
* **Section 5: Gallery & Suasana** (Visualisasi area makan yang luas dan ber-AC)
* **Section 6: Footer / Contact & Location** (Alamat, Jam Buka, Google Maps, Kontak)

---

## 4. Panduan Desain Visual (Design System)

### 4.1. Palet Warna (Color Palette)
Warna yang dipilih mengombinasikan elemen kuliner Korea yang berenergi dengan kenyamanan tempat makan modern.

| Kegunaan | Kode Warna (Hex) | Kesan / Representasi |
| :--- | :--- | :--- |
| **Primary (Aksen Utama)** | `#D90429` (Crimson Red) | Membangkitkan selera makan, identitas resto Korea/daging. |
| **Secondary (Aksen Pendukung)**| `#F4A261` (Warm Amber) | Representasi panggangan (*grill*), kehangatan, dan energi muda. |
| **Background (Utama)** | `#FAFAFA` (Off-White) | Bersih, luas, membuat elemen konten dan foto makanan lebih menonjol. |
| **Background (Sekunder)** | `#F1FAEE` (Mint Soft) | Memberikan kesan sejuk/adem (menyeimbangkan kesan panggangan panas). |
| **Text (Utama)** | `#2B2D42` (Dark Slate) | Keterbacaan teks (*readability*) yang sangat tinggi dan profesional. |

### 4.2. Tipografi (Typography)
* **Heading Font (Judul Besar):** `Poppins` atau `Montserrat` (Sans-serif, Bold/Extra Bold)
    * *Alasan:* Modern, kasual, tegas, dan sangat disukai oleh audiens muda.
* **Body Font (Teks Deskripsi):** `Inter` atau `Roboto` (Sans-serif, Regular/Medium)
    * *Alasan:* Tingkat keterbacaan yang tinggi di layar *smartphone* maupun desktop saat membaca detail menu.

### 4.3. Elemen Grafis & UI Style
* **Tombol (Buttons):** Sudut melengkung (*rounded corners* sekitar 8px–12px) untuk memberikan kesan ramah (*friendly*). Gunakan efek *hover shadow* lembut.
* **Kartu Menu (Cards):** Desain minimalis dengan *border* tipis abu-abu atau bayangan (*drop shadow*) sangat tipis untuk memisahkan menu reguler dan premium.
* **Spasi (Whitespace):** Berikan jarak antar-elemen yang cukup luas (minimal 60px–80px per *section*) untuk merepresentasikan keunggulan fisik restoran yang "jarak antar mejanya luas dan adem".

---

## 5. Kerangka Konten & Copywriting (Bahasa Indonesia)

### 5.1. Header / Navbar
* **Teks Navigasi:** Home | Kenapa Kami | Menu Andalan | Kata Mereka | Lokasi
* **CTA Button:** Hubungi Kami

### 5.2. Hero Section
* **Visual:** Foto beresolusi tinggi kombinasi daging shabu yang dicelup ke kuah mendidih dan daging grill yang sedang dipanggang, dengan asap tipis yang menggugah selera.
* **Headline:** "Makan Puas Tanpa Cemas di Sogogi Buaran!"
* **Sub-headline:** "Nikmati sensasi All You Can Eat Shabu & Grill otentik Korea sepuasnya. Harga ramah di kantong mahasiswa, tempat luas, adem, dan super nyaman untuk momen kebersamaanmu."
* **CTA Button:** Lihat Menu Paket (Scroll ke Section Menu)

### 5.3. Brand Perks / Keunggulan Section
Format menggunakan 3 kolom ikon interaktif:
1.  **Ikon Dompet / Mahasiswa:** * *Judul:* Budget Anak Kampus
    * *Deskripsi:* Makan AYCE sepuasnya mulai dari Rp 100rb - Rp 125rb aja. Solusi terbaik buat makan enak di tanggal tua!
2.  **Ikon AC / Salju:**
    * *Judul:* Tempat Adem & Nyaman
    * *Deskripsi:* Dilengkapi AC yang dingin maksimal. Gak perlu takut gerah atau bau asap berlebih saat nge-grill bareng temen.
3.  **Ikon Jarak / Meja Luas:**
    * *Judul:* Ruang Luas & Fleksibel
    * *Deskripsi:* Jarak antar meja yang lebar bikin suasana makan jadi lega. Cocok banget buat acara kumpul keluarga besar atau komunitas.

### 5.4. Menu Highlights Section
Menggunakan layout dua tab atau dua kartu berdampingan:

* **Paket 1: Grilled and Shabu (Best Value)**
    * *Deskripsi:* Kombinasi sempurna panggangan daging premium dan kuah shabu hangat yang gurih.
    * *Harga:* Rp 125.000,- / pax
    * *Fitur:* Pilihan daging melimpah, sayuran segar, *side dishes* khas Korea, dan minuman *free-flow*.
* **Paket 2: Regular Beef (Shabu Only / Grill Only)**
    * *Deskripsi:* Pilihan hemat buat kamu yang mau fokus menikmati kelembutan potongan daging reguler pilihan.
    * *Harga:* Rp 100.000,- / pax
    * *Fitur:* Pilihan kuah sup beragam, saus racikan spesial, dan es krim penutup yang menyegarkan.

### 5.5. Social Proof / Testimonials Section
Menampilkan ulasan bintang 5 dengan foto profil bergaya kasual:

1.  *"Tempat makan murah meriah, budget anak kampus pun cocok banget di sini. Harganya pas, pilihan dagingnya mantap!"* – **Rian, Mahasiswa Universitas Sekitar**
2.  *"Suasana di cabang Buaran oke sih, jarak antar mejanya luas jadi gak sumpek. Tempatnya adem banget meskipun lagi penuh."* – **Lelly F., Local Guide**
3.  *"Tempatnya bersih, pelayanannya ramah kalau kita booking duluan. Pas banget buat makan bareng keluarga besar pas akhir pekan."* – **Siti M., Ibu Rumah Tangga**

### 5.6. Footer / Kontak & Lokasi Section
* **Headline:** "Sudah Siap Amankan Mejamu?"
* **Sub-headline:** "Khusus hari Sabtu dan jam makan malam, tempat kami sangat ramai. Amankan tempatmu sekarang dengan melakukan reservasi!"
* **Informasi Kontak:**
    * **Alamat:** Samping BAKS Coffee, Jl. Buaran Raya No.104-108 Blok A, RT.1/RW.14, Duren Sawit, Kec. Duren Sawit, Kota Jakarta Timur, DKI Jakarta 13470
    * **Telepon:** (021) 29195053
    * **Jam Operasional:** Buka Setiap Hari, Mulai Pukul 12.00 WIB
* **Widget Tambahan:** Integrasi Google Maps Embed (Titik koordinat QWHF+V2 Duren Sawit).
* **Tombol CTA Footer:** Chat WhatsApp Reservasi

---

## 6. Rekomendasi Teknis untuk Developer

1.  **Optimasi Gambar (Image Optimization):** Karena website kuliner sangat bergantung pada foto makanan, pastikan semua gambar dikompresi ke format `.webp` agar *loading speed* website tetap di bawah 2 detik.
2.  **Mobile-First Design:** Lebih dari 80% calon konsumen mencari tempat makan via HP. Pastikan struktur tabel menu dan tombol reservasi sangat mudah ditekan menggunakan jempol di layar ponsel.
3.  **Integrasi WhatsApp Link:** Tombol reservasi harus otomatis mengarah ke API WhatsApp dengan teks bawaan otomatis, contoh: 
    * *`"Halo Sogogi Buaran, saya mau reservasi meja untuk [Jumlah Orang] pada tanggal [Tanggal] jam [Jam]..."`*

---