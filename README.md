# EduCampus Digital - Platform Media Pembelajaran Interaktif & Sistem Informasi Tugas Mahasiswa

Platform aplikasi web pembelajaran interaktif modern yang dirancang khusus untuk mahasiswa dan dosen dalam mendukung kegiatan perkuliahan terstruktur, media pembelajaran multimedia, serta pengelolaan tugas perkuliahan.

Sistem ini merealisasikan dan mengintegrasikan 5 pilar kebutuhan:
1. **Media Pembelajaran Interaktif**: Kuis interaktif real-time dengan instant score & feedback pembahasan, latihan soal berpenjelasan, dan sintesis audio chime.
2. **Website Multimedia**: Materi kuliah disajikan dalam multi-format (Teks teoritis terstruktur, Infografis resolusi tinggi dengan zoom modal, Video embedding YouTube edukatif, dan Audio podcast/voice note dosen dengan waveform visualizer).
3. **Sistem Informasi Materi & Tugas**: Multi-mata kuliah (fokus utama: Analisis & Desain Perangkat Lunak / ADPL), alur pertemuan terstruktur dari **Pertemuan 1 hingga 16**, serta pusat pengumpulan tugas (Individu & Kelompok) dengan live deadline countdown dan modal submission.
4. **Platform Terpusat**: Dashboard ringkasan akademik, pencarian global (Ctrl+K), navigasi terstruktur, notifikasi tenggat waktu, dan bank referensi / e-library (buku standar ACM/IEEE, tools UML, OWASP).
5. **Pembelajaran Mandiri (Self-Paced Learning)**: Pelacak progres belajar per pertemuan, *Catatan Belajar Mandiri* dengan auto-save tersimpan di `LocalStorage`, mode fokus, serta pengalih tema **Dark Mode / Light Mode**.

---

## 📁 Struktur Direktori

```text
WEB PEMBELAJARAN MAHASISWA/
├── index.html            # Halaman antarmuka utama (SPA)
├── README.md             # Dokumentasi proyek
├── css/
│   └── styles.css        # Design system, glassmorphism, responsive styles & tema
├── js/
│   ├── data.js           # Model data kurikulum, pertemuan 1-16, kuis, tugas, & referensi
│   └── app.js            # Controller logika, state LocalStorage, audio synth, & modal
└── assets/
    ├── hero_banner.jpg       # Ilustrasi hero banner platform edukasi digital
    ├── sdlc_infographic.jpg  # Infografis diagram SDLC & arsitektur sistem
    └── course_web.jpg        # Thumbnail mata kuliah & diagram teknologi web
```

---

## 🚀 Cara Menjalankan Web

Aplikasi ini dibangun menggunakan arsitektur web modern murni (*Pure Modern HTML5, Vanilla CSS3, dan Vanilla JavaScript ES6+*), sehingga sangat ringan, cepat, dan tanpa dependensi rumit:

### Opsi 1: Menjalankan Server Lokal (Sedang Aktif)
Server lokal Python telah dijalankan dan aktif melayani aplikasi:
* Buka browser (Google Chrome / Microsoft Edge / Firefox)
* Akses URL: **`http://localhost:3000`**

### Opsi 2: Membuka Berkas Langsung
Anda juga dapat membuka berkas [`index.html`](file:///d:/SEMESTER%205/ANALISIS%20DESIGN%20PL/INDIVIDU/WEB%20PEMBELAJARAN%20MAHASISWA/index.html) secara langsung di browser tanpa perlu server tambahan.

---

## 💡 Fitur-Fitur Utama yang Dapat Dicoba

1. **Dashboard & Metrik**:
   - Menampilkan kartu mata kuliah aktif, status kelulusan pertemuan, jumlah tugas terkumpul, dan riwayat kuis.
2. **Ruang Kelas Multimedia (Pertemuan 1–16)**:
   - Pilih mata kuliah (misal: *Analisis dan Desain Perangkat Lunak*).
   - Klik daftar pertemuan di panel kiri untuk membuka materi pertemuan bersangkutan.
   - Beralih antar-tab media:
     * **📖 Materi Teks**: Bacaan teori lengkap dengan callout catatan dan capaian pembelajaran.
     * **🖼️ Infografis**: Klik gambar untuk mode *Zoom Penuh*.
     * **🎥 Video Pembelajaran**: Video YouTube pengayaan materi terkait.
     * **🎙️ Audio Penjelasan**: Klik tombol play untuk mengaktifkan equalizer visualizer.
     * **⚡ Latihan Soal**: Kerjakan kuis interaktif, langsung dapatkan skor dan pembahasan benar/salah beserta efek suara Web Audio API.
     * **📝 Tugas Perkuliahan**: Lihat instruksi tugas spesifik sesi tersebut.
   - **Catatan Belajar Mandiri**: Tuliskan catatan penting di bagian bawah materi, tersimpan otomatis tanpa perlu menekan tombol save.
3. **Pusat Tugas & Pengumpulan**:
   - Filter tugas berdasarkan kategori: *Semua*, *Individu*, atau *Kelompok (Tubes)*.
   - Klik tombol **"Kumpulkan Tugas"** untuk membuka modal upload simulasi (seret file PDF/ZIP atau masukkan tautan repository GitHub/Drive).
4. **Bank Referensi & E-Book**:
   - Repositori referensi standar buku ajar, dokumen standar IEEE, serta software pemodelan UML.
5. **Pencarian Cepat & Pengalih Tema**:
   - Ketik topik di bilah pencarian atas (contoh: *UML*, *Agile*, *Class Diagram*).
   - Klik ikon matahari/bulan di sudut kanan atas untuk beralih antara tema gelap (*Dark Mode*) dan terang (*Light Mode*).

---

## 🛠️ Fitur Manajemen Fleksibel (CRUD) untuk Kegunaan Jangka Panjang

Agar web ini dapat digunakan untuk berbagai semester, jurusan, dan kebutuhan perkuliahan seterusnya:

1. **Kelola Mata Kuliah (Tambah, Edit, Hapus, & Reset)**:
   - **Tambah Mata Kuliah Baru**: Klik tombol `+ Tambah Kelas Kuliah Baru` atau `+ Tambah Matkul`. Sistem otomatis menginisialisasi 16 pertemuan lengkap dengan silabus, kuis, dan tugas.
   - **Edit Data Mata Kuliah**: Klik tombol `✏️ Edit` pada kartu matkul atau tabel KRS untuk mengubah Nama Kelas, Kode MK, Dosen Pengampu, Ruang, Jadwal, SKS, dan Deskripsi.
   - **Hapus Mata Kuliah**: Klik tombol `🗑️ Hapus` untuk menghapus mata kuliah yang sudah selesai atau tidak diambil lagi (data tersimpan di `LocalStorage` browser).
   - **Reset Default**: Tombol `↺ Reset ke 8 Matkul Awal` mengembalikan data awal KRS Semester 5 kapan pun dibutuhkan.

2. **Kelola Materi Perkuliahan & Berkas (CMS per Pertemuan)**:
   - Tombol **`⚙️ Kelola & Edit Konten Sesi Ini`** pada setiap pertemuan memungkinkan Anda:
     * Menambah, mengedit, atau menghapus naskah materi teori HTML.
     * Mengunggah atau menghapus berkas modul lampiran (PDF/DOCX/PPTX) dengan ukuran dan tanggal.
     * Menambah atau menghapus diagram infografis resolusi tinggi.
     * Mengubah URL embed video YouTube pengayaan.
     * Mengelola rekaman audio/podcast dosen dan transkrip.
     * Menambah/mengedit soal kuis latihan beserta kunci jawaban dan penjelasannya.
     * Menambah atau mengedit tugas individu/kelompok serta tenggat waktunya.

3. **Kelola Jadwal & Sesi Pertemuan (Tambah, Edit, & Hapus Pertemuan)**:
   - **Tambah Pertemuan Baru**: Klik tombol `+ Tambah` di atas panel Daftar Pertemuan untuk menambah sesi pertemuan (misal Pertemuan ke-17 atau sesi pengayaan baru).
   - **Edit Jadwal & Informasi Sesi**: Klik tombol `✏️` pada kartu pertemuan di daftar panel kiri (atau tombol `✏️ Edit Jadwal Sesi Ini` di toolbar ruang kelas) untuk mengubah judul materi, nomor pertemuan, durasi waktu, sasaran overview, dan konfigurasi tugas.
   - **Hapus Sesi Pertemuan**: Klik tombol `🗑️` pada kartu pertemuan untuk menghapus sesi yang dibatalkan secara aman dengan validasi dan konfirmasi.
   - **Reset Pertemuan**: Klik tombol `↺` untuk mengembalikan susunan silabus ke 16 pertemuan standar kurikulum.


