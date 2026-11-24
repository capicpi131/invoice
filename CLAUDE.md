# Aturan proyek

- Semua output invoice SELALU dalam bentuk PDF, kertas A4, siap cetak (tanpa margin printer, 1 halaman).
- Generator: `node src/build.js && python3 src/fix_a4.py` -> hasil di `pdf/`. Konten diberi jarak 6mm dari tepi kertas agar tidak terpotong printer. Tambah invoice baru lewat array `invoices` di `src/build.js`.
- Font dan logo ada di `assets/`.
