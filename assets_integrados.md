# LATENTE — Reporte de Assets Integrados

**Generado:** 2026-05-23  
**Herramientas:** Python 3.14 + Pillow 12.2 (ImageMagick y ffmpeg no disponibles en el entorno)

---

## 1. Imágenes — Extraídas y optimizadas desde `paginas/`

| Página | Elemento extraído | Recorte aplicado | Ruta de destino | Tamaño JPG | Tamaño WebP |
|--------|-------------------|-----------------|-----------------|------------|-------------|
| 01 | Portada completa (mujer indígena + ciudad) | 100% × 100% | `portada/portada-bg` | 1 199 KB | 935 KB |
| 06 | Portadilla chicha (tinaja + maíz) | 100% × 100% | `chicha/chicha-hero` | 933 KB | 629 KB |
| 08 | Retrato mujer indígena (mitad izquierda) | 0–52% × 0–78% | `chicha/chicha-pag7` | 606 KB | 422 KB |
| 08 | Tinaja chicha (mitad derecha) | 48–100% × 0–65% | `chicha/tl-precolombino` | 325 KB | 219 KB |
| 09 | Botella Bavaria (estigmatización) | 0–45% × 1–58% | `chicha/tl-bavaria` | 310 KB | 209 KB |
| 09 | Casa La Perseverancia (hoy) | 50–100% × 58–100% | `chicha/tl-hoy` | 222 KB | 159 KB |
| 11 | Torre Catedral Primada portadilla | 100% × 100% | `expresiones/expresiones-hero` | 933 KB | 631 KB |
| 16 | Calle colonial bogotana portadilla | 100% × 100% | `rolo/rolo-hero` | 854 KB | 533 KB |
| 20 | Hombre en callejón de ladrillo (mitad derecha) | 47–100% × 0–100% | `rolo/rolo-pag18` | 645 KB | 406 KB |
| 22 | Skyline Bogotá + Cerros + Parque portadilla | 100% × 100% | `bogota2050/bogota2050-hero` | 1 116 KB | 837 KB |
| 22 | Ciudad Bogotá porción inferior (río) | 0–100% × 30–100% | `bogota2050/bogota2050-pag24` | 361 KB | 298 KB |
| 28 | Reja colonial de hierro portadilla | 100% × 100% | `subterranea/subterranea-hero` | 926 KB | 618 KB |
| 30 | Arco subterráneo colonial | 5–95% × 38–98% | `subterranea/subterranea-pag30` | 274 KB | 198 KB |
| 34 | Ciprés + iglesia neogótica roja portadilla | 100% × 100% | `barrios/barrios-hero` | 1 106 KB | 841 KB |
| 35 | Panorama Bogotá + edificios barrios | 42–100% × 35–100% | `barrios/barrios-pag36` | 511 KB | 374 KB |

**Total imágenes:** 15 elementos → 30 archivos (JPG + WebP por cada una)  
**Resoluciones:**
- Heroes (fullscreen): 1920 px de ancho, calidad 85
- Contenido (col-m / lightbox): máx. 1200 / 1000 px, calidad 82 / 80

---

## 2. Íconos PWA — Generados desde portada

| Archivo | Tamaño |
|---------|--------|
| `assets/images/portada/icon-192.png` | 77 KB |
| `assets/images/portada/icon-512.png` | 466 KB |

---

## 3. Audios — Mapeados desde `data/sounds/`

| Archivo fuente | Destino | Sección | Motivo editorial | Tamaño |
|----------------|---------|---------|-----------------|--------|
| `lluvia_bogota-71137.mp3` | `audio/chicha/chicha-ambient.mp3` | La Chicha · pág. 6 | Lluvia de Bogotá como atmósfera ancestral de la chicha | 592 KB |
| `portal_transmilenio_norte-25447.mp3` | `audio/bogota2050/metro.mp3` | Bogotá 2050 · pág. 26 | Sonido de tránsito masivo como premonición del metro | 598 KB |
| `portal_transmilenio_norte-25447 (1).mp3` | `audio/expresiones/expresiones-ambient.mp3` | Expresiones · pág. 11 | Ambiente urbano bogotano para el glosario | 598 KB |
| `sitp_bgta-72696.mp3` | `audio/barrios/barrios-raices.mp3` | Barrios · pág. 36 | Bus SITP como símbolo sonoro de los barrios populares | 603 KB |

---

## 4. PDF

| Archivo | Tamaño | Nota |
|---------|--------|------|
| `assets/pdf/latente-revista.pdf` | 34,4 MB | Copiado desde `data/docs/Revista210526.pdf`. Supera el umbral de 15 MB. Ghostscript no disponible en el entorno — optimizar manualmente con Adobe Acrobat o en línea |

**Links corregidos en index.html:** 4 enlaces (nav, menú, portada-CTA, footer) actualizados de ruta Windows absoluta a `assets/pdf/latente-revista.pdf` con `download="LATENTE-Revista-Ed1.pdf"`.

---

## 5. PWA — Progressive Web App

| Archivo | Estado |
|---------|--------|
| `manifest.json` | ✅ Creado — name, short_name, icons 192/512, theme #a3000f |
| `sw.js` | ✅ Creado — cache-first para assets, network-first para HTML, excluye PDF y CDN externos |
| `<head>` index.html | ✅ Etiquetas manifest, theme-color, apple-mobile-web-app-* agregadas |
| `js/main.js` | ✅ Registro del service worker agregado al final |

---

## 6. Placeholders `img-ph` reemplazados en index.html

| Sección | Placeholder original | Imagen integrada |
|---------|---------------------|-----------------|
| 01 · La Chicha (hero) | `div.img-ph` | `chicha/chicha-hero.webp` + `.jpg` |
| 01 · La Chicha (col-m) | `div.img-ph.tall` | `chicha/chicha-pag7.webp` + `.jpg` |
| 02 · Expresiones (hero) | `div.img-ph` | `expresiones/expresiones-hero.webp` + `.jpg` |
| 03 · Rolo (hero) | `div.img-ph` | `rolo/rolo-hero.webp` + `.jpg` |
| 03 · Rolo (col-m) | `div.img-ph.tall` | `rolo/rolo-pag18.webp` + `.jpg` |
| 04 · Bogotá 2050 (hero) | `div.img-ph` | `bogota2050/bogota2050-hero.webp` + `.jpg` |
| 04 · Bogotá 2050 (col-m) | `div.img-ph.tall` | `bogota2050/bogota2050-pag24.webp` + `.jpg` |
| 05 · Subterránea (hero) | `div.img-ph` | `subterranea/subterranea-hero.webp` + `.jpg` |
| 05 · Subterránea (col-m) | `div.img-ph.tall` | `subterranea/subterranea-pag30.webp` + `.jpg` |
| 06 · Barrios (hero) | `div.img-ph` | `barrios/barrios-hero.webp` + `.jpg` |
| 06 · Barrios (col-m) | `div.img-ph.tall` | `barrios/barrios-pag36.webp` + `.jpg` |

**Nota:** La portada usa un SVG animado de skyline como diseño intencional — no es un placeholder roto.

---

## 7. Pendientes — Assets que requieren producción externa

### Audios sin fuente en `data/`

| Ruta esperada | Descripción | Acción recomendada |
|---------------|-------------|-------------------|
| `assets/audio/expresiones/flautas.mp3` | Sonido de flautas indígenas pág. 12 | Grabar o licenciar audio de flautas muiscas |
| `assets/audio/rolo/rolo.mp3` | Narración "¿Qué significa ser rolo?" pág. 16 | Locución en estudio |
| `assets/audio/barrios/senor-pag35.mp3` | Señor hablando texto entre comillas pág. 35 | Locución en estudio o TTS |

### Imágenes lightbox del timeline de chicha (archivos históricos)

| Ruta esperada | Descripción | Acción recomendada |
|---------------|-------------|-------------------|
| `assets/images/chicha/tl-colonial.jpg` | Grabado colonial de chichería en Santa Fe | Buscar en archivo Biblioteca Nacional |
| `assets/images/chicha/tl-bolivar.jpg` | Documento época / retrato Bolívar 1820 | Usar imagen de dominio público |
| `assets/images/chicha/tl-bogotazo.jpg` | Fotografía Bogotazo 9 de abril 1948 | Archivo Semana / El Tiempo (licenciar) |
| `assets/images/chicha/tl-festival.jpg` | Festival de la Chicha La Perseverancia | Fotografía propia del festival |

> Los lightbox de precolombino, bavaria y hoy **sí tienen imagen** (extraída de págs. 8 y 9).

### Videos (requieren producción / IA generativa)

| Ruta esperada | Descripción | Herramienta sugerida |
|---------------|-------------|---------------------|
| `assets/video/flautas.mp4` | Animación IA flautas pág. 12 | Runway Gen-3 / Kling AI |
| `assets/video/personas-pag20-21.mp4` | Personas en movimiento pág. 20-21 | Runway Gen-3 / Kling AI |
| `assets/video/senor-pag35.mp4` | Señor hablando texto pág. 35 | HeyGen / D-ID (talking head) |
| `assets/video/subterranea-bogota.mp4` | Video propio túneles subterráneos | Filmación propia |

---

## 8. Resumen ejecutivo

| Categoría | Total | Integrados | Pendientes |
|-----------|-------|-----------|-----------|
| Imágenes | 15 | 15 | 0 |
| Audios | 7 | 4 | 3 |
| Videos propios | 4 | 0 | 4 |
| Videos YouTube | 4 | 4 (embed) | 0 |
| PDF | 1 | 1 | 0 (optimización pendiente) |
| PWA (manifest+SW) | 2 | 2 | 0 |
| **TOTAL** | **33** | **26** | **7** |
