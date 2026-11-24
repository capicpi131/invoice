# Aturan proyek

- Semua output invoice SELALU dalam bentuk PDF, kertas A4, siap cetak (tanpa margin printer, 1 halaman).
- Generator: `node src/build.js` (Playwright/Chromium) -> hasil di `pdf/`. Tambah invoice baru dengan menambah data di array `invoices` pada `src/build.js`.
- Font dan logo ada di `assets/`.
