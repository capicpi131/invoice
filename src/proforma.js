// Layout "proforma" (meniru contoh invoice Ibu Edha). Posisi ditulis dalam piksel
// contoh (lebar 1131 px = 210 mm) lalu dikonversi ke mm, agar mudah dicocokkan.
const P = (px) => (px * 210) / 1131;
const mm = (px) => P(px).toFixed(2) + 'mm';

// x = titik jangkar horizontal, y = tengah baris teks; align: l (kiri), r (kanan), c (tengah)
function t(x, y, body, cls = '', align = 'l', extra = '') {
  const pos = align === 'r' ? `right:${(210 - P(x)).toFixed(2)}mm` : `left:${mm(x)}`;
  const tx = align === 'c' ? 'translate(-50%,-50%)' : 'translateY(-50%)';
  return `<div class="t ${cls}" style="${pos};top:${mm(y)};transform:${tx};${extra}">${body}</div>`;
}
const hline = (x1, x2, y, cls = '') => `<div class="hl ${cls}" style="left:${mm(x1)};width:${mm(x2 - x1)};top:${mm(y)}"></div>`;

function htmlPF(d, A) {
  const o = [];
  // Kepala
  o.push(`<div class="t h1" style="left:${mm(97)};top:${mm(176)};transform:translateY(-50%)">Invoice</div>`);
  d.meta.forEach(([k, v], i) => {
    o.push(t(806, 145 + i * 30.5, k, 'ml', 'r'));
    o.push(t(1022, 145 + i * 30.5, v, 'mv', 'r'));
  });
  o.push(t(118, 281, d.sub, 'sub'));
  // Kepada / Dari
  o.push(t(162, 329, 'Kepada:', 'lab'));
  d.to.forEach((l, i) => o.push(t(291, 329 + i * 26.7, l, 'tx')));
  o.push(hline(162, 538, 448, 'thin'));
  o.push(t(162, 490, 'Dari:', 'lab'));
  d.from.forEach((l, i) => o.push(t(291, 490 + i * 26.7, l, 'tx')));
  o.push(`<img class="logo" src="${A('logo.png')}" style="left:${mm(664)};top:${mm(351)};width:${mm(366)}">`);
  // Tabel
  const cx = [118, 575, 715, 805, 1011];
  const al = ['l', 'c', 'c', 'c', 'r'];
  o.push(hline(108, 1022, 637));
  d.head.forEach((h, i) => o.push(t(cx[i], 664, h, 'th', al[i])));
  o.push(hline(108, 1022, 691));
  const RH = 60; // tinggi tambahan per baris item berikutnya
  d.rows.forEach((r, ri) => {
    const y = 740 + ri * RH;
    r.forEach((c, i) => {
      if (i === 0) {
        const [main, small] = String(c).split('<small>');
        o.push(t(118, y - 11, main, 'td'));
        if (small) o.push(t(118, y + 11, small.replace('</small>', ''), 'tds'));
      } else o.push(t(cx[i], y, c, 'td', al[i]));
    });
  });
  const s = (d.rows.length - 1) * RH; // geser semua elemen di bawah tabel
  o.push(hline(108, 1022, 787 + s));
  o.push(t(118, 815 + s, d.totalLabel, 'tot'));
  o.push(t(1011, 815 + s, d.total, 'totv', 'r'));
  o.push(hline(108, 1022, 842 + s));
  // DP & sisa
  (d.extra || []).forEach(([k, v, last], i) => {
    const y = (last ? 940 : 898) + s;
    if (last) o.push(hline(593, 1022, 918 + s, 'thin'));
    o.push(t(860, y, k, last ? 'exb' : 'ex', 'r'));
    o.push(t(1022, y, v, last ? 'exvb' : 'exv', 'r'));
  });
  // Pembayaran
  o.push(t(108, 946 + s, d.payTitle, 'h2'));
  d.pay.forEach((l, i) => o.push(t(108, 990 + s + i * 27, l, 'pay')));
  if (d.note) o.push(`<div class="note" style="left:${mm(108)};top:${mm(1072 + s)};width:${mm(372)}">${d.note}</div>`);
  // Tanda tangan
  o.push(t(855, 995 + s, 'Hormat kami,', 'hk', 'c'));
  o.push(hline(690, 1022, 1080 + s));
  o.push(t(856, 1104 + s, 'SOFYANDI', 'sg', 'c'));
  o.push(t(856, 1131 + s, 'SunaRi Beach Resort Selayar', 'sgs', 'c'));
  // Syarat & ketentuan
  if (d.terms) {
    o.push(t(108, 1199 + s, 'Syarat &amp; Ketentuan', 'h2', 'l', 'font-size:13.4pt'));
    d.terms.forEach((l, i) => {
      o.push(t(123, 1229 + s + i * 23.1, i + 1 + '.', 'term', 'r'));
      o.push(t(135, 1229 + s + i * 23.1, l, 'term'));
    });
  }
  // Kaki
  o.push(hline(108, 1022, 1476, 'foot'));
  o.push(t(108, 1500, d.footerL, 'ft'));
  o.push(t(1022, 1500, 'IG @sunaribeachresortselayar · WA +62 821-8903-3044', 'ft', 'r'));

  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><style>
@font-face{font-family:Pinyon;src:url(${A('PinyonScript-Regular.ttf')})}
@font-face{font-family:Playfair;src:url(${A('PlayfairDisplay.ttf')});font-weight:400 900}
@font-face{font-family:Playfair;font-style:italic;src:url(${A('PlayfairDisplay-Italic.ttf')});font-weight:400 900}
@font-face{font-family:Mont;src:url(${A('Montserrat.ttf')});font-weight:100 900}
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:210mm;height:296mm;overflow:hidden;background:#fff;position:relative}
body{font-family:Mont,sans-serif;color:#111;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.frame{position:absolute;left:${mm(43)};top:${mm(43)};width:${mm(1043)};height:${mm(1513)};border:.35mm solid #111}
.frame2{position:absolute;left:${mm(52)};top:${mm(52)};width:${mm(1025)};height:${mm(1495)};border:.2mm solid #999}
.t{position:absolute;white-space:nowrap;line-height:1.2}
.hl{position:absolute;border-top:.3mm solid #111;height:0}
.hl.thin{border-top-width:.25mm}.hl.foot{border-top:.2mm solid #bbb}
.h1{font-family:Pinyon;font-size:101pt;line-height:1}
.ml{font-family:Playfair;font-style:italic;text-transform:uppercase;letter-spacing:.08em;color:#555;font-size:8.6pt}
.mv{font-size:9.4pt;font-weight:500;letter-spacing:.08em}
.sub{font-family:Playfair;font-style:italic;font-size:13.4pt;letter-spacing:.07em;color:#333}
.lab{font-size:8pt;font-weight:600;letter-spacing:.15em;text-transform:uppercase}
.tx{font-size:8.7pt;letter-spacing:.02em}.tx b{font-weight:500}
.th{font-size:8pt;font-weight:600;letter-spacing:.14em;text-transform:uppercase}
.td{font-size:8.8pt;letter-spacing:.02em}
.tds{font-size:7.2pt;color:#777;letter-spacing:.02em}
.tot{font-size:8.6pt;font-weight:600;letter-spacing:.12em;text-transform:uppercase}
.totv{font-size:8.8pt;font-weight:600;letter-spacing:.04em}
.ex{font-size:7.6pt;letter-spacing:.12em;text-transform:uppercase;color:#444}
.exb{font-size:7.6pt;font-weight:600;letter-spacing:.12em;text-transform:uppercase}
.exv{font-size:8.8pt;letter-spacing:.02em;color:#333}
.exvb{font-size:8.8pt;font-weight:600;letter-spacing:.04em}
.h2{font-family:Playfair;font-style:italic;font-weight:500;font-size:15.5pt;text-transform:uppercase;letter-spacing:.02em}
.pay{font-size:8.2pt;letter-spacing:.08em;text-transform:uppercase}.pay .g{color:#777}
.note{position:absolute;font-size:7.3pt;line-height:1.5;color:#777}
.hk{font-family:Playfair;font-style:italic;font-weight:600;font-size:10.6pt}
.sg{font-size:10pt;font-weight:600;letter-spacing:.12em}
.sgs{font-size:6.9pt;letter-spacing:.15em;text-transform:uppercase;color:#777}
.term{font-size:7.35pt;letter-spacing:.01em}
.ft{font-size:6.1pt;letter-spacing:.1em;text-transform:uppercase;color:#666}
.logo{position:absolute;height:auto}
</style></head><body><div class="frame"></div><div class="frame2"></div>
${o.join('\n')}
</body></html>`;
}

module.exports = { htmlPF };
