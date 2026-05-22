// 👇 GANTI BAGIAN INI DENGAN LINK/URL YANG KAMU SALIN DARI GOOGLE APPS SCRIPT DI ATAS 👇
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyEErFsuFGhb1aYV54zo_TVlu_Cp8bVwStalwFIRmAxtGTtReA9MC7GQRw4eoZLzNRa/exec";


// Fungsi ambil IP pengguna (untuk cek sekali isi saja)
async function getUserIP() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const json = await res.json();
    return json.ip;
  } catch (e) {
    return '0.0.0.0'; // Jika gagal deteksi, isi acak
  }
}


// PROSES KIRIM DATA
document.getElementById("surveiForm").addEventListener("submit", async function(e) {
    e.preventDefault(); // Cegah halaman reload

    const tombolKirim = e.target.querySelector('button[type="submit"]');
    tombolKirim.disabled = true;
    tombolKirim.innerHTML = '<i class="fa fa-spinner fa-spin mr-2"></i> Sedang Mengirim...';

    // Ambil semua isian formulir
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Masukkan data IP ke dalam kiriman
    data.ip = await getUserIP();

    // Kirim ke Google Sheet
    fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then(res => res.json())
    .then(hasil => {
        if (hasil.status === "berhasil") {
            alert(hasil.pesan);
            e.target.reset(); // Kosongkan form setelah sukses
        } else {
            alert(hasil.pesan); // Tampilkan pesan kalau sudah pernah isi
        }
    })
    .catch(() => {
        alert("❌ Gagal terhubung. Cek koneksi internet Anda.");
    })
    .finally(() => {
        // Kembalikan tombol ke awal
        tombolKirim.disabled = false;
        tombolKirim.innerHTML = '<i class="fa fa-paper-plane-o mr-2"></i> Kirim Survei';
    });
});
