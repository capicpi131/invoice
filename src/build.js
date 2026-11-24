// Generator PDF invoice A4 siap cetak.
// Pakai: node src/build.js  -> hasil di folder pdf/
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');
const { htmlPF } = require('./proforma');

const root = path.join(__dirname, '..');
const A = (f) => 'file://' + path.join(root, 'assets', f);
const rp = (n) => 'Rp ' + n.toLocaleString('id-ID');

const seller = {
  addr: ['Jl. Poros Benteng – Appatana KM 14', 'Desa Patikarya, Kep. Selayar, Sulsel', '+62 821-8903-3044'],
};

const invoices = [
  {
    file: 'INV-2611-008.pdf',
    meta: [['Kategori', 'RESTO'], ['No. Invoice', 'INV-2611-008'], ['Tanggal', '23.11.2026'], ['Jatuh Tempo', '23.11.2026']],
    to: ['<b>Ibu Ede</b>', 'Bill Resto', '23 Nov 2026'],
    from: ['<b>Bajoy Beach Resto</b>', 'SunaRi Beach Resort Selayar', ...seller.addr],
    head: ['Deskripsi', 'Harga Satuan', 'Qty', 'Total'],
    rows: [
      ['Kelapa Muda', rp(25000), 3, rp(75000)],
      ['Pisang Goreng', rp(25000), 2, rp(50000)],
      ['Buah Naga', rp(25000), 1, rp(25000)],
      ['Air Mineral', rp(10000), 5, rp(50000)],
    ],
    totalLabel: 'Total',
    total: rp(200000),
    pay: ['Transfer Bank: BRI', 'No. Rek: 025701011852534', 'A.N. A A GEDE EKA PUTRA', 'TUNAI'],
    payTitle: 'Metode Pembayaran',
    terms: null,
    footerL: 'Pembayaran dianggap lunas setelah dana diterima',
    stamp: false,
  },
  {
    file: 'INV-PI-SBR-211126-01-LUNAS.pdf',
    meta: [['Kategori', 'KAMAR'], ['No.', 'PI/SBR/211126/01'], ['Tanggal', '21.11.2026'], ['Status', 'LUNAS']],
    sub: 'Invoice · Bukti Pembayaran',
    to: ['<b>Ibu Edha</b>', 'Bandara Makassar', 'Check-in: Senin, 23 Nov 2026 (14.00)', 'Check-out: Rabu, 25 Nov 2026 (12.00)'],
    from: ['<b>SunaRi Beach Resort Selayar</b>', ...seller.addr],
    head: ['Deskripsi', 'Harga / Malam', 'Unit', 'Malam', 'Jumlah'],
    rows: [['Superior Bungalow<small>23 – 25 November 2026 · durasi 2 malam</small>', rp(1100000), 3, 2, rp(6600000)]],
    totalLabel: 'Total Tagihan',
    total: rp(6600000),
    extra: [['DP (Tanda Jadi)', rp(3000000)], ['Pelunasan (saat check-in)', rp(3600000)], ['Sisa Tagihan', rp(0), true]],
    pay: ['Transfer Bank: BRI', 'No. Rek: 025701011852534', 'A.N. A A GEDE EKA PUTRA'],
    payTitle: 'Informasi Pembayaran',
    terms: [
      'Check-in pukul 14.00 dan check-out pukul 12.00. Late check-out dikenakan biaya tambahan 30% dari harga kamar.',
      'Early check-in dapat dilakukan sesuai ketersediaan kamar, dengan konfirmasi ke pihak resort.',
      'Tamu wajib menunjukkan KTP saat check-in.',
      'Sisa pembayaran dilunasi saat check-in. Metode pembayaran: transfer bank, tunai, atau QRIS/e-wallet.',
      'Tidak ada pengembalian dana (refund) untuk pembatalan; yang tersedia hanya reschedule dengan kredit berlaku 6 bulan.',
      'Apabila tamu tidak hadir tanpa kabar (no-show), DP dinyatakan hangus.',
    ],
    footerL: 'Terima kasih atas kepercayaan Ibu Edha',
    stamp: true,
  },
  {
    file: 'INV-PI-SBR-211126-01.pdf',
    layout: 'proforma',
    meta: [['Kategori', 'KAMAR'], ['No.', 'PI/SBR/211126/01'], ['Tanggal', '21.11.2026']],
    sub: 'Proforma · Penawaran Biaya',
    to: ['<b>Ibu Edha</b>', 'Bandara Makassar', 'Check-in: Senin, 23 Nov 2026 (14.00)', 'Check-out: Rabu, 25 Nov 2026 (12.00)'],
    from: ['<b>SunaRi Beach Resort Selayar</b>', ...seller.addr],
    head: ['Deskripsi', 'Harga / Malam', 'Unit', 'Malam', 'Jumlah'],
    rows: [['Superior Bungalow<small>23 – 25 November 2026 · durasi 2 malam</small>', rp(1100000), 3, 2, rp(6600000)]],
    totalLabel: 'Total Tagihan',
    total: rp(6600000),
    extra: [['DP (Tanda Jadi)', rp(3000000)], ['Sisa (saat check-in)', rp(3600000), true]],
    pay: ['Transfer Bank: BRI', '<span class="g">No. Rek:</span> 025701011852534', '<span class="g">A.N.</span> A A GEDE EKA PUTRA'],
    payTitle: 'Informasi Pembayaran',
    note: 'Mohon kirimkan bukti transfer DP sebagai tanda jadi booking.',
    terms: [
      'Check-in pukul 14.00 dan check-out pukul 12.00. Late check-out dikenakan biaya tambahan 30% dari harga kamar.',
      'Early check-in dapat dilakukan sesuai ketersediaan kamar, dengan konfirmasi ke pihak resort.',
      'Tamu wajib menunjukkan KTP saat check-in.',
      'Sisa pembayaran dilunasi saat check-in. Metode pembayaran: transfer bank, tunai, atau QRIS/e-wallet.',
      'Tidak ada pengembalian dana (refund) untuk pembatalan; yang tersedia hanya reschedule dengan kredit berlaku 6 bulan.',
      'Apabila tamu tidak hadir tanpa kabar (no-show), DP dinyatakan hangus.',
    ],
    footerL: 'Terima kasih atas kepercayaan Ibu Edha',
    stamp: false,
  },
];

function html(d) {
  const cols = d.head.length;
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><style>
@font-face{font-family:Pinyon;src:url(${A('PinyonScript-Regular.ttf')})}
@font-face{font-family:Playfair;src:url(${A('PlayfairDisplay.ttf')});font-weight:400 900}
@font-face{font-family:Playfair;font-style:italic;src:url(${A('PlayfairDisplay-Italic.ttf')});font-weight:400 900}
@font-face{font-family:Mont;src:url(${A('Montserrat.ttf')});font-weight:100 900}
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:210mm;height:296mm;overflow:hidden;background:#fff}body{padding:6mm}
body{font-family:Mont,sans-serif;font-size:9.5pt;color:#111;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{position:relative;width:198mm;height:284mm;padding:11mm 15mm;border:.35mm solid #111;outline:.2mm solid #999;outline-offset:-2.2mm}
.top{display:flex;justify-content:space-between;align-items:flex-start}
h1{font-family:Pinyon;font-weight:400;font-size:78pt;line-height:1;margin-top:2mm}
.meta{margin-top:8mm;font-size:9pt}
.meta div{display:flex;justify-content:flex-end;gap:7mm;margin-bottom:2.4mm}
.meta i{font-family:Playfair;font-style:italic;text-transform:uppercase;letter-spacing:.08em;color:#444;font-size:8.5pt}
.meta span{min-width:34mm;text-align:right;letter-spacing:.06em}
.sub{font-family:Playfair;font-style:italic;font-size:13pt;letter-spacing:.06em;margin:2mm 0 0 4mm;color:#222}
.parties{display:flex;justify-content:space-between;margin-top:8mm}
.blk{display:flex;gap:9mm;margin:0 0 8mm 14mm;font-size:9.5pt;line-height:1.55}
.blk label{width:18mm;font-weight:600;letter-spacing:.15em;font-size:8pt;text-transform:uppercase;padding-top:.6mm}
.rule{width:84mm;border-top:.3mm solid #111;margin:0 0 8mm 14mm}
.logo{width:68mm;height:auto;margin-top:6mm}
table{width:100%;border-collapse:collapse;margin-top:6mm}
th{font-weight:600;font-size:8pt;letter-spacing:.14em;text-transform:uppercase;padding:4mm 3mm;border-top:.3mm solid #111;border-bottom:.3mm solid #111}
td{padding:4mm 3mm;font-size:9.5pt}
td small{display:block;font-size:7.5pt;color:#777;margin-top:1.2mm}
th:first-child,td:first-child{text-align:left}
th:not(:first-child),td:not(:first-child){text-align:center}
th:last-child,td:last-child{text-align:right}
.tot{display:flex;justify-content:space-between;border-top:.3mm solid #111;border-bottom:.3mm solid #111;padding:4mm 3mm;font-weight:600;letter-spacing:.1em;font-size:9pt;text-transform:uppercase;margin-top:2mm}
.extra{width:92mm;margin:8mm 0 0 auto}
.extra div{display:flex;justify-content:space-between;padding:1.6mm 3mm;font-size:8.5pt;letter-spacing:.06em;color:#333}
.extra .last{border-top:.3mm solid #111;font-weight:700;color:#111;margin-top:1mm;padding-top:3mm}
.bottom{display:flex;justify-content:space-between;margin-top:9mm}
h2{font-family:Playfair;font-style:italic;font-weight:500;font-size:17pt;text-transform:uppercase;letter-spacing:.02em;margin-bottom:4mm}
.pay{font-size:9pt;line-height:1.7;letter-spacing:.06em;text-transform:uppercase}
.sign{width:80mm;text-align:center}
.sign em{font-family:Playfair;font-size:12pt;display:block;margin-bottom:13mm}
.sign .ln{border-top:.3mm solid #111;padding-top:3.5mm;font-weight:600;letter-spacing:.1em}
.sign small{display:block;margin-top:1.5mm;font-size:7.5pt;color:#666;letter-spacing:.15em;text-transform:uppercase}
.terms{margin-top:6mm}
.terms ol{padding-left:6mm;font-size:8pt;line-height:1.6}
.foot{position:absolute;left:15mm;right:15mm;bottom:10mm;display:flex;justify-content:space-between;border-top:.2mm solid #bbb;padding-top:3.5mm;font-size:6.5pt;letter-spacing:.1em;text-transform:uppercase;color:#666}
.dense h1{font-size:64pt}.dense .meta{margin-top:5mm}.dense .parties{margin-top:3mm}.dense .blk{margin-bottom:4mm}.dense .rule{margin-bottom:4mm}.dense .logo{width:58mm}.dense table{margin-top:2mm}.dense td{padding:3mm}.dense .extra{margin-top:5mm}.dense .bottom{margin-top:6mm}.dense .terms{margin-top:4mm}.dense .terms ol{font-size:7.5pt;line-height:1.5}.dense h2{font-size:15pt;margin-bottom:3mm}.dense .sign em{margin-bottom:10mm}
.pf .extra{width:88mm}.pf .extra div{text-transform:uppercase;letter-spacing:.1em}.pf .extra .last{font-weight:600}
.stamp{position:absolute;left:28mm;top:160mm;border:1.2mm solid #1a7f37;color:#1a7f37;font-weight:800;font-size:28pt;letter-spacing:.2em;padding:2mm 7mm;transform:rotate(-12deg);opacity:.8;border-radius:3mm}
</style></head><body><div class="page${d.terms ? ' dense' : ''}${d.note ? ' pf' : ''}">
<div class="top"><h1>Invoice</h1><div class="meta">${d.meta.map(([k, v]) => `<div><i>${k}</i><span>${v}</span></div>`).join('')}</div></div>
${d.sub ? `<div class="sub">${d.sub}</div>` : ''}
<div class="parties"><div style="margin-top:4mm">
<div class="blk"><label>Kepada:</label><div>${d.to.join('<br>')}</div></div><div class="rule"></div>
<div class="blk"><label>Dari:</label><div>${d.from.join('<br>')}</div></div></div>
<img class="logo" src="${A('logo.png')}"></div>
<table><thead><tr>${d.head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>
${d.rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>
<div class="tot"><span>${d.totalLabel}</span><span>${d.total}</span></div>
${d.extra ? `<div class="extra">${d.extra.map(([k, v, l]) => `<div class="${l ? 'last' : ''}"><span>${k}</span><span>${v}</span></div>`).join('')}</div>` : ''}
<div class="bottom"><div><h2>${d.payTitle}</h2><div class="pay">${d.pay.join('<br>')}</div>${d.note ? `<div style="font-size:7.5pt;color:#777;margin-top:4mm;max-width:80mm;line-height:1.5">${d.note}</div>` : ''}</div>
<div class="sign"><em>Hormat kami,</em><div class="ln">SOFYANDI</div><small>SunaRi Beach Resort Selayar</small></div></div>
${d.terms ? `<div class="terms"><h2>Syarat &amp; Ketentuan</h2><ol>${d.terms.map((t) => `<li>${t}</li>`).join('')}</ol></div>` : ''}
${d.stamp ? '<div class="stamp">LUNAS</div>' : ''}
<div class="foot"><span>${d.footerL}</span><span>IG @sunaribeachresortselayar · WA +62 821-8903-3044</span></div>
</div></body></html>`;
}

(async () => {
  fs.mkdirSync(path.join(root, 'pdf'), { recursive: true });
  const browser = await chromium.launch();
  for (const d of invoices) {
    const page = await browser.newPage();
    const tmp = path.join(root, 'src', '_tmp.html');
    fs.writeFileSync(tmp, d.layout === 'proforma' ? htmlPF(d, A) : html(d));
    await page.goto('file://' + tmp);
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: path.join(root, 'pdf', d.file), preferCSSPageSize: true, printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    fs.unlinkSync(tmp);
    await page.close();
  }
  await browser.close();
})();
