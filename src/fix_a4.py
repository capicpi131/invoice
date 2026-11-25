# Paksa ukuran halaman PDF tepat A4 (595.276 x 841.89 pt). Dijalankan setelah build.js.
# Juga membuat file gabungan (beberapa invoice dalam 1 PDF, 1 invoice per lembar) dari daftar MERGE.
import glob
from pypdf import PdfReader, PdfWriter
from pypdf.generic import RectangleObject

MERGE = {
    'INV-PI-SBR-251126-01-02-GABUNGAN.pdf': ['INV-PI-SBR-251126-01.pdf', 'INV-PI-SBR-251126-02.pdf'],
}

box = RectangleObject([0, 0, 595.276, 841.890])
for f in glob.glob('pdf/*.pdf'):
    if f.split('/')[-1] in MERGE:
        continue
    w = PdfWriter()
    pg = PdfReader(f).pages[0]
    pg.mediabox = pg.cropbox = pg.trimbox = pg.bleedbox = pg.artbox = box
    w.add_page(pg)
    w.write(f)

for out, parts in MERGE.items():
    w = PdfWriter()
    for p in parts:
        w.add_page(PdfReader('pdf/' + p).pages[0])
    w.write('pdf/' + out)
