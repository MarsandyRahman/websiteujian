// auth.js
// Modul otentikasi dan login/logout

let currentUser = null;
let currentRole = "siswa";

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
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'inline-block';
    document.getElementById('user-dashboard').style.display = 'block';
    document.getElementById('result-section').style.display = 'none';
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
    showDashboard();
    if (currentUser.role === 'admin' || currentUser.role === 'guru') {
        manageSection.style.display = 'block';
        quizSection.style.display = 'none';
        showManageSection('main-menu');
    } else if (currentUser.role === 'siswa') {
        manageSection.style.display = 'none';
        quizSection.style.display = 'block';
        showQuizSubjectSelection();
    }
}

function logout() {
    // ...existing code from script.js (logout logic)...
}

function showDashboard() {
    const dash = document.getElementById('user-dashboard');
    dash.style.display = 'block';
    dash.innerHTML = `<strong>Halo, ${currentUser.name}</strong> <br>Role: <span style='text-transform:capitalize'>${currentRole}</span>`;
    document.getElementById('login-section').style.display = 'none';
    // Tidak render menu utama di sini, hanya dashboard saja
    // Jangan sembunyikan menu manajemen atau quiz-section di sini
}

function showMessage(msg, type) {
    // ...existing code from script.js (notification rendering)...
}

function closeNotif() {
    // ...existing code from script.js (close notification)...
}

// ...other auth-related functions...
