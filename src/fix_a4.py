# Paksa ukuran halaman PDF tepat A4 (595.276 x 841.89 pt). Dijalankan setelah build.js.
import glob
from pypdf import PdfReader, PdfWriter
from pypdf.generic import RectangleObject

box = RectangleObject([0, 0, 595.276, 841.890])
for f in glob.glob('pdf/*.pdf'):
    w = PdfWriter()
    pg = PdfReader(f).pages[0]
    pg.mediabox = pg.cropbox = pg.trimbox = pg.bleedbox = pg.artbox = box
    w.add_page(pg)
    w.write(f)
