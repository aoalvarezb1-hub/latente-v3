"""
LATENTE - Recortes v2: coordenadas quirurgicas, SOLO elemento visual, sin texto de revista
"""
from PIL import Image
import os

BASE_IN  = r"C:\Users\User\Downloads\latente-v3\paginas"
BASE_OUT = r"C:\Users\User\Downloads\latente-v3\assets\images"

def load(num):
    return Image.open(os.path.join(BASE_IN, f"pagina_{num:03d}.png"))

def crop(img, left, top, right, bottom):
    w, h = img.size
    return img.crop((int(w*left), int(h*top), int(w*right), int(h*bottom)))

def to_rgb(img):
    if img.mode == "RGBA":
        bg = Image.new("RGB", img.size, (255, 255, 255))
        bg.paste(img, mask=img.split()[3])
        return bg
    return img.convert("RGB") if img.mode != "RGB" else img

def save(img, folder, name, quality=82, max_w=1200, max_h=None):
    img = to_rgb(img)
    if img.width > max_w:
        ratio = max_w / img.width
        new_h = int(img.height * ratio)
        if max_h and new_h > max_h:
            ratio = max_h / img.height
            new_w = int(img.width * ratio)
            img = img.resize((new_w, max_h), Image.LANCZOS)
        else:
            img = img.resize((max_w, new_h), Image.LANCZOS)
    out = os.path.join(BASE_OUT, folder)
    img.save(os.path.join(out, f"{name}.jpg"),  "JPEG", quality=quality, optimize=True)
    img.save(os.path.join(out, f"{name}.webp"), "WEBP", quality=quality)
    print(f"  OK {folder}/{name}  {img.width}x{img.height}px")

print("\n=== CHICHA ===")

# chicha-hero: pag 6 completa (portadilla editorial, sin columnas de texto)
p6 = load(6)
save(p6, "chicha", "chicha-hero", quality=85, max_w=1920)

# chicha-pag7: pag 8 ESQUINA INFERIOR IZQUIERDA — la senora indigena, sin texto
# El texto esta arriba y en el centro. La senora ocupa el cuadrante inferior-izq.
p8 = load(8)
senora = crop(p8, 0.0, 0.48, 0.48, 1.0)
save(senora, "chicha", "chicha-pag7", quality=82, max_w=1200)

# tl-precolombino: pag 8 ESQUINA SUPERIOR DERECHA — tinaja de barro
tinaja = crop(p8, 0.55, 0.02, 0.97, 0.44)
save(tinaja, "chicha", "tl-precolombino", quality=80, max_w=1000)

# tl-bavaria: pag 9 IZQUIERDA CENTRO — botella Bavaria (sin las columnas de texto der.)
p9 = load(9)
botella = crop(p9, 0.0, 0.05, 0.37, 0.62)
save(botella, "chicha", "tl-bavaria", quality=80, max_w=1000)

# tl-hoy: pag 9 INFERIOR DERECHA — casa colorida La Perseverancia
perseverancia = crop(p9, 0.50, 0.62, 1.0, 1.0)
save(perseverancia, "chicha", "tl-hoy", quality=80, max_w=1000)

# tl-bogotazo: pag 10 SUPERIOR DERECHA — retrato hombre (Gaitan era)
p10 = load(10)
gaitan = crop(p10, 0.50, 0.0, 0.90, 0.32)
save(gaitan, "chicha", "tl-bogotazo", quality=80, max_w=1000)

# tl-festival: pag 10 INFERIOR DERECHA — vasijas de barro chicha
vasijas = crop(p10, 0.48, 0.70, 1.0, 1.0)
save(vasijas, "chicha", "tl-festival", quality=80, max_w=1000)

print("\n=== EXPRESIONES ===")

# expresiones-hero: pag 11 — portadilla torre catedral (ok, es diseno editorial)
p11 = load(11)
save(p11, "expresiones", "expresiones-hero", quality=85, max_w=1920)

# expresiones-content: pag 12 — mujer con labios rojos (expresividad bogotana)
p12 = load(12)
mujer_expr = crop(p12, 0.22, 0.0, 0.82, 0.42)
save(mujer_expr, "expresiones", "expresiones-pag12", quality=82, max_w=1200)

print("\n=== ROLO ===")

# rolo-hero: pag 16 — calle colonial (portadilla editorial)
p16 = load(16)
save(p16, "rolo", "rolo-hero", quality=85, max_w=1920)

# rolo-pag18: pag 20 MITAD DERECHA — hombre en callejon de ladrillo
# Evitar el pie de texto inferior "Bogota: mil historias bajo cada calle."
p20 = load(20)
hombre = crop(p20, 0.50, 0.0, 1.0, 0.78)
save(hombre, "rolo", "rolo-pag18", quality=82, max_w=1200)

# rolo-extra: pag 17 INFERIOR — plaza catedral Bogota (sin texto legible)
p17 = load(17)
plaza = crop(p17, 0.0, 0.58, 1.0, 1.0)
save(plaza, "rolo", "rolo-plaza", quality=82, max_w=1920)

print("\n=== BOGOTA 2050 ===")

# bogota2050-hero: pag 22 — skyline con montanas (portadilla editorial)
p22 = load(22)
save(p22, "bogota2050", "bogota2050-hero", quality=85, max_w=1920)

# bogota2050-pag24: pag 25 SUPERIOR — rio Bogota con kayakistas (FOTO LIMPIA, sin texto)
p25 = load(25)
rio = crop(p25, 0.0, 0.0, 1.0, 0.42)
save(rio, "bogota2050", "bogota2050-pag24", quality=82, max_w=1200)

print("\n=== SUBTERRANEA ===")

# subterranea-hero: pag 28 — reja colonial (portadilla editorial)
p28 = load(28)
save(p28, "subterranea", "subterranea-hero", quality=85, max_w=1920)

# subterranea-pag30: pag 30 INFERIOR IZQUIERDA — arco subterraneo SIN las cajas de texto der.
p30 = load(30)
arco = crop(p30, 0.04, 0.50, 0.62, 0.97)
save(arco, "subterranea", "subterranea-pag30", quality=82, max_w=1200)

print("\n=== BARRIOS ===")

# barrios-hero: pag 34 — cipres + iglesia neogotica (portadilla editorial)
p34 = load(34)
save(p34, "barrios", "barrios-hero", quality=85, max_w=1920)

# barrios-pag36: pag 35 IZQUIERDA — hombre con casco (arquitecto/urbanista)
# Evitar la cita central "ANTES DE SER UNA CIUDAD..."
p35 = load(35)
hombre_barrios = crop(p35, 0.0, 0.0, 0.43, 0.54)
save(hombre_barrios, "barrios", "barrios-pag36", quality=82, max_w=1200)

# barrios-ciudad: pag 37 INFERIOR DERECHA — torre iglesia roja barrio
p37 = load(37)
iglesia = crop(p37, 0.55, 0.52, 1.0, 1.0)
save(iglesia, "barrios", "barrios-iglesia", quality=82, max_w=1200)

print("\n=== PORTADA ===")
p1 = load(1)
save(p1, "portada", "portada-bg", quality=85, max_w=1920)

print("\nDone!")
