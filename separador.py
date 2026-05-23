import fitz  # PyMuPDF
import os

pdf_path = "C:/Users/User/Downloads/latente-v3/data/docs/Revista210526.pdf"
output_folder = "paginas"

os.makedirs(output_folder, exist_ok=True)

pdf = fitz.open(pdf_path)

# 4x equivale aproximadamente a 288 DPI
zoom = 4.0
matrix = fitz.Matrix(zoom, zoom)

for page_num in range(len(pdf)):
    page = pdf[page_num]

    pix = page.get_pixmap(
        matrix=matrix,
        alpha=False
    )

    output_path = os.path.join(
        output_folder,
        f"pagina_{page_num + 1:03d}.png"
    )

    pix.save(output_path)

    print(f"Guardada: {output_path}")

pdf.close()

print("Proceso completado.")