// Inisialisasi Supabase
const supabaseUrl = 'https://piaycptnvkyahallyysx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpYXljcHRudmt5YWhhbGx5eXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMTIyMzcsImV4cCI6MjA4NjU4ODIzN30.ADYwz_gLL7GzsZXOvWTSLNWyaYQurR3fGQdzl7qnEWU';
const supabaselokal = supabase.createClient(supabaseUrl, supabaseAnonKey);

let currentUsername = localStorage.getItem('siswaUsername');

// Fungsi untuk menampilkan custom alert
function showAlert(message) {
    const alertDiv = document.getElementById('customAlert');
    const alertMessage = document.getElementById('alertMessage');
    alertMessage.textContent = message;
    alertDiv.style.display = 'block';
    // Auto-hide setelah 3 detik
    setTimeout(() => {
        hideAlert();
    }, 3000);
}

// Fungsi untuk menyembunyikan custom alert
function hideAlert() {
    const alertDiv = document.getElementById('customAlert');
    alertDiv.style.display = 'none';
}

// Cek login
if (!currentUsername) {
    showAlert('Anda belum login. Redirect ke halaman login.');
    setTimeout(() => {
        window.location.href = 'loginsis.html';
    }, 1000);
}

// Fetch data siswa
async function loadData() {
    const loading = document.getElementById('loading');
    const form = document.getElementById('editForm');
    loading.style.display = 'block';
    form.style.display = 'none';

    try {
        const { data, error } = await supabaselokal
            .from('siswa')
            .select('*')
            .eq('username', currentUsername)
            .single();

        if (error) throw error;

        document.getElementById('nama_siswa').value = data.nama_siswa || '';
        document.getElementById('akun_ig').value = data["akun IG"] || '';
        document.getElementById('akun_tiktok').value = data["akun Tiktok"] || '';
        document.getElementById('tanggal_lahir').value = data["tanggal lahir"] || '';

        loading.style.display = 'none';
        form.style.display = 'block';
    } catch (error) {
        console.error('Error loading data:', error);
        showAlert('Gagal memuat data. Silakan coba lagi.');
        loading.style.display = 'none';
    }
}

// Update data profil
document.getElementById('editForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = document.querySelector('#editForm .submit-btn');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
    submitBtn.disabled = true;

    const nama_siswa = document.getElementById('nama_siswa').value;
    const akun_ig = document.getElementById('akun_ig').value;
    const akun_tiktok = document.getElementById('akun_tiktok').value;
    const tanggal_lahir = document.getElementById('tanggal_lahir').value;
    const pesan = document.getElementById('pesan').value;

    try {
        const { error } = await supabaselokal
            .from('siswa')
            .update({
                nama_siswa: nama_siswa,
                pesan: pesan,
                "akun IG": akun_ig,
                "akun Tiktok": akun_tiktok,
                "tanggal lahir": tanggal_lahir,
            })
            .eq('username', currentUsername);

        if (error) throw error;

        showAlert('Data berhasil diperbarui!');
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Simpan Perubahan';
        submitBtn.disabled = false;
    } catch (error) {
        console.error('Error updating data:', error);
        showAlert('Gagal memperbarui data. Silakan coba lagi.');
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Simpan Perubahan';
        submitBtn.disabled = false;
    }
});

// Update password
document.getElementById('passwordForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const currentPassword = document.getElementById('current_password').value;
    const newPassword = document.getElementById('new_password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    const submitBtn = document.querySelector('#passwordForm .submit-btn');

    // Validasi
    if (newPassword.length < 8) {
        showAlert('Password baru harus minimal 8 karakter!');
        return;
    }
    if (newPassword !== confirmPassword) {
        showAlert('Konfirmasi password tidak cocok!');
        return;
    }

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengubah...';
    submitBtn.disabled = true;

    try {
        // Fetch current password untuk verifikasi
        const { data, error: fetchError } = await supabaselokal
            .from('siswa')
            .select('password')
            .eq('username', currentUsername)
            .single();

        if (fetchError) throw fetchError;

        if (currentPassword !== data.password) {
            showAlert('Password saat ini salah!');
            resetButton(submitBtn);
            return;
        }

        // Update password
        const { error: updateError } = await supabaselokal
            .from('siswa')
            .update({ password: newPassword })
            .eq('username', currentUsername);

        if (updateError) throw updateError;

        showAlert('Password berhasil diubah!');
        document.getElementById('passwordForm').reset();
        resetButton(submitBtn);
    } catch (error) {
        console.error('Error updating password:', error);
        showAlert('Gagal mengubah password. Silakan coba lagi.');
        resetButton(submitBtn);
    }
});
// Toggle show/hide password
document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (input.type === 'password') {
            input.type = 'text';
            this.classList.remove('fa-eye');
            this.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            this.classList.remove('fa-eye-slash');
            this.classList.add('fa-eye');
        }
    });
});

// Fungsi untuk reset button
function resetButton(btn) {
    btn.innerHTML = '<i class="fas fa-save"></i> Ubah Password';
    btn.disabled = false;
}

// Logout
function logout() {
    localStorage.removeItem('siswaUsername');
    window.location.href = 'loginsis.html';
}

// Load data saat halaman load

window.onload = loadData;
