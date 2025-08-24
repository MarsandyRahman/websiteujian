// Fungsi menu utama manajemen dengan log dan render konten
function showManageUsers() {
    console.log('Fungsi showManageUsers dipanggil');
    const manageSection = document.getElementById('manage-section');
    if (!manageSection) return;
    manageSection.innerHTML = '';
    let html = `<h2>Manajemen User</h2>`;
    html += `<table style='width:100%;border-collapse:collapse;margin-top:8px;'>`;
    html += `<tr style='background:#eee;'><th>ID</th><th>Nama</th><th>Role</th></tr>`;
    users.forEach(u => {
        html += `<tr><td>${u.id}</td><td>${u.name}</td><td>${u.role}</td></tr>`;
    });
    html += `</table>`;
    manageSection.innerHTML = html;
}
// ...existing code...
function renderOptionInputs() {
    const type = document.getElementById('new-type').value;
    const optionInputs = document.getElementById('option-inputs');
    if (type === 'multiple') {
        let html = '';
        for (let i = 0; i < 4; i++) {
            html += `<div style='display:flex;align-items:center;gap:8px;margin-bottom:4px;'><input type='text' id='opt${i}' placeholder='Opsi ${i+1}' style='width:180px;'><input type='radio' name='answer-radio' value='${i}' id='radio${i}'><label for='radio${i}' style='font-size:14px;'>Centang jika jawaban benar</label></div>`;
        }
        optionInputs.innerHTML = html;
        document.getElementById('new-answer-text').style.display = 'none';
    } else {
        optionInputs.innerHTML = '';
        document.getElementById('new-answer-text').style.display = '';
    }
    }

function addQuestion() {
    const type = document.getElementById('new-type').value;
    const qText = document.getElementById('new-question').value;
    const selectedCode = document.getElementById('subject-select').value;
    let selectedSubject = subjects.find(s => s.code === selectedCode);
    const image = uploadedImageData;
    if (type === 'multiple') {
        let opts = [];
        for (let i = 0; i < 4; i++) {
            const val = document.getElementById('opt'+i).value.trim();
            if (val) opts.push(val);
        }
        const radios = document.getElementsByName('answer-radio');
        let ans = -1;
        radios.forEach(r => { if (r.checked) ans = parseInt(r.value); });
        if (!qText || opts.length < 2 || ans < 0 || ans >= opts.length) {
            showMessage('Isi soal, minimal 2 opsi, dan centang jawaban benar!', 'error');
            return;
        }
        selectedSubject.questions.push({ type, question: qText, options: opts, answer: ans, image });
    } else if (type === 'short') {
        const answerText = document.getElementById('new-answer-text').value.trim();
        if (!qText || !answerText) {
            showMessage('Isi soal dan jawaban benar untuk isian singkat!', 'error');
            return;
        }
        selectedSubject.questions.push({ type, question: qText, answerText, image });
    }
    showMessage('Soal berhasil ditambah!', 'success');
    showManageSection();
}

function deleteQuestion(code, idx) {
    let subj = subjects.find(s => s.code === code);
    if (!subj) return;
    if (confirm('Yakin ingin menghapus soal ini?')) {
        subj.questions.splice(idx, 1);
        showManageSection();
    }
}
// ...existing code...

function editSubject(idx) {
    const subj = subjects[idx];
    const area = document.getElementById('edit-subject-area');
    area.innerHTML = `<div style='margin-top:10px;background:#fffbe6;padding:10px;border-radius:6px;'>Edit Nama Mapel: <input type='text' id='edit-subject-name' value='${subj.name}'><button onclick='saveEditSubject(${idx})' style='margin-left:8px;'>Simpan</button></div>`;
}
// ...existing code...

function saveEditSubject(idx) {
    const newName = document.getElementById('edit-subject-name').value.trim();
    if (!newName) {
        alert('Nama mapel tidak boleh kosong!');
        return;
    }
    subjects[idx].name = newName;
    showManageSection('mapel');
}
// ...existing code...

function deleteSubject(idx) {
    if (confirm('Yakin ingin menghapus mata pelajaran ini beserta semua soalnya?')) {
        subjects.splice(idx, 1);
        showManageSection('mapel');
    }
}
// ...existing code...

function addSubject() {
    const code = document.getElementById('new-subject-code').value;
    const name = document.getElementById('new-subject-name').value;
    if (!code || !name) {
        showMessage('Isi kode dan nama mapel!', 'error');
        return;
    }
    if (subjects.find(s => s.code === code)) {
        showMessage('Kode mapel sudah digunakan!', 'error');
        return;
    }
    subjects.push({ code, name, questions: [] });
    showMessage('Mata pelajaran berhasil ditambah!', 'success');
    showManageSection('mapel');
}
// ...existing code...

function startQuiz() {
    currentRole = 'siswa';
    currentQuestion = 0;
    score = 0;
    document.getElementById('manage-section').style.display = 'none';
    showQuestion();
}

let users = [
    { id: 'admin', password: 'admin123', name: 'Administrator', role: 'admin' },
    { id: 'guru1', password: 'guru123', name: 'Guru Satu', role: 'guru' },
    { id: 'siswa1', password: 'siswa123', name: 'Siswa Satu', role: 'siswa' }
];

// Cegah data default menimpa data localStorage
window._ujian_data_loaded = false;
function loadAllData() {
    try {
        const u = localStorage.getItem('ujian_users');
        const s = localStorage.getItem('ujian_subjects');
        const c = localStorage.getItem('ujian_classes');
        if (u) { users = JSON.parse(u); window._ujian_data_loaded = true; }
        if (s) { subjects = JSON.parse(s); window._ujian_data_loaded = true; }
        if (c) { classes = JSON.parse(c); window._ujian_data_loaded = true; }
    } catch(e) {}
}

// Panggil loadAllData di awal
loadAllData();

let subjects = [
    { code: 'MTK01', name: 'Matematika', questions: [
        {
            type: 'multiple',
            question: "2 + 2 = ?",
            options: ["3", "4", "5", "6"],
            answer: 1,
            image: '' // kosong, tidak ada gambar
        },
        {
            type: 'short',
            question: "Berapakah hasil 5 x 3?",
            answerText: "15",
            image: ''
        },
        {
            type: 'multiple',
            question: "Pilih gambar segitiga!",
            options: ["A", "B", "C", "D"],
            answer: 2,
            image: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Triangle_illustration.png'
        }
    ] },
    { code: 'IND01', name: 'Bahasa Indonesia', questions: [
        {
            type: 'multiple',
            question: "Ibukota Indonesia adalah?",
            options: ["Bandung", "Jakarta", "Surabaya", "Medan"],
            answer: 1,
            image: ''
        },
        {
            type: 'short',
            question: "Tuliskan sinonim kata 'pandai'!",
            answerText: "cerdas",
            image: ''
        }
    ] }
];
// const questions = []; // Nonaktifkan, migrasi ke subjects


let currentUser = null;
let currentRole = "siswa";
let currentQuestion = 0;
let score = 0;

function login() {
    const userid = document.getElementById('userid').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember-me') ? document.getElementById('remember-me').checked : false;
    const user = users.find(u => u.id === userid && u.password === password);
    if (!user) {
        showMessage('ID atau password salah!', 'error');
        return;
    }
    currentUser = user;
    currentRole = user.role;
    if (remember) {
        localStorage.setItem('rememberUser', JSON.stringify({ id: userid, password: password }));
    } else {
        localStorage.removeItem('rememberUser');
    }
    // Reset tampilan utama
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'inline-block';
    document.getElementById('user-dashboard').style.display = 'block';
    document.getElementById('result-section').style.display = 'none';
    // Pastikan elemen menu manajemen dan quiz-section ada
    let manageSection = document.getElementById('manage-section');
    if (!manageSection) {
        manageSection = document.createElement('div');
        manageSection.id = 'manage-section';
        document.body.appendChild(manageSection);
    }
    let quizSection = document.getElementById('quiz-section');
    if (!quizSection) {
        quizSection = document.createElement('div');
        quizSection.id = 'quiz-section';
        document.body.appendChild(quizSection);
    }
    // Modular: render sesuai peran
    showDashboard();
    if (currentRole === 'admin' || currentRole === 'guru') {
        manageSection.style.display = 'block';
        quizSection.style.display = 'none';
        showManageSection('main-menu');
    } else if (currentRole === 'siswa') {
        manageSection.style.display = 'none';
        quizSection.style.display = 'block';
        showQuizSubjectSelection();
    }
}

// Tampilkan pilihan mapel untuk siswa
function showQuizSubjectSelection() {
    const quizSection = document.getElementById('quiz-section');
    quizSection.style.display = 'block';
    let html = `<h2>Pilih Mata Pelajaran untuk Ujian</h2>`;
    html += `<ul style='padding-left:0;'>`;
    subjects.forEach(subj => {
        html += `<li style='margin-bottom:10px;'><button type='button' id='btn-${subj.code}'>${subj.name} (${subj.code})</button></li>`;
    });
    html += `</ul>`;
    quizSection.innerHTML = html;
    // Attach event listeners after rendering
    subjects.forEach(subj => {
        const btn = document.getElementById('btn-' + subj.code);
        if (btn) {
            btn.onclick = function() {
                startQuizWithCode(subj.code);
            };
        }
    });
}

function startQuizWithCode(code) {
    let subject = subjects.find(s => s.code === code);
    if (!subject) {
        showMessage('Kode mapel tidak ditemukan!', 'error');
        return;
    }
    window.selectedSubjectForQuiz = subject;
    currentRole = 'siswa';
    currentQuestion = 0;
    score = 0;
    document.getElementById('manage-section').style.display = 'none';
    showQuestion();
}

function showDashboard() {
    const dash = document.getElementById('user-dashboard');
    dash.style.display = 'block';
    dash.innerHTML = `<strong>Halo, ${currentUser.name}</strong> <br>Role: <span style='text-transform:capitalize'>${currentRole}</span>`;
    document.getElementById('login-section').style.display = 'none';
    // Tidak render menu utama di sini, hanya dashboard saja
    // Jangan sembunyikan menu manajemen atau quiz-section di sini
}

function logout() {
    currentUser = null;
    currentRole = 'siswa';
    currentQuestion = 0;
    score = 0;
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('quiz-section').style.display = 'none';
    document.getElementById('result-section').style.display = 'none';
    document.getElementById('manage-section').style.display = 'none';
    document.getElementById('user-dashboard').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'none';
    showMessage('Anda telah logout.', 'info');
}

function showMessage(msg, type) {
    let color = type === 'error' ? '#dc3545' : (type === 'info' ? '#007bff' : '#28a745');
    let dash = document.getElementById('user-dashboard');
    dash.style.display = 'block';
    dash.innerHTML = `<div id='notif-area' style='background:${type==='error'?'#ffe6e6':type==='info'?'#e6f0ff':'#e6ffe6'};color:${color};padding:10px 16px;border-radius:8px;margin-bottom:8px;box-shadow:0 2px 8px #0001;font-weight:bold;display:flex;align-items:center;justify-content:space-between;'>${msg}<button onclick='closeNotif()' style='background:none;border:none;font-size:18px;cursor:pointer;color:${color};margin-left:12px;'>×</button></div>`;
    if (type !== 'error') {
        setTimeout(() => {
            closeNotif();
        }, 2200);
    }
}

function closeNotif() {
    let dash = document.getElementById('user-dashboard');
    const notif = document.getElementById('notif-area');
    if (notif) notif.remove();
    if (!currentUser) dash.style.display = 'none';
}

function showQuestion() {
    const quizSection = document.getElementById('quiz-section');
    quizSection.style.display = 'block';
    let subject = window.selectedSubjectForQuiz;
    if (!subject) {
        quizSection.innerHTML = '<p>Mapel tidak ditemukan.</p>';
        return;
    }
    if (currentQuestion < subject.questions.length) {
        const q = subject.questions[currentQuestion];
        let html = `<h2>${subject.name} (${subject.code})</h2><h3>Soal ${currentQuestion + 1}</h3><p>${q.question}</p>`;
        if (q.image) {
            html += `<img src='${q.image}' alt='Gambar soal' style='max-width:300px;display:block;margin:10px auto;'>`;
        }
        if (q.type === 'multiple') {
            q.options.forEach((opt, idx) => {
                html += `<button onclick="answer(${idx})">${opt}</button>`;
            });
        } else if (q.type === 'short') {
            html += `<input type='text' id='short-answer' placeholder='Jawaban Anda'><br><button onclick='answerShort()'>Kirim Jawaban</button>`;
        }
        quizSection.innerHTML = html;
    } else {
        showResult();
    }
}

function answer(idx) {
    let subject = window.selectedSubjectForQuiz;
    const q = subject.questions[currentQuestion];
    if (q.type === 'multiple' && idx === q.answer) {
        score++;
    }
    currentQuestion++;
    showQuestion();
}

function answerShort() {
    let subject = window.selectedSubjectForQuiz;
    const q = subject.questions[currentQuestion];
    const userAnswer = document.getElementById('short-answer').value.trim().toLowerCase();
    if (q.type === 'short' && userAnswer === q.answerText.toLowerCase()) {
        score++;
    }
    currentQuestion++;
    showQuestion();
}

function editQuestion(sidx, idx) {
    const subj = subjects[sidx];
    const q = subj.questions[idx];
    let html = `<div style='margin-top:10px;background:#fffbe6;padding:10px;border-radius:6px;'>`;
    html += `<b>Edit Soal</b><br>`;
    html += `<input type='text' id='edit-q-text' value='${q.question}' style='width:90%;margin-bottom:6px;'><br>`;
    if (q.type === 'multiple') {
        for (let i = 0; i < q.options.length; i++) {
            html += `<div style='display:flex;align-items:center;gap:8px;margin-bottom:4px;'><input type='text' id='edit-opt${i}' value='${q.options[i]}' style='width:180px;'><input type='radio' name='edit-answer-radio' value='${i}' id='edit-radio${i}' ${i===q.answer?'checked':''}><label for='edit-radio${i}' style='font-size:14px;'>Centang jika jawaban benar</label></div>`;
        }
    } else {
        html += `<input type='text' id='edit-answer-text' value='${q.answerText}' style='width:180px;margin-bottom:6px;'><br>`;
    }
    html += `<div style='margin-bottom:6px;'>Gambar: <input type='file' id='edit-image-file' accept='image/*'><br>`;
    if (q.image) html += `<img id='edit-image-preview' src='${q.image}' style='max-width:120px;margin-top:6px;'><br>`;
    html += `<button onclick='saveEditQuestion(${sidx},${idx})' style='margin-top:8px;'>Simpan Perubahan</button> <button onclick='cancelEditQuestion(${sidx})' style='margin-top:8px;'>Batal</button></div>`;
    document.getElementById('edit-question-area-'+sidx).innerHTML = html;
    // Event upload gambar
    let uploadedEditImage = q.image || '';
    const fileInput = document.getElementById('edit-image-file');
    const preview = document.getElementById('edit-image-preview');
    if (fileInput) {
        fileInput.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    uploadedEditImage = evt.target.result;
                    if (preview) preview.src = uploadedEditImage;
                    else document.getElementById('edit-question-area-'+sidx).innerHTML += `<img id='edit-image-preview' src='${uploadedEditImage}' style='max-width:120px;margin-top:6px;'>`;
                };
                reader.readAsDataURL(file);
            }
        };
    }
    window._editQuestionImage = () => uploadedEditImage;
}

function saveEditQuestion(sidx, idx) {
    const subj = subjects[sidx];
    const q = subj.questions[idx];
    const qText = document.getElementById('edit-q-text').value;
    let image = window._editQuestionImage ? window._editQuestionImage() : q.image;
    if (q.type === 'multiple') {
        let opts = [];
        for (let i = 0; i < q.options.length; i++) {
            const val = document.getElementById('edit-opt'+i).value.trim();
            if (val) opts.push(val);
        }
        const radios = document.getElementsByName('edit-answer-radio');
        let ans = -1;
        radios.forEach(r => { if (r.checked) ans = parseInt(r.value); });
        if (!qText || opts.length < 2 || ans < 0 || ans >= opts.length) {
            alert('Isi soal, minimal 2 opsi, dan centang jawaban benar!');
            return;
        }
        subj.questions[idx] = { ...q, question: qText, options: opts, answer: ans, image };
    } else {
        const answerText = document.getElementById('edit-answer-text').value.trim();
        if (!qText || !answerText) {
            alert('Isi soal dan jawaban benar untuk isian singkat!');
            return;
        }
        subj.questions[idx] = { ...q, question: qText, answerText, image };
    }
    showManageSection('soal');
}

function cancelEditQuestion(sidx) {
    document.getElementById('edit-question-area-'+sidx).innerHTML = '';
}

function moveQuestion(sidx, idx, dir) {
    const subj = subjects[sidx];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= subj.questions.length) return;
    const temp = subj.questions[idx];
    subj.questions[idx] = subj.questions[newIdx];
    subj.questions[newIdx] = temp;
    showManageSection('soal');
}

function addClass() {
    const grade = document.getElementById('new-class-grade').value.trim();
    const className = document.getElementById('new-class-name').value.trim();
    if (!grade || !className) {
        showMessage('Isi tingkatan dan nama kelas!', 'error');
        return;
    }
    classes.push({ grade, className, students: [] });
    showMessage('Kelas berhasil ditambah!', 'success');
    showManageSection('kelas');
}

function editClass(cidx) {
    const cls = classes[cidx];
    let html = `<div style='margin-top:10px;background:#fffbe6;padding:10px;border-radius:6px;'>`;
    html += `<b>Edit Kelas ${cls.grade} ${cls.className}</b><br>`;
    html += `<table style='width:100%;border-collapse:collapse;margin-top:8px;'>`;
    html += `<tr style='background:#eee;'><th>No</th><th>Nama Lengkap</th><th>No Absen</th><th>ID Pengguna</th><th>Password</th><th>Aksi</th></tr>`;
    cls.students.forEach((stu, sidx) => {
        html += `<tr>`;
        html += `<td style='text-align:center;'>${sidx+1}</td>`;
        html += `<td><input type='text' id='stu-name-${sidx}' value='${stu.name}' style='width:120px;'></td>`;
        html += `<td><input type='text' id='stu-absen-${sidx}' value='${stu.absen}' style='width:60px;'></td>`;
        html += `<td><input type='text' id='stu-id-${sidx}' value='${stu.id}' style='width:100px;'></td>`;
        html += `<td><input type='password' id='stu-pass-${sidx}' value='${stu.password}' style='width:100px;'> <button onclick='toggleEditPassword(${sidx})' style='font-size:12px;'>👁️</button></td>`;
        html += `<td>`;
        html += `<button onclick='moveStudent(${cidx},${sidx},-1)' ${sidx===0?'disabled':''}>⬆️</button>`;
        html += `<button onclick='moveStudent(${cidx},${sidx},1)' ${sidx===cls.students.length-1?'disabled':''}>⬇️</button>`;
        html += `<button onclick='deleteStudent(${cidx},${sidx})' style='color:#dc3545;'>Hapus</button>`;
        html += `</td></tr>`;
    });
    html += `</table>`;
    html += `<h4>Tambah Siswa</h4>`;
    html += `<input type='text' id='new-stu-name' placeholder='Nama Lengkap'><br>`;
    html += `<input type='text' id='new-stu-absen' placeholder='No Absen'><br>`;
    html += `<input type='text' id='new-stu-id' placeholder='ID Pengguna'><br>`;
    html += `<input type='password' id='new-stu-pass' placeholder='Password'><br>`;
    html += `<button onclick='addStudent(${cidx})'>➕ Tambah Siswa</button>`;
    html += `<button onclick='saveClass(${cidx})' style='margin-left:12px;'>💾 Simpan Data Kelas</button>`;
    html += `<button onclick='showManageSection("kelas")' style='margin-left:12px;'>⬅️ Kembali</button>`;
    html += `<button onclick='cancelEditClass()' style='margin-left:12px;'>Batal</button>`;
    html += `</div>`;
// Toggle password visibility pada tabel siswa di kelas
function togglePassword(cidx, sidx) {
    const input = document.getElementById('stu-pass-view-' + cidx + '-' + sidx);
    if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
    }
}

// Toggle password visibility pada edit siswa
function toggleEditPassword(sidx) {
    const input = document.getElementById('stu-pass-' + sidx);
    if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
    }
}
    document.getElementById('edit-class-area').innerHTML = html;
}

function addStudent(cidx) {
    const name = document.getElementById('new-stu-name').value.trim();
    const absen = document.getElementById('new-stu-absen').value.trim();
    const id = document.getElementById('new-stu-id').value.trim();
    const password = document.getElementById('new-stu-pass').value.trim();
    if (!name || !absen || !id || !password) {
        showMessage('Isi semua data siswa!', 'error');
        return;
    }
    if (classes[cidx].students.find(s => s.id === id)) {
        showMessage('ID siswa sudah digunakan di kelas ini!', 'error');
        return;
    }
    classes[cidx].students.push({ name, absen, id, password });
    saveAllData();
    showMessage('Siswa berhasil ditambah!', 'success');
    setTimeout(() => { editClass(cidx); }, 1200);
}

function deleteStudent(cidx, sidx) {
    if (confirm('Yakin ingin menghapus siswa ini?')) {
        classes[cidx].students.splice(sidx, 1);
        saveAllData();
        editClass(cidx);
    }
}
// Aktifkan user siswa dari data kelas
function addUserFromClass(cidx, sidx) {
    const stu = classes[cidx].students[sidx];
    if (!stu.id || !stu.password || !stu.name) {
        showMessage('Data siswa tidak lengkap!', 'error');
        return;
    }
    if (users.find(u => u.id === stu.id)) {
        showMessage('User siswa sudah aktif!', 'info');
        return;
    }
    users.push({ id: stu.id, password: stu.password, name: stu.name, role: 'siswa' });
    saveAllData();
    showMessage('User siswa berhasil diaktifkan!', 'success');
}

function moveStudent(cidx, sidx, dir) {
    const cls = classes[cidx];
    const newIdx = sidx + dir;
    if (newIdx < 0 || newIdx >= cls.students.length) return;
    const temp = cls.students[sidx];
    cls.students[sidx] = cls.students[newIdx];
    cls.students[newIdx] = temp;
    saveAllData();
    editClass(cidx);
}

function saveClass(cidx) {
    const cls = classes[cidx];
    let valid = true;
    let ids = [];
    cls.students.forEach((stu, sidx) => {
        const name = document.getElementById('stu-name-' + sidx).value.trim();
        const absen = document.getElementById('stu-absen-' + sidx).value.trim();
        const id = document.getElementById('stu-id-' + sidx).value.trim();
        const password = document.getElementById('stu-pass-' + sidx).value.trim();
        if (!name || !absen || !id || !password) valid = false;
        if (ids.includes(id)) valid = false;
        ids.push(id);
        stu.name = name;
        stu.absen = absen;
        stu.id = id;
        stu.password = password;
    });
    if (!valid) {
        showMessage('Pastikan semua data siswa terisi dan ID unik!', 'error');
        return;
    }
    saveAllData();
    showMessage('Data kelas berhasil disimpan!', 'success');
    setTimeout(() => {
        editClass(cidx);
    }, 1200);
}

function deleteClass(cidx) {
    if (confirm('Yakin ingin menghapus kelas ini beserta semua siswa?')) {
        classes.splice(cidx, 1);
        saveAllData();
        showManageSection('kelas');
    }
}

function cancelEditClass() {
    document.getElementById('edit-class-area').innerHTML = '';
}

// Remember Me feature
// Auto-fill login if remembered
window.addEventListener('DOMContentLoaded', function() {
    // Tambahkan checkbox 'Ingat saya' di form login terlebih dahulu
    const loginSection = document.getElementById('login-section');
    if (loginSection && !document.getElementById('remember-me')) {
        // Cari input password, tambahkan checkbox setelahnya
        const passInput = document.getElementById('password');
        if (passInput) {
            const rememberDiv = document.createElement('div');
            rememberDiv.style.margin = '8px 0';
            rememberDiv.innerHTML = `<label><input type='checkbox' id='remember-me'> Ingat saya</label>`;
            passInput.parentNode.insertBefore(rememberDiv, passInput.nextSibling);
        }
    }
    // Setelah checkbox pasti ada, baru lakukan autofill dan login otomatis
    const remembered = localStorage.getItem('rememberUser');
    if (remembered) {
        try {
            const data = JSON.parse(remembered);
            if (document.getElementById('userid')) document.getElementById('userid').value = data.id;
            if (document.getElementById('password')) document.getElementById('password').value = data.password;
            if (document.getElementById('remember-me')) document.getElementById('remember-me').checked = true;
            // Login otomatis jika data valid
            const user = users.find(u => u.id === data.id && u.password === data.password);
            if (user) {
                // Pastikan login-section masih terlihat (belum login)
                if (document.getElementById('login-section').style.display !== 'none') {
                    login();
                }
            }
        } catch(e) {}
    }
});

function addUser() {
    const id = document.getElementById('new-user-id').value.trim();
    const password = document.getElementById('new-user-password').value.trim();
    const name = document.getElementById('new-user-name').value.trim();
    const role = document.getElementById('new-user-role').value;
    if (!id || !password || !name) {
        showMessage('Isi semua data user!', 'error');
        return;
    }
    if (users.find(u => u.id === id)) {
        showMessage('ID user sudah digunakan!', 'error');
        return;
    }
    if (role === 'siswa') {
        // Pastikan kelas dipilih
        const gradeSel = document.getElementById('user-class-grade');
        const kelasSel = document.getElementById('user-class-name');
        if (!gradeSel || !kelasSel) {
            showMessage('Pilih tingkat dan kelas!', 'error');
            return;
        }
        const grade = gradeSel.value;
        const className = kelasSel.value;
        // Tambahkan ke users dan ke kelas yang dipilih
        users.push({ id, password, name, role });
        let kelasObj = classes.find(cls => cls.grade === grade && cls.className === className);
        if (kelasObj) {
            kelasObj.students.push({ name, absen: '', id, password });
        }
    } else {
        users.push({ id, password, name, role });
    }
    saveAllData();
    showMessage('User berhasil ditambah!', 'success');
    showManageSection('user');
}

// Render dropdown tingkat dan kelas pada form tambah user siswa
function renderUserClassSelect() {
    const roleSel = document.getElementById('new-user-role');
    const area = document.getElementById('user-class-select-area');
    if (!roleSel || !area) return;
    if (roleSel.value === 'siswa') {
        if (classes.length === 0) {
            area.innerHTML = '';
            document.getElementById('add-user-btn').disabled = true;
            return;
        }
        let html = `<select id='user-class-grade'>`;
        // Ambil semua tingkat unik
        let grades = [...new Set(classes.map(cls => cls.grade))];
        grades.forEach(gr => {
            html += `<option value='${gr}'>${gr}</option>`;
        });
        html += `</select> `;
        html += `<select id='user-class-name'>`;
        // Default: kelas dari tingkat pertama
        let kelasPertama = classes.filter(cls => cls.grade === grades[0]);
        kelasPertama.forEach(cls => {
            html += `<option value='${cls.className}'>${cls.className}</option>`;
        });
        html += `</select><br>`;
        area.innerHTML = html;
        // Event: jika tingkat berubah, update kelas
        document.getElementById('user-class-grade').onchange = function() {
            let selectedGrade = this.value;
            let kelas = classes.filter(cls => cls.grade === selectedGrade);
            let kelasSel = document.getElementById('user-class-name');
            kelasSel.innerHTML = '';
            kelas.forEach(cls => {
                let opt = document.createElement('option');
                opt.value = cls.className;
                opt.textContent = cls.className;
                kelasSel.appendChild(opt);
            });
        };
        document.getElementById('add-user-btn').disabled = false;
    } else {
        area.innerHTML = '';
        document.getElementById('add-user-btn').disabled = false;
    }
}
// Edit user guru
function editGuruUser(guruIdx) {
    let guruList = users.filter(u => u.role === 'guru');
    const guru = guruList[guruIdx];
    if (!guru) return;
    const area = document.getElementById('edit-guru-area');
    area.innerHTML = `<div style='margin-top:10px;background:#fffbe6;padding:10px;border-radius:6px;'>
        <b>Edit User Guru</b><br>
        <label>ID: <input type='text' id='edit-guru-id' value='${guru.id}' style='width:120px;'></label><br>
        <label>Password: <input type='text' id='edit-guru-password' value='${guru.password}' style='width:120px;'></label><br>
        <label>Nama: <input type='text' id='edit-guru-name' value='${guru.name}' style='width:180px;'></label><br>
        <button onclick='saveEditGuruUser(${guruIdx})' style='margin-top:8px;'>Simpan Perubahan</button>
        <button onclick='cancelEditGuruUser()' style='margin-left:8px;'>Batal</button>
    </div>`;
}

function saveEditGuruUser(guruIdx) {
    let guruList = users.filter(u => u.role === 'guru');
    const guru = guruList[guruIdx];
    if (!guru) return;
    const newId = document.getElementById('edit-guru-id').value.trim();
    const newPassword = document.getElementById('edit-guru-password').value.trim();
    const newName = document.getElementById('edit-guru-name').value.trim();
    if (!newId || !newPassword || !newName) {
        showMessage('Isi semua data user guru!', 'error');
        return;
    }
    // Cek ID unik (tidak bentrok dengan user lain)
    if (users.some(u => u.id === newId && u !== guru)) {
        showMessage('ID user sudah digunakan!', 'error');
        return;
    }
    guru.id = newId;
    guru.password = newPassword;
    guru.name = newName;
    saveAllData();
    showMessage('User guru berhasil diupdate!', 'success');
    showManageSection('user');
}

function cancelEditGuruUser() {
    const area = document.getElementById('edit-guru-area');
    if (area) area.innerHTML = '';
}
//end of today