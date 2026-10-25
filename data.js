/**
 * DATA MODEL - PORTAL PEMBELAJARAN MAHASISWA & SISTEM INFORMASI TUGAS
 * Mengintegrasikan:
 * 1. Media Pembelajaran Interaktif (Kuis, latihan soal, feedback)
 * 2. Website Multimedia (Teks, Infografis, Video, Audio podcast kuliah)
 * 3. Sistem Informasi Materi & Tugas (Pertemuan 1-16, Tugas Individu/Kelompok, Deadline)
 * 4. Platform Belajar Terpusat (Multi-matkul, search, filter)
 * 5. Pembelajaran Mandiri (Progress tracker, self-note taking)
 */

const COURSES_DATA = [
  {
    id: "adpl",
    code: "TI24D",
    title: "Analisis dan Design PL",
    className: "Analisis dan Design PL TI24D",
    alias: "ADPL",
    semester: 5,
    academicYear: "2026/2027 Ganjil",
    schedule: "Senin 13:00:00 s/d 15:30:00",
    room: "Mahdor D 406",
    sks: 3,
    lecturer: "Dr. Ir. Hendra Gunawan, M.T.",
    nip: "197805122003121002",
    department: "FT T. Informatika",
    category: "Wajib Program Studi",
    thumbnail: "assets/hero_banner.jpg",
    description: "Mempelajari metodologi analisis kebutuhan, perancangan arsitektur sistem, pemodelan UML terstruktur, desain antarmuka, hingga pengujian perangkat lunak modern.",
    totalMeetings: 16,
    meetings: [
      {
        id: "adpl-m1",
        number: 1,
        title: "Pengantar Analisis & Desain Sistem Perangkat Lunak",
        tagline: "Konsep Dasar Sistem, Peran Analis Sistem, dan Siklus Hidup Pengembangan (SDLC)",
        duration: "90 Menit",
        status: "available",
        infographic: "assets/sdlc_infographic.jpg",
        infographicTitle: "Infografis Siklus Hidup Rekayasa & Arsitektur Perangkat Lunak (SDLC)",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/2_88m_9n7_0",
        videoTitle: "Introduction to Software Engineering & Systems Analysis",
        audioTitle: "Audio Kuliah: Perbedaan Analisis vs Desain dalam Proyek Nyata",
        audioDuration: "14:20",
        audioTranscript: "Halo rekan-rekan mahasiswa. Di pertemuan pertama ini kita menekankan bahwa Analisis menjawab pertanyaan 'WHAT' (apa yang dibutuhkan oleh pengguna dan bisnis), sementara Desain menjawab pertanyaan 'HOW' (bagaimana sistem secara teknis memenuhi kebutuhan tersebut)...",
        overview: "Pertemuan ini membahas pondasi dasar rekayasa perangkat lunak, paradigma berorientasi objek vs prosedural, dan tahapan SDLC (Software Development Life Cycle) dari Planning hingga Maintenance.",
        learningOutcomes: [
          "Mampu membedakan peran Problem Domain (Analisis) dan Solution Domain (Desain).",
          "Memahami 5 tahapan utama SDLC klasik dan modern (Agile Scrum).",
          "Mampu mengidentifikasi stakeholder kunci dalam proyek perangkat lunak."
        ],
        textTheory: `
          <h3>1. Hakikat Analisis dan Desain Perangkat Lunak (ADPL)</h3>
          <p>Pengembangan perangkat lunak sering kali mengalami kegagalan bukan karena kesalahan koding (*coding errors*), melainkan karena <strong>kesalahan pemahaman kebutuhan pengguna</strong> dan perancangan arsitektur yang buruk. Analisis dan Desain Perangkat Lunak menjadi jembatan krusial antara visi bisnis klien dengan eksekusi kode programmer.</p>
          
          <div class="theory-callout note">
            <div class="callout-icon">💡</div>
            <div class="callout-body">
              <strong>Prinsip Inti:</strong> <em>"Analisis adalah proses mengurai kebutuhan pengguna (What to build), sedangkan Desain adalah proses merancang arsitektur dan spesifikasi teknis solusi (How to build it)."</em>
            </div>
          </div>

          <h3>2. Siklus Hidup Pengembangan Perangkat Lunak (SDLC)</h3>
          <p>SDLC merupakan kerangka kerja terstruktur yang digunakan tim pengembang untuk memproduksi perangkat lunak berkualitas tinggi dengan biaya dan waktu yang optimal:</p>
          <ul>
            <li><strong>Planning:</strong> Studi kelayakan, estimasi biaya, penentuan lingkup proyek (*scope*).</li>
            <li><strong>Analysis:</strong> Pengumpulan kebutuhan (*requirement gathering*), pembuatan dokumen SRS (*Software Requirements Specification*).</li>
            <li><strong>Design:</strong> Perancangan arsitektur sistem, pemodelan UML, desain basis data (ERD), dan perancangan antarmuka (UI/UX).</li>
            <li><strong>Implementation:</strong> Penulisan kode sumber (*coding*), integrasi pustaka, dan konfigurasi environment.</li>
            <li><strong>Testing:</strong> Verifikasi fungsi sistem (Blackbox & Whitebox testing) dan validasi penerimaan pengguna (UAT).</li>
            <li><strong>Deployment & Maintenance:</strong> Rilis ke lingkungan produksi serta pemeliharaan berkala atas bug dan pembaruan fitur.</li>
          </ul>

          <div class="theory-callout warning">
            <div class="callout-icon">⚠️</div>
            <div class="callout-body">
              <strong>Cost of Change:</strong> Kesalahan yang ditemukan pada tahap Analisis membutuhkan biaya 10 hingga 100 kali lebih murah untuk diperbaiki dibandingkan kesalahan yang baru disadari setelah sistem masuk tahap produksi!
            </div>
          </div>
        `,
        quiz: [
          {
            id: "q1-1",
            question: "Manakah pernyataan yang paling tepat membedakan tahap 'Analisis' dan 'Desain' pada pengembangan perangkat lunak?",
            options: [
              "Analisis fokus pada penulisan kode sumber, sedangkan Desain fokus pada pembuatan database.",
              "Analisis menjawab pertanyaan 'What' (kebutuhan sistem), sedangkan Desain menjawab pertanyaan 'How' (cara sistem dibangun).",
              "Analisis dilakukan oleh programmer pemula, sedangkan Desain dilakukan oleh manajer proyek.",
              "Analisis dilakukan setelah perangkat lunak diuji coba oleh pengguna akhir."
            ],
            correct: 1,
            explanation: "Tepat sekali! Analisis mendefinisikan apa yang dibutuhkan pengguna (What), sedangkan Desain merumuskan bagaimana sistem memenuhi kebutuhan tersebut secara teknis (How)."
          },
          {
            id: "q1-2",
            question: "Bila terjadi kesalahan definisi spesifikasi kebutuhan di awal proyek dan baru diperbaiki saat fase Testing, dampaknya adalah:",
            options: [
              "Tidak ada dampak biaya karena kode dapat langsung diedit.",
              "Biaya perbaikan meningkat drastis (Cost of Change) karena harus merombak kode dan desain sebelumnya.",
              "Kecepatan rilis aplikasi menjadi lebih cepat.",
              "Sistem otomatis menjadi lebih aman."
            ],
            correct: 1,
            explanation: "Benar! Menurut Boehm Curve, semakin lambat cacat kebutuhan terdeteksi dalam SDLC, semakin eksponensial biaya perbaikannya."
          },
          {
            id: "q1-3",
            question: "Manakah di bawah ini yang BUKAN merupakan tahapan utama dalam SDLC konvensional?",
            options: [
              "Requirement Analysis",
              "Architectural Design",
              "Hardware Manufacturing",
              "Verification & Testing"
            ],
            correct: 2,
            explanation: "Hardware Manufacturing bukan bagian dari SDLC murni perangkat lunak, melainkan manufaktur perangkat keras."
          }
        ],
        assignment: {
          id: "tugas-adpl-1",
          type: "Individu",
          title: "Tugas 1: Analisis Studi Kasus Kegagalan Proyek PL & Rekomendasi Solusi",
          deadline: "2026-11-05 23:59:00",
          points: 100,
          instructions: `
            1. Carilah 1 studi kasus nyata kegagalan sistem perangkat lunak skala nasional atau internasional (misal: Healthcare.gov 2013, kegagalan sistem reservasi tiket kereta, atau sistem perbankan).
            2. Analisislah di fase SDLC mana kesalahan paling fatal bermula.
            3. Buat makalah ringkas maksimal 3 halaman berformat PDF dengan ketentuan: Pendahuluan, Kronologi Masalah, Analisis Kegagalan, dan Rekomendasi Perbaikan.
            4. Kumpulkan dalam bentuk berkas PDF atau cantumkan tautan Google Drive / Cloud Docs.
          `
        },
        references: [
          { title: "Pressman, R. S. - Software Engineering: A Practitioner's Approach 9th Edition", type: "E-Book", link: "https://www.mheducation.com" },
          { title: "IEEE Standard for System and Software Engineering - Vocabulary", type: "Jurnal/Standar", link: "https://standards.ieee.org" }
        ]
      },
      {
        id: "adpl-m2",
        number: 2,
        title: "Elisitasi & Spesifikasi Kebutuhan (Software Requirements)",
        tagline: "Teknik Wawancara, Observasi, User Story, dan Pembuatan Dokumen SRS (IEEE 830)",
        duration: "100 Menit",
        status: "available",
        infographic: "assets/sdlc_infographic.jpg",
        infographicTitle: "Diagram Kategori Kebutuhan Fungsional vs Non-Fungsional",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/5U_722V5s5o",
        videoTitle: "Functional vs Non-Functional Requirements in Software Design",
        audioTitle: "Audio Kuliah: Tips Menghadapi Klien yang Belum Paham Kebutuhannya",
        audioDuration: "12:15",
        audioTranscript: "Sering kali klien mengatakan 'saya ingin aplikasi yang cepat dan bagus'. Ini adalah pernyataan ambigu. Tugas software analyst adalah menerjemahkan kata 'cepat' menjadi metrik terukur, misalnya 'waktu respon di bawah 2 detik'...",
        overview: "Membahas teknik elisitasi kebutuhan dari pengguna nyata, membedakan Kebutuhan Fungsional (FR) dan Non-Fungsional (NFR), serta penulisan User Stories yang mematuhi format INVEST.",
        learningOutcomes: [
          "Mampu menuliskan spesifikasi kebutuhan fungsional dengan jelas tanpa ambiguitas.",
          "Mampu mengidentifikasi kebutuhan non-fungsional dengan parameter metrik terukur (URPS+).",
          "Mampu menyusun User Story dengan struktur 'As a... I want to... So that...'."
        ],
        textTheory: `
          <h3>1. Taksonomi Kebutuhan Perangkat Lunak</h3>
          <p>Kebutuhan perangkat lunak dibagi menjadi dua pilar utama:</p>
          <div class="theory-comparison-grid">
            <div class="theory-card">
              <h4>🎯 Kebutuhan Fungsional (FR)</h4>
              <p>Mendefinisikan <strong>layanan atau fungsi spesifik</strong> yang harus disediakan oleh sistem ketika menerima input tertentu.</p>
              <em>Contoh: "Sistem harus memvalidasi kata sandi minimal 8 karakter dan mengirim OTP ke email terdaftar."</em>
            </div>
            <div class="theory-card">
              <h4>⚡ Kebutuhan Non-Fungsional (NFR)</h4>
              <p>Mendefinisikan <strong>batasan, karakteristik kualitas, dan performa</strong> sistem saat beroperasi.</p>
              <em>Contoh: "Sistem harus mampu melayani 10.000 request bersamaan dengan latency &lt; 500ms."</em>
            </div>
          </div>

          <h3>2. Menulis Kebutuhan yang Baik (Prinsip SMART & INVEST)</h3>
          <p>Kebutuhan yang buruk adalah sumber utama penundaan proyek. Pastikan kebutuhan selalu <strong>Spesifik, Terukur (Measurable), Dapat Dicapai, Relevan, dan Dapat Diuji (Testable)</strong>.</p>
        `,
        quiz: [
          {
            id: "q2-1",
            question: "Manakah di bawah ini yang merupakan contoh Kebutuhan Non-Fungsional (NFR)?",
            options: [
              "Pengguna dapat mencetak riwayat transaksi dalam format PDF.",
              "Sistem harus mengenkripsi data sensitif pengguna dengan standar AES-256.",
              "Admin dapat menghapus data mahasiswa yang telah lulus.",
              "Mahasiswa dapat mengunggah tugas dengan ukuran maksimal 10MB."
            ],
            correct: 1,
            explanation: "Tepat! Enkripsi AES-256 menyangkut atribut keamanan (security attribute) yang merupakan kebutuhan non-fungsional."
          },
          {
            id: "q2-2",
            question: "Format standar penulisan User Story dalam metodologi Agile adalah:",
            options: [
              "Given... When... Then...",
              "As a <role>, I want <goal>, so that <benefit>",
              "If <condition> then <action> else <fallback>",
              "Input -> Process -> Output"
            ],
            correct: 1,
            explanation: "Benar! 'As a [role], I want [action/feature], so that [business value]' adalah format baku user story."
          }
        ],
        assignment: {
          id: "tugas-adpl-2",
          type: "Kelompok",
          title: "Tugas Besar Milestone 1: Dokumen Spesifikasi Kebutuhan Perangkat Lunak (SRS)",
          deadline: "2026-11-12 23:59:00",
          points: 100,
          instructions: `
            1. Bentuk kelompok 3-4 orang mahasiswa.
            2. Tentukan satu topik studi kasus aplikasi nyata (misal: Sistem Antrean RS, Smart Parking Kampus, atau E-Commerce Thrift).
            3. Susun bab Analisis Kebutuhan: Deskripsi Umum Sistem, Daftar 10 Kebutuhan Fungsional, 5 Kebutuhan Non-Fungsional (Metrik Terukur), dan 5 User Stories utama.
            4. Lampirkan lembar pembagian tugas anggota kelompok.
          `
        },
        references: [
          { title: "Wiegers, K., & Beatty, J. - Software Requirements 3rd Edition (Microsoft Press)", type: "Buku Panduan", link: "https://microsoft.com" }
        ]
      },
      {
        id: "adpl-m3",
        number: 3,
        title: "Pemodelan Kebutuhan dengan Use Case Diagram & Skenario",
        tagline: "Aktor, Relasi <<include>>, <<extend>>, Generalisasi, dan Skenario Use Case Naratif",
        duration: "110 Menit",
        status: "available",
        infographic: "assets/sdlc_infographic.jpg",
        infographicTitle: "UML Diagram Hierarchy & Use Case Ecosystem",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/zid-MVo7aa4",
        videoTitle: "How to Draw Use Case Diagrams like a Pro",
        audioTitle: "Audio Kuliah: Jebakan Terbesar dalam Menentukan Relasi Include vs Extend",
        audioDuration: "16:45",
        audioTranscript: "Banyak mahasiswa sering tertukar antara Include dan Extend. Ingat rumusnya: Include itu WAJIB dieksekusi agar use case induk berhasil, sedangkan Extend itu OPSIONAL hanya terjadi pada kondisi tertentu...",
        overview: "Membahas teknik pemodelan kebutuhan sistem dari sudut pandang interaksi pengguna luar (Actor) dengan batas sistem (System Boundary) menggunakan standar Unified Modeling Language (UML).",
        learningOutcomes: [
          "Mampu membedakan Aktor Primer, Sekunder, dan Sistem Eksternal.",
          "Mampu menggunakan relasi <<include>> dan <<extend>> secara tepat tanpa miskonsepsi.",
          "Mampu menyusun dokumen Skenario Use Case (Main Success Scenario & Alternative Paths)."
        ],
        textTheory: `
          <h3>1. Komponen Use Case Diagram</h3>
          <p>Use Case Diagram menggambarkan interaksi antara sistem dan dunia luar tanpa membocorkan detail internal algoritma atau database:</p>
          <ul>
            <li><strong>Actor:</strong> Entitas luar (manusia, sensor, sistem perbankan pihak ketiga) yang berinteraksi dengan sistem.</li>
            <li><strong>Use Case (Elips):</strong> Fungsionalitas atau tujuan bernilai tambah yang dicapai oleh aktor.</li>
            <li><strong>System Boundary (Kotak):</strong> Membatasi apa yang ada di dalam lingkup sistem yang sedang dibangun dan apa yang berada di luar.</li>
          </ul>

          <div class="theory-callout tip">
            <div class="callout-icon">✨</div>
            <div class="callout-body">
              <strong>Rumus Mudah Include vs Extend:</strong><br>
              • <code>&lt;&lt;include&gt;&gt;</code>: <em>Selalu dijalankan (Mandatory Dependency)</em>. Contoh: 'Bayar Tagihan' <strong>includes</strong> 'Validasi Saldo'.<br>
              • <code>&lt;&lt;extend&gt;&gt;</code>: <em>Hanya dijalankan jika kondisi khusus terpenuhi (Optional Extension)</em>. Contoh: 'Cairkan Dana' <strong>extended by</strong> 'Tampilkan Peringatan Biaya Transfer Antar Bank'.
            </div>
          </div>
        `,
        quiz: [
          {
            id: "q3-1",
            question: "Kapan sebuah relasi antara dua Use Case diberi label <<extend>>?",
            options: [
              "Ketika use case kedua wajib selalu dieksekusi oleh use case pertama.",
              "Ketika use case kedua bersifat opsional dan hanya dipanggil berdasarkan kondisi spesifik (Extension Point).",
              "Ketika aktor memiliki lebih dari satu hak akses.",
              "Ketika sistem mengalami kegagalan koneksi database."
            ],
            correct: 1,
            explanation: "Tepat! Relasi <<extend>> digunakan untuk fungsionalitas opsional atau perkecualian pada titik perluasan (extension point)."
          },
          {
            id: "q3-2",
            question: "Aktor dalam Use Case Diagram:",
            options: [
              "Hanya boleh berupa manusia yang bekerja di perusahaan.",
              "Selalu diletakkan di dalam kotak System Boundary.",
              "Bisa berupa manusia, perangkat keras, atau sistem eksternal (misal Payment Gateway API).",
              "Harus mewakili satu nama individu spesifik (bukan peran/role)."
            ],
            correct: 2,
            explanation: "Benar! Aktor mewakili peran atau sistem eksternal yang berada di luar batas sistem dan bertindak sebagai inisiator atau penerima data."
          }
        ],
        assignment: {
          id: "tugas-adpl-3",
          type: "Individu",
          title: "Tugas 3: Perancangan Use Case Diagram & Skenario Kasus Lengkap",
          deadline: "2026-11-19 23:59:00",
          points: 100,
          instructions: `
            1. Pilihlah fitur 'Peminjaman Buku di Perpustakaan Digital Kampus'.
            2. Gambarlah Use Case Diagram dengan minimal 2 Actor (Mahasiswa, Pustakawan, dan API Notifikasi WhatsApp).
            3. Sertakan minimal satu relasi <<include>> dan satu relasi <<extend>>.
            4. Tuliskan 1 dokumen Skenario Use Case Lengkap yang memuat: Pre-condition, Main Flow (1-6 langkah), Post-condition, dan Alternative Flow.
          `
        },
        references: [
          { title: "Cockburn, A. - Writing Effective Use Cases (Addison-Wesley)", type: "Buku Legendaris", link: "https://alistair.cockburn.us" }
        ]
      },
      {
        id: "adpl-m4",
        number: 4,
        title: "Pemodelan Struktur Sistem dengan Class Diagram",
        tagline: "Class, Atribut, Operasi, Visibility (+, -, #), Asosiasi, Agregasi, dan Komposisi",
        duration: "115 Menit",
        status: "available",
        infographic: "assets/sdlc_infographic.jpg",
        infographicTitle: "Diagram Hubungan Relasi OOP: Dependency s.d. Composition",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/UI6lqHOVHic",
        videoTitle: "Class Diagram Modeling & OOP Relationships Simplified",
        audioTitle: "Audio Kuliah: Kapan Menggunakan Komposisi vs Agregasi?",
        audioDuration: "13:30",
        audioTranscript: "Komposisi memiliki relasi kepemilikan yang kuat (*strong ownership*). Bila objek induk dihancurkan, objek anak ikut musnah. Sedangkan agregasi adalah relasi kepemilikan yang longgar (*weak ownership*)...",
        overview: "Mempelajari inti pemodelan statis berorientasi objek: merancang struktur kelas, penentuan enkapsulasi, serta kardinalitas relasi antar entitas bisnis.",
        learningOutcomes: [
          "Mampu menentukan visibility atribut dan method (public, private, protected).",
          "Mampu membedakan notasi Agregasi (berlian kosong) dan Komposisi (berlian solid).",
          "Mampu memetakan Class Diagram ke dalam kode pemrograman OOP (Java/TypeScript)."
        ],
        textTheory: `
          <h3>1. Anatomi Sebuah Class dalam UML</h3>
          <p>Dalam UML, kelas digambarkan dengan kotak persegi tiga kompartemen:</p>
          <ol>
            <li><strong>Nama Kelas:</strong> Menggunakan format PascalCase.</li>
            <li><strong>Atribut:</strong> <code>[visibility] namaAtribut : tipeData [= nilaiAwal]</code></li>
            <li><strong>Metode/Operasi:</strong> <code>[visibility] namaMetode(param: tipe): tipeKembalian</code></li>
          </ol>

          <h3>2. Simbol Visibility (Hak Akses)</h3>
          <ul>
            <li><code>+</code> : Public (Dapat diakses dari kelas manapun)</li>
            <li><code>-</code> : Private (Hanya dapat diakses di dalam kelas bersangkutan)</li>
            <li><code>#</code> : Protected (Dapat diakses oleh kelas turunan / inheritance)</li>
            <li><code>~</code> : Package/Default (Dapat diakses oleh kelas dalam package yang sama)</li>
          </ul>

          <div class="theory-callout note">
            <div class="callout-icon">🏛️</div>
            <div class="callout-body">
              <strong>Agregasi vs Komposisi:</strong><br>
              • <em>Agregasi (Has-A):</em> Universitas memiliki Mahasiswa. Jika Universitas ditutup, Mahasiswa tetap hidup sebagai individu.<br>
              • <em>Komposisi (Part-Of):</em> Kamar adalah bagian dari Rumah. Jika Rumah dihancurkan total, maka Kamar tersebut lenyap.
            </div>
          </div>
        `,
        quiz: [
          {
            id: "q4-1",
            question: "Manakah simbol UML yang merepresentasikan hak akses 'Protected'?",
            options: ["-", "+", "#", "~"],
            correct: 2,
            explanation: "Simbol pagar (#) adalah representasi standar UML untuk hak akses 'Protected'."
          },
          {
            id: "q4-2",
            question: "Jika penghapusan objek induk mengakibatkan seluruh objek anak ikut terhapus secara otomatis, relasi tersebut dinamakan:",
            options: ["Association", "Aggregation", "Composition", "Dependency"],
            correct: 2,
            explanation: "Komposisi (Composition) dilambangkan dengan berlian hitam penuh dan menandakan kepemilikan mutlak seumur hidup (lifecycle dependency)."
          }
        ],
        assignment: {
          id: "tugas-adpl-4",
          type: "Kelompok",
          title: "Tugas Besar Milestone 2: Perancangan Domain Class Diagram",
          deadline: "2026-11-26 23:59:00",
          points: 100,
          instructions: `
            1. Lanjutkan studi kasus kelompok dari Milestone 1.
            2. Rancanglah Domain Class Diagram dengan minimal 6 Kelas yang saling berelasi.
            3. Wajib memuat minimal 1 relasi Inheritance, 1 relasi Komposisi, dan 1 relasi Asosiasi dengan Multiplicity lengkap (misal: 1..*, 0..1).
            4. Sertakan kode implementasi singkat kelas-kelas tersebut dalam bahasa TypeScript atau Java.
          `
        },
        references: [
          { title: "Fowler, M. - UML Distilled 3rd Edition", type: "Referensi Utama", link: "https://martinfowler.com" }
        ]
      },
      {
        id: "adpl-m5",
        number: 5,
        title: "Pemodelan Interaksi & Perilaku Dinamis (Sequence & Activity Diagram)",
        tagline: "Lifeline, Synchronous Message, Alt/Loop Fragments, dan Alur Kerja Aktivitas",
        duration: "110 Menit",
        status: "available",
        infographic: "assets/sdlc_infographic.jpg",
        infographicTitle: "Alur Eksekusi Pesan Dinamis pada Sequence Diagram",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/pCK6prSq8aw",
        videoTitle: "Mastering UML Sequence Diagrams Step-by-Step",
        audioTitle: "Audio Kuliah: Membaca Alur Pesan dari Kiri ke Kanan dan Atas ke Bawah",
        audioDuration: "11:50",
        audioTranscript: "Sequence diagram menekankan urutan waktu pengiriman pesan antar objek. Sumbu vertikal mewakili berjalannya waktu dari atas ke bawah, sedangkan garis horizontal adalah pesan antar lifeline...",
        overview: "Mempelajari pemodelan perilaku dinamis perangkat lunak untuk memetakan bagaimana sekumpulan objek berkolaborasi menjalankan use case tertentu secara real-time.",
        learningOutcomes: [
          "Mampu menggambar Lifeline, Garis Aktivasi, dan Panah Pesan Sinkron/Asinkron.",
          "Mampu menerapkan fragmen interaksi (Loop, Alt, Opt) untuk kondisi if-else dan perulangan.",
          "Mampu memodelkan alur bisnis paralel menggunakan Fork dan Join pada Activity Diagram."
        ],
        textTheory: `
          <h3>1. Sequence Diagram: Dinamika Berbasis Waktu</h3>
          <p>Sequence diagram menunjukkan pertukaran pesan antar objek dalam urutan kronologis vertikal:</p>
          <ul>
            <li><strong>Lifeline:</strong> Garis putus-putus vertikal yang mewakili eksistensi objek selama interaksi.</li>
            <li><strong>Activation Bar:</strong> Kotak tipis di lifeline yang menunjukkan saat objek sedang mengeksekusi operasi.</li>
            <li><strong>Synchronous Call (Panah Solid):</strong> Pengirim pesan menunggu respon penerima sebelum melanjutkan.</li>
            <li><strong>Reply Message (Panah Putus-putus):</strong> Nilai balik yang dikembalikan ke pemanggil.</li>
          </ul>

          <div class="theory-callout note">
            <div class="callout-icon">🔄</div>
            <div class="callout-body">
              <strong>Combined Fragments:</strong><br>
              • <code>alt</code> : Alternatif (struktur if - else if - else).<br>
              • <code>opt</code> : Opsional (struktur if tanpa else).<br>
              • <code>loop</code> : Pengulangan (struktur for/while).
            </div>
          </div>
        `,
        quiz: [
          {
            id: "q5-1",
            question: "Fragmen interaksi manakah yang digunakan untuk memodelkan struktur logika if-else dalam Sequence Diagram?",
            options: ["loop", "alt", "par", "opt"],
            correct: 1,
            explanation: "Fragmen 'alt' (Alternative) digunakan untuk mengevaluasi beberapa kondisi saling lepas seperti if-else."
          }
        ],
        assignment: {
          id: "tugas-adpl-5",
          type: "Individu",
          title: "Tugas 5: Sequence Diagram Alur Otentikasi & Pembayaran",
          deadline: "2026-12-03 23:59:00",
          points: 100,
          instructions: `
            Gambarkan Sequence Diagram untuk use case 'Pembayaran Pesanan' yang melibatkan: Pengguna, Controller Pembayaran, Database Transaksi, dan Payment Gateway API Eksternal. Sertakan fragmen 'alt' untuk skenario Saldo Cukup vs Saldo Gagal.
          `
        },
        references: [
          { title: "Visual Paradigm Guides - UML Sequence Diagram Tutorial", type: "Web Tutorial", link: "https://www.visual-paradigm.com" }
        ]
      },
      {
        id: "adpl-m6",
        number: 6,
        title: "Perancangan Arsitektur Perangkat Lunak & Desain Database",
        tagline: "Monolith vs Microservices, MVC, Client-Server, ERD Konseptual ke Skema Fisikal",
        duration: "120 Menit",
        status: "available",
        infographic: "assets/sdlc_infographic.jpg",
        infographicTitle: "Arsitektur 3-Tier & Microservices Modern",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/DMnBHJ-jW3k",
        videoTitle: "Software Architecture Patterns Explained",
        audioTitle: "Audio Kuliah: Jangan Langsung Pakai Microservices Jika Belum Siap!",
        audioDuration: "15:10",
        audioTranscript: "Banyak startup terjebak tren microservices padahal tim mereka hanya 3 orang. Arsitektur modular monolith sering kali menjadi pilihan paling bijak dan efisien di fase awal...",
        overview: "Membahas pemilihan pola arsitektur perangkat lunak (MVC, Layered, Clean Architecture) dan perancangan database relasional terstandarisasi normalisasi 3NF.",
        learningOutcomes: [
          "Mampu memilih arsitektur sistem yang tepat berdasarkan skala dan kebutuhan non-fungsional.",
          "Mampu mentransformasikan Class Diagram Domain menjadi Entity Relationship Diagram (ERD).",
          "Mampu melakukan normalisasi tabel database hingga bentuk normal ketiga (3NF)."
        ],
        textTheory: `
          <h3>1. Pola Arsitektur MVC (Model-View-Controller)</h3>
          <p>Memisahkan aplikasi ke dalam tiga komponen independen:</p>
          <ul>
            <li><strong>Model:</strong> Mengelola logika data, validasi, dan komunikasi dengan basis data.</li>
            <li><strong>View:</strong> Merender representasi visual dan menerima interaksi pengguna.</li>
            <li><strong>Controller:</strong> Menerima permintaan (*request*), memproses input, memperbarui model, dan mengarahkan ke view yang tepat.</li>
          </ul>
        `,
        quiz: [
          {
            id: "q6-1",
            question: "Komponen dalam pola arsitektur MVC yang bertanggung jawab langsung berinteraksi dengan tabel database adalah:",
            options: ["View", "Controller", "Model", "Router"],
            correct: 2,
            explanation: "Model adalah lapisan yang mengelola data, query, dan aturan integritas bisnis."
          }
        ],
        assignment: {
          id: "tugas-adpl-6",
          type: "Kelompok",
          title: "Tugas Besar Milestone 3: Dokumen Arsitektur & Perancangan Database Relasional (ERD)",
          deadline: "2026-12-10 23:59:00",
          points: 100,
          instructions: `
            1. Jelaskan diagram arsitektur teknologi yang dipilih (Tech Stack Frontend, Backend, Database, Cloud Service).
            2. Buat rancangan ERD (Entity Relationship Diagram) lengkap dengan Primary Key, Foreign Key, dan Kardinalitas Relasi.
            3. Sertakan Data Dictionary untuk setiap tabel.
          `
        },
        references: [
          { title: "Bass, L., Clements, P., & Kazman, R. - Software Architecture in Practice 4th Ed", type: "Buku Standar", link: "https://sei.cmu.edu" }
        ]
      },
      {
        id: "adpl-m7",
        number: 7,
        title: "Perancangan Antarmuka Pengguna (UI/UX) & Prototyping",
        tagline: "Prinsip Usability Nielsen, Wireframing Low/High-Fidelity, dan Desain Sistem",
        duration: "105 Menit",
        status: "available",
        infographic: "assets/course_web.jpg",
        infographicTitle: "10 Heuristik Usability Jakob Nielsen untuk Antarmuka Modern",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/c9Wg6Cb_YlU",
        videoTitle: "UX Design Process: Wireframing to High-Fidelity Prototype",
        audioTitle: "Audio Kuliah: Desain yang Bagus Adalah Desain yang Tidak Perlu Ditebak",
        audioDuration: "10:45",
        audioTranscript: "Usability adalah kunci. Jika pengguna butuh panduan manual tebal hanya untuk memesan secangkir kopi di aplikasi, maka desain UI/UX kita telah gagal...",
        overview: "Mempelajari dasar psikologi interaksi manusia dan komputer, 10 heuristik Jakob Nielsen, serta metodologi perancangan antarmuka dari sketsa kertas hingga prototipe interaktif.",
        learningOutcomes: [
          "Mampu menerapkan 10 Heuristik Usability Nielsen dalam mendesain halaman web/mobile.",
          "Mampu membuat wireframe wireflow pengguna.",
          "Memahami peranan Design Tokens, Konsistensi Warna, dan Tipografi Hierarkis."
        ],
        textTheory: `
          <h3>1. 10 Heuristik Usability Jakob Nielsen</h3>
          <p>Prinsip evaluasi antarmuka yang paling diakui di dunia:</p>
          <ol>
            <li><strong>Visibility of system status:</strong> Sistem selalu memberi umpan balik apa yang sedang terjadi (misal: progress bar, spinner loading).</li>
            <li><strong>Match between system and the real world:</strong> Menggunakan bahasa dan konsep yang akrab bagi pengguna.</li>
            <li><strong>User control and freedom:</strong> Sediakan tombol 'Batal', 'Kembali', atau 'Undo'.</li>
            <li><strong>Consistency and standards:</strong> Elemen yang sama harus memiliki fungsi dan gaya visual yang konsisten.</li>
            <li><strong>Error prevention:</strong> Desain yang mencegah terjadinya kesalahan input sejak awal.</li>
          </ol>
        `,
        quiz: [
          {
            id: "q7-1",
            question: "Menampilkan ikon indikator sinyal dan animasi spinner saat aplikasi memuat data adalah penerapan prinsip heuristik:",
            options: [
              "Error Prevention",
              "Visibility of System Status",
              "Flexibility and Efficiency",
              "Aesthetic and Minimalist Design"
            ],
            correct: 1,
            explanation: "Memberitahukan kepada pengguna apa yang sedang dilakukan sistem secara berkala adalah inti dari 'Visibility of System Status'."
          }
        ],
        assignment: {
          id: "tugas-adpl-7",
          type: "Individu",
          title: "Tugas 7: Evaluasi Usability Heuristik Aplikasi Populer",
          deadline: "2026-12-17 23:59:00",
          points: 100,
          instructions: `
            Pilih 1 aplikasi mobile perbankan atau belanja online. Lakukan evaluasi heuristik dengan menemukan minimal 3 pelanggaran usability dan berikan usulan perbaikan desain antarmukanya.
          `
        },
        references: [
          { title: "Nielsen Norman Group - 10 Usability Heuristics for User Interface Design", type: "Artikel", link: "https://www.nngroup.com" }
        ]
      },
      {
        id: "adpl-m8",
        number: 8,
        title: "Evaluasi Tengah Semester (UTS) & Review Desain",
        tagline: "Ujian Teori & Presentasi Progress Desain Sistem Perangkat Lunak Kelompok",
        duration: "120 Menit",
        status: "available",
        infographic: "assets/sdlc_infographic.jpg",
        infographicTitle: "Rubrik Penilaian Milestone Desain Sistem",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/O94m5v3j4pY",
        videoTitle: "System Design Interview & Academic Defense Guide",
        audioTitle: "Audio Kuliah: Panduan Teknis Pelaksanaan UTS dan Defense Proyek",
        audioDuration: "08:30",
        audioTranscript: "Selamat kepada seluruh mahasiswa yang telah menyelesaikan paruh pertama semester. Di UTS ini kita menguji sintesis pemahaman kalian mulai dari SRS, Use Case, hingga Class Diagram...",
        overview: "Evaluasi capaian pembelajaran paruh pertama semester: penguasaan teori pemodelan sistem, konsistensi antar-diagram UML, dan presentasi milestone kelompok.",
        learningOutcomes: [
          "Mampu mempertahankan keputusan desain arsitektur di hadapan tim penguji/dosen.",
          "Mampu memverifikasi konsistensi antara Use Case dengan Sequence dan Class Diagram."
        ],
        textTheory: `
          <h3>Materi Evaluasi Tengah Semester (Pertemuan 1 - 7)</h3>
          <p>Pastikan setiap kelompok telah merapikan dokumen SRS dan seluruh diagram UML yang telah dibuat untuk sesi *peer review* dan penilaian dosen pengampu.</p>
        `,
        quiz: [
          {
            id: "q8-1",
            question: "Jika sebuah Use Case bernama 'Cetak Laporan Penjualan' ada di Use Case Diagram, di manakah metode cetak tersebut seharusnya muncul?",
            options: [
              "Hanya di antarmuka HTML tanpa kelas backend.",
              "Sebagai operasi (method) pada salah satu Class atau Controller di Class Diagram yang bersangkutan.",
              "Tidak perlu dicantumkan di Class Diagram.",
              "Di dalam file konfigurasi server saja."
            ],
            correct: 1,
            explanation: "Prinsip keterlacakan (Traceability): fungsionalitas yang ada pada Use Case harus termanifestasikan sebagai operasi/metode pada Class Diagram pendukungnya."
          }
        ],
        assignment: {
          id: "tugas-adpl-8",
          type: "Kelompok",
          title: "Pengumpulan Berkas Bundel Dokumen Desain Sistem (UTS)",
          deadline: "2026-12-24 23:59:00",
          points: 100,
          instructions: `
            Unggah bundel berkas PDF hasil integrasi Tugas Kelompok Milestone 1, 2, dan 3 yang telah direvisi sesuai catatan asisten laboratorium dan dosen pengampu.
          `
        },
        references: [
          { title: "Panduan Penulisan Dokumen Perangkat Lunak Laboratorium RPL", type: "Buku Pedoman Kampus", link: "#" }
        ]
      },
      {
        id: "adpl-m9",
        number: 9,
        title: "Pola Desain Perangkat Lunak (Design Patterns - GoF)",
        tagline: "Creational (Singleton, Factory), Structural (Adapter), & Behavioral (Observer)",
        duration: "110 Menit",
        status: "available",
        infographic: "assets/sdlc_infographic.jpg",
        infographicTitle: "Katalog Pola Desain Gang of Four (GoF)",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/v9ejT8FO-7I",
        videoTitle: "Software Design Patterns Explained in 10 Minutes",
        audioTitle: "Audio Kuliah: Kapan Sebaiknya Singleton Pattern Dihindari?",
        audioDuration: "14:05",
        audioTranscript: "Singleton memastikan sebuah kelas hanya memiliki tepat satu instansiasi global. Namun, jika digunakan sembarangan, Singleton dapat membuat unit testing menjadi sangat sulit...",
        overview: "Mempelajari solusi-solusi teruji yang dirumuskan oleh Gang of Four (GoF) untuk mengatasi masalah perancangan berulang dalam rekayasa perangkat lunak berorientasi objek.",
        learningOutcomes: [
          "Memahami klasifikasi Creational, Structural, dan Behavioral patterns.",
          "Mampu mengimplementasikan Factory Method dan Singleton Pattern secara aman.",
          "Mampu menerapkan Observer Pattern untuk mekanisme event listener."
        ],
        textTheory: `
          <h3>1. Apa itu Design Pattern?</h3>
          <p>Design pattern bukanlah kode yang langsung dapat disalin-tempel, melainkan <strong>templat arsitektural teruji</strong> untuk memecahkan masalah umum dalam desain berorientasi objek.</p>
          <ul>
            <li><strong>Creational:</strong> Mekanisme pembuatan objek yang fleksibel (Contoh: Singleton, Factory Method, Builder).</li>
            <li><strong>Structural:</strong> Cara menyusun kelas dan objek untuk membentuk struktur yang lebih besar (Contoh: Adapter, Facade, Decorator).</li>
            <li><strong>Behavioral:</strong> Algoritma dan penugasan tanggung jawab antar objek (Contoh: Observer, Strategy, Command).</li>
          </ul>
        `,
        quiz: [
          {
            id: "q9-1",
            question: "Pola desain yang menjamin sebuah kelas hanya memiliki satu instans objek secara global dalam memori adalah:",
            options: ["Factory Pattern", "Observer Pattern", "Singleton Pattern", "Strategy Pattern"],
            correct: 2,
            explanation: "Singleton Pattern dirancang khusus agar sebuah kelas hanya mempunyai satu instance tunggal dan menyediakan titik akses global."
          }
        ],
        assignment: {
          id: "tugas-adpl-9",
          type: "Individu",
          title: "Tugas 9: Implementasi Kode Pola Desain Factory vs Observer",
          deadline: "2026-12-31 23:59:00",
          points: 100,
          instructions: `
            Tuliskan kode sederhana (dalam JavaScript/Python/Java) yang mengimplementasikan Observer Pattern pada sistem notifikasi mahasiswa (Ketika dosen upload materi baru, seluruh mahasiswa terdaftar otomatis mendapat notifikasi).
          `
        },
        references: [
          { title: "Gamma et al. - Design Patterns: Elements of Reusable Object-Oriented Software", type: "Buku Klasik GoF", link: "https://refactoring.guru/design-patterns" }
        ]
      },
      {
        id: "adpl-m10",
        number: 10,
        title: "Perancangan Pengujian Perangkat Lunak (Software Testing)",
        tagline: "Verifikasi vs Validasi, Blackbox Testing, Boundary Value Analysis, & Unit Test",
        duration: "105 Menit",
        status: "available",
        infographic: "assets/sdlc_infographic.jpg",
        infographicTitle: "Testing Pyramid: Unit, Integration, dan End-to-End Test",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/u6QfIXgjwGQ",
        videoTitle: "Software Testing Tutorial for Beginners",
        audioTitle: "Audio Kuliah: Menulis Test Case Berdasarkan Spesifikasi Kebutuhan",
        audioDuration: "12:40",
        audioTranscript: "Pengujian bukan sekadar mencari-cari bug, melainkan membuktikan secara empiris bahwa perangkat lunak memenuhi seluruh kriteria penerimaan yang disepakati di awal...",
        overview: "Mempelajari strategi pengujian perangkat lunak sistematis, perancangan skenario uji Blackbox (Equivalence Partitioning, BVA), dan pemahaman piramida pengujian.",
        learningOutcomes: [
          "Mampu menyusun matriks Test Case berbasis kebutuhan pengguna.",
          "Mampu menerapkan teknik Equivalence Partitioning dan Boundary Value Analysis.",
          "Memahami konsep Test-Driven Development (TDD)."
        ],
        textTheory: `
          <h3>1. Piramida Pengujian Perangkat Lunak (Testing Pyramid)</h3>
          <p>Distribusi pengujian yang sehat terdiri dari:</p>
          <ol>
            <li><strong>Unit Tests (Paling Bawah - Paling Banyak):</strong> Cepat, murah, menguji fungsi/metode terkecil secara terisolasi.</li>
            <li><strong>Integration Tests (Tengah):</strong> Menguji apakah modul-modul yang berbeda (misal: API dengan Database) bekerja harmonis bersama-sama.</li>
            <li><strong>E2E / UI Tests (Paling Atas - Paling Sedikit):</strong> Mensimulasikan pengguna nyata menekan tombol di browser. Lambat dan rentan (*flaky*).</li>
          </ol>
        `,
        quiz: [
          {
            id: "q10-1",
            question: "Teknik pengujian Blackbox yang menguji input pada nilai batas ekstrem (misal batas bawah 0, batas atas 100, dan nilai 101) disebut:",
            options: [
              "Whitebox Code Coverage",
              "Boundary Value Analysis (BVA)",
              "Mutation Testing",
              "Stress Testing"
            ],
            correct: 1,
            explanation: "Boundary Value Analysis (BVA) secara spesifik menguji nilai di sekitar ambang batas input karena cacat logika sering kali terjadi di area batas."
          }
        ],
        assignment: {
          id: "tugas-adpl-10",
          type: "Individu",
          title: "Tugas 10: Pembuatan Matriks Test Case Uji Blackbox",
          deadline: "2027-01-07 23:59:00",
          points: 100,
          instructions: `
            Buat tabel Test Case pengujian formulir pendaftaran mahasiswa baru (memuat input: Nama, Email, Umur, Nilai Rapor) dengan menggunakan teknik Equivalence Partitioning dan BVA.
          `
        },
        references: [
          { title: "Myers, G. J. - The Art of Software Testing 3rd Edition", type: "Buku Referensi", link: "https://wiley.com" }
        ]
      },
      {
        id: "adpl-m11",
        number: 11,
        title: "Perancangan Keamanan & Manajemen Resiko Perangkat Lunak",
        tagline: "Secure by Design, OWASP Top 10, Otentikasi JWT/OAuth, dan Threat Modeling",
        duration: "100 Menit",
        status: "available",
        infographic: "assets/sdlc_infographic.jpg",
        infographicTitle: "Diagram Alur Keamanan OWASP Top 10 & Token Authorization",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/F-GZf6qQ9vI",
        videoTitle: "OWASP Top 10 Explained for Software Developers",
        audioTitle: "Audio Kuliah: Jangan Pernah Menyimpan Password dalam Bentuk Plaintext!",
        audioDuration: "13:10",
        audioTranscript: "Keamanan bukan fitur yang dipasang di akhir proyek layaknya gembok pada pintu, melainkan harus dipikirkan sejak awal perancangan arsitektur (*Secure by Design*)...",
        overview: "Membahas prinsip keamanan rekayasa perangkat lunak, mitigasi kerentanan SQL Injection, XSS, CSRF, serta perancangan mekanisme otorisasi berbasis peran (RBAC).",
        learningOutcomes: [
          "Mampu mengidentifikasi 5 kerentanan teratas OWASP.",
          "Mampu merancang mekanisme hashing password dengan algoritma modern (Bcrypt/Argon2).",
          "Mampu menerapkan konsep Role-Based Access Control (RBAC)."
        ],
        textTheory: `
          <h3>1. Prinsip Least Privilege & Defense in Depth</h3>
          <p>Setiap komponen sistem (pengguna, proses, API service) hanya boleh diberikan hak akses seminimal mungkin yang diperlukan untuk menjalankan tugasnya.</p>
        `,
        quiz: [
          {
            id: "q11-1",
            question: "Mekanisme pengamanan terhadap serangan SQL Injection yang paling dianjurkan dalam desain aplikasi adalah:",
            options: [
              "Menghapus spasi dari input pengguna secara manual.",
              "Menggunakan Parameterized Queries / Prepared Statements.",
              "Menggunakan huruf kapital untuk semua tabel.",
              "Mematikan fungsi database di malam hari."
            ],
            correct: 1,
            explanation: "Prepared Statements memastikan bahwa data input pengguna diperlakukan murni sebagai parameter, bukan sebagai perintah query executable."
          }
        ],
        assignment: {
          id: "tugas-adpl-11",
          type: "Individu",
          title: "Tugas 11: Analisis Resiko Keamanan Sistem dan Rencana Mitigasi",
          deadline: "2027-01-14 23:59:00",
          points: 100,
          instructions: `
            Lakukan Threat Modeling singkat pada modul otentikasi login aplikasi dengan metodologi STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege).
          `
        },
        references: [
          { title: "OWASP Foundation - Top 10 Web Application Security Risks", type: "Pedoman Resmi", link: "https://owasp.org" }
        ]
      },
      {
        id: "adpl-m12",
        number: 12,
        title: "Pemodelan State Machine & Perancangan Komponen Sistem",
        tagline: "State Diagram, Transisi Kondisi, Trigger, Guard Condition, dan Component Diagram",
        duration: "100 Menit",
        status: "available",
        infographic: "assets/sdlc_infographic.jpg",
        infographicTitle: "State Transition Diagram: Siklus Status Transaksi",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/zQ8gq_qN79c",
        videoTitle: "UML State Machine Diagram Masterclass",
        audioTitle: "Audio Kuliah: Memetakan Status Pemesanan dari Pending ke Completed",
        audioDuration: "09:50",
        audioTranscript: "Sebuah objek pesanan tidak bisa tiba-tiba meloncat dari status 'Batal' menjadi 'Terkirim'. State machine diagram memastikan aturan transisi status dipatuhi dengan ketat...",
        overview: "Mempelajari cara memodelkan daur hidup objek yang memiliki siklus status kompleks dengan menggunakan UML State Machine Diagram.",
        learningOutcomes: [
          "Mampu menggambar State, Transition, Event Trigger, dan Guard Condition.",
          "Mampu mengidentifikasi kondisi buntu (deadlock state) pada alur sistem."
        ],
        textTheory: `
          <h3>1. Anatomi State Machine</h3>
          <p>Digunakan untuk mendeskripsikan perilaku sebuah objek tunggal selama masa hidupnya saat merespon kejadian luar (*events*).</p>
        `,
        quiz: [
          {
            id: "q12-1",
            question: "Kondisi boolean yang harus bernilai TRUE agar suatu transisi state dapat dieksekusi disebut:",
            options: ["Action", "Trigger", "Guard Condition", "Substate"],
            correct: 2,
            explanation: "Guard Condition dituliskan dalam kurung siku [kondisi] dan memvalidasi apakah transisi diizinkan terjadi."
          }
        ],
        assignment: {
          id: "tugas-adpl-12",
          type: "Individu",
          title: "Tugas 12: Desain State Machine Diagram Alur Pengajuan Beasiswa",
          deadline: "2027-01-21 23:59:00",
          points: 100,
          instructions: `
            Gambarkan State Diagram untuk siklus status permohonan beasiswa mahasiswa: Draft -> Diajukan -> Verifikasi Berkas -> Wawancara -> Diterima / Ditolak.
          `
        },
        references: [
          { title: "OMG Unified Modeling Language (OMG UML) Specification v2.5.1", type: "Standar Industri", link: "https://www.omg.org" }
        ]
      },
      {
        id: "adpl-m13",
        number: 13,
        title: "Perancangan Deployment & Arsitektur Cloud (Deployment Diagram)",
        tagline: "Nodes, Artifacts, Containerization (Docker), Load Balancer, dan CI/CD Pipeline",
        duration: "110 Menit",
        status: "available",
        infographic: "assets/sdlc_infographic.jpg",
        infographicTitle: "Deployment Diagram: Cloud Infrastructure & Docker Containers",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/qre_rNkJpYQ",
        videoTitle: "UML Deployment Diagram Tutorial & Modern Cloud Mapping",
        audioTitle: "Audio Kuliah: Menghubungkan Diagram Desain dengan Infrastruktur AWS/GCP",
        audioDuration: "11:20",
        audioTranscript: "Deployment diagram adalah representasi fisik dari sistem kita di dunia nyata: server mana yang menjalankan kode apa, port mana yang terbuka, dan bagaimana database direplikasi...",
        overview: "Membahas pemetaan komponen perangkat lunak ke dalam node perangkat keras dan virtualisasi cloud (Kubernetes, AWS/GCP, Nginx Reverse Proxy).",
        learningOutcomes: [
          "Mampu merancang Deployment Diagram dengan notasi node, artifact, dan protocol koneksi (HTTPS, TCP).",
          "Memahami topologi infrastruktur modern berbasis container."
        ],
        textTheory: `
          <h3>1. Komponen Deployment Diagram</h3>
          <p>Mendokumentasikan bagaimana artefak perangkat lunak dieksekusi di atas infrastruktur server fisik maupun virtual.</p>
        `,
        quiz: [
          {
            id: "q13-1",
            question: "Kotak 3 dimensi (kubus) dalam Deployment Diagram merepresentasikan:",
            options: ["Artifact kode sumber", "Node komputasi fisik / virtual", "Tabel database", "Metode fungsi"],
            correct: 1,
            explanation: "Kotak kubus 3D melambangkan 'Node' (misal: Application Server, Database Server, Mobile Device)."
          }
        ],
        assignment: {
          id: "tugas-adpl-13",
          type: "Kelompok",
          title: "Tugas Besar Milestone 4: Deployment Diagram & Rancangan Infrastruktur Cloud",
          deadline: "2027-01-28 23:59:00",
          points: 100,
          instructions: `
            Rancanglah Deployment Diagram untuk aplikasi kelompok Anda yang menunjukkan: Client Device (Browser/Mobile), CDN, Web Server, Database Cluster, dan Storage Bucket.
          `
        },
        references: [
          { title: "Newman, S. - Building Microservices 2nd Edition", type: "Buku O'Reilly", link: "https://samnewman.io" }
        ]
      },
      {
        id: "adpl-m14",
        number: 14,
        title: "Penyusunan Dokumentasi Desain Perangkat Lunak (SDDS / SAD)",
        tagline: "Software Design Document Standard, Traceability Matrix, & Quality Assurance",
        duration: "100 Menit",
        status: "available",
        infographic: "assets/sdlc_infographic.jpg",
        infographicTitle: "Struktur Dokumen Rekayasa Perangkat Lunak Profesional",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/w7FT_39vVlY",
        videoTitle: "How to Write a Software Architecture Document (SAD)",
        audioTitle: "Audio Kuliah: Menjaga Dokumentasi Tetap Hidup dan Tidak Usang",
        audioDuration: "10:15",
        audioTranscript: "Dokumentasi yang baik bukan dokumentasi yang paling tebal, melainkan dokumentasi yang akurat, mudah dipahami tim baru, dan selalu diperbarui...",
        overview: "Menyatukan seluruh diagram dan spesifikasi ke dalam satu dokumen baku standar industri: Software Architecture & Design Specification (SADS).",
        learningOutcomes: [
          "Mampu menyusun dokumen desain sistem standar IEEE 1016.",
          "Mampu membuat Requirements Traceability Matrix (RTM)."
        ],
        textTheory: `
          <h3>1. Dokumen Desain Perangkat Lunak Standar</h3>
          <p>Dokumen ini menjadi panduan tunggal kebenaran (*single source of truth*) bagi tim rekayasa sebelum dan selama proses pengkodean berlangsung.</p>
        `,
        quiz: [
          {
            id: "q14-1",
            question: "Tujuan utama dari Requirements Traceability Matrix (RTM) adalah:",
            options: [
              "Menghitung gaji tim pengembang.",
              "Melacak korelasi apakah setiap kebutuhan pengguna telah memiliki desain dan skenario pengujian terkait.",
              "Menggantikan seluruh diagram UML.",
              "Mencatat kehadiran anggota rapat harian."
            ],
            correct: 1,
            explanation: "RTM memastikan setiap butir kebutuhan bisnis dapat dilacak perwujudannya pada modul desain dan kasus uji (tidak ada fitur tertinggal)."
          }
        ],
        assignment: {
          id: "tugas-adpl-14",
          type: "Kelompok",
          title: "Pengumpulan Draft Lengkap Dokumen Software Design Document (Final Report)",
          deadline: "2027-02-04 23:59:00",
          points: 100,
          instructions: `
            Satukan seluruh milestone (SRS, Use Case, Class Diagram, Sequence, Arsitektur, ERD, UI Prototype, dan Test Plan) menjadi satu berkas PDF Dokumen Desain Sistem utuh.
          `
        },
        references: [
          { title: "IEEE 1016-2009 - Standard for Information Technology - Systems Design", type: "Standar Internasional", link: "https://ieee.org" }
        ]
      },
      {
        id: "adpl-m15",
        number: 15,
        title: "Presentasi Prototipe, Review Kode & Uji Usability Kelompok",
        tagline: "Showcase Prototipe Berfungsi, Verifikasi Konsistensi Desain, dan Tanya Jawab Teknis",
        duration: "120 Menit",
        status: "available",
        infographic: "assets/course_web.jpg",
        infographicTitle: "Checklist Kesiapan Presentasi & Demo Prototipe",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/5U_722V5s5o",
        videoTitle: "Product Demo & Technical Presentation Tips",
        audioTitle: "Audio Kuliah: Tips Menghadapi Pertanyaan Kritis dari Penguji",
        audioDuration: "08:50",
        audioTranscript: "Saat demo prototipe, tunjukkan alur nyata use case utama dari login hingga hasil akhir. Jangan hanya memperlihatkan antarmuka statis...",
        overview: "Sesi presentasi langsung dan demonstrasi prototipe yang telah dibangun oleh masing-masing kelompok mahasiswa di hadapan dosen pengampu dan rekan sejawat.",
        learningOutcomes: [
          "Mampu menyampaikan demo sistem perangkat lunak secara profesional dan sistematis.",
          "Mampu menjawab pertanyaan kritis terkait justifikasi keputusan desain yang diambil."
        ],
        textTheory: `
          <h3>Checklist Presentasi Final</h3>
          <p>Pastikan prototipe interaktif dapat dijalankan tanpa kendala koneksi lokal dan seluruh dokumen diagram telah dicetak/disiapkan.</p>
        `,
        quiz: [
          {
            id: "q15-1",
            question: "Saat mendemokan perangkat lunak ke stakeholder, fokus utama yang harus ditonjolkan adalah:",
            options: [
              "Menunjukkan baris kode assembly yang rumit.",
              "Membuktikan bahwa sistem mampu menyelesaikan masalah dan kebutuhan utama pengguna sesuai skenario use case.",
              "Menghabiskan waktu membahas lisensi server.",
              "Menunjukkan slide presentasi tanpa membuka aplikasi."
            ],
            correct: 1,
            explanation: "Stakeholder ingin melihat bukti nyata bahwa kebutuhan operasional mereka terselesaikan dengan lancar oleh sistem yang dibuat."
          }
        ],
        assignment: {
          id: "tugas-adpl-15",
          type: "Kelompok",
          title: "Slide Presentasi Sidang Akhir Proyek Desain Perangkat Lunak",
          deadline: "2027-02-11 23:59:00",
          points: 100,
          instructions: `
            Unggah slide presentasi maksimal 15 slide yang memuat: Latar Belakang Masalah, Diagram Use Case & Arsitektur Utama, Screenshot Prototipe, dan Kesimpulan Hasil Uji.
          `
        },
        references: [
          { title: "Panduan Teknis Presentasi Ilmiah & Sidang Tugas Akhir", type: "Pedoman Kampus", link: "#" }
        ]
      },
      {
        id: "adpl-m16",
        number: 16,
        title: "Evaluasi Akhir Semester (UAS) & Final Project Exhibition",
        tagline: "Penilaian Komprehensif Desain Sistem, Pengumpulan Source Code, dan Sertifikasi Selesai",
        duration: "120 Menit",
        status: "available",
        infographic: "assets/hero_banner.jpg",
        infographicTitle: "Kelulusan Mata Kuliah Analisis & Desain Perangkat Lunak",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/O94m5v3j4pY",
        videoTitle: "Software Engineer Career Pathways & Advanced System Architecture",
        audioTitle: "Audio Kuliah: Penutup Semester dari Dosen Pengampu & Pesan Moral",
        audioDuration: "07:15",
        audioTranscript: "Selamat kepada seluruh mahasiswa yang telah gigih belajar selama 16 minggu. Keahlian analisis dan desain sistem ini adalah pembeda utama antara seorang insinyur perangkat lunak sejati dengan sekadar juru ketik kode...",
        overview: "Pemberian nilai akhir, pengesahan dokumen spesifikasi perangkat lunak, evaluasi diri, dan penerbitan bukti pencapaian penyelesaian mata kuliah.",
        learningOutcomes: [
          "Menguasai kompetensi dasar insinyur perangkat lunak sesuai standar kurikulum ACM/IEEE.",
          "Memiliki portofolio desain sistem perangkat lunak yang siap dipresentasikan di dunia kerja."
        ],
        textTheory: `
          <h3>Selamat Telah Menyelesaikan 16 Pertemuan!</h3>
          <p>Anda telah menguasai seluruh spektrum Analisis dan Desain Perangkat Lunak: dari elisitasi kebutuhan, pemodelan UML struktural dan dinamis, arsitektur microservices dan MVC, perancangan database, heuristik UI/UX, pengujian blackbox, hingga deployment cloud.</p>
        `,
        quiz: [
          {
            id: "q16-1",
            question: "Apa tujuan filosofis utama dari dilakukannya Analisis dan Desain Perangkat Lunak secara terencana sebelum koding dimulai?",
            options: [
              "Hanya untuk memperbanyak dokumen kertas di kantor.",
              "Meminimalkan resiko kegagalan proyek, menjamin kesesuaian kebutuhan pengguna, serta menghasilkan arsitektur yang mudah dirawat dan dikembangkan.",
              "Agar mahasiswa tidak perlu memprogram lagi.",
              "Untuk menunda waktu perilisan aplikasi selama mungkin."
            ],
            correct: 1,
            explanation: "Sangat tepat! Perencanaan matang menghasilkan sistem yang andal, efisien, teruji, dan siap berevolusi di masa depan."
          }
        ],
        assignment: {
          id: "tugas-adpl-16",
          type: "Individu",
          title: "Refleksi Pembelajaran Mandiri & Pengumpulan Portofolio Akhir",
          deadline: "2027-02-18 23:59:00",
          points: 100,
          instructions: `
            Tuliskan esai refleksi mandiri 1 halaman: Apa materi yang paling menantang bagi Anda, bagaimana Anda mengatasi kesulitannya, dan bagaimana Anda akan menerapkan pengetahuan ADPL ini pada skripsi atau proyek industri Anda kelak.
          `
        },
        references: [
          { title: "ACM/IEEE Computer Society - Curriculum Guidelines for Undergraduate Degree Programs in Software Engineering", type: "Pedoman Internasional", link: "https://www.acm.org" }
        ]
      }
    ]
  },
  {
    id: "imk",
    code: "TI25D",
    title: "Interaksi Manusia & Komputer",
    className: "Interaksi Manusia & Komputer TI25D",
    alias: "IMK",
    semester: 5,
    academicYear: "2026/2027 Ganjil",
    schedule: "Senin 11:30:00 s/d 13:00:00",
    room: "Mahdor D 403",
    sks: 3,
    lecturer: "Nurhadi, M.Kom.",
    nip: "198402122008011004",
    department: "FT T. Informatika",
    category: "Wajib Program Studi",
    thumbnail: "assets/course_web.jpg",
    description: "Mempelajari prinsip desain antarmuka modern, ergonomi kognitif, User-Centered Design (UCD), wireframing & prototyping interaktif, serta evaluasi usability.",
    totalMeetings: 16,
    meetings: [
      {
        id: "imk-m1",
        number: 1,
        title: "Pengantar Interaksi Manusia & Komputer dan Ergonomi Visual",
        tagline: "Paradigma Interaksi, Model Mental Pengguna, dan Prinsip Desain UI/UX Modern",
        duration: "90 Menit",
        status: "available",
        infographic: "assets/course_web.jpg",
        infographicTitle: "Prinsip Ergonomi Visual & Hierarki Informasi UI",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/c9Wg6Cb_YlU",
        videoTitle: "Introduction to Human-Computer Interaction & UX",
        audioTitle: "Audio Kuliah: Memahami Pengguna Sebelum Merancang Tombol",
        audioDuration: "11:20",
        audioTranscript: "Di mata kuliah IMK ini kita belajar bahwa antarmuka bukan sekadar estetika gambar yang cantik, melainkan jembatan komunikasi antara kognisi manusia dengan mesin komputasi...",
        overview: "Fondasi interaksi manusia-komputer, ragam saluran sensorik, serta perancangan aplikasi yang meminimalkan beban kognitif (cognitive load).",
        learningOutcomes: [
          "Mampu menganalisis mental model pengguna saat berinteraksi dengan aplikasi.",
          "Mampu menerapkan prinsip affordance, signifier, dan feedback pada desain UI."
        ],
        textTheory: `
          <h3>Konsep Dasar Interaksi Manusia dan Komputer (IMK)</h3>
          <p>IMK adalah disiplin ilmu yang memusatkan perhatian pada perancangan, evaluasi, dan implementasi sistem komputasi interaktif yang digunakan oleh manusia.</p>
        `,
        quiz: [
          {
            id: "q-imk-1",
            question: "Isyarat visual atau fisik yang mengindikasikan bagaimana suatu objek antarmuka seharusnya digunakan dinamakan:",
            options: ["Affordance & Signifier", "Algorithm", "Database Index", "Compiler"],
            correct: 0,
            explanation: "Affordance dan Signifier memberikan petunjuk langsung kepada indra manusia mengenai cara interaksi (misal tombol yang tampak timbul memberi signifier untuk ditekan)."
          }
        ],
        assignment: {
          id: "tugas-imk-1",
          type: "Individu",
          title: "Tugas 1: Audit Desain Antarmuka Berdasarkan Prinsip Affordance & Signifier",
          deadline: "2026-11-04 23:59:00",
          points: 100,
          instructions: `Pilih 1 antarmuka aplikasi mobile yang membingungkan. Identifikasi masalah affordance/signifier dan buat sketsa perbaikannya.`
        },
        references: [
          { title: "Norman, D. - The Design of Everyday Things", type: "Buku Utama", link: "https://jnd.org" }
        ]
      }
    ]
  },
  {
    id: "pbp",
    code: "TI24D",
    title: "Pemograman Berbasis Platform",
    className: "Pemograman Berbasis Platform TI24D",
    alias: "PBP",
    semester: 5,
    academicYear: "2026/2027 Ganjil",
    schedule: "Senin 10:00:00 s/d 12:30:00",
    room: "Mahdor D 406",
    sks: 3,
    lecturer: "Faisal Rahman, S.T., M.Cs.",
    nip: "198606142010121005",
    department: "FT T. Informatika",
    category: "Wajib Program Studi",
    thumbnail: "assets/course_web.jpg",
    description: "Pengembangan aplikasi terintegrasi lintas platform (Web, Mobile, dan Cloud API) dengan teknologi modern, RESTful services, dan state management.",
    totalMeetings: 16,
    meetings: [
      {
        id: "pbp-m1",
        number: 1,
        title: "Arsitektur Platform Modern & Integrasi RESTful API",
        tagline: "Client-Server Paradigm, JSON Data Interchange, dan Stateless Communication",
        duration: "100 Menit",
        status: "available",
        infographic: "assets/course_web.jpg",
        infographicTitle: "Alur Pertukaran Data REST API Client ke Cloud Server",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/kM9AKn2iVio",
        videoTitle: "Cross-Platform Application Architecture Explained",
        audioTitle: "Audio Kuliah: Kenapa Aplikasi Modern Harus Berbasis Platform Terbuka?",
        audioDuration: "12:45",
        audioTranscript: "Dengan pendekatan berbasis platform, backend kita melayani berbagai macam klien sekaligus: browser web, aplikasi Android, dan IoT devices melalui satu endpoint API yang seragam...",
        overview: "Mempelajari pemisahan layer antarmuka pengguna dengan backend business logic serta standarisasi format JSON untuk komunikasi multi-klien.",
        learningOutcomes: [
          "Mampu merancang arsitektur API RESTful standar HTTP verbs (GET, POST, PUT, DELETE).",
          "Mampu melakukan integrasi data asinkronus (Fetch/Axios) pada aplikasi klien."
        ],
        textTheory: `
          <h3>Paradigma Pemrograman Berbasis Platform</h3>
          <p>Aplikasi modern tidak lagi dibuat monolitik tertutup untuk satu jenis sistem operasi, melainkan dibangun modular dengan backend micro-service yang mengekspos endpoint API.</p>
        `,
        quiz: [
          {
            id: "q-pbp-1",
            question: "Metode HTTP yang paling tepat digunakan untuk memperbarui seluruh data suatu resource yang sudah ada adalah:",
            options: ["GET", "PUT", "POST", "DELETE"],
            correct: 1,
            explanation: "PUT digunakan untuk mengganti atau memperbarui keseluruhan data resource secara idempoten."
          }
        ],
        assignment: {
          id: "tugas-pbp-1",
          type: "Individu",
          title: "Tugas 1: Pembangunan Endpoint RESTful API CRUD dengan Dokumentasi Postman",
          deadline: "2026-11-07 23:59:00",
          points: 100,
          instructions: `Buatlah 5 endpoint CRUD data mahasiswa dengan validasi schema JSON dan sertakan ekspor koleksi Postman.`
        },
        references: [
          { title: "Fielding, R. T. - Architectural Styles and the Design of Network-based Software Architectures", type: "Disertasi Asli REST", link: "https://ics.uci.edu" }
        ]
      }
    ]
  },
  {
    id: "tti",
    code: "TI24D",
    title: "Tata Tulis Ilmiah (Metodologi Penelitian)",
    className: "Tata Tulis Ilmiah (Metodologi Penelitian) TI24D",
    alias: "TTI",
    semester: 5,
    academicYear: "2026/2027 Ganjil",
    schedule: "Selasa 09:10:00 s/d 11:40:00",
    room: "Mahdor D 406",
    sks: 2,
    lecturer: "Prof. Dr. Ir. Wahyudi, M.Sc.",
    nip: "196811201994031001",
    department: "FT T. Informatika",
    category: "Wajib Program Studi",
    thumbnail: "assets/hero_banner.jpg",
    description: "Metodologi penelitian bidang ilmu komputer/informatika, telaah literatur ilmiah, perumusan rumusan masalah & hipotesis, sitasi terstandar, dan penulisan skripsi/jurnal.",
    totalMeetings: 16,
    meetings: [
      {
        id: "tti-m1",
        number: 1,
        title: "Etika Penelitian & Penemuan State-of-the-Art Literatur Ilmiah",
        tagline: "Studi Pustaka Sistematis (SLR), Menghindari Plagiarisme, dan Manajemen Referensi",
        duration: "80 Menit",
        status: "available",
        infographic: "assets/hero_banner.jpg",
        infographicTitle: "Siklus Penelitian Ilmiah Informatika",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/w7FT_39vVlY",
        videoTitle: "Systematic Literature Review in Computer Science",
        audioTitle: "Audio Kuliah: Membedakan Masalah Nyata vs Masalah Teknis Biasa",
        audioDuration: "09:30",
        audioTranscript: "Skripsi atau paper ilmiah harus memiliki kontribusi ilmiah (*novelty*). Membuat aplikasi web sederhana tanpa adanya perbandingan algoritma atau evaluasi empiris bukanlah penelitian...",
        overview: "Membahas perumusan research question, teknik pencarian artikel bereputasi di Scopus/IEEE Xplore, serta etika publikasi ilmiah.",
        learningOutcomes: [
          "Mampu merumuskan Research Question menggunakan kerangka PICOC.",
          "Mampu menggunakan software reference manager (Mendeley/Zotero)."
        ],
        textTheory: `
          <h3>Struktur Artikel Ilmiah (IMRAD)</h3>
          <p>Format baku artikel ilmiah internasional terdiri dari: Introduction, Methods, Results, and Discussion (IMRAD).</p>
        `,
        quiz: [
          {
            id: "q-tti-1",
            question: "Tindakan mengambil karya, ide, atau tulisan orang lain tanpa memberikan sitasi atau atribusi yang sah dinamakan:",
            options: ["Plagiarisme", "Peer Review", "Indexing", "Sitasi Silang"],
            correct: 0,
            explanation: "Plagiarisme adalah pelanggaran etika akademik berat yang melanggar integritas ilmiah."
          }
        ],
        assignment: {
          id: "tugas-tti-1",
          type: "Individu",
          title: "Tugas 1: Resume 3 Paper Jurnal Internasional Bereputasi Terkait Topik Skripsi",
          deadline: "2026-11-10 23:59:00",
          points: 100,
          instructions: `Cari 3 artikel jurnal IEEE/ScienceDirect 3 tahun terakhir dan buat ringkasan matriks: Masalah, Metode, dan Hasil Penelitian.`
        },
        references: [
          { title: "Booth, W. C. et al. - The Craft of Research 4th Edition", type: "Pedoman Riset", link: "https://press.uchicago.edu" }
        ]
      }
    ]
  },
  {
    id: "mpti",
    code: "TI24D",
    title: "Manajemen Proyek Teknologi Informasi",
    className: "Manajemen Proyek Teknologi Informasi TI24D",
    alias: "MPTI",
    semester: 5,
    academicYear: "2026/2027 Ganjil",
    schedule: "Senin 07:30:00 s/d 10:00:00",
    room: "Mahdor D 406",
    sks: 3,
    lecturer: "Rizki Pratama, M.Kom., PMP",
    nip: "198309152009121003",
    department: "FT T. Informatika",
    category: "Wajib Program Studi",
    thumbnail: "assets/sdlc_infographic.jpg",
    description: "Pengelolaan proyek perangkat lunak dari inisiasi hingga closing, Project Management Body of Knowledge (PMBOK), WBS, Critical Path Method (CPM), dan estimasi biaya (COCOMO).",
    totalMeetings: 16,
    meetings: [
      {
        id: "mpti-m1",
        number: 1,
        title: "Pengantar Manajemen Proyek TI & Project Charter",
        tagline: "Triple Constraint (Scope, Time, Cost) dan Inisiasi Proyek Perangkat Lunak",
        duration: "90 Menit",
        status: "available",
        infographic: "assets/sdlc_infographic.jpg",
        infographicTitle: "Segitiga Triple Constraint Manajemen Proyek TI",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/84qX1q6c344",
        videoTitle: "Project Management Foundations: Triple Constraints",
        audioTitle: "Audio Kuliah: Mengapa 68% Proyek Software Sering Mengalami Keterlambatan?",
        audioDuration: "13:15",
        audioTranscript: "Scope creep adalah musuh terbesar project manager. Ketika klien terus menambah fitur tanpa penyesuaian anggaran dan waktu, kegagalan proyek sudah di depan mata...",
        overview: "Mempelajari kerangka kerja PMBOK 10 knowledge areas, penyusunan dokumen Project Charter resmi, dan mitigasi scope creep.",
        learningOutcomes: [
          "Mampu menyusun Project Charter yang disahkan sponsor proyek.",
          "Mampu memetakan Work Breakdown Structure (WBS) hingga level work package."
        ],
        textTheory: `
          <h3>Segitiga Manajemen Proyek (Triple Constraints)</h3>
          <p>Tiga batasan utama yang saling mempengaruhi dalam setiap proyek TI: Lingkup Pekerjaan (Scope), Waktu (Time), dan Biaya/Anggaran (Cost).</p>
        `,
        quiz: [
          {
            id: "q-mpti-1",
            question: "Fenomena bertambahnya fitur sistem secara terus-menerus tanpa terkontrol dan tanpa penyesuaian waktu serta biaya disebut:",
            options: ["Scope Creep", "Sprint Backlog", "Critical Path", "Budget Reserve"],
            correct: 0,
            explanation: "Scope Creep terjadi ketika lingkup proyek melebar di luar kesepakatan awal tanpa persetujuan perubahan formal (Change Request)."
          }
        ],
        assignment: {
          id: "tugas-mpti-1",
          type: "Kelompok",
          title: "Tugas Besar Kelompok MPTI: Penyusunan Dokumen Project Charter & WBS",
          deadline: "2026-11-09 23:59:00",
          points: 100,
          instructions: `Susun Project Charter lengkap untuk sebuah aplikasi sistem informasi kampus memuat: Business Case, Project Objectives, Milestone Schedule, dan Risiko Awal.`
        },
        references: [
          { title: "Project Management Institute - A Guide to the Project Management Body of Knowledge (PMBOK Guide 7th Ed)", type: "Standar Global PMI", link: "https://pmi.org" }
        ]
      }
    ]
  },
  {
    id: "aik4",
    code: "TI24D",
    title: "AIK 4 (Islam dan Ilmu Pengetahuan)",
    className: "AIK 4 (Islam dan Ilmu Pengetahuan) TI24D",
    alias: "AIK 4",
    semester: 5,
    academicYear: "2026/2027 Ganjil",
    schedule: "Kamis 10:00:00 s/d 11:40:00",
    room: "Mahdor D 405",
    sks: 2,
    lecturer: "Dr. H. Ahmad Fauzi, M.Ag.",
    nip: "197503102001121002",
    department: "FT T. Informatika",
    category: "Wajib Universitas",
    thumbnail: "assets/hero_banner.jpg",
    description: "Mempelajari integrasi nilai-nilai keislaman dengan sains dan rekayasa teknologi, etika profesional teknologi informasi, bioetika, serta sejarah kejayaan sains peradaban Islam.",
    totalMeetings: 16,
    meetings: [
      {
        id: "aik4-m1",
        number: 1,
        title: "Epistemologi Sains dalam Islam & Etika Digital Modern",
        tagline: "Ayat Kauniyah dan Kauliyah, Integritas Pengembang Perangkat Lunak, dan Etika AI",
        duration: "80 Menit",
        status: "available",
        infographic: "assets/hero_banner.jpg",
        infographicTitle: "Integrasi Nilai Islam dan Kemajuan Sains Komputasi",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/2_88m_9n7_0",
        videoTitle: "Islamic Scientific Heritage and Ethics in Technology",
        audioTitle: "Audio Kuliah: Tanggung Jawab Moral Insinyur Perangkat Lunak",
        audioDuration: "10:10",
        audioTranscript: "Teknologi seperti kecerdasan buatan adalah instrumen. Nilai maslahat atau mudaratnya sangat bergantung pada akhlak dan etika manusia yang merancangnya...",
        overview: "Membahas konsep tauhid sebagai landasan keilmuan, harmoni antara akal dan wahyu, serta tanggung jawab sosial pengembang teknologi.",
        learningOutcomes: [
          "Mampu merefleksikan peran sains sebagai sarana ibadah dan kemaslahatan umat.",
          "Mampu menerapkan kode etik moral dalam rekayasa teknologi informasi."
        ],
        textTheory: `
          <h3>Islam, Rasionalitas, dan Tanggung Jawab Moral Sains</h3>
          <p>Dalam Islam, menuntut ilmu dan mengembangkan teknologi untuk kemaslahatan umat manusia adalah bagian dari manifestasi khalifah fil ardh.</p>
        `,
        quiz: [
          {
            id: "q-aik-1",
            question: "Tanda-tanda kebesaran Allah SWT yang tersebar di alam semesta dan dapat diobservasi secara empiris oleh sains disebut:",
            options: ["Ayat Kauniyah", "Ayat Kauliyah", "Hadis Dhaif", "Ijma"],
            correct: 0,
            explanation: "Ayat Kauniyah adalah fenomena alam semesta ciptaan-Nya yang dipelajari dan diamati melalui metodologi sains."
          }
        ],
        assignment: {
          id: "tugas-aik4-1",
          type: "Individu",
          title: "Tugas 1: Esai Refleksi Etika Kecerdasan Buatan (AI) Ditinjau dari Nilai Kemanusiaan",
          deadline: "2026-11-13 23:59:00",
          points: 100,
          instructions: `Tulis esai reflektif 2 halaman mengenai etika privasi data dan pengembangan AI yang berkeadilan.`
        },
        references: [
          { title: "Bakar, O. - Tawhid and Science: Islamic Perspectives on Religion and Science", type: "Buku Rujukan", link: "#" }
        ]
      }
    ]
  },
  {
    id: "aicp",
    code: "24K2A",
    title: "AI Computing Platform",
    className: "AI Computing Platform 24K2A",
    alias: "AICP",
    semester: 5,
    academicYear: "2026/2027 Ganjil",
    schedule: "Rabu 18:00:00 s/d 22:00:00",
    room: "Mahdor C 303",
    sks: 3,
    lecturer: "Dr. Eng. Teguh Wibowo, S.T., M.Eng.",
    nip: "198510252012011006",
    department: "FT T. Informatika",
    category: "Pilihan Keahlian AI",
    thumbnail: "assets/course_web.jpg",
    description: "Infrastruktur komputasi untuk beban kerja Artificial Intelligence, arsitektur akselerator hardware (GPU/TPU), distributed training, model serving, dan MLOps platform modern.",
    totalMeetings: 16,
    meetings: [
      {
        id: "aicp-m1",
        number: 1,
        title: "Arsitektur Komputasi AI & Akselerasi Paralel GPU (CUDA)",
        tagline: "Von Neumann vs Tensor Parallelism, Memory Hierarchy, dan GPU Computing",
        duration: "120 Menit",
        status: "available",
        infographic: "assets/course_web.jpg",
        infographicTitle: "Arsitektur CPU Core vs GPU Tensor Core dalam Training AI",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/DMnBHJ-jW3k",
        videoTitle: "How GPUs Accelerate Machine Learning Workloads",
        audioTitle: "Audio Kuliah: Bottleneck Memori pada LLM dan Large Scale Models",
        audioDuration: "14:50",
        audioTranscript: "Dalam AI modern, masalah terbesar bukan lagi kecepatan komputasi FLOPS murni, melainkan throughput memori bandwidth (Memory Wall) saat memindahkan miliaran parameter model...",
        overview: "Mempelajari evolusi komputasi dari pemrosesan serial CPU hingga komputasi paralel masif ribuan core GPU menggunakan framework CUDA dan Triton.",
        learningOutcomes: [
          "Memahami perbedaan karakteristik beban kerja skalar CPU vs matriks GPU.",
          "Mampu mengonfigurasi environment MLOps terakselerasi GPU."
        ],
        textTheory: `
          <h3>Komputasi Paralel untuk Model AI</h3>
          <p>Pelatihan deep learning didominasi oleh perkalian matriks dens (*General Matrix Multiply - GEMM*), yang sangat efisien dijalankan di ribuan core mikro GPU secara bersamaan.</p>
        `,
        quiz: [
          {
            id: "q-aicp-1",
            question: "Komponen perangkat keras yang dirancang secara khusus untuk mempercepat operasi perkalian matriks dalam deep learning adalah:",
            options: ["Tensor Cores / TPU", "Hard Disk Drive", "Network Interface Card", "VGA Analog Port"],
            correct: 0,
            explanation: "Tensor Cores (pada GPU NVIDIA) dan TPU (pada Google Cloud) dirancang secara spesifik untuk memproses komputasi matriks FP16/BF16/INT8 dalam satu siklus clock."
          }
        ],
        assignment: {
          id: "tugas-aicp-1",
          type: "Individu",
          title: "Tugas 1: Benchmark Performa Komputasi Matriks CPU vs GPU pada Google Colab",
          deadline: "2026-11-11 23:59:00",
          points: 100,
          instructions: `Lakukan benchmarking perkalian matriks 10.000 x 10.000 pada PyTorch menggunakan CPU vs CUDA GPU T4. Plot grafik perbandingan waktu eksekusinya.`
        },
        references: [
          { title: "Hennessy, J. L., & Patterson, D. A. - Computer Architecture: A Quantitative Approach 6th Ed", type: "Buku Standar Dunia", link: "https://elsevier.com" }
        ]
      }
    ]
  },
  {
    id: "arvr",
    code: "24K2B",
    title: "Teknologi AR/VR",
    className: "Teknologi AR/VR 24K2B",
    alias: "AR/VR",
    semester: 5,
    academicYear: "2026/2027 Ganjil",
    schedule: "Selasa 13:00:00 s/d 15:30:00",
    room: "Mahdor D 406",
    sks: 3,
    lecturer: "Aditya Wardhana, M.T.",
    nip: "198807182014021003",
    department: "FT T. Informatika",
    category: "Pilihan Keahlian Multimedia",
    thumbnail: "assets/hero_banner.jpg",
    description: "Perancangan pengalaman imersif Augmented Reality & Virtual Reality, pelacakan spasial (6-DOF, SLAM), grafika komputer 3D real-time, dan implementasi WebXR/Unity.",
    totalMeetings: 16,
    meetings: [
      {
        id: "arvr-m1",
        number: 1,
        title: "Konsep Imersi Spatial Computing & Tracking Sensor AR/VR",
        tagline: "Reality-Virtuality Continuum, 3-DOF vs 6-DOF, dan Spatial Anchors",
        duration: "100 Menit",
        status: "available",
        infographic: "assets/hero_banner.jpg",
        infographicTitle: "Spektrum Kontinum Realitas: Dari Dunia Nyata hingga Pure VR",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/UI6lqHOVHic",
        videoTitle: "Augmented Reality & Virtual Reality Technologies Explained",
        audioTitle: "Audio Kuliah: Mengatasi Motion Sickness pada Pengalaman VR",
        audioDuration: "12:00",
        audioTranscript: "Motion sickness terjadi ketika ada disonansi antara input visual mata dengan cairan keseimbangan telinga dalam (vestibular system). Di AR/VR, latency di atas 20ms sudah memicu mual...",
        overview: "Membahas kontinum Milgram, perbedaan AR, VR, dan Mixed Reality (MR), serta mekanika tracking kamera Inside-Out dan Outside-In.",
        learningOutcomes: [
          "Mampu membedakan derajat kebebasan gerak (3 Degrees of Freedom vs 6 Degrees of Freedom).",
          "Mampu memahami prinsip kerja Simultaneous Localization and Mapping (SLAM)."
        ],
        textTheory: `
          <h3>Kontinum Realitas Milgram (Reality-Virtuality Continuum)</h3>
          <p>Rentang kontinum menghubungkan lingkungan nyata murni di ujung kiri dengan lingkungan virtual murni (Virtual Reality) di ujung kanan, dengan Augmented Reality dan Augmented Virtuality di antaranya.</p>
        `,
        quiz: [
          {
            id: "q-arvr-1",
            question: "Sistem pelacakan posisi dan orientasi kepala yang mampu mendeteksi gerakan maju-mundur, kiri-kanan, dan atas-bawah sekaligus disebut:",
            options: ["6-DOF (Six Degrees of Freedom)", "3-DOF", "Monoscopic Camera", "Stereo Speaker"],
            correct: 0,
            explanation: "6-DOF melacak 3 sumbu rotasi (pitch, yaw, roll) ditambah 3 sumbu translasi pergerakan fisik (x, y, z)."
          }
        ],
        assignment: {
          id: "tugas-arvr-1",
          type: "Individu",
          title: "Tugas 1: Pembuatan Objek 3D Interaktif WebAR Menggunakan Marker QR",
          deadline: "2026-11-14 23:59:00",
          points: 100,
          instructions: `Rancang demo WebAR sederhana menggunakan pustaka AR.js atau model-viewer yang menampilkan objek 3D ketika kamera mendeteksi Hiro Marker.`
        },
        references: [
          { title: "Craig, A. B. - Understanding Augmented Reality: Concepts and Applications", type: "Buku Rujukan", link: "https://elsevier.com" }
        ]
      }
    ]
  }
];

// E-Library & Bank Referensi Umum untuk Mahasiswa
const GLOBAL_RESOURCES = [
  {
    category: "Buku & E-Book Utama",
    title: "Software Engineering: A Practitioner's Approach (9th Ed)",
    author: "Roger S. Pressman, Bruce R. Maxim",
    year: "2020",
    tags: ["ADPL", "RPL", "Metodologi"],
    link: "https://www.mheducation.com",
    badge: "Buku Wajib"
  },
  {
    category: "Buku & E-Book Utama",
    title: "UML Distilled: A Brief Guide to the Standard Object Modeling Language (3rd Ed)",
    author: "Martin Fowler",
    year: "2018",
    tags: ["UML", "Class Diagram", "Sequence"],
    link: "https://martinfowler.com",
    badge: "Buku Standar"
  },
  {
    category: "Tools Pemodelan UML & Desain",
    title: "Visual Paradigm Online / Desktop Community",
    author: "Visual Paradigm",
    year: "2026",
    tags: ["Tool", "UML", "ERD"],
    link: "https://www.visual-paradigm.com",
    badge: "Software Recommended"
  },
  {
    category: "Tools Pemodelan UML & Desain",
    title: "PlantUML & Mermaid.js Text-to-Diagram",
    author: "Open Source Community",
    year: "2026",
    tags: ["Tool", "Diagram as Code"],
    link: "https://mermaid.js.org",
    badge: "Productivity"
  },
  {
    category: "Standar Industri",
    title: "IEEE 830-1998 Recommended Practice for Software Requirements Specifications",
    author: "IEEE Standards Association",
    year: "2019",
    tags: ["Standar", "SRS", "Kebutuhan"],
    link: "https://standards.ieee.org",
    badge: "Standar Resmi"
  },
  {
    category: "Standar Industri",
    title: "OWASP Top Ten Web Application Security Project",
    author: "OWASP Foundation",
    year: "2025/2026",
    tags: ["Security", "Web", "ADPL"],
    link: "https://owasp.org",
    badge: "Best Practice"
  }
];

// Mahasiswa Default Profile (Data awal untuk sesi mandiri)
const INITIAL_STUDENT_PROFILE = {
  name: "Salwa Della Amalia",
  nim: "24011150",
  program: "S1 Teknik Informatika",
  semester: 5,
  academicYear: "2026/2027 Ganjil",
  academicStatus: "Aktif",
  completedCredits: 88,
  avatarInitial: "SD"
};

// Global window exposure for browser cross-script compatibility
if (typeof window !== "undefined") {
  window.COURSES_DATA = COURSES_DATA;
  window.INITIAL_STUDENT_PROFILE = INITIAL_STUDENT_PROFILE;
}
