// script.js (Data Awal)
let dataKelas = {
    siswa: [
        { id: 1, nama: "Budi", nis: "001" },
        { id: 2, nama: "Citra", nis: "002" },
        // ... siswa lainnya
    ],
    absensi: {}, // Untuk menyimpan catatan absensi berdasarkan tanggal
    tugas: [], // Untuk menyimpan daftar tugas
};
// script.js (Fungsi Helper Data)
const KEY_STORAGE = 'dataManajemenKelas';

// Mengambil data dari Local Storage
function ambilData() {
    const dataJSON = localStorage.getItem(KEY_STORAGE);
    // Jika ada, parse, jika tidak, kembalikan dataKelas awal
    return dataJSON ? JSON.parse(dataJSON) : dataKelas;
}

// Menyimpan data ke Local Storage
function simpanData(data) {
    localStorage.setItem(KEY_STORAGE, JSON.stringify(data));
    dataKelas = data; // Perbarui variabel global
}

// Inisialisasi data saat aplikasi dimuat
dataKelas = ambilData();
// script.js (Absensi Logic)
function simpanAbsensi(tanggal, statusSiswa) {
    let data = ambilData();
    // Simpan status absensi untuk tanggal tertentu
    data.absensi[tanggal] = statusSiswa;
    // Contoh statusSiswa: { '1': 'Hadir', '2': 'Sakit', ... }
    simpanData(data);
    alert(`Absensi tanggal ${tanggal} berhasil disimpan!`);
}
// script.js (Tugas Logic)
function tambahTugas(nama, deadline) {
    let data = ambilData();
    const tugasBaru = {
        id: Date.now(), // ID unik sederhana
        nama: nama,
        deadline: deadline,
        selesai: false
    };
    data.tugas.push(tugasBaru);
    simpanData(data);
    renderTugas(); // Fungsi untuk memperbarui tampilan
}
// script.js (Shuffling Logic)
function acakKelompok(jumlahKelompok) {
    let data = ambilData();
    let siswaUntukAcak = [...data.siswa]; // Duplikasi array siswa

    // Algoritma Fisher-Yates Shuffle
    for (let i = siswaUntukAcak.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [siswaUntukAcak[i], siswaUntukAcak[j]] = [siswaUntukAcak[j], siswaUntukAcak[i]];
    }

    const kelompok = {};
    for (let i = 0; i < jumlahKelompok; i++) {
        kelompok[`Kelompok ${i + 1}`] = [];
    }

    // Distribusikan siswa ke kelompok
    siswaUntukAcak.forEach((siswa, index) => {
        const indexKelompok = index % jumlahKelompok;
        kelompok[`Kelompok ${indexKelompok + 1}`].push(siswa.nama);
    });

    renderKelompok(kelompok);
}
// script.js (Bagian Navigasi Tab)

function showSection(sectionId) {
    // 1. Sembunyikan semua section
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden');
        section.classList.remove('active');
    });

    // 2. Tampilkan section yang dipilih
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.remove('hidden');
        activeSection.classList.add('active');
    }
    
    // 3. Atur status tombol tab
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    // Menemukan tombol yang sesuai berdasarkan onclick di HTML
    const activeButton = document.querySelector(`.tab-button[onclick*="'${sectionId}'"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    // Refresh data atau tampilan saat pindah tab (PENTING)
    if (sectionId === 'absensi') {
        renderDaftarSiswaAbsensi(document.getElementById('tanggalAbsensi').value);
    } else if (sectionId === 'tugas') {
        renderTugas();
    }
}
