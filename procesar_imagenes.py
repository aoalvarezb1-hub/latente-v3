"""
Extrae y optimiza imágenes de las páginas de la revista LATENTE
para usarlas como heroes, contenido e imágenes de lightbox en index.html
"""
from PIL import Image
import os

BASE_IN  = r"C:\Users\User\Downloads\latente-v3\paginas"
BASE_OUT = r"C:\Users\User\Downloads\latente-v3\assets\images"

def load(num):
    return Image.open(os.path.join(BASE_IN, f"pagina_{num:03d}.png"))

def crop(img, left, top, right, bottom):
    """Recorta usando porcentajes (0.0 – 1.0)."""
    w, h = img.size
    return img.crop((int(w*left), int(h*top), int(w*right), int(h*bottom)))

def to_rgb(img):
    if img.mode == "RGBA":
        bg = Image.new("RGB", img.size, (255, 255, 255))
        bg.paste(img, mask=img.split()[3])
        return bg
    if img.mode != "RGB":
        return img.convert("RGB")
    return img

def save(img, folder, name, quality=82, max_w=1200):
    img = to_rgb(img)
    if img.width > max_w:
        ratio = max_w / img.width
        img = img.resize((max_w, int(img.height * ratio)), Image.LANCZOS)
    out = os.path.join(BASE_OUT, folder)
    jpg_path  = os.path.join(out, f"{name}.jpg")
    webp_path = os.path.join(out, f"{name}.webp")
    img.save(jpg_path,  "JPEG", quality=quality, optimize=True)
    img.save(webp_path, "WEBP", quality=quality)
    print(f"  OK {folder}/{name}  {img.width}x{img.height}px")

results = []

# --------------------------- PORTADA ----------------------------------------
print("\n-- PORTADA --")
# Pág. 1: portada de la revista → fondo hero portada (1920px ancho)
p1 = load(1)
save(p1, "portada", "portada-bg", quality=85, max_w=1920)
results.append(("01", "Portada completa (mujer indígena + ciudad)", "100%x100%", "portada/portada-bg", "OK"))

# --------------------------- CHICHA (Pág. 6–10) -----------------------------
print("\n-- CHICHA --")
# Pág. 6: Portadilla La Chicha → hero chicha (tinaja + maíz + textura dorada)
p6 = load(6)
save(p6, "chicha", "chicha-hero", quality=85, max_w=1920)
results.append(("06", "Portadilla chicha (tinaja + maíz)", "100%x100%", "chicha/chicha-hero", "OK"))

# Pág. 8: Mujer indígena retrato (mitad izquierda) → chicha-pag7 (columna tall)
p8 = load(8)
chicha_col = crop(p8, 0.0, 0.0, 0.52, 0.78)
save(chicha_col, "chicha", "chicha-pag7", quality=82, max_w=1200)
results.append(("08", "Retrato mujer indígena (mitad izq.)", "0%x0%→52%x78%", "chicha/chicha-pag7", "OK"))

# Pág. 8: Tinaja de chicha (mitad derecha) → tl-precolombino lightbox
p8r = crop(p8, 0.48, 0.0, 1.0, 0.65)
save(p8r, "chicha", "tl-precolombino", quality=80, max_w=1000)
results.append(("08", "Tinaja chicha precolombina", "48%x0%→100%x65%", "chicha/tl-precolombino", "OK"))

# Pág. 9: Botella Bavaria (izquierda arriba) → tl-bavaria lightbox
p9 = load(9)
bavaria = crop(p9, 0.0, 0.01, 0.45, 0.58)
save(bavaria, "chicha", "tl-bavaria", quality=80, max_w=1000)
results.append(("09", "Botella Bavaria (estigmatización)", "0%x1%→45%x58%", "chicha/tl-bavaria", "OK"))

# Pág. 9: Casa La Perseverancia (derecha abajo) → tl-hoy lightbox
perseverancia = crop(p9, 0.50, 0.58, 1.0, 1.0)
save(perseverancia, "chicha", "tl-hoy", quality=80, max_w=1000)
results.append(("09", "Casa La Perseverancia (hoy)", "50%x58%→100%x100%", "chicha/tl-hoy", "OK"))

# --------------------------- EXPRESIONES (Pág. 11–15) -----------------------
print("\n-- EXPRESIONES --")
# Pág. 11: Torre de la Catedral → hero expresiones (full page)
p11 = load(11)
save(p11, "expresiones", "expresiones-hero", quality=85, max_w=1920)
results.append(("11", "Torre catedral Bogotá (portadilla)", "100%x100%", "expresiones/expresiones-hero", "OK"))

# --------------------------- ROLO (Pág. 16–21) ------------------------------
print("\n-- ROLO --")
# Pág. 16: Calle colonial B&W con domo y transeúntes → hero rolo (full page)
p16 = load(16)
save(p16, "rolo", "rolo-hero", quality=85, max_w=1920)
results.append(("16", "Calle colonial bogotana (portadilla)", "100%x100%", "rolo/rolo-hero", "OK"))

# Pág. 20: Hombre en callejón de ladrillos (mitad derecha) → rolo-pag18 (tall)
p20 = load(20)
hombre = crop(p20, 0.47, 0.0, 1.0, 1.0)
save(hombre, "rolo", "rolo-pag18", quality=82, max_w=1200)
results.append(("20", "Hombre callejón ladrillo Bogotá", "47%x0%→100%x100%", "rolo/rolo-pag18", "OK"))

# --------------------------- BOGOTÁ 2050 (Pág. 22–27) ----------------------
print("\n-- BOGOTÁ 2050 --")
# Pág. 22: Skyline Bogotá + montañas + parque → hero bogota2050 (full page)
p22 = load(22)
save(p22, "bogota2050", "bogota2050-hero", quality=85, max_w=1920)
results.append(("22", "Skyline Bogotá + Cerros + Parque", "100%x100%", "bogota2050/bogota2050-hero", "OK"))

# Pág. 22: Sección inferior (ciudad + río) → bogota2050-pag24 (tall content)
ciudad_baja = crop(p22, 0.0, 0.30, 1.0, 1.0)
save(ciudad_baja, "bogota2050", "bogota2050-pag24", quality=82, max_w=1200)
results.append(("22", "Ciudad Bogotá porción inferior (río)", "0%x30%→100%x100%", "bogota2050/bogota2050-pag24", "OK"))

# --------------------------- SUBTERRÁNEA (Pág. 28–33) -----------------------
print("\n-- SUBTERRÁNEA --")
# Pág. 28: Reja colonial de hierro → hero subterranea (full page)
p28 = load(28)
save(p28, "subterranea", "subterranea-hero", quality=85, max_w=1920)
results.append(("28", "Reja colonial de hierro (portadilla)", "100%x100%", "subterranea/subterranea-hero", "OK"))

# Pág. 30: Arco subterráneo oscuro (porción inferior) → subterranea-pag30 (tall)
p30 = load(30)
arco = crop(p30, 0.05, 0.38, 0.95, 0.98)
save(arco, "subterranea", "subterranea-pag30", quality=82, max_w=1200)
results.append(("30", "Arco subterráneo colonial", "5%x38%→95%x98%", "subterranea/subterranea-pag30", "OK"))

# --------------------------- BARRIOS (Pág. 34–39) ---------------------------
print("\n-- BARRIOS --")
# Pág. 34: Árbol ciprés + iglesia roja + edificios → hero barrios (full page)
p34 = load(34)
save(p34, "barrios", "barrios-hero", quality=85, max_w=1920)
results.append(("34", "Ciprés + iglesia neogótica roja (portadilla)", "100%x100%", "barrios/barrios-hero", "OK"))

# Pág. 35: Panorama Bogotá (parte inferior derecha) → barrios-pag36 (tall)
p35 = load(35)
panorama = crop(p35, 0.42, 0.35, 1.0, 1.0)
save(panorama, "barrios", "barrios-pag36", quality=82, max_w=1200)
results.append(("35", "Panorama Bogotá + edificios (barrios)", "42%x35%→100%x100%", "barrios/barrios-pag36", "OK"))

# --------------------------- REPORTE ----------------------------------------
print(f"\n{'='*60}")
print(f"Total imágenes procesadas: {len(results)}")
print(f"Archivos generados: {len(results)*2} (JPG + WebP por cada una)")
print("="*60)

# Guardar datos del reporte para assets_integrados.md
import json
with open(r"C:\Users\User\Downloads\latente-v3\_crop_results.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
print("\nDatos del reporte guardados en _crop_results.json")
