// Inisialisasi Supabase
const supabaseUrl = 'https://piaycptnvkyahallyysx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpYXljcHRudmt5YWhhbGx5eXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMTIyMzcsImV4cCI6MjA4NjU4ODIzN30.ADYwz_gLL7GzsZXOvWTSLNWyaYQurR3fGQdzl7qnEWU';
const supabaselokal = supabase.createClient(supabaseUrl, supabaseAnonKey);
baikorburuk = false; 

function showAlert(message) {
    const alertDiv = document.getElementById('customAlert');
    const alertMessage = document.getElementById('alertMessage');
    alertMessage.textContent = message;
    alertDiv.style.display = 'block';
    if (baikorburuk === true) {
        alertDiv.style.backgroundColor = '#f8d7da'; // Merah untuk error
        alertMessage.style.color = '#721c24';
    } else {
        alertDiv.style.backgroundColor = '#86e09b'; // Hijau untuk sukses
        alertMessage.style.color = '#155724';
    }
    setTimeout(() => {
        hideAlert();
    }, 3000);
}

function hideAlert() {
    const alertDiv = document.getElementById('customAlert');
    alertDiv.style.display = 'none';
}

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.querySelector('.login-btn');

    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    loginBtn.disabled = true;

    try {
        const { data: accounts, error } = await supabaselokal
            .from('siswa')
            .select('*')
            .eq('username', username);

        if (error) throw error;

        if (!accounts || accounts.length === 0) {
            baikorburuk = true;
            showAlert('Username tidak ditemukan!');
            resetButton(loginBtn);
            return;
        }

        const account = accounts[0];

        if (password !== account.password) {
            baikorburuk = true;
            showAlert('Password salah!');
            resetButton(loginBtn);
            return;
        }

        localStorage.setItem('siswaUsername', username);
        baikorburuk = false;
        showAlert('Login berhasil! Redirecting...');
        setTimeout(() => {
            window.location.href = 'dashboardsis.html';
        }, 1000);

    } catch (error) {
        console.error('Error:', error);
        showAlert('Terjadi kesalahan saat login. Silakan coba lagi.');
        resetButton(loginBtn);
    }
});

function resetButton(btn) {
    btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
    btn.disabled = false;
}