/**
 * APP LOGIC - PORTAL PEMBELAJARAN MAHASISWA & SISTEM INFORMASI TUGAS
 * Mengintegrasikan:
 * - Manajemen State (LocalStorage) & Dynamic Content Management (CMS)
 * - CRUD Mata Kuliah: Tambah, Edit, Hapus, dan Reset Mata Kuliah
 * - CRUD Sesi Pertemuan: Materi Teks, Berkas Modul, Infografis, Video, Audio, Kuis, & Tugas
 * - Pemutar Multimedia & Visualizer Audio
 * - Engine Kuis Interaktif dengan Audio Synth Feedback
 * - Manajemen Tugas (Individu & Kelompok) & Modal Submission
 * - Catatan Mandiri Auto-save & Dark/Light Mode
 */

// Application State
const state = {
  currentCourseId: "adpl",
  currentSessionId: "adpl-m1",
  activeNavTab: "dashboard",
  activeMediaTab: "theory",
  assignmentFilter: "all",
  isManageMode: JSON.parse(localStorage.getItem("edu_is_manage_mode") || "true"),
  quizViewMode: "play", // "play" or "manage"
  
  // LocalStorage Persisted State
  progress: JSON.parse(localStorage.getItem("edu_progress") || '{"completedSessions": ["adpl-m1"]}'),
  quizResults: JSON.parse(localStorage.getItem("edu_quiz_results") || '{}'),
  submissions: JSON.parse(localStorage.getItem("edu_submissions") || '{}'),
  notes: JSON.parse(localStorage.getItem("edu_notes") || '{}'),
  theme: localStorage.getItem("edu_theme") || "dark",
  customMaterials: JSON.parse(localStorage.getItem("edu_custom_materials") || '{}')
};

// Web Audio API Synthesizer for rich interactive audio chimes
class SoundEffects {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playSuccess() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2);
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.3);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch(e) {
      console.warn("Audio synth error:", e);
    }
  }

  playError() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(160, now + 0.25);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch(e) {
      console.warn("Audio synth error:", e);
    }
  }

  playClick() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch(e) {
      console.warn("Audio synth error:", e);
    }
  }
}

const sfx = new SoundEffects();

// Helper Toast Notification
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  // Batasi maksimal 3 toast agar tidak menumpuk memenuhi layar
  const currentToasts = container.querySelectorAll(".toast-message");
  if (currentToasts.length >= 3) {
    currentToasts[0].remove();
  }

  const toast = document.createElement("div");
  toast.className = "toast-message";
  const icon = type === "success" ? "✅" : type === "error" ? "⚠️" : "ℹ️";
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// -------------------------------------------------------------
// COURSE DATA MANAGEMENT (PERSISTENT & EDITABLE COURSES)
// -------------------------------------------------------------
function getAllCourses() {
  const custom = localStorage.getItem("edu_custom_courses");
  if (custom) {
    try {
      const parsed = JSON.parse(custom);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch(e) {
      console.warn("Failed parsing custom courses:", e);
    }
  }
  const fallback = (typeof COURSES_DATA !== "undefined" ? COURSES_DATA : (typeof window !== "undefined" ? window.COURSES_DATA : [])) || [];
  return JSON.parse(JSON.stringify(fallback));
}

function saveAllCourses(courses) {
  localStorage.setItem("edu_custom_courses", JSON.stringify(courses));
}

// Generate default 16 meetings when a new course is added
function generateDefaultMeetings(courseAlias) {
  const safeAlias = (courseAlias || "mk").toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "matkul";
  const meetings = [];
  for (let i = 1; i <= 16; i++) {
    let title = `Pertemuan ${i}: Pembahasan Materi ${courseAlias}`;
    let tagline = `Konsep dasar, studi kasus, dan implementasi materi ${courseAlias} pertemuan ${i}`;
    if (i === 8) {
      title = `Evaluasi Tengah Semester (UTS) ${courseAlias}`;
      tagline = `Ujian teori dan evaluasi pencapaian materi tengah semester`;
    } else if (i === 16) {
      title = `Evaluasi Akhir Semester (UAS) & Final Project ${courseAlias}`;
      tagline = `Pameran karya akhir semester dan evaluasi komprehensif`;
    }

    meetings.push({
      id: `${safeAlias}-m${i}`,
      number: i,
      title: title,
      tagline: tagline,
      duration: "90 Menit",
      status: "available",
      infographic: "assets/course_web.jpg",
      infographicTitle: `Infografis Pertemuan ${i}`,
      videoEmbedUrl: "https://www.youtube-nocookie.com/embed/kM9AKn2iVio",
      videoTitle: `Video Kuliah Pertemuan ${i}`,
      audioTitle: `Audio Penjelasan Dosen: Pertemuan ${i}`,
      audioDuration: "12:00",
      audioTranscript: `Transkrip pengantar materi pertemuan ${i}...`,
      overview: `Membahas konsep dan kompetensi inti pada pertemuan ke-${i}.`,
      learningOutcomes: [
        `Memahami teori dasar pertemuan ${i}.`,
        `Mampu mempraktikkan studi kasus topik pertemuan ${i}.`
      ],
      textTheory: `<h3>Materi Perkuliahan Pertemuan ${i}</h3><p>Selamat datang di sesi pembelajaran pertemuan ke-${i}. Anda dapat menggunakan tombol 'Edit' di atas untuk melengkapi naskah teori ini dan mengunggah berkas modul terkait.</p>`,
      quiz: [
        {
          id: `q-${safeAlias}-${i}-1`,
          question: `Pertanyaan evaluasi pemahaman untuk materi pertemuan ${i}:`,
          options: [
            "Pilihan jawaban A (Benar)",
            "Pilihan jawaban B",
            "Pilihan jawaban C",
            "Pilihan jawaban D"
          ],
          correct: 0,
          explanation: "Jawaban A adalah pilihan yang paling tepat sesuai teori yang dipelajari."
        }
      ],
      assignment: (i === 3 || i === 7 || i === 12) ? {
        id: `tugas-${safeAlias}-${i}`,
        type: i % 2 === 0 ? "Kelompok" : "Individu",
        title: `Tugas Pertemuan ${i}: Studi Kasus & Praktik ${courseAlias}`,
        deadline: "2026-11-28 23:59:00",
        points: 100,
        instructions: `Kerjakan analisis dan implementasi topik pertemuan ${i}. Kumpulkan laporan dalam format PDF atau cantumkan tautan cloud.`,
        templateFile: "Template_Laporan_Tugas.docx"
      } : null,
      references: [
        { title: `Diktat Kuliah Resmi ${courseAlias}`, type: "Diktat", link: "#" }
      ]
    });
  }
  return meetings;
}

// Helper to get session data merged with dynamic custom changes (CRUD)
function getResolvedMeeting(courseId, meetingId) {
  const allCourses = getAllCourses();
  const course = allCourses.find(c => c.id === courseId) || allCourses[0];
  const original = (course.meetings && course.meetings.find(m => m.id === meetingId)) || (course.meetings && course.meetings[0]) || {
    id: meetingId || "m1",
    number: 1,
    title: "Pengantar Mata Kuliah",
    tagline: "Sesi Pendahuluan",
    duration: "90 Menit"
  };

  const custom = state.customMaterials[original.id];

  // Default structure
  const baseFiles = [
    {
      id: `default-file-${original.id}`,
      name: `Modul_Kuliah_${original.number}_${course.alias || 'Materi'}.pdf`,
      size: "2.4 MB",
      type: "application/pdf",
      date: "Materi Terverifikasi Dosen",
      desc: "Slide presentasi & diktat perkuliahan lengkap."
    }
  ];

  const baseInfographics = [
    {
      id: `default-info-${original.id}`,
      url: original.infographic || "assets/sdlc_infographic.jpg",
      title: original.infographicTitle || "Infografis Materi Perkuliahan",
      desc: "Diagram visual arsitektural resolusi tinggi."
    }
  ];

  const baseVideos = [
    {
      id: `default-video-${original.id}`,
      title: original.videoTitle || "Video Kuliah Pembelajaran",
      embedUrl: original.videoEmbedUrl || "https://www.youtube-nocookie.com/embed/2_88m_9n7_0",
      duration: original.duration || "90 Menit"
    }
  ];

  const baseAudios = [
    {
      id: `default-audio-${original.id}`,
      title: original.audioTitle || "Voice Note & Penjelasan Dosen",
      duration: original.audioDuration || "12:00",
      transcript: original.audioTranscript || "Transkrip materi perkuliahan."
    }
  ];

  if (!custom) {
    return {
      ...original,
      files: baseFiles,
      infographics: baseInfographics,
      videos: baseVideos,
      audios: baseAudios,
      quiz: original.quiz ? [...original.quiz] : [],
      assignment: original.assignment ? { ...original.assignment } : null
    };
  }

  return {
    ...original,
    title: custom.title !== undefined ? custom.title : original.title,
    tagline: custom.tagline !== undefined ? custom.tagline : original.tagline,
    textTheory: custom.textTheory !== undefined ? custom.textTheory : original.textTheory,
    learningOutcomes: custom.learningOutcomes !== undefined ? custom.learningOutcomes : original.learningOutcomes,
    files: custom.files !== undefined ? custom.files : baseFiles,
    infographics: custom.infographics !== undefined ? custom.infographics : baseInfographics,
    videos: custom.videos !== undefined ? custom.videos : baseVideos,
    audios: custom.audios !== undefined ? custom.audios : baseAudios,
    quiz: custom.quiz !== undefined ? custom.quiz : (original.quiz ? [...original.quiz] : []),
    assignment: custom.assignment !== undefined ? custom.assignment : (original.assignment ? { ...original.assignment } : null)
  };
}

// DOM Initialization
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  renderStudentProfileUI();
  setupNavListeners();
  renderDashboard();
  renderCourseSelect();
  renderClassroom();
  renderAssignmentsHub();
  renderResourcesHub();
  setupGlobalSearch();
  setupModalEvents();
  updateAcademicProgressUI();
});

// -------------------------------------------------------------
// STUDENT PROFILE MANAGEMENT (USERNAME & IDENTITY)
// -------------------------------------------------------------
function getStudentProfile() {
  const saved = localStorage.getItem("edu_student_profile");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.name) return parsed;
    } catch(e) {
      console.warn("Failed parsing student profile:", e);
    }
  }
  return {
    name: "Salwa Della Amalia",
    nim: "24011150",
    semester: 5,
    academicYear: "2026/2027 Ganjil",
    avatarInitial: "SD"
  };
}

function saveStudentProfile(profile) {
  localStorage.setItem("edu_student_profile", JSON.stringify(profile));
  renderStudentProfileUI();
}

function renderStudentProfileUI() {
  const profile = getStudentProfile();
  const nameEl = document.getElementById("userNameDisplay");
  const nimEl = document.getElementById("userNimDisplay");
  const avatarEl = document.getElementById("userAvatarInitial");
  const heroNameEl = document.getElementById("heroWelcomeTitle");
  const widgetEl = document.getElementById("userProfileWidget");

  if (nameEl) nameEl.textContent = profile.name;
  if (nimEl) nimEl.textContent = `${profile.nim} • Sem. ${profile.semester}`;
  if (avatarEl) avatarEl.textContent = profile.avatarInitial || profile.name.slice(0, 2).toUpperCase();
  if (heroNameEl) heroNameEl.textContent = `Selamat Datang, ${profile.name}!`;
  if (widgetEl) widgetEl.setAttribute("title", `Profil Mahasiswa: ${profile.name} (${profile.nim}) - Klik untuk Mengedit`);
}

window.openProfileModal = function() {
  sfx.playClick();
  const profile = getStudentProfile();
  const modal = document.getElementById("profileModal");
  if (!modal) return;

  const inputName = document.getElementById("profileFormName");
  const inputNim = document.getElementById("profileFormNim");
  const inputSemester = document.getElementById("profileFormSemester");
  const inputAvatar = document.getElementById("profileFormAvatar");

  if (inputName) inputName.value = profile.name;
  if (inputNim) inputNim.value = profile.nim;
  if (inputSemester) inputSemester.value = profile.semester;
  if (inputAvatar) inputAvatar.value = profile.avatarInitial || "SD";

  modal.classList.add("active");
};

window.closeProfileModal = function() {
  const modal = document.getElementById("profileModal");
  if (modal) modal.classList.remove("active");
};

window.handleSaveProfile = function(event) {
  event.preventDefault();
  const name = document.getElementById("profileFormName").value.trim();
  const nim = document.getElementById("profileFormNim").value.trim();
  const semester = parseInt(document.getElementById("profileFormSemester").value, 10) || 5;
  let avatarInitial = document.getElementById("profileFormAvatar").value.trim().toUpperCase();

  if (!avatarInitial && name) {
    const parts = name.split(" ");
    avatarInitial = parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
  }

  const updatedProfile = {
    name,
    nim,
    semester,
    academicYear: "2026/2027 Ganjil",
    avatarInitial
  };

  saveStudentProfile(updatedProfile);
  sfx.playSuccess();
  closeProfileModal();
  showToast(`Profil mahasiswa diperbarui: ${name} (${nim})`, "success");
};

// Theme Management
function applyThemeUI() {
  document.documentElement.setAttribute("data-theme", state.theme);
  const themeBtn = document.getElementById("themeToggleBtn");
  if (themeBtn) {
    const isDark = state.theme === "dark";
    themeBtn.setAttribute("title", isDark ? "Beralih ke Mode Terang (Light Mode)" : "Beralih ke Mode Gelap (Dark Mode)");
    themeBtn.setAttribute("aria-label", isDark ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap");
    themeBtn.innerHTML = isDark 
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>` 
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  }
}

function toggleTheme() {
  sfx.playClick();
  state.theme = state.theme === "dark" ? "light" : "dark";
  localStorage.setItem("edu_theme", state.theme);
  applyThemeUI();
  showToast(`Mode visual diubah ke tema ${state.theme === "dark" ? "Gelap (Dark Mode)" : "Terang (Light Mode)"}`);
}

function initTheme() {
  applyThemeUI();
  const themeBtn = document.getElementById("themeToggleBtn");
  if (themeBtn) {
    themeBtn.onclick = toggleTheme;
  }
}

// Navigation Handling
function setupNavListeners() {
  const navButtons = document.querySelectorAll(".sidebar-nav-item button");
  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      sfx.playClick();
      const targetTab = btn.getAttribute("data-tab");
      switchTab(targetTab);
    });
  });

  document.querySelectorAll("[data-action='goto-classroom']").forEach(el => {
    el.addEventListener("click", () => switchTab("classroom"));
  });
  document.querySelectorAll("[data-action='goto-assignments']").forEach(el => {
    el.addEventListener("click", () => switchTab("assignments"));
  });
}

function switchTab(tabId) {
  state.activeNavTab = tabId;
  
  document.querySelectorAll(".sidebar-nav-item").forEach(item => {
    const btn = item.querySelector("button");
    if (btn && btn.getAttribute("data-tab") === tabId) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  document.querySelectorAll(".tab-pane").forEach(pane => {
    if (pane.id === `tab-${tabId}`) {
      pane.classList.add("active");
    } else {
      pane.classList.remove("active");
    }
  });

  if (tabId === "dashboard") renderDashboard();
  if (tabId === "classroom") renderClassroom();
  if (tabId === "assignments") renderAssignmentsHub();
}

// 1. DASHBOARD VIEW
function renderDashboard() {
  const courses = getAllCourses();
  const container = document.getElementById("dashboardCoursesContainer");
  if (container) {
    container.innerHTML = courses.map(course => {
      const completedCount = course.meetings ? course.meetings.filter(m => state.progress.completedSessions.includes(m.id)).length : 0;
      const progressPercent = Math.round((completedCount / (course.totalMeetings || 16)) * 100);

      return `
        <div class="course-card-item">
          <div class="course-thumbnail-wrapper" onclick="selectCourseAndOpen('${course.id}')" style="cursor: pointer;">
            <img src="${course.thumbnail || 'assets/hero_banner.jpg'}" alt="${course.title}" onerror="this.src='assets/hero_banner.jpg'">
            <span class="course-badge-top">${course.code} • ${course.alias}</span>
            <span class="course-sks-badge">${course.sks} SKS</span>
          </div>
          <div class="course-card-body">
            <div class="course-code-tag">${course.schedule || 'Jadwal Reguler'} • ${course.room || 'Ruang Kuliah'}</div>
            <h3 class="course-title-text" onclick="selectCourseAndOpen('${course.id}')" style="cursor: pointer;">${course.className || course.title}</h3>
            <div class="course-lecturer-text">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              ${course.lecturer} (${course.department})
            </div>
            <p class="course-desc-snippet">${course.description}</p>
            <div class="course-card-footer">
              <div class="course-meta-progress">${completedCount}/${course.totalMeetings || 16} Selesai (${progressPercent}%)</div>
              <div style="display: flex; gap: 0.35rem; align-items: center;">
                <button class="btn-edit-card" onclick="openCourseModal('edit', '${course.id}')" title="Edit Mata Kuliah">✏️</button>
                <button class="btn-delete-card" onclick="deleteCourse('${course.id}')" title="Hapus Mata Kuliah">🗑️</button>
                <button class="btn-pill-action" style="color: var(--primary-400);" onclick="selectCourseAndOpen('${course.id}')">Buka &rarr;</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  // Render Academic Schedule Table (Daftar Kelas Kuliah)
  renderScheduleTable();

  // Update metric counters
  const totalCompleted = state.progress.completedSessions.length;
  const totalSubmissions = Object.keys(state.submissions).length;
  const totalQuizzes = Object.keys(state.quizResults).length;

  // Hitung rata-rata persentase skor kuis secara dinamis
  let avgQuizScore = 0;
  const quizResultValues = Object.values(state.quizResults);
  if (quizResultValues.length > 0) {
    const totalPercentage = quizResultValues.reduce((acc, curr) => {
      const pct = (curr && curr.total > 0) ? (curr.score / curr.total) * 100 : 0;
      return acc + pct;
    }, 0);
    avgQuizScore = Math.round(totalPercentage / quizResultValues.length);
  }

  const elCompleted = document.getElementById("metricCompletedSessions");
  if (elCompleted) elCompleted.textContent = totalCompleted;

  const elSubmissions = document.getElementById("metricSubmissions");
  if (elSubmissions) elSubmissions.textContent = totalSubmissions;

  const elQuizzes = document.getElementById("metricQuizzes");
  if (elQuizzes) elQuizzes.textContent = totalQuizzes;

  const elAvgQuiz = document.getElementById("metricAvgQuizScore");
  if (elAvgQuiz) elAvgQuiz.textContent = `${avgQuizScore}%`;
}

function renderScheduleTable() {
  const courses = getAllCourses();
  const container = document.getElementById("scheduleTableContainer");
  if (!container) return;

  container.innerHTML = `
    <div class="schedule-table-wrapper">
      <div class="schedule-table-header">
        <div class="schedule-portal-title">
          <span>📋 Daftar Kelas Kuliah</span>
          <span style="font-size: 0.8rem; font-weight: 500; opacity: 0.9;">(Sesuai Portal KRS Mahasiswa)</span>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
          <button class="btn-add-action" style="padding: 0.35rem 0.8rem; font-size: 0.76rem;" onclick="openCourseModal('add')">
            + Tambah Kelas Kuliah Baru
          </button>
          <button class="btn-pill-action" style="padding: 0.35rem 0.7rem; font-size: 0.74rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff;" onclick="resetAllCourses()" title="Kembalikan ke 8 Mata Kuliah KRS">
            ↺ Reset Default
          </button>
          <div style="font-size: 0.82rem; background: rgba(0,0,0,0.25); padding: 4px 12px; border-radius: var(--radius-full);">
            Tahun Ajaran: <strong>2026/2027 Ganjil</strong>
          </div>
        </div>
      </div>

      <div class="schedule-filter-bar">
        <div style="font-size: 0.85rem; color: var(--text-secondary);">
          Filter Tahun Ajaran: <strong style="color: var(--text-primary);">2026/2027 Ganjil</strong>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
          <button class="btn-pill-action" style="background:#16a34a; color:#fff; border:none;" onclick="showToast('Mengekspor jadwal ke Excel...')">Excel</button>
          <button class="btn-pill-action" style="background:#dc2626; color:#fff; border:none;" onclick="showToast('Mengekspor jadwal ke PDF...')">PDF</button>
          <button class="btn-pill-action" style="background:#0284c7; color:#fff; border:none;" onclick="window.print()">Print</button>
        </div>
      </div>

      <div class="schedule-table-container">
        <table class="academic-data-table">
          <thead>
            <tr>
              <th>Tahun Ajaran</th>
              <th>Jadwal Kuliah (Hari / Jam / Ruangan)</th>
              <th>Nama Kelas (Fakultas / Prodi)</th>
              <th>Jadwal UTS</th>
              <th>Jadwal UAS</th>
              <th>Aksi Pengelolaan</th>
            </tr>
          </thead>
          <tbody>
            ${courses.map(c => `
              <tr>
                <td style="color: var(--text-secondary); white-space: nowrap;">2026/2027 Ganjil</td>
                <td onclick="selectCourseAndOpen('${c.id}')" style="cursor: pointer;">
                  <div style="font-weight: 600; color: var(--text-primary);">${c.schedule}</div>
                  <div style="font-size: 0.75rem; color: var(--text-tertiary);">${c.room}</div>
                </td>
                <td onclick="selectCourseAndOpen('${c.id}')" style="cursor: pointer;">
                  <div style="font-weight: 700; color: var(--primary-400);">${c.className || c.title}</div>
                  <div style="font-size: 0.75rem; color: var(--text-secondary);">${c.department}</div>
                </td>
                <td style="font-size: 0.8rem; color: var(--text-tertiary);">- Terjadwal -</td>
                <td style="font-size: 0.8rem; color: var(--text-tertiary);">- Terjadwal -</td>
                <td style="white-space: nowrap;">
                  <button class="btn-nilai-pill" onclick="selectCourseAndOpen('${c.id}')">Buka Kelas</button>
                  <button class="btn-edit-card" style="padding: 4px 8px;" onclick="openCourseModal('edit', '${c.id}')" title="Edit Mata Kuliah">✏️ Edit</button>
                  <button class="btn-delete-card" style="padding: 4px 8px;" onclick="deleteCourse('${c.id}')" title="Hapus Mata Kuliah">🗑️ Hapus</button>
                  <button class="btn-rps-pill" onclick="showToast('RPS untuk ${c.alias} telah diverifikasi')">RPS</button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <div style="padding: 0.75rem 1.25rem; font-size: 0.76rem; color: var(--text-tertiary); border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between;">
        <span>Showing 1 to ${courses.length} of ${courses.length} entries (Total ${courses.length} Mata Kuliah Terdaftar)</span>
        <span style="color: var(--accent-cyan); font-weight: 600;">Semester 5 Aktif</span>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// COURSE MODAL & CRUD ACTIONS
// -------------------------------------------------------------
window.openCourseModal = function(mode, courseId = null) {
  sfx.playClick();
  const modal = document.getElementById("courseModal");
  const titleEl = document.getElementById("courseModalTitle");
  const subtitleEl = document.getElementById("courseModalSubtitle");
  const submitBtn = document.getElementById("btnSubmitCourseModal");
  const formId = document.getElementById("courseFormId");

  if (mode === "edit" && courseId) {
    const courses = getAllCourses();
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    formId.value = course.id;
    titleEl.textContent = `Edit Mata Kuliah: ${course.title}`;
    subtitleEl.textContent = `Kode: ${course.code} • ${course.department}`;
    submitBtn.textContent = "Simpan Perubahan Mata Kuliah 💾";

    document.getElementById("courseFormTitle").value = course.title || "";
    document.getElementById("courseFormClassName").value = course.className || "";
    document.getElementById("courseFormCode").value = course.code || "";
    document.getElementById("courseFormAlias").value = course.alias || "";
    document.getElementById("courseFormSKS").value = course.sks || 3;
    document.getElementById("courseFormSchedule").value = course.schedule || "";
    document.getElementById("courseFormRoom").value = course.room || "";
    document.getElementById("courseFormLecturer").value = course.lecturer || "";
    document.getElementById("courseFormDepartment").value = course.department || "FT T. Informatika";
    document.getElementById("courseFormCategory").value = course.category || "Wajib Program Studi";
    document.getElementById("courseFormThumbnail").value = course.thumbnail || "assets/hero_banner.jpg";
    document.getElementById("courseFormDescription").value = course.description || "";
  } else {
    // Add mode
    formId.value = "";
    titleEl.textContent = "Tambah Mata Kuliah Baru";
    subtitleEl.textContent = "Tambahkan mata kuliah baru ke sistem kurikulum";
    submitBtn.textContent = "Tambahkan Mata Kuliah Baru ➕";

    document.getElementById("courseFormTitle").value = "";
    document.getElementById("courseFormClassName").value = "";
    document.getElementById("courseFormCode").value = "";
    document.getElementById("courseFormAlias").value = "";
    document.getElementById("courseFormSKS").value = 3;
    document.getElementById("courseFormSchedule").value = "Senin 08:00:00 s/d 10:30:00";
    document.getElementById("courseFormRoom").value = "Mahdor D 406";
    document.getElementById("courseFormLecturer").value = "";
    document.getElementById("courseFormDepartment").value = "FT T. Informatika";
    document.getElementById("courseFormCategory").value = "Wajib Program Studi";
    document.getElementById("courseFormThumbnail").value = "assets/course_web.jpg";
    document.getElementById("courseFormDescription").value = "";
  }

  if (modal) modal.classList.add("active");
};

window.closeCourseModal = function() {
  const modal = document.getElementById("courseModal");
  if (modal) modal.classList.remove("active");
};

window.handleSaveCourse = function(event) {
  event.preventDefault();
  const formId = document.getElementById("courseFormId").value;
  const title = document.getElementById("courseFormTitle").value.trim();
  const className = document.getElementById("courseFormClassName").value.trim() || title;
  const code = document.getElementById("courseFormCode").value.trim();
  const alias = document.getElementById("courseFormAlias").value.trim() || code;
  const sks = parseInt(document.getElementById("courseFormSKS").value, 10) || 3;
  const schedule = document.getElementById("courseFormSchedule").value.trim();
  const room = document.getElementById("courseFormRoom").value.trim();
  const lecturer = document.getElementById("courseFormLecturer").value.trim();
  const department = document.getElementById("courseFormDepartment").value.trim();
  const category = document.getElementById("courseFormCategory").value;
  const thumbnail = document.getElementById("courseFormThumbnail").value;
  const description = document.getElementById("courseFormDescription").value.trim();

  let courses = [...getAllCourses()];

  if (formId) {
    // Edit existing course
    const index = courses.findIndex(c => c.id === formId);
    if (index !== -1) {
      courses[index] = {
        ...courses[index],
        title,
        className,
        code,
        alias,
        sks,
        schedule,
        room,
        lecturer,
        department,
        category,
        thumbnail,
        description
      };
      showToast(`Mata kuliah "${title}" berhasil diperbarui!`, "success");
    }
  } else {
    // Add new course
    const newId = `course-${Date.now()}`;
    const newCourse = {
      id: newId,
      code,
      title,
      className,
      alias,
      semester: 5,
      academicYear: "2026/2027 Ganjil",
      schedule,
      room,
      sks,
      lecturer,
      nip: `19850101${Date.now().toString().slice(-8)}`,
      department,
      category,
      thumbnail,
      description,
      totalMeetings: 16,
      meetings: generateDefaultMeetings(alias)
    };
    courses.push(newCourse);
    state.currentCourseId = newId;
    state.currentSessionId = newCourse.meetings[0].id;
    showToast(`Mata kuliah baru "${title}" berhasil ditambahkan dengan 16 sesi pertemuan!`, "success");
  }

  saveAllCourses(courses);
  sfx.playSuccess();
  closeCourseModal();

  renderDashboard();
  renderCourseSelect();
  renderClassroom();
  renderAssignmentsHub();
  updateAcademicProgressUI();
};

window.deleteCourse = function(courseId) {
  let courses = [...getAllCourses()];
  const course = courses.find(c => c.id === courseId);
  if (!course) return;

  if (courses.length <= 1) {
    showToast("Minimal harus ada 1 mata kuliah aktif di dalam sistem.", "error");
    return;
  }

  if (confirm(`Apakah Anda yakin ingin menghapus mata kuliah "${course.className || course.title}" beserta seluruh pertemuannya?`)) {
    sfx.playClick();
    courses = courses.filter(c => c.id !== courseId);
    saveAllCourses(courses);

    if (state.currentCourseId === courseId) {
      state.currentCourseId = courses[0].id;
      if (courses[0].meetings && courses[0].meetings.length > 0) {
        state.currentSessionId = courses[0].meetings[0].id;
      }
    }

    renderDashboard();
    renderCourseSelect();
    renderClassroom();
    renderAssignmentsHub();
    updateAcademicProgressUI();
    showToast(`Mata kuliah "${course.title}" berhasil dihapus.`);
  }
};

window.resetAllCourses = function() {
  if (confirm("Apakah Anda yakin ingin mereset seluruh daftar mata kuliah kembali ke 8 mata kuliah awal semester 5?")) {
    sfx.playClick();
    localStorage.removeItem("edu_custom_courses");
    state.currentCourseId = "adpl";
    state.currentSessionId = "adpl-m1";
    renderDashboard();
    renderCourseSelect();
    renderClassroom();
    renderAssignmentsHub();
    updateAcademicProgressUI();
    showToast("Seluruh mata kuliah telah dikembalikan ke 8 mata kuliah awal semester 5.", "success");
  }
};

window.selectCourseAndOpen = function(courseId) {
  sfx.playClick();
  state.currentCourseId = courseId;
  const allCourses = getAllCourses();
  const course = allCourses.find(c => c.id === courseId);
  if (course && course.meetings && course.meetings.length > 0) {
    state.currentSessionId = course.meetings[0].id;
  }
  switchTab("classroom");
};

// 2. RUANG KELAS MULTIMEDIA (CLASSROOM)
function renderCourseSelect() {
  const select = document.getElementById("courseSelectDropdown");
  if (!select) return;

  const courses = getAllCourses();
  select.innerHTML = courses.map(c => `
    <option value="${c.id}" ${c.id === state.currentCourseId ? "selected" : ""}>
      ${c.className || c.title} • ${c.room} (${c.schedule})
    </option>
  `).join("");

  select.addEventListener("change", (e) => {
    sfx.playClick();
    state.currentCourseId = e.target.value;
    const allCourses = getAllCourses();
    const course = allCourses.find(c => c.id === state.currentCourseId);
    if (course && course.meetings && course.meetings.length > 0) {
      state.currentSessionId = course.meetings[0].id;
    }
    renderClassroom();
  });
}

function renderClassroom() {
  const allCourses = getAllCourses();
  const course = allCourses.find(c => c.id === state.currentCourseId) || allCourses[0];
  const meetings = course.meetings || [];
  
  // Update header badge count & subhead
  const countBadge = document.getElementById("sessionCountBadge");
  if (countBadge) countBadge.textContent = `${meetings.length} Sesi`;

  const subhead = document.getElementById("sessionSubheadText");
  if (subhead) subhead.textContent = `${course.alias || 'Kelas'} • Silabus & Jadwal`;

  // 1. Render Left Sidebar of Meetings
  const sessionsList = document.getElementById("sessionsListContainer");
  if (sessionsList) {
    if (meetings.length === 0) {
      sessionsList.innerHTML = `
        <div style="padding: 1.5rem 1rem; text-align: center; color: var(--text-tertiary); font-size: 0.8rem;">
          Belum ada jadwal pertemuan.<br>
          <button class="btn-add-action" style="margin-top: 0.75rem; font-size: 0.75rem;" onclick="openMeetingModal('add')">
            + Tambah Pertemuan Pertama
          </button>
        </div>
      `;
    } else {
      sessionsList.innerHTML = meetings.map(m => {
        const resolved = getResolvedMeeting(course.id, m.id);
        const isActive = m.id === state.currentSessionId;
        const isCompleted = state.progress.completedSessions.includes(m.id);
        
        return `
          <div class="session-timeline-card ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}" 
               onclick="selectMeetingSession('${m.id}')"
               role="button"
               tabindex="0">
            <div class="session-number-badge">${isCompleted ? '✓' : resolved.number}</div>
            <div class="session-card-info">
              <div class="session-card-title">P-${resolved.number}: ${resolved.title}</div>
              <div class="session-card-meta">
                <span>⏱ ${resolved.duration || '90 Menit'}</span>
                ${resolved.assignment ? `<span style="color:var(--accent-amber); font-weight:600;">• Ada Tugas (${resolved.assignment.type})</span>` : ''}
              </div>
            </div>
            <div class="session-card-actions" onclick="event.stopPropagation()">
              <button type="button" class="btn-action-icon edit" title="Edit Jadwal & Sesi" onclick="openMeetingModal('edit', '${m.id}')">✏️</button>
              <button type="button" class="btn-action-icon delete" title="Hapus Pertemuan" onclick="deleteMeetingSession('${m.id}')">🗑️</button>
            </div>
          </div>
        `;
      }).join("");
    }
  }

  // 2. Render Active Session Content
  const session = getResolvedMeeting(course.id, state.currentSessionId);
  renderActiveSessionDetails(session, course);
}

window.selectMeetingSession = function(sessionId) {
  sfx.playClick();
  state.currentSessionId = sessionId;
  renderClassroom();
};

window.toggleManageMode = function() {
  sfx.playClick();
  state.isManageMode = !state.isManageMode;
  localStorage.setItem("edu_is_manage_mode", JSON.stringify(state.isManageMode));
  renderClassroom();
  showToast(state.isManageMode ? "Mode Kelola & Edit Materi Aktif (Bisa Menambah / Menghapus)" : "Mode Belajar Mandiri Aktif");
};

window.resetSessionContent = function(sessionId) {
  if (confirm("Apakah Anda yakin ingin mereset seluruh materi, file, dan soal pada pertemuan ini kembali ke bawaan kurikulum?")) {
    sfx.playClick();
    delete state.customMaterials[sessionId];
    localStorage.setItem("edu_custom_materials", JSON.stringify(state.customMaterials));
    renderClassroom();
    renderAssignmentsHub();
    showToast("Materi pertemuan telah dikembalikan ke kondisi bawaan kurikulum.", "success");
  }
};

// -------------------------------------------------------------
// MEETING SESSIONS MANAGEMENT (CRUD: TAMBAH, EDIT, HAPUS PERTEMUAN)
// -------------------------------------------------------------

window.toggleAssignmentFields = function() {
  const select = document.getElementById("meetingFormAssignmentType");
  const deadlineGroup = document.getElementById("meetingDeadlineGroup");
  const titleGroup = document.getElementById("meetingTitleGroup");
  if (!select || !deadlineGroup || !titleGroup) return;

  const hasAssignment = select.value === "Individu" || select.value === "Kelompok";
  deadlineGroup.style.display = hasAssignment ? "block" : "none";
  titleGroup.style.display = hasAssignment ? "block" : "none";
};

window.openMeetingModal = function(mode, meetingId) {
  try {
    sfx.playClick();
    const modal = document.getElementById("meetingModal");
    if (!modal) {
      console.error("meetingModal element not found in DOM");
      showToast("Modal pertemuan tidak ditemukan di halaman.", "error");
      return;
    }

    const titleEl = document.getElementById("meetingModalTitle");
    const subtitleEl = document.getElementById("meetingModalSubtitle");
    const submitBtn = document.getElementById("btnSubmitMeetingModal");

    const allCourses = getAllCourses();
    const course = (allCourses && allCourses.find(c => c.id === state.currentCourseId)) || (allCourses && allCourses[0]) || { meetings: [] };
    const meetings = course.meetings || [];

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    };

    if (mode === "edit" && meetingId) {
      const meeting = meetings.find(m => m.id === meetingId) || getResolvedMeeting(course.id, meetingId);
      if (titleEl) titleEl.textContent = "Edit Jadwal & Sesi Pertemuan";
      if (subtitleEl) subtitleEl.textContent = `Mata Kuliah: ${course.className || course.title || 'Kuliah'}`;
      if (submitBtn) submitBtn.textContent = "Simpan Perubahan Pertemuan 💾";

      setVal("meetingFormId", meeting.id || "");
      setVal("meetingFormTitle", meeting.title || "");
      setVal("meetingFormNumber", meeting.number || (meetings.indexOf(meeting) + 1));
      setVal("meetingFormDuration", meeting.duration || "90 Menit");
      setVal("meetingFormTagline", meeting.tagline || "");
      setVal("meetingFormOverview", meeting.overview || "");
      setVal("meetingFormVideoUrl", meeting.videoEmbedUrl || "");
      setVal("meetingFormInfographic", meeting.infographic || "assets/sdlc_infographic.jpg");

      const assignType = (meeting.assignment && meeting.assignment.type) ? meeting.assignment.type : "none";
      setVal("meetingFormAssignmentType", assignType);
      setVal("meetingFormAssignmentDeadline", (meeting.assignment && meeting.assignment.deadline) ? meeting.assignment.deadline : "2026-11-28 23:59:00");
      setVal("meetingFormAssignmentTitle", (meeting.assignment && meeting.assignment.title) ? meeting.assignment.title : `Tugas Pertemuan ${meeting.number}`);

    } else {
      // Mode Add
      if (titleEl) titleEl.textContent = "Tambah Jadwal Pertemuan Baru";
      if (subtitleEl) subtitleEl.textContent = `Mata Kuliah: ${course.className || course.title || 'Kuliah'}`;
      if (submitBtn) submitBtn.textContent = "Tambahkan Jadwal Pertemuan ➕";

      const nextNumber = meetings.length + 1;
      setVal("meetingFormId", "");
      setVal("meetingFormTitle", "");
      setVal("meetingFormNumber", nextNumber);
      setVal("meetingFormDuration", "90 Menit");
      setVal("meetingFormTagline", "");
      setVal("meetingFormOverview", "");
      setVal("meetingFormVideoUrl", "https://www.youtube-nocookie.com/embed/kM9AKn2iVio");
      setVal("meetingFormInfographic", "assets/sdlc_infographic.jpg");
      setVal("meetingFormAssignmentType", "none");
      setVal("meetingFormAssignmentDeadline", "2026-11-28 23:59:00");
      setVal("meetingFormAssignmentTitle", "");
    }

    toggleAssignmentFields();
    modal.classList.add("active");
  } catch (err) {
    console.error("Error in openMeetingModal:", err);
    showToast("Terjadi kesalahan saat membuka form pertemuan: " + err.message, "error");
  }
};

window.closeMeetingModal = function() {
  const modal = document.getElementById("meetingModal");
  if (modal) modal.classList.remove("active");
};

window.handleSaveMeeting = function(event) {
  event.preventDefault();
  const formId = document.getElementById("meetingFormId").value;
  const title = document.getElementById("meetingFormTitle").value.trim();
  const number = parseInt(document.getElementById("meetingFormNumber").value, 10) || 1;
  const duration = document.getElementById("meetingFormDuration").value.trim() || "90 Menit";
  const tagline = document.getElementById("meetingFormTagline").value.trim() || `Pembahasan materi perkuliahan pertemuan ${number}`;
  const overview = document.getElementById("meetingFormOverview").value.trim() || `Membahas konsep dan kompetensi pembelajaran topik ${title}.`;
  const videoUrl = document.getElementById("meetingFormVideoUrl").value.trim() || "https://www.youtube-nocookie.com/embed/kM9AKn2iVio";
  const infographic = document.getElementById("meetingFormInfographic").value || "assets/sdlc_infographic.jpg";
  const assignType = document.getElementById("meetingFormAssignmentType").value;

  let assignmentData = null;
  if (assignType === "Individu" || assignType === "Kelompok") {
    const assignTitle = document.getElementById("meetingFormAssignmentTitle").value.trim() || `Tugas Pertemuan ${number}: ${title}`;
    const assignDeadline = document.getElementById("meetingFormAssignmentDeadline").value.trim() || "2026-11-28 23:59:00";
    assignmentData = {
      id: `tugas-${formId || ('m' + Date.now())}`,
      type: assignType,
      title: assignTitle,
      deadline: assignDeadline,
      points: 100,
      instructions: `Kerjakan studi kasus dan laporan topik ${title}. Kumpulkan file tugas sesuai panduan perkuliahan.`,
      templateFile: `Template_Tugas_${number}.docx`
    };
  }

  let courses = [...getAllCourses()];
  const courseIndex = courses.findIndex(c => c.id === state.currentCourseId);
  if (courseIndex === -1) return;

  const currentCourse = courses[courseIndex];
  if (!currentCourse.meetings) currentCourse.meetings = [];

  if (formId) {
    // Edit existing meeting
    const mIndex = currentCourse.meetings.findIndex(m => m.id === formId);
    if (mIndex !== -1) {
      currentCourse.meetings[mIndex] = {
        ...currentCourse.meetings[mIndex],
        number,
        title,
        duration,
        tagline,
        overview,
        videoEmbedUrl: videoUrl,
        infographic,
        assignment: assignmentData
      };
      // Sync if customMaterials exists
      if (state.customMaterials[formId]) {
        state.customMaterials[formId].title = title;
        state.customMaterials[formId].tagline = tagline;
        state.customMaterials[formId].duration = duration;
        if (assignmentData) state.customMaterials[formId].assignment = assignmentData;
        localStorage.setItem("edu_custom_materials", JSON.stringify(state.customMaterials));
      }
      showToast(`Jadwal & Sesi Pertemuan P-${number} berhasil diperbarui!`, "success");
    }
  } else {
    // Add new meeting
    const safeAlias = (currentCourse.alias || "mk").toLowerCase().replace(/[^a-z0-9]/g, "");
    const newId = `${safeAlias}-m${Date.now()}`;
    const newMeeting = {
      id: newId,
      number,
      title,
      tagline,
      duration,
      status: "available",
      infographic,
      infographicTitle: `Infografis Pertemuan ${number}: ${title}`,
      videoEmbedUrl: videoUrl,
      videoTitle: `Video Pembelajaran: ${title}`,
      audioTitle: `Audio Kuliah: Penjelasan Materi ${title}`,
      audioDuration: "12:00",
      audioTranscript: `Transkrip perkuliahan sesi ke-${number} membahas topik ${title}...`,
      overview,
      learningOutcomes: [
        `Memahami teori fundamental terkait ${title}.`,
        `Mampu mengaplikasikan studi kasus materi pertemuan ke-${number}.`
      ],
      textTheory: `<h3>Materi Perkuliahan: ${title}</h3><p>Selamat datang pada sesi pertemuan ke-${number}. Pelajari materi melalui tab modul teks, infografis, rekaman video, audio dosen, serta selesaikan latihan kuis evaluasi.</p>`,
      quiz: [
        {
          id: `q-${newId}-1`,
          question: `Pertanyaan evaluasi pemahaman untuk materi: ${title}?`,
          options: [
            "Pilihan A (Jawaban yang Tepat)",
            "Pilihan B",
            "Pilihan C",
            "Pilihan D"
          ],
          correct: 0,
          explanation: "Pilihan A adalah jawaban yang benar sesuai bahasan materi sesi ini."
        }
      ],
      assignment: assignmentData,
      references: [
        { title: `Diktat Kuliah Resmi ${currentCourse.alias}`, type: "Diktat", link: "#" }
      ]
    };

    currentCourse.meetings.push(newMeeting);
    state.currentSessionId = newId;
    showToast(`Pertemuan P-${number}: "${title}" berhasil ditambahkan!`, "success");
  }

  // Sort meetings by number
  currentCourse.meetings.sort((a, b) => (a.number || 0) - (b.number || 0));
  currentCourse.totalMeetings = currentCourse.meetings.length;

  saveAllCourses(courses);
  closeMeetingModal();
  renderClassroom();
  renderDashboard();
  renderAssignmentsHub();
};

window.deleteMeetingSession = function(meetingId) {
  let courses = [...getAllCourses()];
  const courseIndex = courses.findIndex(c => c.id === state.currentCourseId);
  if (courseIndex === -1) return;

  const currentCourse = courses[courseIndex];
  const meetings = currentCourse.meetings || [];

  if (meetings.length <= 1) {
    showToast("Minimal harus tersisa 1 sesi pertemuan dalam mata kuliah ini.", "error");
    return;
  }

  const meetingToDelete = meetings.find(m => m.id === meetingId);
  if (!meetingToDelete) return;

  if (confirm(`Apakah Anda yakin ingin menghapus Pertemuan P-${meetingToDelete.number}: "${meetingToDelete.title}" beserta seluruh kuis dan tugas di dalamnya?`)) {
    sfx.playClick();
    currentCourse.meetings = meetings.filter(m => m.id !== meetingId);
    currentCourse.totalMeetings = currentCourse.meetings.length;

    // Clean up student progress / results for this session
    state.progress.completedSessions = state.progress.completedSessions.filter(id => id !== meetingId);
    localStorage.setItem("edu_progress", JSON.stringify(state.progress));

    if (state.quizResults[meetingId]) {
      delete state.quizResults[meetingId];
      localStorage.setItem("edu_quiz_results", JSON.stringify(state.quizResults));
    }
    if (state.submissions[meetingId]) {
      delete state.submissions[meetingId];
      localStorage.setItem("edu_submissions", JSON.stringify(state.submissions));
    }
    if (state.customMaterials[meetingId]) {
      delete state.customMaterials[meetingId];
      localStorage.setItem("edu_custom_materials", JSON.stringify(state.customMaterials));
    }

    // Switch active session if deleted
    if (state.currentSessionId === meetingId) {
      state.currentSessionId = currentCourse.meetings[0].id;
    }

    saveAllCourses(courses);
    renderClassroom();
    renderDashboard();
    renderAssignmentsHub();
    showToast(`Pertemuan P-${meetingToDelete.number} berhasil dihapus.`);
  }
};

window.resetCourseMeetings = function() {
  let courses = [...getAllCourses()];
  const courseIndex = courses.findIndex(c => c.id === state.currentCourseId);
  if (courseIndex === -1) return;

  const currentCourse = courses[courseIndex];
  if (confirm(`Apakah Anda yakin ingin mengembalikan seluruh jadwal pertemuan untuk mata kuliah "${currentCourse.className || currentCourse.title}" ke 16 pertemuan standar kurikulum?`)) {
    sfx.playClick();
    currentCourse.meetings = generateDefaultMeetings(currentCourse.alias);
    currentCourse.totalMeetings = 16;
    state.currentSessionId = currentCourse.meetings[0].id;
    saveAllCourses(courses);

    renderClassroom();
    renderDashboard();
    renderAssignmentsHub();
    showToast(`Pertemuan mata kuliah ${currentCourse.alias} telah dikembalikan ke 16 sesi standar kurikulum.`, "success");
  }
};

function renderActiveSessionDetails(session, course) {
  const container = document.getElementById("activeSessionContentArea");
  if (!container || !session) return;

  const isCompleted = state.progress.completedSessions.includes(session.id);
  const userSavedNote = state.notes[session.id] || "";
  const isCustomized = !!state.customMaterials[session.id];

  container.innerHTML = `
    <!-- Manage Mode Toolbar (CMS Dosen & Mahasiswa) -->
    <div class="manage-mode-bar">
      <div class="manage-mode-info">
        <span>⚙️ Kontrol Sesi & Pengelolaan Materi:</span>
        <span class="manage-mode-badge ${state.isManageMode ? 'active' : 'inactive'}">
          ${state.isManageMode ? 'Mode Edit / Dosen Aktif' : 'Mode Belajar Siswa'}
        </span>
      </div>
      <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
        <button class="btn-pill-action" onclick="openMeetingModal('edit', '${session.id}')" title="Edit Jadwal & Informasi Sesi Pertemuan Ini">
          ✏️ Edit Jadwal Sesi Ini
        </button>
        <button class="btn-pill-action" style="color: var(--accent-rose);" onclick="deleteMeetingSession('${session.id}')" title="Hapus Sesi Pertemuan Ini">
          🗑️ Hapus Sesi Ini
        </button>
        <button class="btn-pill-action" onclick="toggleManageMode()">
          ${state.isManageMode ? 'Kunci Tampilan (Mode Siswa)' : '🛠️ Mode Edit Materi Multimedia'}
        </button>
        ${isCustomized ? `
          <button class="btn-pill-action" style="color: var(--accent-rose);" onclick="resetSessionContent('${session.id}')">
            ↺ Reset Konten Sesi
          </button>
        ` : ''}
      </div>
    </div>

    <!-- Top Header of Active Meeting -->
    <div class="session-header-banner">
      <div class="session-top-meta-row">
        <span class="session-meta-pill">Pertemuan Ke-${session.number} • ${course.alias}</span>
        <div class="session-action-btns">
          <button class="btn-pill-action ${isCompleted ? 'completed-state' : ''}" onclick="toggleSessionCompletion('${session.id}')">
            ${isCompleted ? '✓ Telah Diselesaikan' : '○ Tandai Selesai Belajar'}
          </button>
          <button class="btn-pill-action" onclick="printOrSaveSummary()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Simpan Rangkuman
          </button>
        </div>
      </div>
      <h1 class="session-main-title">${session.title}</h1>
      <p class="session-tagline-text">${session.tagline}</p>
    </div>

    <!-- Multimedia Navigation Tabs -->
    <div class="multimedia-tabs-nav">
      <button class="tab-btn-pill ${state.activeMediaTab === 'theory' ? 'active' : ''}" onclick="switchMediaTab('theory')">
        📖 Materi Teks (${(session.files ? session.files.length : 0)} Berkas)
      </button>
      <button class="tab-btn-pill ${state.activeMediaTab === 'infographic' ? 'active' : ''}" onclick="switchMediaTab('infographic')">
        🖼️ Infografis (${session.infographics ? session.infographics.length : 1})
      </button>
      <button class="tab-btn-pill ${state.activeMediaTab === 'video' ? 'active' : ''}" onclick="switchMediaTab('video')">
        🎥 Video (${session.videos ? session.videos.length : 1})
      </button>
      <button class="tab-btn-pill ${state.activeMediaTab === 'audio' ? 'active' : ''}" onclick="switchMediaTab('audio')">
        🎙️ Audio (${session.audios ? session.audios.length : 1})
      </button>
      <button class="tab-btn-pill ${state.activeMediaTab === 'quiz' ? 'active' : ''}" onclick="switchMediaTab('quiz')">
        ⚡ Latihan Soal (${session.quiz ? session.quiz.length : 0})
      </button>
      <button class="tab-btn-pill ${state.activeMediaTab === 'assignment' ? 'active' : ''}" onclick="switchMediaTab('assignment')">
        📝 Tugas ${session.assignment ? `(${session.assignment.type})` : '(0)'}
      </button>
    </div>

    <!-- Panel 1: Teks Teori & Lampiran Berkas -->
    <div class="media-tab-panel ${state.activeMediaTab === 'theory' ? 'active' : ''}" id="panel-theory">
      ${state.isManageMode ? `
        <div class="content-action-toolbar">
          <span style="font-size:0.8rem; font-weight:600; color:var(--text-secondary);">Kelola Teks & Berkas:</span>
          <div class="content-action-group">
            <button class="btn-add-action" onclick="openContentModal('edit-text', '${session.id}')">
              ✏️ Edit Teks & Capaian Belajar
            </button>
            <button class="btn-add-action" style="background: linear-gradient(135deg, var(--accent-cyan), var(--primary-600));" onclick="openContentModal('add-file', '${session.id}')">
              📎 Tambah / Upload Berkas Modul
            </button>
          </div>
        </div>
      ` : ''}

      <div class="theory-article-content">
        <div class="theory-callout tip">
          <div class="callout-icon">🎯</div>
          <div class="callout-body">
            <strong>Capaian Pembelajaran (Learning Outcomes):</strong>
            <ul style="margin: 0.5rem 0 0 0; padding-left: 1.2rem;">
              ${session.learningOutcomes ? session.learningOutcomes.map(item => `<li>${item}</li>`).join("") : '<li>Memahami konsep inti materi.</li>'}
            </ul>
          </div>
        </div>

        <div id="theoryBodyContent">
          ${session.textTheory}
        </div>

        <!-- Attached Files Section (PDF / PPT / DOC) -->
        <div class="attached-files-container">
          <div class="attached-files-header">
            <span>📎 Berkas & Modul Pembelajaran Terlampir (${session.files ? session.files.length : 0} File)</span>
            ${state.isManageMode ? `
              <button class="btn-pill-action" onclick="openContentModal('add-file', '${session.id}')">+ Tambah File</button>
            ` : ''}
          </div>

          <div class="files-grid-list">
            ${session.files && session.files.length > 0 ? session.files.map(f => `
              <div class="file-attachment-card">
                <div class="file-icon-box">📄</div>
                <div class="file-meta-content">
                  <div class="file-name-bold" title="${f.name}">${f.name}</div>
                  <div class="file-size-info">${f.size || '1.5 MB'} • ${f.date || 'Berkas Modul'}</div>
                </div>
                <div class="file-card-actions">
                  <button class="btn-pill-action" style="padding: 4px 8px; font-size: 0.72rem;" onclick="downloadSimulatedFile('${f.name}')">⬇</button>
                  ${state.isManageMode ? `
                    <button class="btn-delete-card" onclick="deleteContentItem('file', '${session.id}', '${f.id}')" title="Hapus File">🗑</button>
                  ` : ''}
                </div>
              </div>
            `).join("") : `
              <div style="grid-column: 1/-1; color: var(--text-tertiary); font-size: 0.84rem; padding: 1rem; text-align: center; background: var(--bg-surface); border-radius: var(--radius-md);">
                Belum ada file modul terlampir. Klik "+ Tambah File" untuk mengunggah dokumen baru.
              </div>
            `}
          </div>
        </div>

        ${session.references && session.references.length > 0 ? `
          <h4 style="margin-top: 1.5rem; font-size: 1rem; color: var(--text-secondary);">📚 Referensi & Bacaan Lanjutan:</h4>
          <ul style="font-size: 0.88rem; color: var(--primary-300);">
            ${session.references.map(r => `<li><a href="${r.link}" target="_blank" rel="noopener">${r.title} (${r.type})</a></li>`).join("")}
          </ul>
        ` : ''}
      </div>
    </div>

    <!-- Panel 2: Infografis Interaktif -->
    <div class="media-tab-panel ${state.activeMediaTab === 'infographic' ? 'active' : ''}" id="panel-infographic">
      ${state.isManageMode ? `
        <div class="content-action-toolbar">
          <span style="font-size:0.8rem; font-weight:600; color:var(--text-secondary);">Kelola Galeri Infografis:</span>
          <button class="btn-add-action" onclick="openContentModal('add-infographic', '${session.id}')">
            + Tambah / Upload Infografis Baru
          </button>
        </div>
      ` : ''}

      <div class="infographic-gallery-list">
        ${session.infographics && session.infographics.length > 0 ? session.infographics.map((info, idx) => `
          <div class="infographic-card-box">
            <div class="infographic-image-wrapper" onclick="openImageModal('${info.url}')">
              <img src="${info.url}" alt="${info.title}" onerror="this.src='assets/sdlc_infographic.jpg'">
            </div>
            <div class="infographic-caption-bar">
              <div>
                <strong>${info.title}</strong>
                <div style="font-size: 0.75rem; color: var(--text-tertiary);">${info.desc || 'Klik gambar untuk memperbesar resolusi tinggi'}</div>
              </div>
              <div style="display:flex; gap:0.5rem; align-items:center;">
                <button class="btn-pill-action" onclick="openImageModal('${info.url}')">🔍 Zoom Penuh</button>
                ${state.isManageMode ? `
                  <button class="btn-delete-card" onclick="deleteContentItem('infographic', '${session.id}', '${info.id}')">🗑 Hapus</button>
                ` : ''}
              </div>
            </div>
          </div>
        `).join("") : `
          <div style="text-align: center; padding: 2.5rem; background: var(--bg-surface); border-radius: var(--radius-lg); color: var(--text-tertiary);">
            Tidak ada infografis pada pertemuan ini.
          </div>
        `}
      </div>
    </div>

    <!-- Panel 3: Video Player -->
    <div class="media-tab-panel ${state.activeMediaTab === 'video' ? 'active' : ''}" id="panel-video">
      ${state.isManageMode ? `
        <div class="content-action-toolbar">
          <span style="font-size:0.8rem; font-weight:600; color:var(--text-secondary);">Kelola Video Pembelajaran:</span>
          <button class="btn-add-action" onclick="openContentModal('add-video', '${session.id}')">
            + Tambah Video Pembelajaran Baru
          </button>
        </div>
      ` : ''}

      <div class="videos-gallery-list">
        ${session.videos && session.videos.length > 0 ? session.videos.map(v => `
          <div class="video-card-box">
            <div class="video-responsive-wrapper">
              <iframe src="${v.embedUrl}" title="${v.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.75rem;">
              <div>
                <h3 style="font-size: 1.05rem; margin-bottom: 0.2rem;">${v.title}</h3>
                <span style="font-size: 0.8rem; color: var(--text-secondary);">Durasi: ${v.duration || 'Video Pembelajaran'}</span>
              </div>
              ${state.isManageMode ? `
                <button class="btn-delete-card" onclick="deleteContentItem('video', '${session.id}', '${v.id}')">🗑 Hapus Video</button>
              ` : ''}
            </div>
          </div>
        `).join("") : `
          <div style="text-align: center; padding: 2.5rem; background: var(--bg-surface); border-radius: var(--radius-lg); color: var(--text-tertiary);">
            Belum ada video pembelajaran. Klik "+ Tambah Video" untuk menambahkan video baru.
          </div>
        `}
      </div>
    </div>

    <!-- Panel 4: Audio Podcast Kuliah -->
    <div class="media-tab-panel ${state.activeMediaTab === 'audio' ? 'active' : ''}" id="panel-audio">
      ${state.isManageMode ? `
        <div class="content-action-toolbar">
          <span style="font-size:0.8rem; font-weight:600; color:var(--text-secondary);">Kelola Audio & Voice Note:</span>
          <button class="btn-add-action" onclick="openContentModal('add-audio', '${session.id}')">
            + Tambah Rekaman Audio / Voice Note
          </button>
        </div>
      ` : ''}

      <div class="audios-gallery-list">
        ${session.audios && session.audios.length > 0 ? session.audios.map((a, idx) => `
          <div class="audio-podcast-card" id="audioPodcastCard-${a.id}">
            <div class="podcast-meta-row">
              <div>
                <div style="font-size: 0.72rem; color: var(--accent-cyan); font-weight: 700; text-transform: uppercase;">Voice Note & Audio Perkuliahan</div>
                <div class="podcast-title">${a.title}</div>
              </div>
              <div style="display:flex; gap:0.5rem; align-items:center;">
                <span class="session-meta-pill">Durasi: ${a.duration}</span>
                ${state.isManageMode ? `
                  <button class="btn-delete-card" onclick="deleteContentItem('audio', '${session.id}', '${a.id}')">🗑 Hapus</button>
                ` : ''}
              </div>
            </div>

            <!-- Waveform Simulation -->
            <div class="waveform-container" id="waveformBars-${a.id}">
              ${Array.from({length: 36}).map(() => `<div class="wave-bar"></div>`).join("")}
            </div>

            <!-- Audio Controls -->
            <div class="audio-controls-row">
              <button class="btn-play-pause-circle" onclick="toggleAudioPodcastSimulation('${a.id}')">
                ▶
              </button>
              <div class="audio-time-label" id="audioTimeLabel-${a.id}">00:00 / ${a.duration}</div>
              <button class="audio-speed-toggle" onclick="cycleAudioSpeed(this)">1.0x</button>
            </div>

            <!-- Transcript -->
            <div class="podcast-transcript-box">
              <strong style="color: var(--text-primary); font-size: 0.82rem; display: block; margin-bottom: 0.3rem;">Transkrip Ringkas:</strong>
              "${a.transcript || 'Transkrip audio perkuliahan.'}"
            </div>
          </div>
        `).join("") : `
          <div style="text-align: center; padding: 2.5rem; background: var(--bg-surface); border-radius: var(--radius-lg); color: var(--text-tertiary);">
            Belum ada rekaman audio pada pertemuan ini.
          </div>
        `}
      </div>
    </div>

    <!-- Panel 5: Latihan Soal & Kuis Interaktif -->
    <div class="media-tab-panel ${state.activeMediaTab === 'quiz' ? 'active' : ''}" id="panel-quiz">
      ${state.isManageMode ? `
        <div class="content-action-toolbar">
          <div style="display:flex; gap:0.5rem; align-items:center;">
            <span style="font-size:0.8rem; font-weight:600; color:var(--text-secondary);">Kelola Bank Soal:</span>
            <button class="btn-pill-action ${state.quizViewMode === 'manage' ? 'active' : ''}" onclick="toggleQuizViewMode()">
              ${state.quizViewMode === 'manage' ? 'Mode Pengerjaan Kuis ⚡' : '📋 Kelola & Daftar Soal (Dosen)'}
            </button>
          </div>
          <button class="btn-add-action" onclick="openContentModal('add-quiz', '${session.id}')">
            + Tambah Butir Soal Baru
          </button>
        </div>
      ` : ''}

      <div class="quiz-arena-wrapper" id="sessionQuizArena">
        ${state.quizViewMode === 'manage' && state.isManageMode ? renderQuizManageList(session) : renderInteractiveQuiz(session)}
      </div>
    </div>

    <!-- Panel 6: Tugas Perkuliahan -->
    <div class="media-tab-panel ${state.activeMediaTab === 'assignment' ? 'active' : ''}" id="panel-assignment">
      ${state.isManageMode ? `
        <div class="content-action-toolbar">
          <span style="font-size:0.8rem; font-weight:600; color:var(--text-secondary);">Kelola Penugasan Mahasiswa:</span>
          <div class="content-action-group">
            <button class="btn-add-action" onclick="openContentModal('edit-assignment', '${session.id}')">
              ${session.assignment ? '✏️ Edit Instruksi Tugas' : '+ Buat Tugas Baru'}
            </button>
            ${session.assignment ? `
              <button class="btn-delete-card" onclick="deleteContentItem('assignment', '${session.id}', '${session.assignment.id}')">
                🗑 Hapus Tugas Sesi Ini
              </button>
            ` : ''}
          </div>
        </div>
      ` : ''}

      ${session.assignment ? renderSessionAssignment(session.assignment, session.title) : `
        <div style="text-align: center; padding: 2.5rem; background: var(--bg-surface); border-radius: var(--radius-lg); color: var(--text-secondary);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🎉</div>
          <h3 style="margin-bottom: 0.4rem;">Tidak Ada Tugas pada Pertemuan Ini</h3>
          <p style="font-size: 0.88rem; color: var(--text-tertiary);">Fokuskan waktu Anda untuk mempelajari materi teori dan latihan soal interaktif.</p>
          ${state.isManageMode ? `
            <button class="btn-primary-gradient" style="margin-top: 1rem;" onclick="openContentModal('edit-assignment', '${session.id}')">
              + Buat Tugas untuk Pertemuan Ini
            </button>
          ` : ''}
        </div>
      `}
    </div>

    <!-- Self-Notes / Catatan Belajar Mandiri (Auto Save) -->
    <div class="self-notes-editor-card">
      <div class="notes-editor-header">
        <h4>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          Catatan Belajar Mandiri (Pertemuan ${session.number})
        </h4>
        <span class="notes-saved-hint" id="notesSavedIndicator">✓ Tersimpan otomatis</span>
      </div>
      <textarea class="notes-textarea" id="sessionNoteTextarea" 
                placeholder="Tulis ringkasan rumus, pertanyaan untuk dosen, atau catatan penting Anda di sini..."
                oninput="saveSessionNote('${session.id}', this.value)">${userSavedNote}</textarea>
    </div>
  `;
}

window.switchMediaTab = function(tabName) {
  sfx.playClick();
  state.activeMediaTab = tabName;
  const allCourses = getAllCourses();
  const course = allCourses.find(c => c.id === state.currentCourseId) || allCourses[0];
  const session = getResolvedMeeting(course.id, state.currentSessionId);
  renderActiveSessionDetails(session, course);
};

window.toggleQuizViewMode = function() {
  sfx.playClick();
  state.quizViewMode = state.quizViewMode === "play" ? "manage" : "play";
  const allCourses = getAllCourses();
  const course = allCourses.find(c => c.id === state.currentCourseId) || allCourses[0];
  const session = getResolvedMeeting(course.id, state.currentSessionId);
  renderActiveSessionDetails(session, course);
};

// Render Quiz Question Manager List (For Lecturer/Edit Mode)
function renderQuizManageList(session) {
  if (!session.quiz || session.quiz.length === 0) {
    return `
      <div style="text-align:center; padding: 2rem; color:var(--text-tertiary);">
        Belum ada butir soal. Klik "+ Tambah Butir Soal Baru" di atas untuk menambahkan pertanyaan kuis.
      </div>
    `;
  }

  return `
    <div style="margin-bottom: 1.25rem;">
      <h3 style="font-size: 1.15rem; margin-bottom: 0.35rem;">Daftar Bank Soal Kuis (${session.quiz.length} Soal)</h3>
      <p style="font-size: 0.8rem; color: var(--text-secondary);">Sebagai pengajar, Anda dapat menambah atau menghapus butir soal di bawah ini.</p>
    </div>

    <div>
      ${session.quiz.map((q, qIdx) => `
        <div class="quiz-manage-item-card">
          <div style="flex: 1;">
            <div style="font-weight: 700; margin-bottom: 0.5rem; font-size: 0.95rem;">
              ${qIdx + 1}. ${q.question}
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.84rem;">
              ${q.options.map((opt, optIdx) => `
                <div style="padding: 4px 8px; border-radius: 4px; background: ${optIdx === q.correct ? 'rgba(16,185,129,0.15)' : 'var(--bg-surface)'}; border: 1px solid ${optIdx === q.correct ? 'var(--accent-emerald)' : 'var(--border-subtle)'}; color: ${optIdx === q.correct ? 'var(--accent-emerald)' : 'inherit'};">
                  <strong>${String.fromCharCode(65 + optIdx)}:</strong> ${opt} ${optIdx === q.correct ? '✓ (Kunci)' : ''}
                </div>
              `).join("")}
            </div>
            <div style="margin-top: 0.5rem; font-size: 0.78rem; color: var(--text-tertiary);">
              <strong>Pembahasan:</strong> ${q.explanation}
            </div>
          </div>
          <button class="btn-delete-card" onclick="deleteContentItem('quiz', '${session.id}', '${q.id}')">
            🗑 Hapus Soal
          </button>
        </div>
      `).join("")}
    </div>
  `;
}

window.toggleSessionCompletion = function(sessionId) {
  sfx.playClick();
  const index = state.progress.completedSessions.indexOf(sessionId);
  if (index === -1) {
    state.progress.completedSessions.push(sessionId);
    sfx.playSuccess();
    showToast("Hebat! Pertemuan berhasil ditandai selesai.", "success");
  } else {
    state.progress.completedSessions.splice(index, 1);
    showToast("Status penyelesaian pertemuan dibatalkan.");
  }
  localStorage.setItem("edu_progress", JSON.stringify(state.progress));
  renderClassroom();
  renderDashboard();
  updateAcademicProgressUI();
};

window.saveSessionNote = function(sessionId, text) {
  state.notes[sessionId] = text;
  localStorage.setItem("edu_notes", JSON.stringify(state.notes));
  const indicator = document.getElementById("notesSavedIndicator");
  if (indicator) {
    indicator.textContent = "Menyimpan...";
    setTimeout(() => {
      indicator.textContent = "✓ Tersimpan otomatis";
    }, 600);
  }
};

window.printOrSaveSummary = function() {
  sfx.playClick();
  window.print();
};

// 3. INTERACTIVE QUIZ ENGINE
let currentQuizQuestionIndex = 0;
let currentQuizScore = 0;
let userSelectedAnswers = [];

function renderInteractiveQuiz(session) {
  if (!session.quiz || session.quiz.length === 0) {
    return `<div style="text-align:center; padding: 2rem;">Tidak ada kuis untuk pertemuan ini.</div>`;
  }

  const existingResult = state.quizResults[session.id];
  if (existingResult && currentQuizQuestionIndex === 0 && userSelectedAnswers.length === 0) {
    return `
      <div class="quiz-summary-result">
        <div class="quiz-trophy-icon">🏆</div>
        <h3 style="font-size: 1.4rem; margin-bottom: 0.5rem;">Kuis Telah Diselesaikan!</h3>
        <p style="color: var(--text-secondary); margin-bottom: 1.2rem;">
          Skor Terakhir Anda: <strong style="color: var(--accent-emerald); font-size: 1.25rem;">${existingResult.score} / ${existingResult.total * 100}</strong>
          (${existingResult.completedAt})
        </p>
        <button class="btn-primary-gradient" onclick="restartQuiz('${session.id}')">Ulangi Kuis ↺</button>
      </div>
    `;
  }

  const q = session.quiz[currentQuizQuestionIndex];
  if (!q) {
    currentQuizQuestionIndex = 0;
    return renderInteractiveQuiz(session);
  }

  const questionCount = session.quiz.length;

  return `
    <div class="quiz-arena-header">
      <span class="quiz-badge-question-num">Pertanyaan ${currentQuizQuestionIndex + 1} dari ${questionCount}</span>
      <span class="quiz-score-badge">Skor Sementara: ${currentQuizScore}</span>
    </div>

    <div class="quiz-question-card">
      <h3 class="quiz-question-text">${q.question}</h3>
      <div class="quiz-options-grid">
        ${q.options.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx);
          return `
            <button class="quiz-option-button" id="quiz-opt-${idx}" onclick="handleQuizAnswer('${session.id}', ${idx})">
              <span class="option-letter-badge">${letter}</span>
              <span>${opt}</span>
            </button>
          `;
        }).join("")}
      </div>
      <div id="quizExplanationBox"></div>
    </div>
  `;
}

window.handleQuizAnswer = function(sessionId, selectedIdx) {
  const allCourses = getAllCourses();
  const course = allCourses.find(c => c.id === state.currentCourseId) || allCourses[0];
  const session = getResolvedMeeting(course.id, sessionId);
  const q = session.quiz[currentQuizQuestionIndex];

  const buttons = document.querySelectorAll(".quiz-option-button");
  buttons.forEach(b => b.classList.add("disabled"));

  const selectedBtn = document.getElementById(`quiz-opt-${selectedIdx}`);
  const correctBtn = document.getElementById(`quiz-opt-${q.correct}`);

  const isCorrect = selectedIdx === q.correct;
  if (isCorrect) {
    sfx.playSuccess();
    if (selectedBtn) selectedBtn.classList.add("correct");
    currentQuizScore += Math.round(100 / session.quiz.length);
  } else {
    sfx.playError();
    if (selectedBtn) selectedBtn.classList.add("incorrect");
    if (correctBtn) correctBtn.classList.add("correct");
  }

  const expBox = document.getElementById("quizExplanationBox");
  if (expBox) {
    expBox.innerHTML = `
      <div class="quiz-explanation-box">
        <strong>${isCorrect ? '🎉 Jawaban Tepat!' : '❌ Jawaban Kurang Tepat!'}</strong>
        <p style="margin-top: 0.35rem; color: var(--text-secondary);">${q.explanation}</p>
        <button class="btn-primary-gradient" style="margin-top: 0.85rem; padding: 0.45rem 1rem; font-size: 0.8rem;" 
                onclick="nextQuizQuestion('${sessionId}')">
          ${currentQuizQuestionIndex + 1 < session.quiz.length ? 'Pertanyaan Selanjutnya &rarr;' : 'Selesaikan Kuis 🏆'}
        </button>
      </div>
    `;
  }
};

window.nextQuizQuestion = function(sessionId) {
  sfx.playClick();
  const allCourses = getAllCourses();
  const course = allCourses.find(c => c.id === state.currentCourseId) || allCourses[0];
  const session = getResolvedMeeting(course.id, sessionId);

  if (currentQuizQuestionIndex + 1 < session.quiz.length) {
    currentQuizQuestionIndex++;
    const arena = document.getElementById("sessionQuizArena");
    if (arena) arena.innerHTML = renderInteractiveQuiz(session);
  } else {
    sfx.playSuccess();
    state.quizResults[sessionId] = {
      score: currentQuizScore,
      total: session.quiz.length,
      completedAt: new Date().toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    localStorage.setItem("edu_quiz_results", JSON.stringify(state.quizResults));
    
    if (!state.progress.completedSessions.includes(sessionId)) {
      state.progress.completedSessions.push(sessionId);
      localStorage.setItem("edu_progress", JSON.stringify(state.progress));
    }

    currentQuizQuestionIndex = 0;
    currentQuizScore = 0;
    showToast("Selamat! Skor kuis telah dicatat di portofolio Anda.", "success");
    renderClassroom();
    renderDashboard();
    updateAcademicProgressUI();
  }
};

window.restartQuiz = function(sessionId) {
  sfx.playClick();
  currentQuizQuestionIndex = 0;
  currentQuizScore = 0;
  delete state.quizResults[sessionId];
  renderClassroom();
};

// 4. AUDIO PODCAST SIMULATION
let activePlayingAudioId = null;
let audioTimer = null;
let audioSeconds = 0;

window.toggleAudioPodcastSimulation = function(audioId) {
  sfx.playClick();
  const card = document.getElementById(`audioPodcastCard-${audioId}`);
  const timeLabel = document.getElementById(`audioTimeLabel-${audioId}`);

  if (activePlayingAudioId !== audioId) {
    if (activePlayingAudioId) {
      const prevCard = document.getElementById(`audioPodcastCard-${activePlayingAudioId}`);
      if (prevCard) prevCard.classList.remove("audio-playing");
      clearInterval(audioTimer);
    }

    activePlayingAudioId = audioId;
    audioSeconds = 0;
    if (card) card.classList.add("audio-playing");
    
    audioTimer = setInterval(() => {
      audioSeconds++;
      const mins = Math.floor(audioSeconds / 60).toString().padStart(2, '0');
      const secs = (audioSeconds % 60).toString().padStart(2, '0');
      if (timeLabel) timeLabel.textContent = `${mins}:${secs} / 12:00`;
    }, 1000);
  } else {
    activePlayingAudioId = null;
    if (card) card.classList.remove("audio-playing");
    clearInterval(audioTimer);
  }
};

window.cycleAudioSpeed = function(btn) {
  sfx.playClick();
  const speeds = ["1.0x", "1.25x", "1.5x", "2.0x"];
  const currentIdx = speeds.indexOf(btn.textContent);
  const nextSpeed = speeds[(currentIdx + 1) % speeds.length];
  btn.textContent = nextSpeed;
  showToast(`Kecepatan pemutaran diubah ke ${nextSpeed}`);
};

// 5. SESSION ASSIGNMENT COMPONENT
function renderSessionAssignment(assignment, sessionTitle) {
  const submission = state.submissions[assignment.id];
  const isSubmitted = !!submission;

  return `
    <div class="assignment-card-item" style="border-color: var(--primary-500);">
      <div class="assignment-card-top">
        <div>
          <span class="assignment-type-pill ${assignment.type}">${assignment.type}</span>
          <h2 class="assignment-title-bold">${assignment.title}</h2>
          <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 0.3rem;">Terkait: ${sessionTitle} • Bobot: ${assignment.points || 100} Poin</div>
        </div>
        <div class="assignment-deadline-countdown">
          ⏳ Tenggat: ${assignment.deadline}
        </div>
      </div>

      <div class="assignment-instructions-box">
        ${assignment.instructions}
      </div>

      ${assignment.templateFile ? `
        <div class="assignment-template-attachment">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span style="font-size: 1.3rem;">📎</span>
            <div>
              <div style="font-weight: 600; font-size: 0.84rem;">${assignment.templateFile}</div>
              <div style="font-size: 0.72rem; color: var(--text-tertiary);">Berkas Lembar Kerja / Template Resmi Dosen</div>
            </div>
          </div>
          <button class="btn-pill-action" onclick="downloadSimulatedFile('${assignment.templateFile}')">⬇ Unduh Template</button>
        </div>
      ` : ''}

      <div class="assignment-footer-status">
        <div class="submission-status-indicator">
          ${isSubmitted ? `
            <span style="color: var(--accent-emerald);">✅ Terkumpul pada ${submission.submittedAt}</span>
          ` : `
            <span style="color: var(--accent-amber);">⚠️ Belum Mengumpulkan Berkas</span>
          `}
        </div>

        <button class="btn-primary-gradient" onclick="openSubmissionModal('${assignment.id}', '${assignment.title}')">
          ${isSubmitted ? 'Edit / Perbarui Pengumpulan' : 'Unggah Tugas Sekarang 📤'}
        </button>
      </div>
    </div>
  `;
}

// 6. ASSIGNMENTS HUB VIEW (CENTRALIZED)
function renderAssignmentsHub() {
  const container = document.getElementById("assignmentsCardsContainer");
  if (!container) return;

  const courses = getAllCourses();
  let allAssignments = [];
  courses.forEach(c => {
    if (c.meetings) {
      c.meetings.forEach(m => {
        const resolved = getResolvedMeeting(c.id, m.id);
        if (resolved.assignment) {
          allAssignments.push({
            ...resolved.assignment,
            courseCode: c.code,
            courseTitle: c.title,
            meetingNumber: resolved.number
          });
        }
      });
    }
  });

  if (state.assignmentFilter !== "all") {
    allAssignments = allAssignments.filter(a => a.type.toLowerCase() === state.assignmentFilter.toLowerCase());
  }

  container.innerHTML = allAssignments.map(a => {
    const submission = state.submissions[a.id];
    const isSubmitted = !!submission;

    return `
      <div class="assignment-card-item">
        <div class="assignment-card-top">
          <div>
            <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.4rem;">
              <span class="assignment-type-pill ${a.type}">${a.type}</span>
              <span style="font-size: 0.75rem; color: var(--primary-400); font-weight: 700;">${a.courseCode} • Pertemuan ${a.meetingNumber}</span>
            </div>
            <h3 class="assignment-title-bold">${a.title}</h3>
          </div>
          <div class="assignment-deadline-countdown">
            ⏳ Tenggat: ${a.deadline}
          </div>
        </div>

        <div class="assignment-instructions-box">
          ${a.instructions}
        </div>

        <div class="assignment-footer-status">
          <div class="submission-status-indicator">
            ${isSubmitted ? `
              <span style="color: var(--accent-emerald);">
                ✅ Terkumpul: <strong>${submission.fileName || submission.link}</strong>
              </span>
            ` : `
              <span style="color: var(--accent-amber);">⚠️ Status: Belum Dikumpulkan</span>
            `}
          </div>

          <button class="btn-primary-gradient" onclick="openSubmissionModal('${a.id}', '${a.title}')">
            ${isSubmitted ? 'Lihat / Ubah Pengumpulan' : 'Kumpulkan Tugas 📤'}
          </button>
        </div>
      </div>
    `;
  }).join("");

  document.querySelectorAll(".filter-chip-btn").forEach(btn => {
    btn.onclick = () => {
      sfx.playClick();
      document.querySelectorAll(".filter-chip-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.assignmentFilter = btn.getAttribute("data-filter");
      renderAssignmentsHub();
    };
  });
}

// 7. SUBMISSION MODAL
let activeSubmittingAssignmentId = null;

window.openSubmissionModal = function(assignmentId, title) {
  sfx.playClick();
  activeSubmittingAssignmentId = assignmentId;
  const modal = document.getElementById("submissionModalBackdrop");
  const titleEl = document.getElementById("submissionModalTitle");
  if (titleEl) titleEl.textContent = title;

  const existing = state.submissions[assignmentId];
  const linkInput = document.getElementById("submissionLinkInput");
  const noteInput = document.getElementById("submissionNotesInput");
  const fileLabel = document.getElementById("submissionFileNameLabel");

  if (linkInput) linkInput.value = existing ? existing.link || "" : "";
  if (noteInput) noteInput.value = existing ? existing.notes || "" : "";
  if (fileLabel) fileLabel.textContent = existing && existing.fileName ? `Berkas terpasang: ${existing.fileName}` : "Belum ada berkas dipilih";

  if (modal) modal.classList.add("active");
};

function setupModalEvents() {
  const modal = document.getElementById("submissionModalBackdrop");
  const closeBtn = document.getElementById("closeSubmissionModalBtn");
  const form = document.getElementById("submissionForm");

  if (closeBtn) closeBtn.onclick = () => modal.classList.remove("active");
  if (modal) {
    modal.onclick = (e) => {
      if (e.target === modal) modal.classList.remove("active");
    };
  }

  const fileInput = document.getElementById("fileDropInput");
  const fileLabel = document.getElementById("submissionFileNameLabel");
  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        sfx.playClick();
        if (fileLabel) fileLabel.textContent = `File terpilih: ${e.target.files[0].name} (${(e.target.files[0].size / 1024).toFixed(1)} KB)`;
      }
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const link = document.getElementById("submissionLinkInput").value;
      const notes = document.getElementById("submissionNotesInput").value;
      const file = fileInput && fileInput.files.length > 0 ? fileInput.files[0].name : "Dokumen_Tugas.pdf";

      state.submissions[activeSubmittingAssignmentId] = {
        fileName: file,
        link: link,
        notes: notes,
        submittedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      };

      localStorage.setItem("edu_submissions", JSON.stringify(state.submissions));
      sfx.playSuccess();
      showToast("Tugas berhasil dikumpulkan dan tersimpan di database!", "success");
      modal.classList.remove("active");
      renderClassroom();
      renderAssignmentsHub();
      renderDashboard();
    });
  }

  // Meeting modal backdrop click & direct button listener
  const meetingModal = document.getElementById("meetingModal");
  if (meetingModal) {
    meetingModal.addEventListener("click", (e) => {
      if (e.target === meetingModal) closeMeetingModal();
    });
  }

  const btnAddMeeting = document.getElementById("btnAddMeeting");
  if (btnAddMeeting) {
    btnAddMeeting.addEventListener("click", (e) => {
      e.preventDefault();
      openMeetingModal("add");
    });
  }
}

// 8. CONTENT MANAGEMENT MODAL & HANDLERS (CMS)
let activeCMSContext = {
  type: null,
  sessionId: null,
  itemId: null
};

window.openContentModal = function(type, sessionId, itemId = null) {
  sfx.playClick();
  activeCMSContext = { type, sessionId, itemId };
  const modal = document.getElementById("contentManagerModal");
  const titleEl = document.getElementById("contentModalTitle");
  const subtitleEl = document.getElementById("contentModalSubtitle");
  const formBody = document.getElementById("contentManagerFormBody");

  const resolved = getResolvedMeeting(state.currentCourseId, sessionId);

  if (type === "edit-text") {
    titleEl.textContent = "Edit Teks Teori & Capaian Belajar";
    subtitleEl.textContent = `Pertemuan ${resolved.number} • ${resolved.title}`;
    formBody.innerHTML = `
      <div class="form-group-field">
        <label class="form-label-text">Judul Pertemuan</label>
        <input type="text" class="form-input-text" id="cmsSessionTitle" value="${resolved.title}" required>
      </div>
      <div class="form-group-field">
        <label class="form-label-text">Sub-Judul / Tagline Materi</label>
        <input type="text" class="form-input-text" id="cmsSessionTagline" value="${resolved.tagline || ''}">
      </div>
      <div class="form-group-field">
        <label class="form-label-text">Capaian Pembelajaran (Pisahkan dengan baris baru)</label>
        <textarea class="form-input-text" id="cmsLearningOutcomes" rows="3">${resolved.learningOutcomes ? resolved.learningOutcomes.join("\n") : ""}</textarea>
      </div>
      <div class="form-group-field">
        <label class="form-label-text">Isi Materi Teks Teori (Mendukung HTML & Paragraf)</label>
        <textarea class="form-input-text" id="cmsTextTheory" rows="8" required>${resolved.textTheory}</textarea>
      </div>
    `;
  } else if (type === "add-file") {
    titleEl.textContent = "Unggah / Tambah Berkas Modul Pembelajaran";
    subtitleEl.textContent = `Lampirkan Dokumen ke Pertemuan ${resolved.number}`;
    formBody.innerHTML = `
      <div class="form-group-field">
        <label class="form-label-text">Nama Dokumen / Modul</label>
        <input type="text" class="form-input-text" id="cmsFileName" placeholder="Contoh: Modul_Praktikum_UML_P3.pdf" required>
      </div>
      <div class="form-group-field">
        <label class="form-label-text">Pilih File dari Komputer (PDF, PPT, DOC, ZIP)</label>
        <input type="file" class="form-input-text" id="cmsFileInput" accept=".pdf,.docx,.pptx,.zip,.rar,.txt">
      </div>
      <div class="form-group-field">
        <label class="form-label-text">Atau Tautan Download Cloud (Google Drive / OneDrive)</label>
        <input type="url" class="form-input-text" id="cmsFileUrl" placeholder="https://drive.google.com/...">
      </div>
      <div class="form-group-field">
        <label class="form-label-text">Keterangan / Ukuran Berkas</label>
        <input type="text" class="form-input-text" id="cmsFileSize" placeholder="Contoh: 3.5 MB • Slide Kuliah Dosen">
      </div>
    `;
  } else if (type === "add-infographic") {
    titleEl.textContent = "Tambah Infografis & Diagram Sistem Baru";
    subtitleEl.textContent = `Galeri Visual Pertemuan ${resolved.number}`;
    formBody.innerHTML = `
      <div class="form-group-field">
        <label class="form-label-text">Judul Infografis</label>
        <input type="text" class="form-input-text" id="cmsInfoTitle" placeholder="Contoh: Diagram Arsitektur Microservices" required>
      </div>
      <div class="form-group-field">
        <label class="form-label-text">Pilih File Gambar dari Komputer (PNG, JPG, SVG)</label>
        <input type="file" class="form-input-text" id="cmsInfoFileInput" accept="image/*">
      </div>
      <div class="form-group-field">
        <label class="form-label-text">Atau Masukkan Tautan / URL Gambar</label>
        <input type="text" class="form-input-text" id="cmsInfoUrl" placeholder="assets/sdlc_infographic.jpg atau https://..." value="assets/sdlc_infographic.jpg">
      </div>
      <div class="form-group-field">
        <label class="form-label-text">Keterangan Singkat</label>
        <input type="text" class="form-input-text" id="cmsInfoDesc" placeholder="Deskripsi pemodelan arsitektur...">
      </div>
    `;
  } else if (type === "add-video") {
    titleEl.textContent = "Tambah Video Pembelajaran Baru";
    subtitleEl.textContent = `Koleksi Video Pertemuan ${resolved.number}`;
    formBody.innerHTML = `
      <div class="form-group-field">
        <label class="form-label-text">Judul Video</label>
        <input type="text" class="form-input-text" id="cmsVideoTitle" placeholder="Contoh: Tutorial Praktik Use Case Diagram" required>
      </div>
      <div class="form-group-field">
        <label class="form-label-text">URL Embed Video (YouTube Embed atau URL MP4)</label>
        <input type="text" class="form-input-text" id="cmsVideoUrl" placeholder="https://www.youtube-nocookie.com/embed/..." value="https://www.youtube-nocookie.com/embed/UI6lqHOVHic" required>
      </div>
      <div class="form-group-field">
        <label class="form-label-text">Estimasi Durasi Video</label>
        <input type="text" class="form-input-text" id="cmsVideoDuration" placeholder="Contoh: 18:30" value="20 Menit">
      </div>
    `;
  } else if (type === "add-audio") {
    titleEl.textContent = "Tambah Rekaman Audio / Voice Note";
    subtitleEl.textContent = `Podcast Materi Pertemuan ${resolved.number}`;
    formBody.innerHTML = `
      <div class="form-group-field">
        <label class="form-label-text">Judul Rekaman Audio</label>
        <input type="text" class="form-input-text" id="cmsAudioTitle" placeholder="Contoh: Audio Penjelasan Dosen: Tips Analisis Kebutuhan" required>
      </div>
      <div class="form-group-field">
        <label class="form-label-text">Pilih File Audio (MP3, WAV, OGG) atau Tautan</label>
        <input type="file" class="form-input-text" id="cmsAudioFileInput" accept="audio/*">
      </div>
      <div class="form-group-field">
        <label class="form-label-text">Durasi Audio</label>
        <input type="text" class="form-input-text" id="cmsAudioDuration" placeholder="Contoh: 15:40" value="12:00">
      </div>
      <div class="form-group-field">
        <label class="form-label-text">Transkrip Ringkas Penjelasan</label>
        <textarea class="form-input-text" id="cmsAudioTranscript" rows="3" placeholder="Tuliskan rangkuman apa yang dibahas pada rekaman audio ini..."></textarea>
      </div>
    `;
  } else if (type === "add-quiz") {
    titleEl.textContent = "Tambah Butir Soal Kuis Baru";
    subtitleEl.textContent = `Bank Soal Pertemuan ${resolved.number}`;
    formBody.innerHTML = `
      <div class="form-group-field">
        <label class="form-label-text">Pertanyaan Soal</label>
        <textarea class="form-input-text" id="cmsQuizQuestion" rows="2" placeholder="Tuliskan butir soal pertanyaan di sini..." required></textarea>
      </div>
      <div class="form-group-field">
        <label class="form-label-text">Pilihan Opsi A</label>
        <input type="text" class="form-input-text" id="cmsOptA" placeholder="Jawaban A" required>
      </div>
      <div class="form-group-field">
        <label class="form-label-text">Pilihan Opsi B</label>
        <input type="text" class="form-input-text" id="cmsOptB" placeholder="Jawaban B" required>
      </div>
      <div class="form-group-field">
        <label class="form-label-text">Pilihan Opsi C</label>
        <input type="text" class="form-input-text" id="cmsOptC" placeholder="Jawaban C" required>
      </div>
      <div class="form-group-field">
        <label class="form-label-text">Pilihan Opsi D</label>
        <input type="text" class="form-input-text" id="cmsOptD" placeholder="Jawaban D" required>
      </div>
      <div class="form-group-field">
        <label class="form-label-text">Kunci Jawaban Benar</label>
        <select class="form-input-text" id="cmsCorrectOpt">
          <option value="0">Opsi A</option>
          <option value="1">Opsi B</option>
          <option value="2">Opsi C</option>
          <option value="3">Opsi D</option>
        </select>
      </div>
      <div class="form-group-field">
        <label class="form-label-text">Penjelasan & Pembahasan Jawaban</label>
        <textarea class="form-input-text" id="cmsQuizExplanation" rows="2" placeholder="Jelaskan mengapa pilihan ini benar..."></textarea>
      </div>
    `;
  } else if (type === "edit-assignment") {
    const curAssign = resolved.assignment || {
      id: `tugas-${resolved.id}`,
      type: "Individu",
      title: `Tugas Pertemuan ${resolved.number}`,
      deadline: "2026-11-20 23:59:00",
      points: 100,
      instructions: "Petunjuk pengerjaan tugas...",
      templateFile: "Template_Laporan.docx"
    };

    titleEl.textContent = resolved.assignment ? "Edit Instruksi Tugas Perkuliahan" : "Buat Tugas Baru untuk Pertemuan Ini";
    subtitleEl.textContent = `Penugasan Mahasiswa Pertemuan ${resolved.number}`;
    formBody.innerHTML = `
      <div class="form-group-field">
        <label class="form-label-text">Judul Tugas</label>
        <input type="text" class="form-input-text" id="cmsAssignTitle" value="${curAssign.title}" required>
      </div>
      <div class="form-group-field">
        <label class="form-label-text">Kategori Penugasan</label>
        <select class="form-input-text" id="cmsAssignType">
          <option value="Individu" ${curAssign.type === 'Individu' ? 'selected' : ''}>Tugas Individu</option>
          <option value="Kelompok" ${curAssign.type === 'Kelompok' ? 'selected' : ''}>Tugas Kelompok (Tubes)</option>
        </select>
      </div>
      <div class="form-group-field">
        <label class="form-label-text">Batas Waktu Pengumpulan (Deadline)</label>
        <input type="text" class="form-input-text" id="cmsAssignDeadline" value="${curAssign.deadline}" placeholder="YYYY-MM-DD HH:mm:ss" required>
      </div>
      <div class="form-group-field">
        <label class="form-label-text">Bobot Nilai Maksimal</label>
        <input type="number" class="form-input-text" id="cmsAssignPoints" value="${curAssign.points || 100}">
      </div>
      <div class="form-group-field">
        <label class="form-label-text">Petunjuk & Rubrik Pengerjaan Tugas</label>
        <textarea class="form-input-text" id="cmsAssignInstructions" rows="5" required>${curAssign.instructions}</textarea>
      </div>
      <div class="form-group-field">
        <label class="form-label-text">Lampirkan File Template Tugas (Opsional)</label>
        <input type="text" class="form-input-text" id="cmsAssignTemplate" value="${curAssign.templateFile || ''}" placeholder="Contoh: Template_Dokumen_SRS.docx">
      </div>
    `;
  }

  if (modal) modal.classList.add("active");
};

window.closeContentModal = function() {
  const modal = document.getElementById("contentManagerModal");
  if (modal) modal.classList.remove("active");
};

// Handle Saving dynamic content item
window.handleSaveContentItem = function(e) {
  e.preventDefault();
  const { type, sessionId } = activeCMSContext;
  if (!sessionId) return;

  if (!state.customMaterials[sessionId]) {
    state.customMaterials[sessionId] = {};
  }
  const custom = state.customMaterials[sessionId];
  const allCourses = getAllCourses();
  const course = allCourses.find(c => c.id === state.currentCourseId) || allCourses[0];
  const resolved = getResolvedMeeting(course.id, sessionId);

  if (type === "edit-text") {
    custom.title = document.getElementById("cmsSessionTitle").value;
    custom.tagline = document.getElementById("cmsSessionTagline").value;
    const outcomesRaw = document.getElementById("cmsLearningOutcomes").value;
    custom.learningOutcomes = outcomesRaw.split("\n").map(s => s.trim()).filter(s => s.length > 0);
    custom.textTheory = document.getElementById("cmsTextTheory").value;
    showToast("Materi teks teori & capaian belajar berhasil diperbarui!", "success");
  } else if (type === "add-file") {
    const fileInput = document.getElementById("cmsFileInput");
    let fileName = document.getElementById("cmsFileName").value;
    let sizeInfo = document.getElementById("cmsFileSize").value || "2.1 MB";
    let fileUrl = document.getElementById("cmsFileUrl").value || "#";

    if (fileInput && fileInput.files.length > 0) {
      fileName = fileInput.files[0].name;
      sizeInfo = `${(fileInput.files[0].size / (1024 * 1024)).toFixed(1)} MB`;
    }

    const currentFiles = custom.files !== undefined ? custom.files : (resolved.files || []);
    const newFile = {
      id: `file-${Date.now()}`,
      name: fileName,
      size: sizeInfo,
      url: fileUrl,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    custom.files = [...currentFiles, newFile];
    showToast("Berkas modul baru berhasil dilampirkan!", "success");
  } else if (type === "add-infographic") {
    const infoFileInput = document.getElementById("cmsInfoFileInput");
    const infoTitle = document.getElementById("cmsInfoTitle").value;
    const infoDesc = document.getElementById("cmsInfoDesc").value;
    let infoUrl = document.getElementById("cmsInfoUrl").value;

    if (infoFileInput && infoFileInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        saveInfographicEntry(evt.target.result, infoTitle, infoDesc, sessionId, custom, resolved);
      };
      reader.readAsDataURL(infoFileInput.files[0]);
      closeContentModal();
      return;
    } else {
      saveInfographicEntry(infoUrl, infoTitle, infoDesc, sessionId, custom, resolved);
      closeContentModal();
      return;
    }
  } else if (type === "add-video") {
    const vTitle = document.getElementById("cmsVideoTitle").value;
    let vUrl = document.getElementById("cmsVideoUrl").value;
    const vDur = document.getElementById("cmsVideoDuration").value || "15 Menit";

    if (vUrl.includes("watch?v=")) {
      vUrl = vUrl.replace("watch?v=", "embed/");
    }

    const currentVideos = custom.videos !== undefined ? custom.videos : (resolved.videos || []);
    custom.videos = [...currentVideos, {
      id: `video-${Date.now()}`,
      title: vTitle,
      embedUrl: vUrl,
      duration: vDur
    }];
    showToast("Video pembelajaran baru berhasil ditambahkan!", "success");
  } else if (type === "add-audio") {
    const aTitle = document.getElementById("cmsAudioTitle").value;
    const aDur = document.getElementById("cmsAudioDuration").value || "12:00";
    const aTrans = document.getElementById("cmsAudioTranscript").value || "Transkrip audio.";

    const currentAudios = custom.audios !== undefined ? custom.audios : (resolved.audios || []);
    custom.audios = [...currentAudios, {
      id: `audio-${Date.now()}`,
      title: aTitle,
      duration: aDur,
      transcript: aTrans
    }];
    showToast("Rekaman audio penjelasan baru berhasil ditambahkan!", "success");
  } else if (type === "add-quiz") {
    const qText = document.getElementById("cmsQuizQuestion").value;
    const optA = document.getElementById("cmsOptA").value;
    const optB = document.getElementById("cmsOptB").value;
    const optC = document.getElementById("cmsOptC").value;
    const optD = document.getElementById("cmsOptD").value;
    const correctIdx = parseInt(document.getElementById("cmsCorrectOpt").value, 10);
    const expText = document.getElementById("cmsQuizExplanation").value || "Kunci jawaban tepat.";

    const currentQuiz = custom.quiz !== undefined ? custom.quiz : (resolved.quiz || []);
    custom.quiz = [...currentQuiz, {
      id: `quiz-q-${Date.now()}`,
      question: qText,
      options: [optA, optB, optC, optD],
      correct: correctIdx,
      explanation: expText
    }];
    showToast("Butir soal kuis baru berhasil ditambahkan ke bank soal!", "success");
  } else if (type === "edit-assignment") {
    const title = document.getElementById("cmsAssignTitle").value;
    const assignType = document.getElementById("cmsAssignType").value;
    const deadline = document.getElementById("cmsAssignDeadline").value;
    const points = parseInt(document.getElementById("cmsAssignPoints").value, 10) || 100;
    const instructions = document.getElementById("cmsAssignInstructions").value;
    const template = document.getElementById("cmsAssignTemplate").value;

    custom.assignment = {
      id: `tugas-${sessionId}`,
      title: title,
      type: assignType,
      deadline: deadline,
      points: points,
      instructions: instructions,
      templateFile: template
    };
    showToast("Instruksi tugas berhasil diperbarui!", "success");
  }

  sfx.playSuccess();
  localStorage.setItem("edu_custom_materials", JSON.stringify(state.customMaterials));
  closeContentModal();
  renderClassroom();
  renderAssignmentsHub();
};

function saveInfographicEntry(url, title, desc, sessionId, custom, resolved) {
  const currentInfos = custom.infographics !== undefined ? custom.infographics : (resolved.infographics || []);
  custom.infographics = [...currentInfos, {
    id: `info-${Date.now()}`,
    url: url,
    title: title,
    desc: desc
  }];
  sfx.playSuccess();
  localStorage.setItem("edu_custom_materials", JSON.stringify(state.customMaterials));
  showToast("Infografis baru berhasil ditambahkan!", "success");
  renderClassroom();
}

// Delete Item from collection (file, infographic, video, audio, quiz, assignment)
window.deleteContentItem = function(type, sessionId, itemId) {
  if (!confirm("Apakah Anda yakin ingin menghapus materi ini dari pertemuan?")) return;

  sfx.playClick();
  if (!state.customMaterials[sessionId]) {
    state.customMaterials[sessionId] = {};
  }
  const custom = state.customMaterials[sessionId];
  const allCourses = getAllCourses();
  const course = allCourses.find(c => c.id === state.currentCourseId) || allCourses[0];
  const resolved = getResolvedMeeting(course.id, sessionId);

  if (type === "file") {
    const files = custom.files !== undefined ? custom.files : (resolved.files || []);
    custom.files = files.filter(f => f.id !== itemId);
    showToast("Berkas modul berhasil dihapus.");
  } else if (type === "infographic") {
    const infos = custom.infographics !== undefined ? custom.infographics : (resolved.infographics || []);
    custom.infographics = infos.filter(i => i.id !== itemId);
    showToast("Infografis berhasil dihapus.");
  } else if (type === "video") {
    const videos = custom.videos !== undefined ? custom.videos : (resolved.videos || []);
    custom.videos = videos.filter(v => v.id !== itemId);
    showToast("Video pembelajaran berhasil dihapus.");
  } else if (type === "audio") {
    const audios = custom.audios !== undefined ? custom.audios : (resolved.audios || []);
    custom.audios = audios.filter(a => a.id !== itemId);
    showToast("Audio penjelasan berhasil dihapus.");
  } else if (type === "quiz") {
    const quiz = custom.quiz !== undefined ? custom.quiz : (resolved.quiz || []);
    custom.quiz = quiz.filter(q => q.id !== itemId);
    showToast("Butir soal berhasil dihapus dari bank soal.");
  } else if (type === "assignment") {
    custom.assignment = null;
    showToast("Tugas pertemuan ini telah dihapus.");
  }

  localStorage.setItem("edu_custom_materials", JSON.stringify(state.customMaterials));
  renderClassroom();
  renderAssignmentsHub();
};

window.downloadSimulatedFile = function(fileName) {
  sfx.playClick();
  showToast(`Mengunduh file: ${fileName}...`, "success");
  const blob = new Blob([`EduCampus Digital - Materi Kuliah Resmi: ${fileName}\nDiunduh pada: ${new Date().toLocaleString()}`], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// 9. E-LIBRARY & RESOURCES
function renderResourcesHub() {
  const container = document.getElementById("resourcesLibraryGrid");
  if (!container) return;

  container.innerHTML = GLOBAL_RESOURCES.map(r => `
    <div class="resource-item-card">
      <div class="resource-category-tag">${r.category}</div>
      <a href="${r.link}" target="_blank" rel="noopener" class="resource-title-link">
        ${r.title} ↗
      </a>
      <div class="resource-author-text">Oleh: ${r.author} (${r.year})</div>
      <div class="resource-tags-wrap">
        <span class="tag-badge-subtle" style="background: rgba(99,102,241,0.2); color: var(--primary-300);">${r.badge}</span>
        ${r.tags.map(t => `<span class="tag-badge-subtle">${t}</span>`).join("")}
      </div>
    </div>
  `).join("");
}

// 10. IMAGE MODAL VIEWER
window.openImageModal = function(src) {
  sfx.playClick();
  const modal = document.getElementById("imageViewerModal");
  const img = document.getElementById("imageViewerImg");
  if (modal && img) {
    img.src = src;
    modal.classList.add("active");
  }
};

window.closeImageModal = function() {
  const modal = document.getElementById("imageViewerModal");
  if (modal) modal.classList.remove("active");
};

// 11. GLOBAL SEARCH
function setupGlobalSearch() {
  const searchInput = document.getElementById("globalSearchInput");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (query.length < 2) return;

    const allCourses = getAllCourses();
    let foundMeeting = null;
    let foundCourse = null;

    for (let c of allCourses) {
      if (c.meetings) {
        for (let m of c.meetings) {
          const resolved = getResolvedMeeting(c.id, m.id);
          if (resolved.title.toLowerCase().includes(query) || (resolved.tagline && resolved.tagline.toLowerCase().includes(query))) {
            foundMeeting = resolved;
            foundCourse = c;
            break;
          }
        }
      }
      if (foundMeeting) break;
    }

    if (foundMeeting && foundCourse) {
      state.currentCourseId = foundCourse.id;
      state.currentSessionId = foundMeeting.id;
      renderCourseSelect();
      renderClassroom();
      switchTab("classroom");
      showToast(`Ditemukan materi: "${foundMeeting.title}"`);
    }
  });
}

// 12. SIDEBAR ACADEMIC PROGRESS
function updateAcademicProgressUI() {
  const allCourses = getAllCourses();
  const course = allCourses.find(c => c.id === state.currentCourseId) || allCourses[0];
  const total = course.totalMeetings || 16;
  const completed = course.meetings ? course.meetings.filter(m => state.progress.completedSessions.includes(m.id)).length : 0;
  const pct = Math.round((completed / total) * 100);

  const fill = document.getElementById("sidebarProgressFill");
  const text = document.getElementById("sidebarProgressText");
  const metric = document.getElementById("sidebarProgressMetric");

  if (fill) fill.style.width = `${pct}%`;
  if (text) text.textContent = `${pct}% Selesai`;
  if (metric) metric.textContent = `${completed} dari ${total} Pertemuan`;
}
